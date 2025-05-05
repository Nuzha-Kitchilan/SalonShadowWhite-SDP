// const db = require('../config/db');

// const createCompleteAppointment = async (
//   customer_id,
//   appointment_date,
//   appointment_time,
//   services = [],
//   stylist_ids = []
// ) => {
//   const connection = await db.getConnection();
//   try {
//     await connection.beginTransaction();

//     // 1. Insert into Appointment table
//     const [appointmentResult] = await connection.query(
//       `INSERT INTO Appointment (customer_id, appointment_date, appointment_time, appointment_status)
//        VALUES (?, ?, ?, 'Confirmed')`,
//       [customer_id, appointment_date, appointment_time]
//     );

//     const appointment_ID = appointmentResult.insertId;

//     // 2. Insert into Appointment_Service table
//     let servicesCount = 0;
//     for (const service of services) {
//       await connection.query(
//         `INSERT INTO Appointment_Service (appointment_ID, service_id)
//          VALUES (?, ?)`,
//         [appointment_ID, service.service_id]
//       );
//       servicesCount++;
//     }

//     // 3. Insert into Appointment_Stylist table
//     let stylistsAssigned = 0;
//     for (const stylist_id of stylist_ids) {
//       if (stylist_id) {
//         await connection.query(
//           `INSERT INTO Appointment_Stylist (stylist_ID, appointment_ID)
//            VALUES (?, ?)`,
//           [stylist_id, appointment_ID]
//         );
//         stylistsAssigned++;
//       }
//     }

//     await connection.commit();
//     connection.release();

//     return {
//       appointment_ID,
//       servicesCount,
//       stylistsAssigned
//     };
//   } catch (err) {
//     await connection.rollback();
//     connection.release();
//     throw err;
//   }
// };

// const checkIfFirstTimeCustomer = async (customer_id) => {
//   const connection = await db.getConnection();
//   try {
//     const [appointments] = await connection.query(
//       `SELECT * FROM Appointment WHERE customer_id = ?`,
//       [customer_id]
//     );
//     return appointments.length === 0;
//   } catch (err) {
//     throw new Error('Error checking if customer is first-timer: ' + err.message);
//   } finally {
//     connection.release();
//   }
// };

// module.exports = {
//   createCompleteAppointment,
//   checkIfFirstTimeCustomer
// };









// const db = require('../config/db');



// // 1. First, let's update the createCompleteAppointment function in your backend
// // This is the most important fix
// const createCompleteAppointment = async (
//   customer_id,
//   appointment_date, // Expects YYYY-MM-DD
//   appointment_time, // Expects HH:MM
//   services = [],
//   stylist_ids = []
// ) => {
//   const connection = await db.getConnection();
//   try {
//     await connection.beginTransaction();

//     // CRITICAL FIX: Ensure the exact date string provided is used directly
//     // Do NOT create a new Date object as it will apply timezone conversion
//     const formattedDate = appointment_date; // Use the exact date string passed from frontend

//     // 1. Insert into Appointment table with the exact date string
//     const [appointmentResult] = await connection.query(
//       `INSERT INTO Appointment (customer_id, appointment_date, appointment_time, appointment_status)
//        VALUES (?, ?, ?, 'Confirmed')`,
//       [customer_id, formattedDate, appointment_time]
//     );

//     const appointment_ID = appointmentResult.insertId;

//     // 2. Insert into Appointment_Service table
//     let servicesCount = 0;
//     for (const service of services) {
//       await connection.query(
//         `INSERT INTO Appointment_Service (appointment_ID, service_id)
//          VALUES (?, ?)`,
//         [appointment_ID, service.service_id]
//       );
//       servicesCount++;
//     }

//     // 3. Insert into Appointment_Stylist table
//     let stylistsAssigned = 0;
//     for (const stylist_id of stylist_ids) {
//       if (stylist_id) {
//         await connection.query(
//           `INSERT INTO Appointment_Stylist (stylist_ID, appointment_ID)
//            VALUES (?, ?)`,
//           [stylist_id, appointment_ID]
//         );
//         stylistsAssigned++;
//       }
//     }

//     await connection.commit();
//     connection.release();

//     return {
//       appointment_ID,
//       servicesCount,
//       stylistsAssigned
//     };
//   } catch (err) {
//     await connection.rollback();
//     connection.release();
//     throw err;
//   }
// };


// // ... (rest of the model methods remain the same)

// const checkIfFirstTimeCustomer = async (customer_id) => {
//   const connection = await db.getConnection();
//   try {
//     const [appointments] = await connection.query(
//       `SELECT * FROM Appointment WHERE customer_id = ?`,
//       [customer_id]
//     );
//     return appointments.length === 0;
//   } catch (err) {
//     throw new Error('Error checking if customer is first-timer: ' + err.message);
//   } finally {
//     connection.release();
//   }
// };

// // NEW: Customer cancellation request
// const sendCancelRequest = async (appointmentId) => {
//   const connection = await db.getConnection();
//   try {
//     const [result] = await connection.query(
//       `UPDATE Appointment
//        SET cancellation_status = 'Requested', cancel_request_time = NOW()
//        WHERE appointment_ID = ? AND appointment_status != 'Cancelled'`,
//       [appointmentId]
//     );
//     return result;
//   } catch (err) {
//     throw new Error('Error updating cancellation request: ' + err.message);
//   } finally {
//     connection.release();
//   }
// };



// const getAppointmentsByCustomer = async (customerId) => {
//   const connection = await db.getConnection();
//   try {
//     const [appointments] = await connection.query(
//       `SELECT 
//         a.appointment_ID,
//         a.appointment_date,
//         a.appointment_time,
//         a.appointment_status,
//         a.cancellation_status,
//         a.cancel_request_time,
//         GROUP_CONCAT(DISTINCT s.service_name) as services,
//         GROUP_CONCAT(DISTINCT CONCAT(st.firstname, ' ', st.lastname)) as stylists
//       FROM Appointment a
//       LEFT JOIN Appointment_Service aps ON a.appointment_ID = aps.appointment_ID
//       LEFT JOIN Service s ON aps.service_ID = s.service_ID
//       LEFT JOIN Appointment_Stylist ast ON a.appointment_ID = ast.appointment_ID
//       LEFT JOIN Stylists st ON ast.stylist_ID = st.stylist_ID
//       WHERE a.customer_id = ?
//       GROUP BY a.appointment_ID
//       ORDER BY a.appointment_date DESC, a.appointment_time DESC
//       `,
//       [customerId]
//     );

//     return appointments;
//   } catch (err) {
//     throw new Error('Error fetching appointments: ' + err.message);
//   } finally {
//     connection.release();
//   }
// };


// // Get all pending cancellation requests
// // Get all pending cancellation requests
// // const getPendingCancellationRequests = async () => {
// //   const connection = await db.getConnection();
// //   try {
// //     // First get the basic request info
// //     const [requests] = await connection.query(
// //       `SELECT 
// //         a.appointment_ID,
// //         a.customer_id,
// //         a.appointment_date,
// //         a.appointment_time,
// //         a.cancel_request_time,
// //         c.firstname,
// //         c.lastname,
// //         c.email,
// //         GROUP_CONCAT(DISTINCT s.service_name) as services,
// //         GROUP_CONCAT(DISTINCT CONCAT(st.firstname, ' ', st.lastname)) as stylists
// //       FROM Appointment a
// //       JOIN Customer c ON a.customer_id = c.customer_ID
// //       LEFT JOIN Appointment_Service aps ON a.appointment_ID = aps.appointment_ID
// //       LEFT JOIN Service s ON aps.service_ID = s.service_ID
// //       LEFT JOIN Appointment_Stylist ast ON a.appointment_ID = ast.appointment_ID
// //       LEFT JOIN Stylists st ON ast.stylist_ID = st.stylist_ID
// //       WHERE a.cancellation_status = 'Requested'
// //       GROUP BY a.appointment_ID
// //       ORDER BY a.cancel_request_time ASC`
// //     );

// //     // Then get phone numbers for each customer
// //     const requestsWithPhones = await Promise.all(
// //       requests.map(async (request) => {
// //         const [phones] = await connection.query(
// //           `SELECT phone_num FROM Customer_Phone_Num 
// //            WHERE customer_ID = ?`,
// //           [request.customer_id]
// //         );
// //         return {
// //           ...request,
// //           phones: phones.map(p => p.phone_num),
// //           primary_phone: phones[0]?.phone_num || null
// //         };
// //       })
// //     );

// //     return requestsWithPhones;
// //   } catch (err) {
// //     throw new Error('Error fetching cancellation requests: ' + err.message);
// //   } finally {
// //     connection.release();
// //   }
// // };


// // Process cancellation request (approve/reject)
// // const processCancellationRequest = async (appointmentId, action) => {
// //   const connection = await db.getConnection();
// //   try {
// //     await connection.beginTransaction();
    
// //     // Update appointment status
// //     const [result] = await connection.query(
// //       `UPDATE Appointment 
// //        SET cancellation_status = ?, 
// //            appointment_status = IF(? = 'Approved', 'Cancelled', appointment_status)
// //        WHERE appointment_ID = ? AND cancellation_status = 'Requested'`,
// //       [action, action, appointmentId]
// //     );

// //     if (result.affectedRows === 0) {
// //       throw new Error('No pending cancellation request found for this appointment');
// //     }

// //     await connection.commit();
// //     return { success: true, action };
// //   } catch (err) {
// //     await connection.rollback();
// //     throw err;
// //   } finally {
// //     connection.release();
// //   }
// // };






// const getPendingCancellationRequests = async () => {
//   const connection = await db.getConnection();
//   try {
//     // First get basic appointment data with payment info
//     const [appointments] = await connection.query(`
//       SELECT 
//         a.appointment_ID,
//         a.customer_id,
//         a.appointment_date,
//         a.appointment_time,
//         a.cancel_request_time,
//         c.firstname,
//         c.lastname,
//         c.email,
//         p.payment_ID,
//         p.payment_amount,
//         p.amount_paid,
//         p.payment_status,
//         p.payment_type,
//         p.stripe_payment_intent_id,
//         p.payment_date
//       FROM Appointment a
//       JOIN Customer c ON a.customer_id = c.customer_ID
//       LEFT JOIN Payment p ON a.appointment_ID = p.appointment_ID
//       WHERE a.cancellation_status = 'Requested'
//       ORDER BY a.cancel_request_time ASC
//     `);

//     // Then get additional details for each appointment
//     const requestsWithDetails = await Promise.all(
//       appointments.map(async (appt) => {
//         // Get services
//         const [services] = await connection.query(`
//           SELECT GROUP_CONCAT(DISTINCT s.service_name) as services
//           FROM Appointment_Service aps
//           JOIN Service s ON aps.service_ID = s.service_ID
//           WHERE aps.appointment_ID = ?
//           GROUP BY aps.appointment_ID
//         `, [appt.appointment_ID]);

//         // Get stylists
//         const [stylists] = await connection.query(`
//           SELECT GROUP_CONCAT(DISTINCT CONCAT(st.firstname, ' ', st.lastname)) as stylists
//           FROM Appointment_Stylist ast
//           JOIN Stylists st ON ast.stylist_ID = st.stylist_ID
//           WHERE ast.appointment_ID = ?
//           GROUP BY ast.appointment_ID
//         `, [appt.appointment_ID]);

//         // Get phone numbers
//         const [phones] = await connection.query(`
//           SELECT phone_num FROM Customer_Phone_Num 
//           WHERE customer_ID = ?
//         `, [appt.customer_id]);

//         return {
//           ...appt,
//           services: services[0]?.services || null,
//           stylists: stylists[0]?.stylists || null,
//           phones: phones.map(p => p.phone_num),
//           primary_phone: phones[0]?.phone_num || null,
//           payment: appt.payment_ID ? {
//             payment_ID: appt.payment_ID,
//             payment_amount: appt.payment_amount,
//             amount_paid: appt.amount_paid,
//             payment_status: appt.payment_status,
//             payment_type: appt.payment_type,
//             stripe_payment_intent_id: appt.stripe_payment_intent_id,
//             payment_date: appt.payment_date
//           } : null
//         };
//       })
//     );

//     return requestsWithDetails;
//   } catch (err) {
//     console.error('Database error in getPendingCancellationRequests:', err);
//     throw err;
//   } finally {
//     connection.release();
//   }
// };

// const processCancellationRequest = async (appointmentId, action) => {
//   const connection = await db.getConnection();
//   try {
//     await connection.beginTransaction();
    
//     // Update appointment status - removed the comma and fixed parameter order
//     const [result] = await connection.query(
//       `UPDATE Appointment 
//        SET cancellation_status = ?, 
//            appointment_status = IF(? = 'Approved', 'Cancelled', appointment_status)
//        WHERE appointment_ID = ? AND cancellation_status = 'Requested'`,
//       [action, action, appointmentId]
//     );

//     if (result.affectedRows === 0) {
//       throw new Error('No pending cancellation request found for this appointment');
//     }

//     await connection.commit();
//     return { success: true, action };
//   } catch (err) {
//     await connection.rollback();
//     throw err;
//   } finally {
//     connection.release();
//   }
// };





// module.exports = {
//   createCompleteAppointment,
//   checkIfFirstTimeCustomer,
//   sendCancelRequest,
//   getAppointmentsByCustomer,
//   getPendingCancellationRequests,
//   processCancellationRequest
// };














const db = require('../config/db');

// 1. Create a complete appointment
const createCompleteAppointment = async (
  customer_id,
  appointment_date,
  appointment_time,
  services = [],
  stylist_ids = []
) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const formattedDate = appointment_date;

    const [appointmentResult] = await connection.query(
      `INSERT INTO Appointment (customer_id, appointment_date, appointment_time, appointment_status)
       VALUES (?, ?, ?, 'Scheduled')`,
      [customer_id, formattedDate, appointment_time]
    );

    const appointment_ID = appointmentResult.insertId;

    // Insert into Appointment_Service_Stylist table
    let serviceStylistPairs = 0;
    for (const service of services) {
      for (const stylist_id of stylist_ids) {
        if (stylist_id) {
          await connection.query(
            `INSERT INTO Appointment_Service_Stylist (appointment_ID, service_ID, stylist_ID)
             VALUES (?, ?, ?)`,
            [appointment_ID, service.service_id, stylist_id]
          );
          serviceStylistPairs++;
        }
      }
    }

    await connection.commit();
    connection.release();

    return {
      appointment_ID,
      serviceStylistPairs
    };
  } catch (err) {
    await connection.rollback();
    connection.release();
    throw err;
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

// 3. Customer requests cancellation
const sendCancelRequest = async (appointmentId) => {
  const connection = await db.getConnection();
  try {
    const [result] = await connection.query(
      `UPDATE Appointment
       SET cancellation_status = 'Requested', cancel_request_time = NOW()
       WHERE appointment_ID = ? AND appointment_status != 'Cancelled'`,
      [appointmentId]
    );
    return result;
  } catch (err) {
    throw new Error('Error updating cancellation request: ' + err.message);
  } finally {
    connection.release();
  }
};

// 4. Get all appointments for a customer
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
        GROUP_CONCAT(DISTINCT CONCAT(st.firstname, ' ', st.lastname)) AS stylists
      FROM Appointment a
      LEFT JOIN Appointment_Service_Stylist ass ON a.appointment_ID = ass.appointment_ID
      LEFT JOIN Service s ON ass.service_ID = s.service_ID
      LEFT JOIN Stylists st ON ass.stylist_ID = st.stylist_ID
      WHERE a.customer_id = ?
      GROUP BY a.appointment_ID
      ORDER BY a.appointment_date DESC, a.appointment_time DESC`,
      [customerId]
    );

    return appointments;
  } catch (err) {
    throw new Error('Error fetching appointments: ' + err.message);
  } finally {
    connection.release();
  }
};

// 5. Get all pending cancellation requests (with payment, services, stylists, phones)
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

// 6. Process cancellation request (approve/reject)
const processCancellationRequest = async (appointmentId, action) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const [result] = await connection.query(
      `UPDATE Appointment
       SET cancellation_status = ?, 
           appointment_status = IF(? = 'Approved', 'Cancelled', appointment_status)
       WHERE appointment_ID = ? AND cancellation_status = 'Requested'`,
      [action, action, appointmentId]
    );

    if (result.affectedRows === 0) {
      throw new Error('No pending cancellation request found for this appointment');
    }

    await connection.commit();
    return { success: true, action };
  } catch (err) {
    await connection.rollback();
    throw err;
  } finally {
    connection.release();
  }
};

// Export all
module.exports = {
  createCompleteAppointment,
  checkIfFirstTimeCustomer,
  sendCancelRequest,
  getAppointmentsByCustomer,
  getPendingCancellationRequests,
  processCancellationRequest
};
