const db = require('../config/db');

// Get working hours for a specific date
exports.getWorkingHours = async (date) => {
  try {
    const [rows] = await db.query(`
      SELECT * FROM WorkingHours 
      WHERE date = ?
    `, [date]);
    return rows[0]; 
  } catch (err) {
    console.error('Error fetching working hours:', err);
    throw err;
  }
};



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







