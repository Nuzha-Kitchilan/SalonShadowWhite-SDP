const db = require('../config/db');

exports.getRevenueData = async (startDate, endDate) => {
  const query = `
    SELECT 
      DATE(a.appointment_date) as date,
      s.service_name,
      SUM(s.price) as revenue,
      COUNT(*) as appointments
    FROM Appointment_Service_Stylist ass
    JOIN Appointment a ON ass.appointment_id = a.appointment_id
    JOIN Service s ON ass.service_ID = s.service_id
    WHERE DATE(a.appointment_date) BETWEEN ? AND ?
    GROUP BY DATE(a.appointment_date), s.service_name
    ORDER BY date, revenue DESC
  `;

  const [rows] = await db.execute(query, [startDate, endDate]);
  return rows;
};