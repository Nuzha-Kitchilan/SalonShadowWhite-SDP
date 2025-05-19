// models/dashboard/serviceModel.js
const db = require('../../config/db');

const getServicePopularity = async (period = 'monthly') => {
  try {
    let dateCondition = '';
    let subqueryCondition = '';
    
    switch (period) {
      case 'weekly':
        dateCondition = 'WHERE YEARWEEK(a.appointment_date, 1) = YEARWEEK(CURDATE(), 1)';
        subqueryCondition = 'YEARWEEK(a.appointment_date, 1) = YEARWEEK(CURDATE(), 1)';
        break;
      case 'monthly':
        dateCondition = 'WHERE MONTH(a.appointment_date) = MONTH(CURDATE()) AND YEAR(a.appointment_date) = YEAR(CURDATE())';
        subqueryCondition = 'MONTH(a.appointment_date) = MONTH(CURDATE()) AND YEAR(a.appointment_date) = YEAR(CURDATE())';
        break;
      case 'yearly':
        dateCondition = 'WHERE YEAR(a.appointment_date) = YEAR(CURDATE())';
        subqueryCondition = 'YEAR(a.appointment_date) = YEAR(CURDATE())';
        break;
      default:
        dateCondition = '';
        subqueryCondition = '1=1';
    }

    const [rows] = await db.execute(`
      SELECT 
        s.service_name,
        COUNT(ass.service_ID) AS count,
        ROUND(COUNT(ass.service_ID) * 100.0 / (
          SELECT COUNT(*) 
          FROM Appointment_Service_Stylist ass
          JOIN Appointment a ON ass.appointment_ID = a.appointment_ID
          WHERE ${subqueryCondition}
          AND a.appointment_status IN ('Completed', 'Scheduled')
        ), 1) AS percentage
      FROM Service s
      JOIN Appointment_Service_Stylist ass ON s.service_ID = ass.service_ID
      JOIN Appointment a ON ass.appointment_ID = a.appointment_ID
      ${dateCondition}
      AND a.appointment_status IN ('Completed', 'Scheduled')
      GROUP BY s.service_ID, s.service_name
      ORDER BY count DESC
      LIMIT 5
    `);

    return rows;
  } catch (error) {
    console.error('Error fetching service popularity:', error);
    throw error;
  }
};

module.exports = {
  getServicePopularity
};