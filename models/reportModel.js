

const db = require('../config/db');

// -------- HELPER FUNCTIONS -------- //
const getStylistFullName = "CONCAT(st.firstname, ' ', st.lastname)";


exports.getTotalUniqueClients = async (startDate, endDate) => {
  const query = `
    SELECT COUNT(DISTINCT a.customer_ID) AS total_unique_clients
    FROM Appointment a
    WHERE DATE(a.appointment_date) BETWEEN ? AND ?
    AND a.appointment_status = 'completed'
  `;

  const [rows] = await db.execute(query, [startDate, endDate]);
  return rows[0]?.total_unique_clients || 0;
};



exports.getDetailedRevenueData = async (startDate, endDate, groupBy) => {
  let groupFields, groupBySql, orderBySql;

  const getStylistFullName = `CONCAT(st.firstname, ' ', st.lastname)`;

  switch (groupBy) {
    case 'week':
      groupFields = `
        YEARWEEK(a.appointment_date, 1) AS period,
        CONCAT('Week ', WEEK(a.appointment_date, 1), ', ', YEAR(a.appointment_date)) AS period_label
      `;
      groupBySql = `
        YEARWEEK(a.appointment_date, 1),
        CONCAT('Week ', WEEK(a.appointment_date, 1), ', ', YEAR(a.appointment_date))
      `;
      orderBySql = 'period';
      break;
    case 'month':
      groupFields = `
        DATE_FORMAT(a.appointment_date, '%Y-%m') AS period,
        DATE_FORMAT(a.appointment_date, '%M %Y') AS period_label
      `;
      groupBySql = `
        DATE_FORMAT(a.appointment_date, '%Y-%m'),
        DATE_FORMAT(a.appointment_date, '%M %Y')
      `;
      orderBySql = 'period';
      break;
    case 'quarter':
      groupFields = `
        CONCAT(YEAR(a.appointment_date), '-Q', QUARTER(a.appointment_date)) AS period,
        CONCAT('Q', QUARTER(a.appointment_date), ' ', YEAR(a.appointment_date)) AS period_label
      `;
      groupBySql = `
        CONCAT(YEAR(a.appointment_date), '-Q', QUARTER(a.appointment_date)),
        CONCAT('Q', QUARTER(a.appointment_date), ' ', YEAR(a.appointment_date))
      `;
      orderBySql = 'period';
      break;
    case 'year':
      groupFields = `
        YEAR(a.appointment_date) AS period,
        YEAR(a.appointment_date) AS period_label
      `;
      groupBySql = `
        YEAR(a.appointment_date),
        YEAR(a.appointment_date)
      `;
      orderBySql = 'period';
      break;
    case 'service':
      groupFields = `
        s.service_ID AS period,
        s.service_name AS period_label
      `;
      groupBySql = `
        s.service_ID,
        s.service_name
      `;
      orderBySql = 'period';
      break;
    case 'stylist':
      groupFields = `
        st.stylist_ID AS period,
        ${getStylistFullName} AS period_label
      `;
      groupBySql = `
        st.stylist_ID,
        ${getStylistFullName}
      `;
      orderBySql = 'period';
      break;
    default: // day
      groupFields = `
        DATE(a.appointment_date) AS period,
        DATE_FORMAT(a.appointment_date, '%M %e, %Y') AS period_label
      `;
      groupBySql = `
        DATE(a.appointment_date),
        DATE_FORMAT(a.appointment_date, '%M %e, %Y')
      `;
      orderBySql = 'period';
  }

  const query = `
    SELECT
      ${groupFields},
      s.service_name,
      ${getStylistFullName} AS stylist_name,
      SUM(s.price) AS revenue,
      COUNT(*) AS appointments,
      COUNT(DISTINCT a.customer_ID) AS unique_clients,
      IFNULL(SUM(s.price) / NULLIF(COUNT(*), 0), 0) AS avg_revenue_per_appointment
    FROM Appointment_Service_Stylist ass
    JOIN Appointment a ON ass.appointment_ID = a.appointment_ID
    JOIN Service s ON ass.service_ID = s.service_ID
    LEFT JOIN Stylists st ON ass.stylist_ID = st.stylist_ID
    WHERE DATE(a.appointment_date) BETWEEN ? AND ?
    GROUP BY ${groupBySql}, s.service_name, st.stylist_ID
    ORDER BY ${orderBySql}, revenue DESC
  `;

  const [rows] = await db.execute(query, [startDate, endDate]);
  return rows;
};



exports.getSummaryRevenueData = async (startDate, endDate, groupBy) => {
  let groupFields, groupBySql, orderBy;

  switch (groupBy) {
    case 'week':
      groupFields = `YEARWEEK(a.appointment_date, 1) AS period_key`;
      groupBySql = `YEARWEEK(a.appointment_date, 1)`;
      orderBy = `summary.period_key`;
      break;
    case 'month':
      groupFields = `DATE_FORMAT(a.appointment_date, '%Y-%m') AS period_key`;
      groupBySql = `DATE_FORMAT(a.appointment_date, '%Y-%m')`;
      orderBy = `summary.period_key`;
      break;
    case 'quarter':
      groupFields = `CONCAT(YEAR(a.appointment_date), '-Q', QUARTER(a.appointment_date)) AS period_key`;
      groupBySql = `CONCAT(YEAR(a.appointment_date), '-Q', QUARTER(a.appointment_date))`;
      orderBy = `summary.period_key`;
      break;
    case 'year':
      groupFields = `YEAR(a.appointment_date) AS period_key`;
      groupBySql = `YEAR(a.appointment_date)`;
      orderBy = `summary.period_key`;
      break;
    default: // day
      groupFields = `DATE(a.appointment_date) AS period_key`;
      groupBySql = `DATE(a.appointment_date)`;
      orderBy = `summary.period_key`;
  }

  const query = `
    SELECT
      summary.period_key,
      ${
        groupBy === 'day' ? `DATE_FORMAT(summary.period_key, '%M %e, %Y')` :
        groupBy === 'month' ? `DATE_FORMAT(STR_TO_DATE(CONCAT(summary.period_key, '-01'), '%Y-%m-%d'), '%M %Y')` :
        groupBy === 'week' ? `CONCAT('Week ', RIGHT(summary.period_key, 2), ', ', LEFT(summary.period_key, 4))` :
        groupBy === 'quarter' ? `CONCAT('Q', SUBSTRING_INDEX(summary.period_key, '-Q', -1), ' ', SUBSTRING_INDEX(summary.period_key, '-Q', 1))` :
        `summary.period_key`
      } AS period_label,
      summary.total_revenue,
      summary.total_appointments,
      summary.avg_revenue_per_appointment,
      summary.unique_clients,
      summary.active_stylists,
      summary.stylist_name,
      summary.service_name
    FROM (
      SELECT
        ${groupFields},
        COALESCE(SUM(s.price), 0) AS total_revenue,
        COALESCE(COUNT(*), 0) AS total_appointments,
        COALESCE(IFNULL(SUM(s.price) / NULLIF(COUNT(*), 0), 0), 0) AS avg_revenue_per_appointment,
        COALESCE(COUNT(DISTINCT a.customer_ID), 0) AS unique_clients,
        COALESCE(COUNT(DISTINCT ass.stylist_ID), 0) AS active_stylists,
        GROUP_CONCAT(DISTINCT CONCAT(stylist.firstname, ' ', stylist.lastname) ORDER BY stylist.firstname SEPARATOR ', ') AS stylist_name,
        GROUP_CONCAT(DISTINCT s.service_name ORDER BY s.service_name SEPARATOR ', ') AS service_name
      FROM Appointment a
      JOIN Appointment_Service_Stylist ass ON a.appointment_ID = ass.appointment_ID
      JOIN Service s ON ass.service_ID = s.service_ID
      JOIN Stylists stylist ON ass.stylist_ID = stylist.stylist_ID
      WHERE DATE(a.appointment_date) BETWEEN ? AND ?
        AND a.appointment_status = 'completed'
      GROUP BY ${groupBySql}
    ) summary
    ORDER BY ${orderBy}
    LIMIT 0, 1000;
  `;

  const [rows] = await db.execute(query, [startDate, endDate]);
  console.log("Summary Revenue Data with names:", rows);
  return rows;
};





exports.getRevenueTrends = async (startDate, endDate, groupBy) => {
  const data = await exports.getDetailedRevenueData(startDate, endDate, groupBy);
  
  // Calculate moving averages and growth rates
  const processedData = data.map((item, index, array) => {
    if (index === 0) {
      return { 
        ...item, 
        growth_rate: 0,
        moving_avg_7: item.revenue,
        moving_avg_30: item.revenue 
      };
    }

    // Calculate 7-period moving average
    const prev7Items = array.slice(Math.max(0, index - 6), index + 1);
    const movingAvg7 = prev7Items.reduce((sum, i) => sum + i.revenue, 0) / prev7Items.length;

    // Calculate 30-period moving average if enough data exists
    const prev30Items = array.slice(Math.max(0, index - 29), index + 1);
    const movingAvg30 = prev30Items.reduce((sum, i) => sum + i.revenue, 0) / Math.min(30, index + 1);

    // Calculate growth rate
    const prevItem = array[index - 1];
    const growthRate = prevItem.revenue !== 0 
      ? ((item.revenue - prevItem.revenue) / prevItem.revenue) * 100 
      : 0;

    return { 
      ...item, 
      growth_rate: growthRate,
      moving_avg_7: movingAvg7,
      moving_avg_30: movingAvg30
    };
  });

  return processedData;
};

// -------- COMPARISON REPORT -------- //
exports.getPeriodComparison = async (startDate, endDate, groupBy = 'month') => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const duration = end.getTime() - start.getTime();

  // Get previous period (same length)
  const prevStart = new Date(start.getTime() - duration);
  const prevEnd = new Date(start.getTime());

  // Get year-over-year comparison
  const prevYearStart = new Date(start.getFullYear() - 1, start.getMonth(), start.getDate());
  const prevYearEnd = new Date(end.getFullYear() - 1, end.getMonth(), end.getDate());

  const [currentData, previousData, yoyData] = await Promise.all([
    exports.getSummaryRevenueData(startDate, endDate, groupBy),
    exports.getSummaryRevenueData(prevStart.toISOString().split('T')[0], prevEnd.toISOString().split('T')[0], groupBy),
    exports.getSummaryRevenueData(prevYearStart.toISOString().split('T')[0], prevYearEnd.toISOString().split('T')[0], groupBy)
  ]);

  return {
    current_period: currentData,
    previous_period: previousData,
    year_over_year: yoyData,
    metrics: {
      current_total: currentData.reduce((sum, item) => sum + item.total_revenue, 0),
      previous_total: previousData.reduce((sum, item) => sum + item.total_revenue, 0),
      yoy_total: yoyData.reduce((sum, item) => sum + item.total_revenue, 0)
    }
  };
};



exports.getStylistPerformance = async (startDate, endDate) => {
  const query = `
    SELECT 
      st.stylist_ID,
      ${getStylistFullName} AS stylist_name,
      COUNT(*) AS total_appointments,
      SUM(s.price) AS total_revenue,
      SUM(s.price) / COUNT(*) AS avg_revenue_per_appointment,
      COUNT(DISTINCT a.customer_ID) AS unique_clients,
      COUNT(DISTINCT s.service_ID) AS services_offered,
      (SELECT COUNT(*) 
       FROM Appointment_Service_Stylist ass2
       JOIN Appointment a2 ON ass2.appointment_ID = a2.appointment_ID
       WHERE ass2.stylist_ID = st.stylist_ID
       AND DATE(a2.appointment_date) BETWEEN ? AND ?
       AND a2.appointment_status = 'completed') AS completed_appointments,
      (SELECT COUNT(*) 
       FROM Appointment_Service_Stylist ass3
       JOIN Appointment a3 ON ass3.appointment_ID = a3.appointment_ID
       WHERE ass3.stylist_ID = st.stylist_ID
       AND DATE(a3.appointment_date) BETWEEN ? AND ?
       AND a3.appointment_status = 'cancelled') AS cancelled_appointments
    FROM Appointment_Service_Stylist ass
    JOIN Appointment a ON ass.appointment_ID = a.appointment_ID
    JOIN Service s ON ass.service_ID = s.service_ID
    JOIN Stylists st ON ass.stylist_ID = st.stylist_ID
    WHERE DATE(a.appointment_date) BETWEEN ? AND ?
    GROUP BY st.stylist_ID
    ORDER BY total_revenue DESC
  `;

  const [rows] = await db.execute(query, [startDate, endDate, startDate, endDate, startDate, endDate]);
  return rows;
};