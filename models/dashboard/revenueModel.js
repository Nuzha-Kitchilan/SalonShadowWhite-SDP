const db = require('../../config/db');

module.exports = {
  getRevenue: async (range) => {
    let query = '';
    if (range === 'weekly') {
      query = `
        SELECT SUM(amount_paid) as total
        FROM Payment
        WHERE payment_status = 'Paid'
        AND payment_date >= DATE_SUB(NOW(), INTERVAL 7 DAY);
      `;
    } else if (range === 'monthly') {
      query = `
        SELECT SUM(amount_paid) as total
        FROM Payment
        WHERE payment_status = 'Paid'
        AND payment_date >= DATE_SUB(NOW(), INTERVAL 1 MONTH);
      `;
    } else if (range === 'yearly') {
      query = `
        SELECT SUM(amount_paid) as total
        FROM Payment
        WHERE payment_status = 'Paid'
        AND payment_date >= DATE_SUB(NOW(), INTERVAL 1 YEAR);
      `;
    }

    const [rows] = await db.query(query);
    return { total: rows[0].total || 0 }; // Ensure we always return a number
  },



  getRevenueByService: async (range) => {
    let interval = '7 DAY';
    if (range === 'monthly') interval = '1 MONTH';
    else if (range === 'yearly') interval = '1 YEAR';
  
    const query = `
      SELECT 
        s.service_name AS category,
        SUM(p.amount_paid) AS revenue,
        COUNT(DISTINCT ass.appointment_ID, ass.service_ID) AS service_count
      FROM Payment p
      JOIN Appointment_Service_Stylist ass ON p.appointment_id = ass.appointment_ID
      JOIN Service s ON ass.service_ID = s.service_id
      WHERE p.payment_status = 'Paid'
      AND p.payment_date >= DATE_SUB(NOW(), INTERVAL ${interval})
      GROUP BY s.service_name
      ORDER BY revenue DESC;
    `;
  
    const [rows] = await db.query(query);
    return rows;
  },
  


  getStylistRevenue: async (range) => {
    let interval = '7 DAY';
    if (range === 'monthly') interval = '1 MONTH';
    else if (range === 'yearly') interval = '1 YEAR';
  
    const query = `
      SELECT 
        CONCAT(s.firstname, ' ', s.lastname) AS stylist_name,
        SUM(p.amount_paid) AS revenue
      FROM Payment p
      JOIN Appointment a ON p.appointment_ID = a.appointment_id
      JOIN Appointment_Service_Stylist ass ON a.appointment_id = ass.appointment_id
      JOIN Stylists s ON ass.stylist_id = s.stylist_ID
      WHERE p.payment_status = 'Paid'
      AND p.payment_date >= DATE_SUB(NOW(), INTERVAL ${interval})
      GROUP BY s.stylist_ID;
    `;
  
    const [rows] = await db.query(query);
    return rows.map(row => ({
      stylist_name: row.stylist_name,
      revenue: Number(row.revenue) || 0
    }));
  },
  
  
  

  getAverageTicket: async (range) => {
    let interval = '7 DAY';
    if (range === 'monthly') interval = '1 MONTH';
    else if (range === 'yearly') interval = '1 YEAR';
  
    const query = `
      SELECT 
        AVG(p.amount_paid) AS average_ticket,
        COUNT(*) AS transaction_count,
        SUM(p.amount_paid) AS total_revenue
      FROM Payment p
      WHERE p.payment_status = 'Paid'
      AND p.payment_date >= DATE_SUB(NOW(), INTERVAL ${interval});
    `;
  
    const [rows] = await db.query(query);
    return {
      average: Number(rows[0].average_ticket) || 0,
      count: Number(rows[0].transaction_count) || 0,
      total: Number(rows[0].total_revenue) || 0
    };
  },


  getDetailedRevenue: async (range) => {
    let interval;
    switch(range) {
      case 'weekly': interval = '7 DAY'; break;
      case 'monthly': interval = '1 MONTH'; break;
      case 'yearly': interval = '1 YEAR'; break;
      default: interval = '7 DAY';
    }
  
    const query = `
      SELECT 
        SUM(amount_paid) AS total_revenue,
        SUM(CASE WHEN payment_status = 'Paid' THEN amount_paid ELSE 0 END) AS paid_amount,
        SUM(CASE WHEN payment_status = 'Pending' THEN amount_paid ELSE 0 END) AS pending_amount,
        SUM(CASE WHEN payment_type = 'Online' THEN amount_paid ELSE 0 END) AS online_payments,
        SUM(CASE WHEN payment_type = 'Pay at Salon' THEN amount_paid ELSE 0 END) AS onsite_payments,
        COUNT(*) AS total_transactions,
        AVG(amount_paid) AS average_transaction,
        (SUM(CASE WHEN payment_type = 'Online' THEN amount_paid ELSE 0 END) / SUM(amount_paid)) * 100 AS online_percentage
      FROM Payment
      WHERE payment_date >= DATE_SUB(NOW(), INTERVAL ${interval})
    `;
  
    const [results] = await db.query(query);
    const row = results[0] || {};
  
    return {
      total_revenue: Number(row.total_revenue) || 0,
      paid_amount: Number(row.paid_amount) || 0,
      pending_amount: Number(row.pending_amount) || 0,
      online_payments: Number(row.online_payments) || 0,
      onsite_payments: Number(row.onsite_payments) || 0,
      total_transactions: Number(row.total_transactions) || 0,
      average_transaction: Number(row.average_transaction) || 0,
      online_percentage: Number(row.online_percentage) || 0
    };
  },
  
  
  


  getRevenueTrendData: async (type, year) => {
    let query;
    const currentYear = new Date().getFullYear();
    year = year || currentYear;
  
    if (type === 'week') {
      query = `
        SELECT 
          CONCAT('Week ', week_number) AS period,
          totalRevenue,
          start_date,
          end_date
        FROM (
          SELECT 
            WEEK(payment_date, 1) AS week_number,
            SUM(payment_amount) AS totalRevenue,
            MIN(DATE(payment_date)) AS start_date,
            MAX(DATE(payment_date)) AS end_date
          FROM Payment
          WHERE payment_status = 'Paid' AND YEAR(payment_date) = ?
          GROUP BY week_number
        ) AS weekly_data
        ORDER BY week_number;
      `;
    } else if (type === 'month') {
      query = `
        SELECT 
          MONTHNAME(STR_TO_DATE(month_number, '%m')) AS period,
          totalRevenue
        FROM (
          SELECT 
            MONTH(payment_date) AS month_number,
            SUM(payment_amount) AS totalRevenue
          FROM Payment
          WHERE payment_status = 'Paid' AND YEAR(payment_date) = ?
          GROUP BY month_number
        ) AS monthly_data
        ORDER BY month_number;
      `;
    } else if (type === 'year') {
      query = `
        SELECT 
          year_number AS period,
          totalRevenue
        FROM (
          SELECT 
            YEAR(payment_date) AS year_number,
            SUM(payment_amount) AS totalRevenue
          FROM Payment
          WHERE payment_status = 'Paid'
          GROUP BY year_number
        ) AS yearly_data
        ORDER BY year_number;
      `;
    }
  
    const [rows] = await db.execute(query, type === 'year' ? [] : [year]);
    return rows;
  }

  

};




