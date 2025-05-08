

const db = require('../config/db');

// -------- HELPER FUNCTIONS -------- //
const getStylistFullName = "CONCAT(st.firstname, ' ', st.lastname)";

// -------- BASIC REVENUE DATA -------- //
exports.getRevenueData = async (startDate, endDate) => {
  const query = `
    SELECT 
      DATE(a.appointment_date) AS date,
      s.service_name,
      SUM(s.price) AS revenue,
      COUNT(*) AS appointments
    FROM Appointment_Service_Stylist ass
    JOIN Appointment a ON ass.appointment_ID = a.appointment_ID
    JOIN Service s ON ass.service_ID = s.service_ID
    WHERE DATE(a.appointment_date) BETWEEN ? AND ?
    GROUP BY DATE(a.appointment_date), s.service_name
    ORDER BY date, revenue DESC
  `;

  const [rows] = await db.execute(query, [startDate, endDate]);
  return rows;
};

// -------- DETAILED REVENUE DATA -------- //
exports.getDetailedRevenueData = async (startDate, endDate, groupBy) => {
  let groupFields, groupBySql;

  switch (groupBy) {
    case 'week':
      groupFields = `
        YEARWEEK(a.appointment_date, 1) AS period,
        CONCAT('Week ', WEEK(a.appointment_date, 1), ', ', YEAR(a.appointment_date)) AS period_label
      `;
      groupBySql = 'YEARWEEK(a.appointment_date, 1), WEEK(a.appointment_date, 1), YEAR(a.appointment_date)';
      break;
    case 'month':
      groupFields = `
        DATE_FORMAT(a.appointment_date, '%Y-%m') AS period,
        DATE_FORMAT(a.appointment_date, '%M %Y') AS period_label
      `;
      groupBySql = 'DATE_FORMAT(a.appointment_date, "%Y-%m"), DATE_FORMAT(a.appointment_date, "%M %Y")';
      break;
    case 'quarter':
      groupFields = `
        CONCAT(YEAR(a.appointment_date), '-Q', QUARTER(a.appointment_date)) AS period,
        CONCAT('Q', QUARTER(a.appointment_date), ' ', YEAR(a.appointment_date)) AS period_label
      `;
      groupBySql = 'CONCAT(YEAR(a.appointment_date), "-Q", QUARTER(a.appointment_date)), QUARTER(a.appointment_date), YEAR(a.appointment_date)';
      break;
    case 'year':
      groupFields = `
        YEAR(a.appointment_date) AS period,
        YEAR(a.appointment_date) AS period_label
      `;
      groupBySql = 'YEAR(a.appointment_date)';
      break;
    case 'service':
      groupFields = `
        s.service_ID AS period,
        s.service_name AS period_label
      `;
      groupBySql = 's.service_ID, s.service_name';
      break;
    case 'stylist':
      groupFields = `
        st.stylist_ID AS period,
        ${getStylistFullName} AS period_label
      `;
      groupBySql = 'st.stylist_ID, ' + getStylistFullName;
      break;
    default: // day
      groupFields = `
        DATE(a.appointment_date) AS period,
        DATE_FORMAT(a.appointment_date, '%M %e, %Y') AS period_label
      `;
      groupBySql = 'DATE(a.appointment_date), DATE_FORMAT(a.appointment_date, "%M %e, %Y")';
  }

  const query = `
  SELECT
    ${groupFields},
    s.service_name,
    ${getStylistFullName} AS stylist_name,
    SUM(s.price) AS revenue,
    COUNT(*) AS appointments,
    IFNULL(SUM(s.price) / NULLIF(COUNT(*), 0), 0) AS avg_revenue_per_appointment
  FROM Appointment_Service_Stylist ass
  JOIN Appointment a ON ass.appointment_ID = a.appointment_ID
  JOIN Service s ON ass.service_ID = s.service_ID
  LEFT JOIN Stylists st ON ass.stylist_ID = st.stylist_ID
  WHERE DATE(a.appointment_date) BETWEEN ? AND ?
  GROUP BY ${groupBySql}, s.service_name, st.stylist_ID
  ORDER BY period, revenue DESC
`;

  const [rows] = await db.execute(query, [startDate, endDate]);
  return rows;
};

// // -------- SUMMARY REVENUE DATA -------- //
// exports.getSummaryRevenueData = async (startDate, endDate, groupBy) => {
//   // This function needs to be properly defined and exported
//   return await exports.getDetailedRevenueData(startDate, endDate, groupBy);
// };

// // -------- REVENUE TRENDS -------- //
// exports.getRevenueTrends = async (startDate, endDate, groupBy) => {
//   const data = await exports.getDetailedRevenueData(startDate, endDate, groupBy);

//   return data.map((item, index, array) => {
//     if (index === 0) return { ...item, growth_rate: 0 };

//     const prevItem = array[index - 1];
//     const growthRate = prevItem.revenue !== 0
//       ? ((item.revenue - prevItem.revenue) / prevItem.revenue) * 100
//       : 0;

//     return { ...item, growth_rate: growthRate };
//   });
// };

// // -------- PERIOD COMPARISON -------- //
// exports.getPeriodComparison = async (startDate, endDate, groupBy = 'month') => {
//   const start = new Date(startDate);
//   const end = new Date(endDate);
//   const duration = end.getTime() - start.getTime();

//   const prevStart = new Date(start.getTime() - duration);
//   const prevEnd = new Date(start.getTime());

//   const currentData = await exports.getDetailedRevenueData(startDate, endDate, groupBy);
//   const previousData = await exports.getDetailedRevenueData(
//     prevStart.toISOString().split('T')[0],
//     prevEnd.toISOString().split('T')[0],
//     groupBy
//   );

//   return {
//     current_period: currentData,
//     previous_period: previousData,
//     comparison: currentData.map(curr => {
//       const prev = previousData.find(p => p.period === curr.period) || { revenue: 0 };
//       const growth = prev.revenue !== 0
//         ? ((curr.revenue - prev.revenue) / prev.revenue) * 100
//         : 0;
//       return {
//         period: curr.period_label,
//         current_revenue: curr.revenue,
//         previous_revenue: prev.revenue,
//         growth
//       };
//     })
//   };
// };













// -------- ENHANCED REPORT MODEL -------- //

// -------- SUMMARY REPORT -------- //
exports.getSummaryRevenueData = async (startDate, endDate, groupBy) => {
  let groupFields, groupBySql, orderBy;

  switch (groupBy) {
    case 'week':
      groupFields = `YEARWEEK(a.appointment_date, 1) AS period_key,
        CONCAT('Week ', WEEK(a.appointment_date, 1), ', ', YEAR(a.appointment_date)) AS period_label`;
      groupBySql = `YEARWEEK(a.appointment_date, 1), CONCAT('Week ', WEEK(a.appointment_date, 1), ', ', YEAR(a.appointment_date))`;
      orderBy = `period_key`;
      break;
    case 'month':
      groupFields = `DATE_FORMAT(a.appointment_date, '%Y-%m') AS period_key,
        DATE_FORMAT(a.appointment_date, '%M %Y') AS period_label`;
      groupBySql = `DATE_FORMAT(a.appointment_date, '%Y-%m'), DATE_FORMAT(a.appointment_date, '%M %Y')`;
      orderBy = `period_key`;
      break;
    case 'quarter':
      groupFields = `CONCAT(YEAR(a.appointment_date), '-Q', QUARTER(a.appointment_date)) AS period_key,
        CONCAT('Q', QUARTER(a.appointment_date), ' ', YEAR(a.appointment_date)) AS period_label`;
      groupBySql = `YEAR(a.appointment_date), QUARTER(a.appointment_date), CONCAT('Q', QUARTER(a.appointment_date), ' ', YEAR(a.appointment_date))`;
      orderBy = `YEAR(a.appointment_date), QUARTER(a.appointment_date)`;
      break;
    case 'year':
      groupFields = `YEAR(a.appointment_date) AS period_key,
        YEAR(a.appointment_date) AS period_label`;
      groupBySql = `YEAR(a.appointment_date)`;
      orderBy = `period_key`;
      break;
    default: // day
      groupFields = `DATE(a.appointment_date) AS period_key,
        DATE_FORMAT(a.appointment_date, '%M %e, %Y') AS period_label`;
      groupBySql = `DATE(a.appointment_date), DATE_FORMAT(a.appointment_date, '%M %e, %Y')`;
      orderBy = `period_key`;
  }

  const query = `
    SELECT
      ${groupFields},
      SUM(s.price) AS total_revenue,
      COUNT(*) AS total_appointments,
      IFNULL(SUM(s.price) / NULLIF(COUNT(*), 0), 0) AS avg_revenue_per_appointment,
      COUNT(DISTINCT a.customer_ID) AS unique_clients,
      COUNT(DISTINCT ass.stylist_ID) AS active_stylists
    FROM Appointment_Service_Stylist ass
    JOIN Appointment a ON ass.appointment_ID = a.appointment_ID
    JOIN Service s ON ass.service_ID = s.service_ID
    WHERE DATE(a.appointment_date) BETWEEN ? AND ?
    GROUP BY ${groupBySql}
    ORDER BY ${orderBy};
  `;

  const [rows] = await db.execute(query, [startDate, endDate]);
  return rows;
};



// -------- TREND ANALYSIS REPORT -------- //
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

// -------- STYLIST PERFORMANCE REPORT -------- //
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