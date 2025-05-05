const { Parser } = require('json2csv');

exports.generateCSV = (data) => {
  const fields = [
    { label: 'Date', value: 'date' },
    { label: 'Service', value: 'service_name' },
    { label: 'Appointments', value: 'appointments' },
    { label: 'Revenue ($)', value: row => row.revenue.toFixed(2) }
  ];
  
  const parser = new Parser({ fields });
  return parser.parse(data);
};