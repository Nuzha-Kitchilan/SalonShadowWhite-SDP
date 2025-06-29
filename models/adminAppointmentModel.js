
const db = require('../config/db');

const getAllServices = async () => {
  const [services] = await db.query('SELECT * FROM Service');
  return services;
};

const getAllStylists = async () => {
  const [stylists] = await db.query('SELECT stylist_ID, firstname, lastname FROM Stylists');
  return stylists;
};

const getAllCustomers = async () => {
  const [customers] = await db.query('SELECT customer_ID, firstname, lastname FROM Customer');
  return customers;
};

const getAppointmentsList = async (page = 1, limit = 10, filters = {}) => {
  const offset = (page - 1) * limit;

  let conditions = [];
  let values = [];

  if (filters.appointmentId) {
    conditions.push('a.appointment_ID = ?');
    values.push(filters.appointmentId);
  }
  if (filters.date) {
    conditions.push('DATE(a.appointment_date) = ?');
    values.push(filters.date);
  }
  if (filters.customerName) {
    conditions.push(`CONCAT(c.firstname, ' ', c.lastname) LIKE ?`);
    values.push(`%${filters.customerName}%`);
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const [appointments] = await db.query(`
    SELECT 
      a.appointment_ID,
      a.customer_ID,
      CONCAT(c.firstname, ' ', c.lastname) as customer_name,
      a.appointment_date,
      a.appointment_time,
      a.appointment_status,
      p.payment_status,
      p.payment_amount,
      p.amount_paid,
      IFNULL(GROUP_CONCAT(DISTINCT s.service_name), '') as services,
      IFNULL(GROUP_CONCAT(DISTINCT CONCAT(st.firstname, ' ', st.lastname)), '') as stylists
    FROM Appointment a
    LEFT JOIN Customer c ON a.customer_ID = c.customer_ID
    LEFT JOIN Payment p ON a.appointment_ID = p.appointment_ID
    LEFT JOIN Appointment_Service_Stylist ass ON a.appointment_ID = ass.appointment_ID
    LEFT JOIN Service s ON ass.service_ID = s.service_ID
    LEFT JOIN Stylists st ON ass.stylist_ID = st.stylist_ID
    ${whereClause}
    GROUP BY a.appointment_ID, p.payment_ID
    ORDER BY a.appointment_date DESC, a.appointment_time DESC
    LIMIT ? OFFSET ?
  `, [...values, limit, offset]);

  appointments.forEach(appointment => {
    if (!appointment.services) appointment.services = '';
    if (!appointment.stylists) appointment.stylists = '';
  });

  const [countResult] = await db.query(`
    SELECT COUNT(DISTINCT a.appointment_ID) as total
    FROM Appointment a
    LEFT JOIN Customer c ON a.customer_ID = c.customer_ID
    ${whereClause}
  `, values);

  const totalCount = countResult[0].total;
  const totalPages = Math.ceil(totalCount / limit);

  return {
    appointments,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems: totalCount,
      itemsPerPage: limit
    }
  };
};

const getAppointmentDetails = async (appointmentId) => {
  try {
    const [appointment] = await db.query(`
      SELECT 
        a.*,
        CONCAT(c.firstname, ' ', c.lastname) as customer_name,
        c.email as customer_email,
        (SELECT phone_num FROM Customer_Phone_Num WHERE customer_ID = c.customer_ID LIMIT 1) as customer_phone,
        p.payment_ID,
        p.payment_amount,
        p.amount_paid,
        p.payment_date,
        p.payment_status,
        p.payment_type,
        p.is_partial,
        p.is_first_time,
        IFNULL(GROUP_CONCAT(DISTINCT s.service_name), '') as services,
        IFNULL(GROUP_CONCAT(DISTINCT CONCAT(st.firstname, ' ', st.lastname)), '') as stylists
      FROM Appointment a
      LEFT JOIN Customer c ON a.customer_ID = c.customer_ID
      LEFT JOIN Payment p ON a.appointment_ID = p.appointment_ID
      LEFT JOIN Appointment_Service_Stylist ass ON a.appointment_ID = ass.appointment_ID
      LEFT JOIN Service s ON ass.service_ID = s.service_ID
      LEFT JOIN Stylists st ON ass.stylist_ID = st.stylist_ID
      WHERE a.appointment_ID = ?
      GROUP BY a.appointment_ID, p.payment_ID
    `, [appointmentId]);

    if (appointment && appointment[0]) {
      if (!appointment[0].services) appointment[0].services = '';
      if (!appointment[0].stylists) appointment[0].stylists = '';
    }

    return appointment[0];
  } catch (error) {
    console.error('Error getting appointment details:', error);
    throw error;
  }
};

const createAppointment = async (appointmentData) => {
  console.log('=== STARTING APPOINTMENT CREATION ===');
  console.log('Full appointment data received:', JSON.stringify(appointmentData, null, 2));

  const {
    customer_ID,
    appointment_date,
    appointment_time,
    appointment_status = 'Scheduled',
    serviceStylists = [],
    payment_status = 'Pending',
    payment_amount = 0,
    payment_type = 'Pay at Salon'
  } = appointmentData;

  // Validate required fields
  if (!customer_ID || !appointment_date || !appointment_time) {
    throw new Error('Missing required fields: customer_ID, appointment_date, appointment_time');
  }

  // Validate serviceStylists structure
  if (serviceStylists && !Array.isArray(serviceStylists)) {
    throw new Error('serviceStylists must be an array');
  }

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    console.log('Transaction started');

    // 1. Create the appointment record
    console.log('Creating appointment record...');
    const [appointmentResult] = await connection.query(`
      INSERT INTO Appointment (
        customer_ID, 
        appointment_date, 
        appointment_time, 
        appointment_status
      ) VALUES (?, ?, ?, ?)
    `, [customer_ID, appointment_date, appointment_time, appointment_status]);

    const appointment_ID = appointmentResult.insertId;
    console.log(`Created appointment with ID: ${appointment_ID}`);

    // 2. Insert service-stylist relationships
    if (serviceStylists.length > 0) {
      console.log('Preparing to insert service-stylist relationships:', serviceStylists);
      
      // Validate each service-stylist pair
      const serviceValues = serviceStylists.map(item => {
        if (!item.service_ID || !item.stylist_ID) {
          throw new Error(`Invalid service-stylist pair: ${JSON.stringify(item)}`);
        }
        return [appointment_ID, item.service_ID, item.stylist_ID];
      });

      console.log('Formatted values for insertion:', serviceValues);

      // DEBUG: Check if table exists
      try {
        const [tables] = await connection.query(`
          SHOW TABLES LIKE 'Appointment_Service_Stylist'
        `);
        console.log('Table existence check:', tables.length > 0 ? 'Exists' : 'DOES NOT EXIST');
      } catch (error) {
        console.error('Error checking table existence:', error);
      }

      // DEBUG: Check columns
      try {
        const [columns] = await connection.query(`
          SHOW COLUMNS FROM Appointment_Service_Stylist
        `);
        console.log('Table columns:', columns);
      } catch (error) {
        console.error('Error checking table columns:', error);
      }

      // Insert the relationships
      try {
        const [result] = await connection.query(`
          INSERT INTO Appointment_Service_Stylist (appointment_ID, service_ID, stylist_ID)
          VALUES ?
        `, [serviceValues]);
        
        console.log('Insert result:', result);
        console.log(`Inserted ${result.affectedRows} service-stylist relationships`);
      } catch (insertError) {
        console.error('INSERT ERROR DETAILS:', {
          message: insertError.message,
          sql: insertError.sql,
          parameters: insertError.parameters,
          stack: insertError.stack
        });
        throw insertError;
      }
    } else {
      console.log('No service-stylist relationships provided');
    }

    // 3. Create payment record
    console.log('Creating payment record...');
    await connection.query(`
      INSERT INTO Payment (
        customer_ID,
        appointment_ID,
        payment_amount,
        amount_paid,
        payment_date,
        payment_status,
        payment_type
      ) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, ?, ?)
    `, [
      customer_ID,
      appointment_ID,
      payment_amount,
      payment_status === 'Paid' ? payment_amount : 0,
      payment_status,
      payment_type
    ]);

    await connection.commit();
    console.log('=== APPOINTMENT CREATION SUCCESSFUL ===');
    return appointment_ID;
  } catch (error) {
    await connection.rollback();
    console.error('=== APPOINTMENT CREATION FAILED ===', {
      error: {
        message: error.message,
        stack: error.stack,
        sql: error.sql,
        parameters: error.parameters
      },
      appointmentData
    });
    throw error;
  } finally {
    connection.release();
    console.log('Database connection released');
  }
};


//working one
const updateAppointment = async (appointmentId, updateData) => {
  const {
    customer_ID,
    appointment_date,
    appointment_time,
    appointment_status,
    serviceStylists,
    payment_status,
    payment_amount,
    payment_type
  } = updateData;

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const [currentAppointment] = await connection.query(
      'SELECT appointment_status, appointment_date, appointment_time FROM Appointment WHERE appointment_ID = ?',
      [appointmentId]
    );
    
    const previousStatus = currentAppointment[0]?.appointment_status;
    
    // Validate if trying to set status to 'Completed'
    if (appointment_status === 'Completed') {
      const appointmentDateTime = new Date(`${appointment_date}T${appointment_time}`);
      const currentDateTime = new Date();
      
      if (appointmentDateTime > currentDateTime) {
        throw new Error('Cannot mark an appointment as completed before its scheduled date and time');
      }
    }

    await connection.query(`
      UPDATE Appointment 
      SET 
        customer_ID = ?, 
        appointment_date = ?, 
        appointment_time = ?, 
        appointment_status = ?
      WHERE appointment_ID = ?
    `, [customer_ID, appointment_date, appointment_time, appointment_status, appointmentId]);

    if (serviceStylists !== undefined) {
      await connection.query('DELETE FROM Appointment_Service_Stylist WHERE appointment_ID = ?', [appointmentId]);
      
      if (serviceStylists && serviceStylists.length) {
        const serviceValues = serviceStylists.map(item => {
          if (!item.service_ID || !item.stylist_ID) {
            throw new Error('Each serviceStylist item must have service_ID and stylist_ID');
          }
          return [appointmentId, item.service_ID, item.stylist_ID];
        });
        
        await connection.query(`
          INSERT INTO Appointment_Service_Stylist (appointment_ID, service_ID, stylist_ID)
          VALUES ?
        `, [serviceValues]);
      }
    }

    await connection.query(`
      UPDATE Payment 
      SET 
        payment_amount = ?, 
        amount_paid = ?, 
        payment_status = ?, 
        payment_type = ?, 
        payment_date = CURRENT_TIMESTAMP
      WHERE appointment_ID = ?
    `, [
      payment_amount,
      payment_status === 'Paid' ? payment_amount : 0,
      payment_status,
      payment_type,
      appointmentId
    ]);

    await connection.commit();
    return true;
  } catch (error) {
    await connection.rollback();
    console.error('Error updating appointment:', error);
    throw error;
  } finally {
    connection.release();
  }
};



const deleteAppointment = async (appointmentId) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    await connection.query('DELETE FROM Appointment_Service_Stylist WHERE appointment_ID = ?', [appointmentId]);
    await connection.query('DELETE FROM Payment WHERE appointment_ID = ?', [appointmentId]);
    const [result] = await connection.query('DELETE FROM Appointment WHERE appointment_ID = ?', [appointmentId]);

    await connection.commit();
    return result.affectedRows > 0;
  } catch (error) {
    await connection.rollback();
    console.error('Error deleting appointment:', error);
    throw error;
  } finally {
    connection.release();
  }
};

const getAppointmentsForToday = async (date, stylistId = null) => {
  let query = `
    SELECT 
      a.appointment_ID,
      a.customer_ID,
      a.appointment_date,
      a.appointment_time,
      a.appointment_status,
      CONCAT(c.firstname, ' ', c.lastname) AS customer_name,
      IFNULL(GROUP_CONCAT(DISTINCT s.service_name), '') AS services,
      IFNULL(GROUP_CONCAT(DISTINCT CONCAT(st.firstname, ' ', st.lastname)), '') AS stylists,
      MAX(p.payment_amount) AS payment_amount,
      MAX(p.amount_paid) AS amount_paid,
      MAX(p.payment_status) AS payment_status
    FROM Appointment a
    LEFT JOIN Customer c ON a.customer_ID = c.customer_ID
    LEFT JOIN Payment p ON a.appointment_ID = p.appointment_ID
    LEFT JOIN Appointment_Service_Stylist ass ON a.appointment_ID = ass.appointment_ID
    LEFT JOIN Service s ON ass.service_ID = s.service_ID
    LEFT JOIN Stylists st ON ass.stylist_ID = st.stylist_ID
    WHERE DATE(a.appointment_date) = ?
  `;

  const params = [date];

  if (stylistId) {
    query += ' AND ass.stylist_ID = ?';
    params.push(stylistId);
  }

  query += ' GROUP BY a.appointment_ID, a.customer_ID, a.appointment_date, a.appointment_time, a.appointment_status, customer_name ORDER BY a.appointment_time';

  const [appointments] = await db.execute(query, params);
  
  appointments.forEach(appointment => {
    if (!appointment.services) appointment.services = '';
    if (!appointment.stylists) appointment.stylists = '';
  });
  
  return appointments;
};

const createBridalAppointment = async (bridalData) => {
  console.log('Creating bridal appointment with data:', bridalData);
  
  const {
    customer_ID,
    appointment_date,
    appointment_time,
    services = [],
    stylists = [],
    custom_price,
    notes = ''
  } = bridalData;

  // Validate required fields
  if (!customer_ID || !appointment_date || !appointment_time) {
    throw new Error('Missing required fields: customer_ID, appointment_date, appointment_time');
  }

  // Use the exact assignments from frontend
const serviceStylists = bridalData.service_stylist_assignments.map(assignment => ({
  service_ID: assignment.service_id,
  stylist_ID: assignment.stylist_id
}));

// Validate at least one stylist is assigned
if (serviceStylists.length === 0) {
  throw new Error('At least one service must have a stylist assigned');
}

  // Calculate total price if custom price not provided
  let totalPrice = custom_price;
  if (!custom_price && services.length > 0) {
    const [servicePrices] = await db.query(
      'SELECT SUM(price) as total FROM Service WHERE service_ID IN (?)',
      [services]
    );
    totalPrice = servicePrices[0].total;
  }

  const appointmentData = {
    customer_ID,
    appointment_date,
    appointment_time,
    appointment_status: 'Scheduled',
    serviceStylists,
    payment_amount: totalPrice || 0,
    payment_status: 'Pending',
    payment_type: 'Bridal Package',
    notes
  };

  return await createAppointment(appointmentData);
};


const updateBridalAppointment = async (appointmentId, bridalData) => {
  console.log('Updating bridal appointment with ID:', appointmentId, 'Data:', bridalData);

  const {
    appointment_date,
    appointment_time,
    services = [],
    stylist_id,
    service_stylist_assignments = [],
    custom_price,
    notes = '',
    appointment_status,
    payment_status
  } = bridalData;

  if (!appointment_date || !appointment_time) {
    throw new Error('Missing required fields: appointment_date, appointment_time');
  }

  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Resolve service names to IDs if needed
    const serviceNames = Array.isArray(services) ? services : [services];
    let serviceMap = {};

    if (serviceNames.length > 0) {
      const [serviceResults] = await connection.query(
        'SELECT service_ID, service_name FROM Service WHERE service_name IN (?)',
        [serviceNames]
      );

      serviceResults.forEach(service => {
        serviceMap[service.service_name] = service.service_ID;
      });

      const missingServices = serviceNames.filter(name => !serviceMap[name]);
      if (missingServices.length > 0) {
        throw new Error(`Could not find IDs for services: ${missingServices.join(', ')}`);
      }
    }

    // 2. Update Appointment table
    await connection.query(
      `UPDATE Appointment 
       SET appointment_date = ?, 
           appointment_time = ?, 
           appointment_status = ?
       WHERE appointment_ID = ?`,
      [
        appointment_date,
        appointment_time,
        appointment_status || 'Scheduled',
        appointmentId
      ]
    );

    // 3. Update Payment table
    const totalPrice = custom_price !== undefined
      ? custom_price
      : (serviceNames.length > 0
        ? await calculateServiceTotal(connection, serviceNames)
        : null);

    if (totalPrice !== null) {
      await connection.query(
        `UPDATE Payment 
         SET payment_status = ?, 
             payment_amount = ? 
         WHERE appointment_ID = ?`,
        [
          payment_status || 'Pending',
          totalPrice,
          appointmentId
        ]
      );
    }

    // 4. Update service-stylist assignments ONLY if services or stylist info is being updated
    const shouldUpdateStylistAssignments = 
      (stylist_id && serviceNames.length > 0) ||
      (Array.isArray(service_stylist_assignments) && service_stylist_assignments.length > 0);

    if (shouldUpdateStylistAssignments) {
      // Delete existing
      await connection.query(
        'DELETE FROM Appointment_Service_Stylist WHERE appointment_ID = ?',
        [appointmentId]
      );

      if (stylist_id && serviceNames.length > 0) {
        const insertValues = serviceNames.map(serviceName => [
          appointmentId,
          serviceMap[serviceName],
          stylist_id
        ]);
        await connection.query(
          'INSERT INTO Appointment_Service_Stylist (appointment_ID, service_ID, stylist_ID) VALUES ?',
          [insertValues]
        );
      } else if (service_stylist_assignments.length > 0) {
        const insertValues = service_stylist_assignments.map(({ service_name, stylist_id }) => {
          const serviceID = serviceMap[service_name];
          if (!serviceID) throw new Error(`Service "${service_name}" not found in database.`);
          return [appointmentId, serviceID, stylist_id];
        });

        await connection.query(
          'INSERT INTO Appointment_Service_Stylist (appointment_ID, service_ID, stylist_ID) VALUES ?',
          [insertValues]
        );
      }
    }

    await connection.commit();
    return appointmentId;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};


// Helper function to calculate total service price
async function calculateServiceTotal(connection, serviceNames) {
  const [servicePrices] = await connection.query(
    `SELECT SUM(price) as total 
     FROM Service 
     WHERE service_name IN (?)`,
    [serviceNames]
  );
  return servicePrices[0].total || 0;
}



const deleteBridalAppointment = async (appointmentId) => {
  // Uses the same delete functionality as regular appointments
  // but we add verification that it's a bridal appointment first
  const [appointment] = await db.query(
    `SELECT a.appointment_ID, p.payment_type 
     FROM Appointment a
     JOIN Payment p ON a.appointment_ID = p.appointment_ID
     WHERE a.appointment_ID = ? AND p.payment_type = 'Bridal Package'`,
    [appointmentId]
  );

  if (!appointment || appointment.length === 0) {
    throw new Error('Bridal appointment not found or not a bridal package');
  }

  return await deleteAppointment(appointmentId);
};



const getAllBridalAppointments = async () => {
  const query = `
    SELECT 
      a.appointment_ID AS id,
      CONCAT(c.firstname, ' ', c.lastname) AS customer_name,
      c.email AS customer_email,
      GROUP_CONCAT(DISTINCT cp.phone_num SEPARATOR ', ') AS customer_phones,
      a.appointment_date,
      a.appointment_time,
      a.appointment_status,
      GROUP_CONCAT(DISTINCT s.service_name SEPARATOR ', ') AS services,
      GROUP_CONCAT(DISTINCT st.firstname SEPARATOR ', ') AS stylists,
      MAX(p.payment_amount) AS payment_amount,
      MAX(p.payment_status) AS payment_status,
      MAX(p.payment_type) AS payment_type
    FROM Appointment a
    JOIN Customer c ON a.customer_ID = c.customer_ID
    LEFT JOIN Customer_Phone_Num cp ON c.customer_ID = cp.customer_ID
    JOIN Appointment_Service_Stylist ass ON a.appointment_ID = ass.appointment_ID
    JOIN Service s ON ass.service_ID = s.service_ID
    LEFT JOIN Stylists st ON ass.stylist_ID = st.stylist_ID
    JOIN Payment p ON a.appointment_ID = p.appointment_ID
    WHERE p.payment_type = 'Bridal Package'
    GROUP BY a.appointment_ID
    ORDER BY a.appointment_date, a.appointment_time
  `;

  const [results] = await db.query(query);
  return results;
};



const getBridalAppointmentById = async (appointmentId) => {
  const query = `
    SELECT 
      a.appointment_ID AS id,
      CONCAT(c.firstname, ' ', c.lastname) AS customer_name,
      c.email AS customer_email,
      GROUP_CONCAT(DISTINCT cpn.phone_num SEPARATOR ', ') AS customer_phone,
      a.appointment_date,
      a.appointment_time,
      a.appointment_status,
      
      GROUP_CONCAT(DISTINCT s.service_name SEPARATOR ', ') AS services,
      GROUP_CONCAT(DISTINCT CONCAT(st.firstname, ' ', st.lastname) SEPARATOR ', ') AS stylists,
      MAX(p.payment_amount) AS payment_amount,
      MAX(p.payment_status) AS payment_status,
      MAX(p.payment_date) AS payment_date
    FROM Appointment a
    JOIN Customer c ON a.customer_ID = c.customer_ID
    LEFT JOIN Customer_Phone_Num cpn ON c.customer_ID = cpn.customer_ID
    JOIN Appointment_Service_Stylist ass ON a.appointment_ID = ass.appointment_ID
    JOIN Service s ON ass.service_ID = s.service_ID
    LEFT JOIN Stylists st ON ass.stylist_ID = st.stylist_ID
    JOIN Payment p ON a.appointment_ID = p.appointment_ID
    WHERE p.payment_type = 'Bridal Package' 
    AND a.appointment_ID = ?
    GROUP BY a.appointment_ID
  `;

  try {
    const [rows] = await db.query(query, [appointmentId]);
    
    if (rows.length === 0) {
      throw new Error('Bridal appointment not found');
    }
    
    return rows[0]; // Return the first (and should be only) result
  } catch (error) {
    throw new Error(`Error fetching bridal appointment: ${error.message}`);
  }
};

module.exports = {
  getAllServices,
  getAllStylists,
  getAllCustomers,
  getAppointmentsList,
  getAppointmentDetails,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getAppointmentsForToday,
  createBridalAppointment,
  deleteBridalAppointment,
  getAppointmentsForToday,
  getAllBridalAppointments,
  updateBridalAppointment,
  getBridalAppointmentById
};