
const db = require('../config/db');

const createCompleteAppointment = async (
  customer_id,
  appointment_date,
  appointment_time,
  cartItems
) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Create the appointment
    const [appointmentResult] = await connection.query(
      `INSERT INTO appointment (customer_id, appointment_date, appointment_time, appointment_status)
       VALUES (?, ?, ?, 'Scheduled')`,
      [customer_id, appointment_date, appointment_time]
    );

    const appointment_ID = appointmentResult.insertId;

    // 2. Process each cart item individually
    const insertedRecords = [];
    for (const item of cartItems) {
      try {
        // Validate required fields
        if (typeof item.service_id === 'undefined') {
          throw new Error(`Missing service_id in cart item`);
        }

        // Insert the service-stylist association
        const [result] = await connection.query(
          `INSERT INTO appointment_service_stylist 
           (appointment_ID, service_ID, stylist_ID)
           VALUES (?, ?, ?)`,
          [appointment_ID, item.service_id, item.stylist_id]
        );

        insertedRecords.push({
          appointment_ID,
          service_ID: item.service_id,
          stylist_ID: item.stylist_id,
          insertId: result.insertId
        });
      } catch (itemError) {
        // Handle specific item errors without failing entire transaction
        console.error(`Failed to insert item:`, {
          item,
          error: itemError.message
        });
        continue; // Skip to next item
      }
    }

    
    if (insertedRecords.length === 0) {
      throw new Error('No service-stylist associations were created');
    }

    await connection.commit();
    connection.release();

    return {
      success: true,
      appointment_ID,
      inserted_records: insertedRecords,
      message: `Created appointment with ${insertedRecords.length} service-stylist associations`
    };

  } catch (error) {
    await connection.rollback();
    connection.release();
    
    console.error('Appointment creation failed:', {
      error: error.message,
      customer_id,
      appointment_date,
      appointment_time,
      cartItems
    });

    throw {
      ...error,
      isOperational: true,
      details: {
        customer_id,
        appointment_date,
        appointment_time,
        cartItems
      }
    };
  }
};

// 2. Check if customer is booking for the first time
const checkIfFirstTimeCustomer = async (customer_id) => {
  const connection = await db.getConnection();
  try {
    const [appointments] = await connection.query(
      `SELECT * FROM Appointment WHERE customer_id = ?`,
      [customer_id]
    );
    return appointments.length === 0;
  } catch (err) {
    throw new Error('Error checking if customer is first-timer: ' + err.message);
  } finally {
    connection.release();
  }
};


const sendCancelRequest = async (appointmentId) => {
  const connection = await db.getConnection();
  try {
    // 1. Check the current appointment status and cancellation status
    const [rows] = await connection.query(
      `SELECT appointment_status, cancellation_status
       FROM Appointment
       WHERE appointment_ID = ?`,
      [appointmentId]
    );

    if (rows.length === 0) {
      throw new Error('Appointment not found');
    }

    const { appointment_status, cancellation_status } = rows[0];

    // 2. Validate status
    if (appointment_status !== 'Scheduled') {
      throw new Error(`Cannot cancel an appointment with status '${appointment_status}'`);
    }

    if (cancellation_status !== 'None') {
      throw new Error(`Cancellation request already submitted or processed`);
    }

    // 3. Proceed to update if valid
    const [result] = await connection.query(
      `UPDATE Appointment
       SET cancellation_status = 'Requested', cancel_request_time = NOW()
       WHERE appointment_ID = ?`,
      [appointmentId]
    );

    return result;
  } catch (err) {
    throw new Error('Error sending cancellation request: ' + err.message);
  } finally {
    connection.release();
  }
};


const getAppointmentsByCustomer = async (customerId) => {
  const connection = await db.getConnection();
  try {
    const [appointments] = await connection.query(
      `SELECT 
        a.appointment_ID,
        a.appointment_date,
        a.appointment_time,
        a.appointment_status,
        a.cancellation_status,
        a.cancel_request_time,
        GROUP_CONCAT(DISTINCT s.service_name) AS services,
        GROUP_CONCAT(DISTINCT CONCAT(st.firstname, ' ', st.lastname)) AS stylists,
        GROUP_CONCAT(DISTINCT st.stylist_ID) AS stylist_IDs  -- Add this line
      FROM Appointment a
      LEFT JOIN Appointment_Service_Stylist ass ON a.appointment_ID = ass.appointment_ID
      LEFT JOIN Service s ON ass.service_ID = s.service_ID
      LEFT JOIN Stylists st ON ass.stylist_ID = st.stylist_ID
      WHERE a.customer_id = ?
      GROUP BY a.appointment_ID
      ORDER BY a.appointment_date DESC, a.appointment_time DESC`,
      [customerId]
    );

    // Process the results to pair stylist names with IDs
    const processedAppointments = appointments.map(appointment => {
      const stylistNames = appointment.stylists ? appointment.stylists.split(',') : [];
      const stylistIds = appointment.stylist_IDs ? appointment.stylist_IDs.split(',') : [];
      
      // Create an array of stylist objects with name and ID
      const stylists = stylistNames.map((name, index) => ({
        name: name.trim(),
        id: stylistIds[index] ? stylistIds[index].trim() : null
      }));

      return {
        ...appointment,
        stylists,  // Now contains both names and IDs
        primaryStylistId: stylistIds[0] || null  // Add primary stylist ID if needed
      };
    });

    return processedAppointments;
  } catch (err) {
    throw new Error('Error fetching appointments: ' + err.message);
  } finally {
    connection.release();
  }
};


const getPendingCancellationRequests = async () => {
  const connection = await db.getConnection();
  try {
    const [appointments] = await connection.query(
      `SELECT 
        a.appointment_ID,
        a.customer_id,
        a.appointment_date,
        a.appointment_time,
        a.cancel_request_time,
        c.firstname,
        c.lastname,
        c.email,
        p.payment_ID,
        p.payment_amount,
        p.amount_paid,
        p.payment_status,
        p.payment_type,
        p.stripe_payment_intent_id,
        p.payment_date
      FROM Appointment a
      JOIN Customer c ON a.customer_id = c.customer_ID
      LEFT JOIN Payment p ON a.appointment_ID = p.appointment_ID
      WHERE a.cancellation_status = 'Requested'
      ORDER BY a.cancel_request_time ASC`
    );

    const requestsWithDetails = await Promise.all(
      appointments.map(async (appt) => {
        const [services] = await connection.query(
          `SELECT GROUP_CONCAT(DISTINCT s.service_name) AS services
           FROM Appointment_Service_Stylist ass
           JOIN Service s ON ass.service_ID = s.service_ID
           WHERE ass.appointment_ID = ?
           GROUP BY ass.appointment_ID`,
          [appt.appointment_ID]
        );

        const [stylists] = await connection.query(
          `SELECT GROUP_CONCAT(DISTINCT CONCAT(st.firstname, ' ', st.lastname)) AS stylists
           FROM Appointment_Service_Stylist ass
           JOIN Stylists st ON ass.stylist_ID = st.stylist_ID
           WHERE ass.appointment_ID = ?
           GROUP BY ass.appointment_ID`,
          [appt.appointment_ID]
        );

        const [phones] = await connection.query(
          `SELECT phone_num FROM Customer_Phone_Num
           WHERE customer_ID = ?`,
          [appt.customer_id]
        );

        return {
          ...appt,
          services: services[0]?.services || null,
          stylists: stylists[0]?.stylists || null,
          phones: phones.map(p => p.phone_num),
          primary_phone: phones[0]?.phone_num || null,
          payment: appt.payment_ID ? {
            payment_ID: appt.payment_ID,
            payment_amount: appt.payment_amount,
            amount_paid: appt.amount_paid,
            payment_status: appt.payment_status,
            payment_type: appt.payment_type,
            stripe_payment_intent_id: appt.stripe_payment_intent_id,
            payment_date: appt.payment_date
          } : null
        };
      })
    );

    return requestsWithDetails;
  } catch (err) {
    console.error('Database error in getPendingCancellationRequests:', err);
    throw err;
  } finally {
    connection.release();
  }
};



const processCancellationRequest = async (appointmentId, action) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // 1. First update the appointment status
    const [appointmentResult] = await connection.query(
      `UPDATE Appointment
       SET cancellation_status = ?, 
           appointment_status = IF(? = 'Approved', 'Cancelled', appointment_status)
       WHERE appointment_ID = ? AND cancellation_status = 'Requested'`,
      [action, action, appointmentId]
    );

    if (appointmentResult.affectedRows === 0) {
      throw new Error('No pending cancellation request found for this appointment');
    }

    let paymentUpdateResult = null;

    // 2. Update appointment service-stylist mapping statuses
    if (action === 'Approved') {
      await connection.query(
        `UPDATE Appointment_Service_Stylist
         SET status = 'Cancelled'
         WHERE appointment_ID = ?`,
        [appointmentId]
      );

      // 3. Get current payment status
      const [payment] = await connection.query(
        `SELECT payment_status FROM Payment WHERE appointment_ID = ?`,
        [appointmentId]
      );

      if (payment.length > 0) {
        const currentStatus = payment[0].payment_status;
        let newStatus = currentStatus;

        // Determine new status
        if (currentStatus === 'Paid' || currentStatus === 'Partially Paid') {
          newStatus = 'Refunded';
        } else if (currentStatus === 'Pending') {
          newStatus = 'Cancelled';
        }

        // Update only if needed
        if (newStatus !== currentStatus) {
          [paymentUpdateResult] = await connection.query(
            `UPDATE Payment 
             SET payment_status = ?
             WHERE appointment_ID = ?`,
            [newStatus, appointmentId]
          );
        }
      }
    }

    await connection.commit();

    return { 
      success: true, 
      message: `Cancellation ${action.toLowerCase()} successfully`,
      data: {
        action,
        paymentUpdated: paymentUpdateResult ? paymentUpdateResult.affectedRows > 0 : false
      }
    };
  } catch (err) {
    await connection.rollback();
    console.error("Error processing cancellation:", err);
    throw err;
  } finally {
    connection.release();
  }
};


const getCancellationRequestsByStatus = async (status) => {
  const connection = await db.getConnection();
  try {
    const [appointments] = await connection.query(
      `SELECT 
        a.appointment_ID,
        a.customer_id,
        a.appointment_date,
        a.appointment_time,
        a.cancel_request_time,
        a.cancellation_status,
        c.firstname,
        c.lastname,
        c.email,
        p.payment_ID,
        p.payment_amount,
        p.amount_paid,
        p.payment_status,
        p.payment_type,
        p.stripe_payment_intent_id,
        p.payment_date
      FROM Appointment a
      JOIN Customer c ON a.customer_id = c.customer_ID
      LEFT JOIN Payment p ON a.appointment_ID = p.appointment_ID
      WHERE a.cancellation_status = ?
      ORDER BY a.cancel_request_time DESC`,
      [status]
    );

    const requestsWithDetails = await Promise.all(
      appointments.map(async (appt) => {
        const [services] = await connection.query(
          `SELECT GROUP_CONCAT(DISTINCT s.service_name) AS services
           FROM Appointment_Service_Stylist ass
           JOIN Service s ON ass.service_ID = s.service_ID
           WHERE ass.appointment_ID = ?
           GROUP BY ass.appointment_ID`,
          [appt.appointment_ID]
        );

        const [stylists] = await connection.query(
          `SELECT GROUP_CONCAT(DISTINCT CONCAT(st.firstname, ' ', st.lastname)) AS stylists
           FROM Appointment_Service_Stylist ass
           JOIN Stylists st ON ass.stylist_ID = st.stylist_ID
           WHERE ass.appointment_ID = ?
           GROUP BY ass.appointment_ID`,
          [appt.appointment_ID]
        );

        const [phones] = await connection.query(
          `SELECT phone_num FROM Customer_Phone_Num
           WHERE customer_ID = ?`,
          [appt.customer_id]
        );

        return {
          ...appt,
          services: services[0]?.services || null,
          stylists: stylists[0]?.stylists || null,
          phones: phones.map(p => p.phone_num),
          primary_phone: phones[0]?.phone_num || null,
          payment: appt.payment_ID ? {
            payment_ID: appt.payment_ID,
            payment_amount: appt.payment_amount,
            amount_paid: appt.amount_paid,
            payment_status: appt.payment_status,
            payment_type: appt.payment_type,
            stripe_payment_intent_id: appt.stripe_payment_intent_id,
            payment_date: appt.payment_date
          } : null
        };
      })
    );

    return requestsWithDetails;
  } finally {
    connection.release();
  }
};





const getFilteredRequests = async (statusFilters = []) => {
    try {
        let query = `SELECT 
            sr.id, 
            sr.customer_id, 
            sr.first_name, 
            sr.last_name, 
            sr.email, 
            sr.phone_number, 
            sr.request_details, 
            sr.preferred_date,
            sr.preferred_time,
            sr.status, 
            sr.created_at,
            sr.updated_at,
            GROUP_CONCAT(s.service_name SEPARATOR ', ') as services,
            GROUP_CONCAT(s.service_id SEPARATOR ',') as service_ids
        FROM special_requests sr
        LEFT JOIN special_request_service srs ON sr.id = srs.special_request_id
        LEFT JOIN service s ON srs.service_id = s.service_id`;
        
        // Add WHERE clause for status filtering if requested
        if (statusFilters.length > 0) {
            query += ` WHERE sr.status IN (${statusFilters.map(() => '?').join(',')})`;
        }
        
        query += ` GROUP BY sr.id ORDER BY sr.created_at DESC`;
        
        // Execute query with or without status parameters
        const [rows] = statusFilters.length > 0 
            ? await db.execute(query, statusFilters)
            : await db.execute(query);
            
        return rows;
    } catch (error) {
        console.error('Database error in getFilteredRequests:', error);
        throw new Error('Failed to retrieve filtered requests');
    }
};

module.exports = {
  createCompleteAppointment,
  checkIfFirstTimeCustomer,
  sendCancelRequest,
  getAppointmentsByCustomer,
  getPendingCancellationRequests,
  processCancellationRequest,
  getCancellationRequestsByStatus,
  getFilteredRequests
};
