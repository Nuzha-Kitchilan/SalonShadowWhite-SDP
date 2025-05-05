const db = require('../../config/db');

class PerformanceModel {
  static async getTimeHeatmapData(period = 'week') {
    let groupBy = '';
    let selectFields = '';
    
    if (period === 'day') {
      groupBy = 'HOUR(a.appointment_time)';
      selectFields = `
        HOUR(a.appointment_time) AS time_slot,
        CONCAT(HOUR(a.appointment_time), ':00') AS time_label,
        COUNT(*) AS appointment_count,
        COALESCE(SUM(p.payment_amount), 0) AS total_revenue
      `;
    } else {
      groupBy = 'DAYOFWEEK(a.appointment_date)';
      selectFields = `
        DAYOFWEEK(a.appointment_date) AS time_slot,
        DAYNAME(a.appointment_date) AS time_label,
        COUNT(*) AS appointment_count,
        COALESCE(SUM(p.payment_amount), 0) AS total_revenue
      `;
    }

    const [rows] = await db.execute(`
      SELECT 
        ${selectFields}
      FROM Appointment a
      LEFT JOIN Payment p ON a.appointment_ID = p.appointment_ID
      WHERE a.appointment_status = 'Completed'
      GROUP BY ${groupBy}, time_label
      ORDER BY time_slot
    `);

    return rows;
  }
}

module.exports = PerformanceModel;