


const db = require('../config/db');

// Get working hours for a specific date
exports.getWorkingHours = async (date) => {
  try {
    const [rows] = await db.query(`
      SELECT * FROM WorkingHours 
      WHERE date = ?
    `, [date]);
    return rows[0]; // Either row or undefined
  } catch (err) {
    console.error('Error fetching working hours:', err);
    throw err;
  }
};

// Get appointments (optionally filtered by stylist)
// exports.getAppointmentsByDate = async (date, stylistId) => {
//   try {
//     let query = `
//       SELECT 
//         a.appointment_time, 
//         s.time_duration
//       FROM Appointment a
//       JOIN Appointment_Service_Stylist ass ON a.appointment_ID = ass.appointment_ID
//       JOIN Service s ON ass.service_ID = s.service_ID
//       WHERE a.appointment_date = ?
//     `;
    
//     const params = [date];
    
//     if (stylistId) {
//       query += ' AND ass.stylist_ID = ?';
//       params.push(stylistId);
//     }
    
//     const [rows] = await db.query(query, params);
//     return rows;
//   } catch (err) {
//     console.error('Error fetching appointments:', err);
//     throw err;
//   }
// };









exports.getAppointmentsByDate = async (date, stylistId) => {
  try {
    let query = `
      SELECT 
        a.appointment_time, 
        s.time_duration
      FROM Appointment a
      JOIN Appointment_Service_Stylist ass ON a.appointment_ID = ass.appointment_ID
      JOIN Service s ON ass.service_ID = s.service_ID
      WHERE a.appointment_date = ?
        AND ass.status = 'Active'
        AND a.appointment_status != 'Cancelled'
    `;
    
    const params = [date];
    
    if (stylistId) {
      query += ' AND ass.stylist_ID = ?';
      params.push(stylistId);
    }
    
    const [rows] = await db.query(query, params);
    return rows;
  } catch (err) {
    console.error('Error fetching appointments:', err);
    throw err;
  }
};











// const db = require('../config/db');
// const stylistModel = require('../models/stylistModel');

// // Generate time segments
// const generateTimeSegments = (start, end, stepMinutes) => {
//   const segments = [];
//   let current = new Date(`2025-01-01T${start}`);
//   const endTime = new Date(`2025-01-01T${end}`);

//   while (current < endTime) {
//     segments.push(current.toTimeString().substring(0, 5));
//     current.setMinutes(current.getMinutes() + stepMinutes);
//   }

//   return segments;
// };

// // Get blocked slots
// const getBlockedSlots = (startTime, blocksNeeded, allSegments) => {
//   const index = allSegments.indexOf(startTime.substring(0, 5));
//   if (index === -1) return [];
//   return allSegments.slice(index, index + blocksNeeded);
// };

// // Get working hours for a specific date
// exports.getWorkingHours = async (date) => {
//   try {
//     const [rows] = await db.query(`
//       SELECT * FROM WorkingHours 
//       WHERE date = ?
//     `, [date]);
//     return rows[0]; // Either row or undefined
//   } catch (err) {
//     console.error('Error fetching working hours:', err);
//     throw err;
//   }
// };

// // Get appointments (optionally filtered by stylist)
// exports.getAppointmentsByDate = async (date, stylistId) => {
//   try {
//     let query = `
//       SELECT 
//         a.appointment_time, 
//         s.time_duration
//       FROM Appointment a
//       JOIN Appointment_Service_Stylist ass ON a.appointment_ID = ass.appointment_ID
//       JOIN Service s ON ass.service_ID = s.service_ID
//       WHERE a.appointment_date = ?
//         AND ass.status = 'Active'
//         AND a.appointment_status != 'Cancelled'
//     `;
    
//     const params = [date];
    
//     if (stylistId) {
//       query += ' AND ass.stylist_ID = ?';
//       params.push(stylistId);
//     }
    
//     const [rows] = await db.query(query, params);
//     return rows;
//   } catch (err) {
//     console.error('Error fetching appointments:', err);
//     throw err;
//   }
// };


// // exports.getEarliestAvailableStylist = async (date, serviceDuration) => {
// //   const stylists = await stylistModel.getAllStylists();
// //   const bufferTime = 10;
// //   const totalDuration = serviceDuration + bufferTime;
// //   const interval = 15;

// //   let bestStylist = null;
// //   let earliestTime = null;

// //   for (const stylist of stylists) {
// //     // Get appointments for stylist with Active status
// //     const [appointments] = await db.execute(
// //       `
// //       SELECT 
// //         a.appointment_time, 
// //         s.time_duration
// //       FROM Appointment a
// //       JOIN Appointment_Service_Stylist ass ON a.appointment_ID = ass.appointment_ID
// //       JOIN Service s ON ass.service_ID = s.service_ID
// //       WHERE a.appointment_date = ?
// //         AND ass.stylist_ID = ?
// //         AND ass.status = 'Active'
// //         AND a.appointment_status != 'Cancelled'
// //       `,
// //       [date, stylist.stylist_ID]
// //     );

// //     // Assume working hours are 8 AM to 6 PM
// //     const segments = generateTimeSegments('08:00:00', '18:00:00', interval);
// //     const blockedSlots = new Set();

// //     appointments.forEach(app => {
// //       const blocksNeeded = Math.ceil((app.time_duration + bufferTime) / interval);
// //       const blocked = getBlockedSlots(app.appointment_time, blocksNeeded, segments);
// //       blocked.forEach(slot => blockedSlots.add(slot));
// //     });

// //     const requiredBlocks = Math.ceil(totalDuration / interval);
// //     for (let i = 0; i <= segments.length - requiredBlocks; i++) {
// //       const slice = segments.slice(i, i + requiredBlocks);
// //       const isBlocked = slice.some(time => blockedSlots.has(time));
// //       if (!isBlocked) {
// //         const availableTime = slice[0];
// //         if (!earliestTime || availableTime < earliestTime) {
// //           earliestTime = availableTime;
// //           bestStylist = stylist;
// //         }
// //         break; // No need to look at later slots for this stylist
// //       }
// //     }
// //   }

// //   return bestStylist && earliestTime
// //     ? {
// //         stylist: bestStylist,
// //         time: earliestTime
// //       }
// //     : null;
// // };










// exports.getEarliestAvailableStylist = async (date, serviceDuration) => {
//   const stylists = await stylistModel.getAllStylists();
//   const bufferTime = 10;
//   const totalDuration = serviceDuration + bufferTime;
//   const interval = 15;

//   let bestStylist = null;

//   for (const stylist of stylists) {
//     // Get appointments for stylist with Active status
//     const [appointments] = await db.execute(
//       `
//       SELECT 
//         a.appointment_time, 
//         s.time_duration
//       FROM Appointment a
//       JOIN Appointment_Service_Stylist ass ON a.appointment_ID = ass.appointment_ID
//       JOIN Service s ON ass.service_ID = s.service_ID
//       WHERE a.appointment_date = ?
//         AND ass.stylist_ID = ?
//         AND ass.status = 'Active'
//         AND a.appointment_status != 'Cancelled'
//       `,
//       [date, stylist.stylist_ID]
//     );

//     // Assume working hours are 8 AM to 6 PM
//     const segments = generateTimeSegments('08:00:00', '18:00:00', interval);
//     const blockedSlots = new Set();

//     appointments.forEach(app => {
//       const blocksNeeded = Math.ceil((app.time_duration + bufferTime) / interval);
//       const blocked = getBlockedSlots(app.appointment_time, blocksNeeded, segments);
//       blocked.forEach(slot => blockedSlots.add(slot));
//     });

//     const requiredBlocks = Math.ceil(totalDuration / interval);
//     for (let i = 0; i <= segments.length - requiredBlocks; i++) {
//       const slice = segments.slice(i, i + requiredBlocks);
//       const isBlocked = slice.some(time => blockedSlots.has(time));
//       if (!isBlocked) {
//         // We just need to know this stylist has availability, not the specific time
//         bestStylist = stylist;
//         break;
//       }
//     }

//     if (bestStylist) break; // Found first available stylist, no need to check others
//   }

//   return bestStylist ? { stylist: bestStylist } : null;
// };