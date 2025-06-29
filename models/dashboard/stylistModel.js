const db = require('../../config/db');

const getStylistPopularity = async (period = 'monthly') => {
  try {
    // Get total appointments for percentage calculation
    const [totalResult] = await db.execute(`
      SELECT COUNT(*) as total
      FROM Appointment a
      JOIN Appointment_Service_Stylist ass ON a.appointment_ID = ass.appointment_ID
      WHERE a.appointment_status IN ('Completed' , 'Scheduled')
      ${getDateCondition(period, 'a')}
    `);
    
    const total = totalResult[0]?.total || 0;

    // Get stylist popularity data
    const [stylists] = await db.execute(`
      SELECT 
        st.stylist_ID,
        CONCAT(st.firstname, ' ', st.lastname) AS stylist_name,
        COUNT(ass.appointment_ID) AS count,
        st.profile_url
      FROM Stylists st
      JOIN Appointment_Service_Stylist ass ON st.stylist_ID = ass.stylist_ID
      JOIN Appointment a ON ass.appointment_ID = a.appointment_ID
      WHERE a.appointment_status IN ('Completed' , 'Scheduled')
      ${getDateCondition(period, 'a')}
      GROUP BY st.stylist_ID, st.firstname, st.lastname
      ORDER BY count DESC
      LIMIT 10
    `);

    // Calculate percentages
    return stylists.map(stylist => ({
      ...stylist,
      percentage: total > 0 ? Math.round((stylist.count / total) * 100 * 10) / 10 : 0
    }));

  } catch (error) {
    console.error('Error in getStylistPopularity:', error);
    return [];
  }
};

// Reuse the same date condition helper
function getDateCondition(period, tableAlias = 'a') {
  const alias = tableAlias ? `${tableAlias}.` : '';
  switch (period) {
    case 'weekly':
      return `AND YEARWEEK(${alias}appointment_date, 1) = YEARWEEK(CURDATE(), 1)`;
    case 'monthly':
      return `AND MONTH(${alias}appointment_date) = MONTH(CURDATE()) 
              AND YEAR(${alias}appointment_date) = YEAR(CURDATE())`;
    case 'yearly':
      return `AND YEAR(${alias}appointment_date) = YEAR(CURDATE())`;
    default:
      return '';
  }
}

module.exports = {
  getStylistPopularity
};