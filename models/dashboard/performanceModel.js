


const db = require('../../config/db');

class PerformanceModel {
  static async getTimeHeatmapData(period = 'week') {
    let groupBy = '';
    let selectFields = '';
    let dateCondition = '';
    let params = [];

    const today = new Date();

    if (period === 'day') {
      // Get start and end of today
      const startOfDay = new Date(today.setHours(0,0,0,0));
      const endOfDay = new Date(today.setHours(23,59,59,999));

      groupBy = 'HOUR(a.appointment_time)';
      selectFields = `
        HOUR(a.appointment_time) AS time_slot,
        CONCAT(LPAD(HOUR(a.appointment_time), 2, '0'), ':00') AS time_label,
        COUNT(*) AS appointment_count,
        COALESCE(SUM(p.payment_amount), 0) AS total_revenue
      `;
      dateCondition = `AND a.appointment_date BETWEEN ? AND ?`;
      params = [startOfDay.toISOString().slice(0,19).replace('T',' '), endOfDay.toISOString().slice(0,19).replace('T',' ')];
      
    } else {
      // Get start (Monday) and end (Sunday) of this week
      const dayOfWeek = today.getDay(); // 0 = Sunday
      const diffToMonday = today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1);
      const startOfWeek = new Date(today.setDate(diffToMonday));
      startOfWeek.setHours(0,0,0,0);
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      endOfWeek.setHours(23,59,59,999);

      groupBy = 'DAYOFWEEK(a.appointment_date)';
      selectFields = `
        DAYOFWEEK(a.appointment_date) AS time_slot,
        DAYNAME(a.appointment_date) AS time_label,
        COUNT(*) AS appointment_count,
        COALESCE(SUM(p.payment_amount), 0) AS total_revenue
      `;
      dateCondition = `AND a.appointment_date BETWEEN ? AND ?`;
      params = [startOfWeek.toISOString().slice(0,19).replace('T',' '), endOfWeek.toISOString().slice(0,19).replace('T',' ')];
    }

    const [rows] = await db.execute(`
      SELECT 
        ${selectFields}
      FROM Appointment a
      LEFT JOIN Payment p ON a.appointment_ID = p.appointment_ID
      WHERE a.appointment_status = 'Scheduled'
      ${dateCondition}
      GROUP BY ${groupBy}, time_label
      ORDER BY time_slot
    `, params);

    return rows;
  }
}

module.exports = PerformanceModel;
