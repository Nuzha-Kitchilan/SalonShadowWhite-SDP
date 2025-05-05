const PDFDocument = require('pdfkit');

exports.generatePDF = async (data, startDate, endDate) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const buffers = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', reject);

      // Header
      doc.fontSize(20).text('Revenue Report', { align: 'center' });
      doc.moveDown();
      doc.fontSize(12).text(`From ${startDate} to ${endDate}`, { align: 'center' });
      doc.moveDown(2);

      // Table Header
      const startX = 50;
      doc.font('Helvetica-Bold');
      doc.text('Date', startX, doc.y);
      doc.text('Service', startX + 100, doc.y);
      doc.text('Appointments', startX + 300, doc.y);
      doc.text('Revenue', startX + 400, doc.y);
      doc.moveDown();

      // Table Rows
      doc.font('Helvetica');
      let totalRevenue = 0;
      let totalAppointments = 0;

      data.forEach(row => {
        const revenue = parseFloat(row.revenue) || 0;
        const appointments = parseInt(row.appointments) || 0;

        doc.text(row.date, startX, doc.y);
        doc.text(row.service_name, startX + 100, doc.y);
        doc.text(appointments.toString(), startX + 300, doc.y);
        doc.text(`$${revenue.toFixed(2)}`, startX + 400, doc.y);
        doc.moveDown();

        totalRevenue += revenue;
        totalAppointments += appointments;
      });

      // Footer
      doc.moveDown(2);
      doc.font('Helvetica-Bold');
      doc.text(`Total Appointments: ${totalAppointments}`, startX, doc.y);
      doc.text(`Total Revenue: $${totalRevenue.toFixed(2)}`, startX + 300, doc.y);

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};
