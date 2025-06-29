const db = require('../../config/db');

class CustomerModel {
  static async getTopCustomers(period = 'weekly') {
    let dateCondition = '';
    if (period === 'weekly') {
      dateCondition = "AND a.appointment_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 WEEK) AND NOW()";
    } else if (period === 'monthly') {
      dateCondition = "AND a.appointment_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()";
    } else if (period === 'yearly') {
      dateCondition = "AND a.appointment_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 YEAR) AND NOW()";
    }

    const [rows] = await db.execute(`
      SELECT 
        c.customer_ID,
        CONCAT(c.firstname, ' ', c.lastname) AS customer_name,
        COUNT(a.appointment_ID) AS booking_count,
        CAST(COALESCE(SUM(p.payment_amount), 0) AS DECIMAL(10,2)) AS total_spent
      FROM Customer c
      JOIN Appointment a ON c.customer_ID = a.customer_ID
      LEFT JOIN Payment p ON a.appointment_ID = p.appointment_ID
      WHERE a.appointment_status = 'Completed'
      ${dateCondition}
      GROUP BY c.customer_ID, customer_name
      ORDER BY booking_count DESC, total_spent DESC
      LIMIT 3
    `);

    return rows;
  }
}

module.exports = CustomerModel;