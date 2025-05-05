// models/dashboard/appointmentModel.js
const db = require('../../config/db');

const getAppointmentsCount = async (period) => {
  let query = '';
  switch (period) {
    case 'daily':
      query = 'SELECT COUNT(*) AS count FROM appointment WHERE DATE(appointment_date) = CURDATE()';
      break;
    case 'weekly':
      query = 'SELECT COUNT(*) AS count FROM appointment WHERE YEARWEEK(appointment_date, 1) = YEARWEEK(CURDATE(), 1)';
      break;
    case 'monthly':
      query = 'SELECT COUNT(*) AS count FROM appointment WHERE MONTH(appointment_date) = MONTH(CURDATE()) AND YEAR(appointment_date) = YEAR(CURDATE())';
      break;
    case 'yearly':
      query = 'SELECT COUNT(*) AS count FROM appointment WHERE YEAR(appointment_date) = YEAR(CURDATE())';
      break;
    default:
      query = 'SELECT COUNT(*) AS count FROM appointment';
  }

  try {
    const [rows] = await db.execute(query);
    return rows[0]?.count ?? 0;
  } catch (error) {
    console.error('Query failed:', error);
    throw error;
  }
};

// In your model file (appointmentsModel.js)
// const getCalendarView = async (year, month, offset = 0) => {
//   const daysToShow = 10;
//   const startDay = 1 + (offset * daysToShow);
//   const endDay = startDay + daysToShow - 1;

//   const query = `
//     SELECT 
//       DAY(a.appointment_date) AS day,
//       COUNT(*) AS count,
//       GROUP_CONCAT(
//         CONCAT(
//           c.firstname, ' ', c.lastname, '|',
//           TIME_FORMAT(a.appointment_time, '%H:%i'), '|',
//           TIME_FORMAT(a.end_time, '%H:%i'), '|',
//           a.appointment_ID
//         ) SEPARATOR '||'
//       ) AS appointments
//     FROM Appointment a
//     LEFT JOIN Customer c ON a.customer_ID = c.customer_ID
//     WHERE 
//       YEAR(a.appointment_date) = ? AND
//       MONTH(a.appointment_date) = ? AND
//       DAY(a.appointment_date) BETWEEN ? AND ? AND
//       a.appointment_status = 'Scheduled'
//     GROUP BY day
//     ORDER BY day
//   `;

//   try {
//     const [days] = await db.execute(query, [year, month, startDay, endDay]);

//     // Get services and stylists for each appointment
//     for (const day of days) {
//       if (day.appointments) {
//         const appointmentDetails = await Promise.all(
//           day.appointments.split('||').map(async appt => {
//             const parts = appt.split('|');
//             // Handle cases where customer name might contain '|' character
//             const appointmentId = parts.pop();
//             const endTime = parts.pop();
//             const startTime = parts.pop();
//             const customerName = parts.join('|');

//             const [rows] = await db.execute(`
//               SELECT 
//                 GROUP_CONCAT(DISTINCT s.service_name SEPARATOR ', ') AS services,
//                 GROUP_CONCAT(DISTINCT CONCAT(st.firstname, ' ', st.lastname) SEPARATOR ', ') AS stylists
//               FROM Appointment_Service_Stylist ass
//               JOIN Service s ON ass.service_ID = s.service_ID
//               JOIN Stylists st ON ass.stylist_ID = st.stylist_ID
//               WHERE ass.appointment_ID = ?
//             `, [appointmentId]);

//             return {
//               name: customerName,
//               startTime,
//               endTime,
//               services: rows[0]?.services || 'None',
//               stylists: rows[0]?.stylists || 'None'
//             };
//           })
//         );
//         day.appointments = appointmentDetails;
//       } else {
//         day.appointments = []; // Ensure empty array if no appointments
//       }
//     }

//     return {
//       days,
//       startDay,
//       endDay,
//       totalDays: new Date(year, month, 0).getDate(),
//       hasNext: endDay < new Date(year, month, 0).getDate(),
//       hasPrev: offset > 0
//     };
//   } catch (error) {
//     console.error('Error in getCalendarView:', error);
//     throw error;
//   }
// };


// This should be placed in your appointmentModel.js file

// Make sure this path points to your database configuration

const getCalendarView = async (year, month, offset = 0, limit = 10) => {
  const daysPerPage = limit;
  const startDay = 1 + (offset * daysPerPage);
  
  // Calculate the last day of the month dynamically
  const lastDayOfMonth = new Date(year, month, 0).getDate();
  
  // Ensure endDay doesn't exceed the month's last day
  const endDay = Math.min(startDay + daysPerPage - 1, lastDayOfMonth);

  try {
    // First, get the basic calendar days with appointment IDs
    const [rows] = await db.execute(`
      SELECT 
        DAY(a.appointment_date) AS day,
        COUNT(DISTINCT a.appointment_ID) AS count,
        GROUP_CONCAT(DISTINCT a.appointment_ID) AS appointment_ids
      FROM Appointment a
      WHERE 
        YEAR(a.appointment_date) = ? AND
        MONTH(a.appointment_date) = ? AND
        DAY(a.appointment_date) BETWEEN ? AND ? AND
        a.appointment_status = 'Scheduled'
      GROUP BY DAY(a.appointment_date)
      ORDER BY day
    `, [year, month, startDay, endDay]);

    // Process each day and fetch detailed appointment info separately
    const days = await Promise.all(rows.map(async (row) => {
      const appointmentIds = row.appointment_ids.split(',');
      
      // Get detailed appointment information
      const appointments = await Promise.all(appointmentIds.map(async (id) => {
        const [appointmentDetails] = await db.execute(`
          SELECT 
            a.appointment_ID,
            CONCAT(c.firstname, ' ', c.lastname) AS name,
            TIME_FORMAT(a.appointment_time, '%H:%i') AS startTime,
            a.appointment_time AS raw_start_time,
            MAX(s.time_duration) AS max_duration,
            GROUP_CONCAT(DISTINCT s.service_name ORDER BY s.service_name SEPARATOR ', ') AS services,
            GROUP_CONCAT(DISTINCT CONCAT(st.firstname, ' ', st.lastname) ORDER BY st.firstname SEPARATOR ', ') AS stylists
          FROM Appointment a
          LEFT JOIN Customer c ON a.customer_ID = c.customer_ID
          LEFT JOIN Appointment_Service_Stylist ass ON a.appointment_ID = ass.appointment_ID
          LEFT JOIN Service s ON ass.service_ID = s.service_ID
          LEFT JOIN Stylists st ON ass.stylist_ID = st.stylist_ID
          WHERE a.appointment_ID = ?
          GROUP BY a.appointment_ID, c.firstname, c.lastname, a.appointment_time
        `, [id]);
        
        if (appointmentDetails && appointmentDetails.length > 0) {
          const details = appointmentDetails[0];
          
          // Calculate the total minutes needed (service duration + buffer)
          const totalMinutesNeeded = details.max_duration + 10;
          
          // Round up to the next 15-minute increment
          const timeSlots = Math.ceil(totalMinutesNeeded / 15);
          const totalMinutesRounded = timeSlots * 15;
          
          // Calculate the end time by adding the rounded minutes to the start time
          const startTime = new Date(`1970-01-01T${details.raw_start_time}`);
          const endTime = new Date(startTime.getTime() + totalMinutesRounded * 60000);
          
          return {
            id: details.appointment_ID,
            name: details.name,
            startTime: details.startTime,
            endTime: endTime.toTimeString().substring(0, 5), // Format as HH:MM
            services: details.services,
            stylists: details.stylists
          };
        }
        return null;
      }));
      
      return {
        day: row.day,
        count: row.count,
        appointments: appointments.filter(a => a !== null)
      };
    }));

    // Make sure we include days without appointments too
    const allDays = [];
    for (let day = startDay; day <= endDay; day++) {
      const existingDay = days.find(d => d.day === day);
      if (existingDay) {
        allDays.push(existingDay);
      } else {
        allDays.push({
          day,
          count: 0,
          appointments: []
        });
      }
    }

    // Calculate correct pagination info
    const totalDays = lastDayOfMonth;
    const hasNext = endDay < totalDays;
    const hasPrev = offset > 0;

    return {
      days: allDays,
      startDay,
      endDay,
      hasNext,
      hasPrev,
      totalDays
    };
  } catch (error) {
    console.error('Error in getCalendarView:', error);
    throw error;
  }
};


const getUpcomingAppointments = async (hours = 48) => {
  try {
    const [rows] = await db.execute(`
      SELECT 
        a.appointment_ID,
        CONCAT(c.firstname, ' ', c.lastname) AS client_name,
        DATE(a.appointment_date) AS date,
        TIME_FORMAT(a.appointment_time, '%H:%i') AS time,
        GROUP_CONCAT(DISTINCT s.service_name ORDER BY s.service_name SEPARATOR ', ') AS services,
        GROUP_CONCAT(DISTINCT CONCAT(st.firstname, ' ', st.lastname) ORDER BY st.firstname SEPARATOR ', ') AS stylists,
        a.appointment_status
      FROM Appointment a
      LEFT JOIN Customer c ON a.customer_ID = c.customer_ID
      LEFT JOIN Appointment_Service_Stylist ass ON a.appointment_ID = ass.appointment_ID
      LEFT JOIN Service s ON ass.service_ID = s.service_ID
      LEFT JOIN Stylists st ON ass.stylist_ID = st.stylist_ID
      WHERE 
        a.appointment_status = 'Scheduled' AND
        (
          (DATE(a.appointment_date) = CURDATE() AND TIME(a.appointment_time) >= CURTIME()) OR
          (DATE(a.appointment_date) = CURDATE() + INTERVAL 1 DAY) OR
          (DATE(a.appointment_date) = CURDATE() AND CURTIME() > TIME(a.appointment_time))
        )
      GROUP BY a.appointment_ID, c.firstname, c.lastname, a.appointment_date, a.appointment_time, a.appointment_status
      ORDER BY a.appointment_date, a.appointment_time
      LIMIT 20
    `);
    
    return rows;
  } catch (error) {
    console.error('Error fetching upcoming appointments:', error);
    throw error;
  }
};



const fetchCancellationRates = async (range = 'weekly') => {
  let interval, groupBy;
  
  // Set appropriate interval and groupBy based on range parameter
  switch(range) {
    case 'daily':
      interval = '7 DAY';
      groupBy = 'DATE(appointment_date)';
      break;
    case 'weekly':
      interval = '12 WEEK';
      groupBy = 'YEARWEEK(appointment_date, 1)';
      break;
    case 'monthly':
      interval = '12 MONTH';
      groupBy = 'CONCAT(YEAR(appointment_date), "-", MONTH(appointment_date))';
      break;
    case 'yearly':
      interval = '5 YEAR';
      groupBy = 'YEAR(appointment_date)';
      break;
    default:
      interval = '12 WEEK';
      groupBy = 'YEARWEEK(appointment_date, 1)';
  }

  const query = `
    SELECT 
      ${groupBy} AS period,
      COUNT(*) AS booked,
      SUM(CASE WHEN appointment_status = 'Cancelled' THEN 1 ELSE 0 END) AS cancelled,
      ROUND((SUM(CASE WHEN appointment_status = 'Cancelled' THEN 1 ELSE 0 END) / COUNT(*)) * 100, 2) AS cancellation_rate
    FROM Appointment
    WHERE appointment_date >= DATE_SUB(NOW(), INTERVAL ${interval})
    GROUP BY ${groupBy}
    ORDER BY period ASC
  `;

  try {
    const [results] = await db.query(query);
    return results;
  } catch (error) {
    console.error('Error in fetchCancellationRates query:', error);
    throw error;
  }
};



module.exports = {
  getAppointmentsCount,
  getCalendarView,
  getUpcomingAppointments,
  fetchCancellationRates
};
