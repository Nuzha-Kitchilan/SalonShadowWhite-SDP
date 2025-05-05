// const db = require('../config/db');

// // Get all services
// const getAllServices = async () => {
//   const [services] = await db.query('SELECT * FROM Service');
//   return services;
// };

// // Get all stylists
// const getAllStylists = async () => {
//   const [stylists] = await db.query('SELECT stylist_ID, firstname, lastname FROM Stylists');
//   return stylists;
// };

// // Get all customers
// const getAllCustomers = async () => {
//   const [customers] = await db.query('SELECT customer_ID, firstname, lastname FROM Customer');
//   return customers;
// };

// // Get paginated appointments list with filters
// const getAppointmentsList = async (page = 1, limit = 10, filters = {}) => {
//   const offset = (page - 1) * limit;

//   let conditions = [];
//   let values = [];

//   if (filters.appointmentId) {
//     conditions.push('a.appointment_ID = ?');
//     values.push(filters.appointmentId);
//   }
//   if (filters.date) {
//     conditions.push('DATE(a.appointment_date) = ?');
//     values.push(filters.date);
//   }
//   if (filters.customerName) {
//     conditions.push(`CONCAT(c.firstname, ' ', c.lastname) LIKE ?`);
//     values.push(`%${filters.customerName}%`);
//   }

//   const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

//   const [appointments] = await db.query(`
//     SELECT 
//       a.appointment_ID,
//       a.customer_ID,
//       CONCAT(c.firstname, ' ', c.lastname) as customer_name,
//       a.appointment_date,
//       a.appointment_time,
//       a.appointment_status,
//       p.payment_status,
//       p.payment_amount,
//       p.amount_paid,
//       GROUP_CONCAT(DISTINCT s.service_name) as services,
//       GROUP_CONCAT(DISTINCT CONCAT(st.firstname, ' ', st.lastname)) as stylists
//     FROM Appointment a
//     LEFT JOIN Customer c ON a.customer_ID = c.customer_ID
//     LEFT JOIN Payment p ON a.appointment_ID = p.appointment_ID
//     LEFT JOIN Appointment_Service a_s ON a.appointment_ID = a_s.appointment_ID
//     LEFT JOIN Service s ON a_s.service_ID = s.service_ID
//     LEFT JOIN Appointment_Stylist a_st ON a.appointment_ID = a_st.appointment_ID
//     LEFT JOIN Stylists st ON a_st.stylist_ID = st.stylist_ID
//     ${whereClause}
//     GROUP BY a.appointment_ID, p.payment_ID
//     ORDER BY a.appointment_date DESC, a.appointment_time DESC
//     LIMIT ? OFFSET ?
//   `, [...values, limit, offset]);

//   const [countResult] = await db.query(`
//     SELECT COUNT(DISTINCT a.appointment_ID) as total
//     FROM Appointment a
//     LEFT JOIN Customer c ON a.customer_ID = c.customer_ID
//     ${whereClause}
//   `, values);

//   const totalCount = countResult[0].total;
//   const totalPages = Math.ceil(totalCount / limit);

//   return {
//     appointments,
//     pagination: {
//       currentPage: page,
//       totalPages,
//       totalItems: totalCount,
//       itemsPerPage: limit
//     }
//   };
// };

// // Get single appointment with all details
// const getAppointmentDetails = async (appointmentId) => {
//   try {
//     const [appointment] = await db.query(`
//       SELECT 
//         a.*,
//         CONCAT(c.firstname, ' ', c.lastname) as customer_name,
//         c.email as customer_email,
//         (SELECT phone_num FROM Customer_Phone_Num WHERE customer_ID = c.customer_ID LIMIT 1) as customer_phone,
//         p.payment_ID,
//         p.payment_amount,
//         p.amount_paid,
//         p.payment_date,
//         p.payment_status,
//         p.payment_type,
//         p.is_partial,
//         p.is_first_time,
//         GROUP_CONCAT(DISTINCT s.service_name) as services,
//         GROUP_CONCAT(DISTINCT CONCAT(st.firstname, ' ', st.lastname)) as stylists
//       FROM Appointment a
//       LEFT JOIN Customer c ON a.customer_ID = c.customer_ID
//       LEFT JOIN Payment p ON a.appointment_ID = p.appointment_ID
//       LEFT JOIN Appointment_Service a_s ON a.appointment_ID = a_s.appointment_ID
//       LEFT JOIN Service s ON a_s.service_ID = s.service_ID
//       LEFT JOIN Appointment_Stylist a_st ON a.appointment_ID = a_st.appointment_ID
//       LEFT JOIN Stylists st ON a_st.stylist_ID = st.stylist_ID
//       WHERE a.appointment_ID = ?
//       GROUP BY a.appointment_ID, p.payment_ID
//     `, [appointmentId]);

//     return appointment[0];
//   } catch (error) {
//     console.error('Error getting appointment details:', error);
//     throw error;
//   }
// };

// // Create new appointment
// const createAppointment = async (appointmentData) => {
//   const {
//     customer_ID,
//     appointment_date,
//     appointment_time,
//     appointment_status = 'Scheduled',
//     services = [],
//     stylists = [],
//     payment_status = 'Pending',
//     payment_amount = 0,
//     payment_type = 'Pay at Salon'
//   } = appointmentData;

//   const connection = await db.getConnection();
//   try {
//     await connection.beginTransaction();

//     const [appointmentResult] = await connection.query(`
//       INSERT INTO Appointment (
//         customer_ID, 
//         appointment_date, 
//         appointment_time, 
//         appointment_status
//       ) VALUES (?, ?, ?, ?)
//     `, [customer_ID, appointment_date, appointment_time, appointment_status]);

//     const appointment_ID = appointmentResult.insertId;

//     if (services.length) {
//       const [serviceIds] = await connection.query(
//         'SELECT service_ID FROM Service WHERE service_name IN (?)',
//         [services]
//       );
//       if (serviceIds.length) {
//         const serviceValues = serviceIds.map(s => [appointment_ID, s.service_ID]);
//         await connection.query(`
//           INSERT INTO Appointment_Service (appointment_ID, service_ID)
//           VALUES ?
//         `, [serviceValues]);
//       }
//     }

//     if (stylists.length) {
//       const stylistValues = stylists.map(s => [appointment_ID, s]);
//       await connection.query(`
//         INSERT INTO Appointment_Stylist (appointment_ID, stylist_ID)
//         VALUES ?
//       `, [stylistValues]);
//     }

//     await connection.query(`
//       INSERT INTO Payment (
//         customer_ID,
//         appointment_ID,
//         payment_amount,
//         amount_paid,
//         payment_date,
//         payment_status,
//         payment_type
//       ) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, ?, ?)
//     `, [
//       customer_ID,
//       appointment_ID,
//       payment_amount,
//       payment_status === 'Paid' ? payment_amount : 0,
//       payment_status,
//       payment_type
//     ]);

//     await connection.commit();
//     return appointment_ID;
//   } catch (error) {
//     await connection.rollback();
//     console.error('Error creating appointment:', error);
//     throw error;
//   } finally {
//     connection.release();
//   }
// };

// // Update appointment
// const updateAppointment = async (appointmentId, updateData) => {
//   const {
//     customer_ID,
//     appointment_date,
//     appointment_time,
//     appointment_status,
//     services,
//     stylists,
//     payment_status,
//     payment_amount,
//     payment_type
//   } = updateData;

//   const connection = await db.getConnection();
//   try {
//     await connection.beginTransaction();

//     await connection.query(`
//       UPDATE Appointment 
//       SET 
//         customer_ID = ?, 
//         appointment_date = ?, 
//         appointment_time = ?, 
//         appointment_status = ?
//       WHERE appointment_ID = ?
//     `, [customer_ID, appointment_date, appointment_time, appointment_status, appointmentId]);

//     await connection.query('DELETE FROM Appointment_Service WHERE appointment_ID = ?', [appointmentId]);
//     if (services.length) {
//       const [serviceIds] = await connection.query(
//         'SELECT service_ID FROM Service WHERE service_name IN (?)',
//         [services]
//       );
//       if (serviceIds.length) {
//         const serviceValues = serviceIds.map(s => [appointmentId, s.service_ID]);
//         await connection.query(`
//           INSERT INTO Appointment_Service (appointment_ID, service_ID)
//           VALUES ?
//         `, [serviceValues]);
//       }
//     }

//     await connection.query('DELETE FROM Appointment_Stylist WHERE appointment_ID = ?', [appointmentId]);
//     if (stylists.length) {
//       const stylistValues = stylists.map(s => [appointmentId, s]);
//       await connection.query(`
//         INSERT INTO Appointment_Stylist (appointment_ID, stylist_ID)
//         VALUES ?
//       `, [stylistValues]);
//     }

//     await connection.query(`
//       UPDATE Payment 
//       SET 
//         payment_amount = ?, 
//         amount_paid = ?, 
//         payment_status = ?, 
//         payment_type = ?, 
//         payment_date = CURRENT_TIMESTAMP
//       WHERE appointment_ID = ?
//     `, [
//       payment_amount,
//       payment_status === 'Paid' ? payment_amount : 0,
//       payment_status,
//       payment_type,
//       appointmentId
//     ]);

//     await connection.commit();
//     return true;
//   } catch (error) {
//     await connection.rollback();
//     console.error('Error updating appointment:', error);
//     throw error;
//   } finally {
//     connection.release();
//   }
// };

// // Delete appointment
// const deleteAppointment = async (appointmentId) => {
//   const connection = await db.getConnection();
//   try {
//     await connection.beginTransaction();

//     await connection.query('DELETE FROM Appointment_Service WHERE appointment_ID = ?', [appointmentId]);
//     await connection.query('DELETE FROM Appointment_Stylist WHERE appointment_ID = ?', [appointmentId]);
//     await connection.query('DELETE FROM Payment WHERE appointment_ID = ?', [appointmentId]);
//     const [result] = await connection.query('DELETE FROM Appointment WHERE appointment_ID = ?', [appointmentId]);

//     await connection.commit();
//     return result.affectedRows > 0;
//   } catch (error) {
//     await connection.rollback();
//     console.error('Error deleting appointment:', error);
//     throw error;
//   } finally {
//     connection.release();
//   }
// };


// const getAppointmentsForToday = async (date, stylistId = null) => {
//   let query = `
//     SELECT 
//       a.appointment_ID,
//       a.customer_ID,
//       a.appointment_date,
//       a.appointment_time,
//       a.appointment_status,
//       CONCAT(c.firstname, ' ', c.lastname) AS customer_name,
//       GROUP_CONCAT(DISTINCT s.service_name) AS services,
//       GROUP_CONCAT(DISTINCT CONCAT(st.firstname, ' ', st.lastname)) AS stylists,
//       MAX(p.payment_amount) AS payment_amount,
//       MAX(p.amount_paid) AS amount_paid,
//       MAX(p.payment_status) AS payment_status
//     FROM Appointment a
//     JOIN Customer c ON a.customer_ID = c.customer_ID
//     LEFT JOIN Payment p ON a.appointment_ID = p.appointment_ID
//     JOIN Appointment_Service aps ON a.appointment_ID = aps.appointment_ID
//     JOIN Service s ON aps.service_ID = s.service_ID
//     JOIN Appointment_Stylist apsl ON a.appointment_ID = apsl.appointment_ID
//     JOIN Stylists st ON apsl.stylist_ID = st.stylist_ID
//     WHERE DATE(a.appointment_date) = ?
//   `;

//   const params = [date];

//   if (stylistId) {
//     query += ' AND apsl.stylist_ID = ?';
//     params.push(stylistId);
//   }

//   query += ' GROUP BY a.appointment_ID, a.customer_ID, a.appointment_date, a.appointment_time, a.appointment_status, customer_name ORDER BY a.appointment_time';

//   const [appointments] = await db.execute(query, params);
//   return appointments;
// };






// module.exports = {
//   getAllServices,
//   getAllStylists,
//   getAllCustomers,
//   getAppointmentsList,
//   getAppointmentDetails,
//   createAppointment,
//   updateAppointment,
//   deleteAppointment,
//   getAppointmentsForToday
// };








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
      'SELECT appointment_status FROM Appointment WHERE appointment_ID = ?',
      [appointmentId]
    );
    
    const previousStatus = currentAppointment[0]?.appointment_status;

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

module.exports = {
  getAllServices,
  getAllStylists,
  getAllCustomers,
  getAppointmentsList,
  getAppointmentDetails,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getAppointmentsForToday
};