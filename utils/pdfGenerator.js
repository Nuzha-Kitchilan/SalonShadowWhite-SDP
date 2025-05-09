// const PDFDocument = require('pdfkit');
// const fs = require('fs');

// exports.generateEnhancedPDF = async (data, visualizationData, options) => {
//   return new Promise((resolve, reject) => {
//     try {
//       // Create a compact PDF with better layout
//       const doc = new PDFDocument({ 
//         margin: 50,
//         size: 'A4',
//         bufferPages: true, // Enable page buffering for page numbers
//         autoFirstPage: true // automatically create the first page
//       });
      
//       const buffers = [];
//       doc.on('data', buffers.push.bind(buffers));
//       doc.on('end', () => resolve(Buffer.concat(buffers)));
//       doc.on('error', reject);

//       // Format numbers with commas
//       const formatCurrency = (value) => {
//         return value.toLocaleString('en-US', {
//           style: 'currency', 
//           currency: 'USD',
//           minimumFractionDigits: 2
//         });
//       };

//       // ===== HEADER SECTION =====
//       doc.fontSize(22).fillColor('#333333').text('Advanced Revenue Report', { align: 'center' });
//       doc.moveDown(0.5);
      
//       // Report period and details
//       doc.fontSize(12).fillColor('#555555');
//       doc.text(`Period: ${options.startDate} to ${options.endDate}`, { align: 'center' });
//       doc.text(`Report Type: ${options.reportType}`, { align: 'center' });
//       doc.text(`Grouped By: ${options.groupBy}`, { align: 'center' });
      
//       doc.moveDown();
//       doc.strokeColor('#999999').lineWidth(1)
//          .moveTo(50, doc.y).lineTo(doc.page.width - 50, doc.y)
//          .stroke();
//       doc.moveDown();

//       // ===== KEY METRICS SECTION =====
//       doc.fontSize(16).fillColor('#333333').text('Key Metrics');
//       doc.moveDown(0.5);

//       // Ensure visualizationData and summaryStats exist and have default values
//       const summaryStats = visualizationData?.summaryStats || {};
//       const totalRevenue = Number(summaryStats.totalRevenue || 0);
//       const totalAppointments = Number(summaryStats.totalAppointments || 0);
//       const avgRevenuePerAppointment = totalAppointments > 0
//         ? (totalRevenue / totalAppointments)
//         : 0;

//       // Create a compact metrics display with columns
//       const metricData = [
//         ['Total Revenue:', formatCurrency(totalRevenue)],
//         ['Total Appointments:', totalAppointments.toLocaleString()],
//         ['Average Revenue per Appointment:', formatCurrency(avgRevenuePerAppointment)]
//       ];

//       // Draw metrics in a table-like structure
//       const startY = doc.y;
//       metricData.forEach((row, i) => {
//         doc.fontSize(11).fillColor('#555555');
//         doc.text(row[0], 70, startY + (i * 20), { continued: false });
//         doc.text(row[1], 250, startY + (i * 20), { continued: false });
//       });
      
//       doc.moveDown(2);

//       // ===== DETAILED DATA TABLE =====
//       doc.fontSize(16).fillColor('#333333').text('Detailed Data');
//       doc.moveDown(0.5);

//       // Better table layout with compact spacing
//       const tableTop = doc.y;
//       const colWidths = {
//         period: 120,    // Reduced width
//         service: 100,   // Reduced width
//         stylist: 120,   // Reduced width
//         revenue: 100    // Kept the same
//       };

//       // Table Header with background
//       const tableWidth = doc.page.width - 100;
//       const rowHeight = 22; // Reduced height
//       const startX = 50;
      
//       // Header background
//       doc.rect(startX, doc.y, tableWidth, rowHeight)
//          .fillColor('#eeeeee')
//          .fill();
      
//       // Header text
//       doc.fillColor('#333333').font('Helvetica-Bold').fontSize(11);
//       const headerY = doc.y + 6;
//       doc.text('Period', startX + 5, headerY, { width: colWidths.period, align: 'left' });
//       doc.text('Service', startX + colWidths.period + 5, headerY, { width: colWidths.service, align: 'left' });
//       doc.text('Stylist', startX + colWidths.period + colWidths.service + 5, headerY, { width: colWidths.stylist, align: 'left' });
//       doc.text('Revenue', startX + colWidths.period + colWidths.service + colWidths.stylist + 5, headerY, { width: colWidths.revenue, align: 'right' });
      
//       doc.moveDown(1);

//       // Table Rows with alternating background
//       doc.font('Helvetica').fontSize(10); // Smaller font
      
//       // Ensure data is an array
//       const dataArray = Array.isArray(data) ? data : [];
//       let rowY = doc.y;
//       let isAlternate = false;
      
//       dataArray.forEach((row, index) => {
//         // Debugging: log the row data for inspection
//         console.log('Row Data:', row);
        
//         // Convert total_revenue to a number
//         const rowRevenue = Number(row.total_revenue || 0);  // Ensure it's a number
//         const stylistName = row.stylist_name || 'N/A';
//         const periodLabel = row.period_label || row.period || 'N/A';
//         const serviceName = row.service_name || 'N/A';
        
//         // Debugging: check the value of revenue
//         console.log('Row Revenue:', rowRevenue);

//         // Alternate row background
//         if (isAlternate) {
//           doc.rect(startX, rowY, tableWidth, rowHeight)
//              .fillColor('#f9f9f9')
//              .fill();
//         }
//         isAlternate = !isAlternate;
        
//         // Row text (vertically centered)
//         doc.fillColor('#444444');
//         const textY = rowY + 6; // Vertically centered text
//         doc.text(periodLabel, startX + 5, textY, { width: colWidths.period, align: 'left' });
//         doc.text(serviceName, startX + colWidths.period + 5, textY, { width: colWidths.service, align: 'left' });
//         doc.text(stylistName, startX + colWidths.period + colWidths.service + 5, textY, { width: colWidths.stylist, align: 'left' });
//         doc.text(formatCurrency(rowRevenue), startX + colWidths.period + colWidths.service + colWidths.stylist + 5, textY, { width: colWidths.revenue, align: 'right' });

//         rowY += rowHeight;

//         // Only add a new page if we're near the bottom and have more rows to display
//         if (rowY > doc.page.height - 70 && index < dataArray.length - 1) {
//           doc.addPage();
//           rowY = 50;
//           isAlternate = false;
//         }
//       });
      
//       // Table borders - full border
//       doc.rect(startX, tableTop, tableWidth, rowY - tableTop)
//          .strokeColor('#cccccc')
//          .lineWidth(1)
//          .stroke();
         
//       // Vertical lines for columns
//       doc.moveTo(startX + colWidths.period, tableTop).lineTo(startX + colWidths.period, rowY).stroke();
//       doc.moveTo(startX + colWidths.period + colWidths.service, tableTop)
//          .lineTo(startX + colWidths.period + colWidths.service, rowY).stroke();
//       doc.moveTo(startX + colWidths.period + colWidths.service + colWidths.stylist, tableTop)
//          .lineTo(startX + colWidths.period + colWidths.service + colWidths.stylist, rowY).stroke();

//       // Get total page count
//       const totalPages = doc.bufferedPageRange().count;
      
//       // Add footer to each page
//       for (let i = 0; i < totalPages; i++) {
//         doc.switchToPage(i);
        
//         // Footer line
//         doc.strokeColor('#cccccc').lineWidth(0.5)
//            .moveTo(50, doc.page.height - 40)
//            .lineTo(doc.page.width - 50, doc.page.height - 40)
//            .stroke();
           
//         // Footer text - single line with date and page number
//         doc.fontSize(8).fillColor('#777777')
//            .text(`Report generated on ${new Date().toLocaleString()} | Page ${i + 1} of ${totalPages}`, 
//                 50, doc.page.height - 30, {
//                   align: 'center',
//                   width: doc.page.width - 100
//                 });
//       }

//       doc.end();
//     } catch (err) {
//       reject(err);
//     }
//   });
// };

// // Base64 conversion for web preview
// exports.pdfToBase64 = (buffer) => {
//   return buffer.toString('base64');
// };

// // Optional: Save PDF to file for testing
// exports.savePDFToFile = (buffer, filename) => {
//   fs.writeFileSync(filename, buffer);
//   console.log(`PDF saved as ${filename}`);
// };














const PDFDocument = require('pdfkit');
const fs = require('fs');
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');

exports.generateEnhancedPDF = async (data, visualizationData, options) => {
  return new Promise(async (resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50, size: 'A4', bufferPages: true });
      const buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', reject);

      const formatCurrency = (value) => value.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 });

      // ========== HEADER ==========
      doc.fontSize(22).fillColor('#333').text('Advanced Revenue Report', { align: 'center' });
      doc.fontSize(12).fillColor('#555');
      doc.text(`Period: ${options.startDate} to ${options.endDate}`, { align: 'center' });
      doc.text(`Report Type: ${options.reportType}`, { align: 'center' });
      doc.text(`Grouped By: ${options.groupBy}`, { align: 'center' });

      doc.moveDown();
      doc.strokeColor('#999').moveTo(50, doc.y).lineTo(doc.page.width - 50, doc.y).stroke();
      doc.moveDown();

      // ========== 1️⃣ INSIGHTS ==========
      const stats = visualizationData.summaryStats || {};
      const insights = [
        `✔ Top Stylist: ${stats.top_stylist || 'N/A'} (${formatCurrency(stats.top_stylist_revenue || 0)})`,
        `✔ Best Service: ${stats.top_service || 'N/A'} (${formatCurrency(stats.top_service_revenue || 0)})`,
        `✔ Revenue Change vs Last Period: ${(stats.revenue_growth_rate ?? 0).toFixed(1)}%`,
        `✔ Avg Revenue per Appointment: ${formatCurrency(stats.avgRevenuePerAppointment || 0)}`,
        `✔ Unique Clients: ${stats.uniqueClients || 0}`
      ];
      doc.fontSize(14).fillColor('#333').text('Insights & Highlights:');
      insights.forEach(line => doc.fontSize(11).fillColor('#444').text(line, { indent: 20 }));
      doc.moveDown();

      // ========== 2️⃣ CHART ==========
      const chartCanvas = new ChartJSNodeCanvas({ width: 800, height: 400 });
      const chartBuffer = await chartCanvas.renderToBuffer({
        type: 'bar',
        data: visualizationData.chartData, // assumes visualizationData.chartData is prebuilt
        options: { plugins: { legend: { position: 'bottom' } }, responsive: false }
      });
      doc.image(chartBuffer, { fit: [500, 300], align: 'center' });
      doc.moveDown();

      // ========== KEY METRICS ==========
      const totalRevenue = Number(stats.totalRevenue || 0);
      const totalAppointments = Number(stats.totalAppointments || 0);
      const avgRevenuePerAppointment = totalAppointments > 0 ? (totalRevenue / totalAppointments) : 0;
      const metricData = [
        ['Total Revenue:', formatCurrency(totalRevenue)],
        ['Total Appointments:', totalAppointments.toLocaleString()],
        ['Avg Revenue per Appointment:', formatCurrency(avgRevenuePerAppointment)]
      ];
      const startY = doc.y;
      metricData.forEach((row, i) => {
        doc.fontSize(11).fillColor('#555');
        doc.text(row[0], 70, startY + (i * 18), { continued: false });
        doc.text(row[1], 250, startY + (i * 18), { continued: false });
      });
      doc.moveDown(2);

      // ========== 3️⃣ COMPARISON / % CHANGE ==========
      if (stats.previous_total !== undefined) {
        const revenueGrowth = stats.previous_total !== 0
          ? ((totalRevenue - stats.previous_total) / stats.previous_total) * 100
          : 0;
        const yoyGrowth = stats.yoy_total !== 0
          ? ((totalRevenue - stats.yoy_total) / stats.yoy_total) * 100
          : 0;
        doc.fontSize(12).fillColor('#333').text('Comparison:');
        doc.fillColor(revenueGrowth >= 0 ? 'green' : 'red')
           .text(`✔ Revenue Change vs Previous Period: ${revenueGrowth.toFixed(1)}%`);
        doc.fillColor(yoyGrowth >= 0 ? 'green' : 'red')
           .text(`✔ Year-over-Year Growth: ${yoyGrowth.toFixed(1)}%`);
        doc.moveDown();
      }

      // ========== 4️⃣ & 5️⃣ TABLE WITH HIGHLIGHT + CONTRIBUTION % ==========
      doc.fontSize(14).fillColor('#333').text('Detailed Data');
      doc.moveDown(0.5);

      const tableTop = doc.y;
      const colWidths = { period: 110, service: 90, stylist: 110, revenue: 110 };
      const tableWidth = doc.page.width - 100;
      const rowHeight = 22;
      const startX = 50;

      // Table header background
      doc.rect(startX, doc.y, tableWidth, rowHeight).fillColor('#eee').fill();
      const headerY = doc.y + 6;
      doc.fillColor('#333').font('Helvetica-Bold').fontSize(11);
      doc.text('Period', startX + 5, headerY, { width: colWidths.period });
      doc.text('Service', startX + colWidths.period + 5, headerY, { width: colWidths.service });
      doc.text('Stylist', startX + colWidths.period + colWidths.service + 5, headerY, { width: colWidths.stylist });
      doc.text('Revenue', startX + colWidths.period + colWidths.service + colWidths.stylist + 5, headerY, { width: colWidths.revenue, align: 'right' });

      doc.font('Helvetica').fontSize(10);
      let rowY = doc.y + rowHeight;
      let isAlternate = false;

      const dataArray = Array.isArray(data) ? data : [];
      dataArray.forEach((row, index) => {
        const rowRevenue = Number(row.total_revenue || row.revenue || 0);
        const revenuePercent = totalRevenue !== 0 ? (rowRevenue / totalRevenue) * 100 : 0;
        const stylistName = row.stylist_name || 'N/A';
        const periodLabel = row.period_label || row.period || 'N/A';
        const serviceName = row.service_name || 'N/A';

        // Row background alternate
        if (isAlternate) {
          doc.rect(startX, rowY, tableWidth, rowHeight).fillColor('#f9f9f9').fill();
        }
        isAlternate = !isAlternate;

        // Conditional color for revenue
        const revenueColor = rowRevenue >= 5000 ? '#008800'
                            : rowRevenue >= 3000 ? '#888800'
                            : '#880000';

        const textY = rowY + 6;
        doc.fillColor('#444');
        doc.text(periodLabel, startX + 5, textY, { width: colWidths.period });
        doc.text(serviceName, startX + colWidths.period + 5, textY, { width: colWidths.service });
        doc.text(stylistName, startX + colWidths.period + colWidths.service + 5, textY, { width: colWidths.stylist });

        // Revenue with % contribution + color
        doc.fillColor(revenueColor)
           .text(`${formatCurrency(rowRevenue)} (${revenuePercent.toFixed(1)}%)`, startX + colWidths.period + colWidths.service + colWidths.stylist + 5, textY, { width: colWidths.revenue, align: 'right' });

        rowY += rowHeight;
        if (rowY > doc.page.height - 70 && index < dataArray.length - 1) {
          doc.addPage();
          rowY = 50;
          isAlternate = false;
        }
      });

      // Table borders
      doc.rect(startX, tableTop, tableWidth, rowY - tableTop).strokeColor('#ccc').lineWidth(1).stroke();
      doc.moveTo(startX + colWidths.period, tableTop).lineTo(startX + colWidths.period, rowY).stroke();
      doc.moveTo(startX + colWidths.period + colWidths.service, tableTop).lineTo(startX + colWidths.period + colWidths.service, rowY).stroke();
      doc.moveTo(startX + colWidths.period + colWidths.service + colWidths.stylist, tableTop).lineTo(startX + colWidths.period + colWidths.service + colWidths.stylist, rowY).stroke();

      const totalPages = doc.bufferedPageRange().count;
      for (let i = 0; i < totalPages; i++) {
        doc.switchToPage(i);
        doc.strokeColor('#ccc').moveTo(50, doc.page.height - 40).lineTo(doc.page.width - 50, doc.page.height - 40).stroke();
        doc.fontSize(8).fillColor('#777')
           .text(`Generated ${new Date().toLocaleString()} | Page ${i + 1} of ${totalPages}`,
             50, doc.page.height - 30, { align: 'center', width: doc.page.width - 100 });
      }

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};
