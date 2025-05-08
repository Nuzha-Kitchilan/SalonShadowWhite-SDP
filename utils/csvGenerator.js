// const { Parser } = require('json2csv');

// exports.generateCSV = (data) => {
//   const fields = [
//     { label: 'Date', value: 'date' },
//     { label: 'Service', value: 'service_name' },
//     { label: 'Appointments', value: 'appointments' },
//     { label: 'Revenue ($)', value: row => row.revenue.toFixed(2) }
//   ];
  
//   const parser = new Parser({ fields });
//   return parser.parse(data);
// };









const { Parser } = require('json2csv');

exports.generateCSV = (data, additionalData = null) => {
  try {
    let fields;
    let transformedData = data;
    
    if (additionalData) {
      // For advanced reports
      fields = [
        'period_label',
        'service_name',
        'stylist_name',
        'revenue',
        'appointments',
        'avg_revenue_per_appointment',
        'total_service_duration'
      ];
    } else {
      // For basic reports
      fields = ['date', 'service_name', 'revenue', 'appointments'];
      transformedData = data.map(item => ({
        date: item.date,
        service_name: item.service_name,
        revenue: item.revenue,
        appointments: item.appointments
      }));
    }

    const parser = new Parser({ fields });
    return parser.parse(transformedData);
  } catch (err) {
    console.error('CSV generation error:', err);
    throw err;
  }
};