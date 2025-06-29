
const PDFDocument = require('pdfkit');
const fs = require('fs');
const { ChartJSNodeCanvas } = require('chartjs-node-canvas');

exports.generateEnhancedPDF = async (data, visualizationData, options) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Create PDF with better margins for readability
      const doc = new PDFDocument({ 
        margin: 50, 
        size: 'A4', 
        bufferPages: true 
      });
      
      const buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', reject);

      const formatCurrency = (value) => value.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 });

    
      doc.font('Helvetica-Bold').fontSize(24).fillColor('#1a365d').text('Salon Shadow White', { align: 'center' });
      doc.moveDown(0.3);
      doc.font('Helvetica-Bold').fontSize(20).fillColor('#2c5282').text('Advanced Revenue Report', { align: 'center' });
      doc.moveDown(0.5);
      
      // colored header bar
      const headerBarY = doc.y;
      doc.rect(50, headerBarY, doc.page.width - 100, 30).fillColor('#e6f0ff').fill();
      
      // Header info 
      doc.fontSize(12).fillColor('#333').font('Helvetica');
      doc.text(`Period: ${options.startDate} to ${options.endDate}`, { align: 'center' });
      doc.text(`Report Type: ${options.reportType}`, { align: 'center' });
      doc.text(`Grouped By: ${options.groupBy}`, { align: 'center' });

      doc.moveDown();
      doc.strokeColor('#8daed6').lineWidth(2).moveTo(50, doc.y).lineTo(doc.page.width - 50, doc.y).stroke();
      doc.moveDown();

    
      const stats = visualizationData.summaryStats || {};
      
      // Section heading with background
      const insightHeaderY = doc.y;
      doc.rect(50, insightHeaderY, doc.page.width - 100, 24).fillColor('#f0f5ff').fill();
      doc.fontSize(16).fillColor('#1a365d').font('Helvetica-Bold')
         .text('Insights & Highlights:', 60, insightHeaderY + 5);
      doc.moveDown(1.5);
      
      const insights = [
        `★ Top Stylist: ${stats.top_stylist || 'N/A'} (${formatCurrency(stats.top_stylist_revenue || 0)})`,
        `★ Best Service: ${stats.top_service || 'N/A'} (${formatCurrency(stats.top_service_revenue || 0)})`,
        `${(stats.revenue_growth_rate ?? 0) >= 0 ? '▲' : '▼'} Revenue Change vs Last Period: ${(stats.revenue_growth_rate ?? 0).toFixed(1)}%`,
        `$ Avg Revenue per Appointment: ${formatCurrency(stats.avgRevenuePerAppointment || 0)}`,
        `• Unique Clients: ${stats.uniqueClients || 0}`
      ];
      
      insights.forEach(line => {
        doc.fontSize(11).fillColor('#444').font('Helvetica')
           .text(line, { indent: 20 });
        doc.moveDown(0.5);
      });
      doc.moveDown();

      
      if (visualizationData.chartData) {
        const chartCanvas = new ChartJSNodeCanvas({ width: 800, height: 400 });
        const chartBuffer = await chartCanvas.renderToBuffer({
          type: 'bar',
          data: visualizationData.chartData,
          options: { 
            plugins: { 
              legend: { position: 'bottom' },
              title: {
                display: true,
                text: 'Revenue Distribution',
                font: { size: 16 }
              }
            }, 
            responsive: false,
            backgroundColor: '#ffffff',
            borderColor: '#2c5282',
            borderWidth: 1
          }
        });
        doc.image(chartBuffer, { fit: [500, 300], align: 'center' });
        doc.moveDown();
      }

    
      const metricsHeaderY = doc.y;
      doc.rect(50, metricsHeaderY, doc.page.width - 100, 24).fillColor('#f0f5ff').fill();
      doc.fontSize(16).fillColor('#1a365d').font('Helvetica-Bold')
         .text('Key Metrics:', 60, metricsHeaderY + 5);
      doc.moveDown(1.5);
      
      const totalRevenue = Number(stats.totalRevenue || 0);
      const totalAppointments = Number(stats.totalAppointments || 0);
      const avgRevenuePerAppointment = totalAppointments > 0 ? (totalRevenue / totalAppointments) : 0;
      
      // Create a metrics box with border
      const metricsY = doc.y;
      const metricsHeight = 80;
      doc.roundedRect(70, metricsY, doc.page.width - 140, metricsHeight, 5)
         .fillColor('#f9fafc').fill()
         .strokeColor('#ccd9ea').lineWidth(1).stroke();
      
      
      const labelX = 90;  
      const valueX = 300; 
      const spacing = 25; 
      
      // Add metrics 
      doc.fontSize(12).fillColor('#333').font('Helvetica-Bold')
         .text('Total Revenue:', labelX, metricsY + 15);
      doc.fontSize(14).fillColor('#2c5282').font('Helvetica-Bold')
         .text(formatCurrency(totalRevenue), valueX, metricsY + 15);
         
      doc.fontSize(12).fillColor('#333').font('Helvetica-Bold')
         .text('Total Appointments:', labelX, metricsY + 15 + spacing);
      doc.fontSize(14).fillColor('#2c5282').font('Helvetica-Bold')
         .text(totalAppointments.toLocaleString(), valueX, metricsY + 15 + spacing);
         
      doc.fontSize(12).fillColor('#333').font('Helvetica-Bold')
         .text('Avg Revenue per Appointment:', labelX, metricsY + 15 + (spacing * 2));
      doc.fontSize(14).fillColor('#2c5282').font('Helvetica-Bold')
         .text(formatCurrency(avgRevenuePerAppointment), valueX, metricsY + 15 + (spacing * 2));
         
      doc.moveDown(4.5);

      if (stats.previous_total !== undefined) {
        const comparisonHeaderY = doc.y;
        doc.rect(50, comparisonHeaderY, doc.page.width - 100, 24).fillColor('#f0f5ff').fill();
        doc.fontSize(16).fillColor('#1a365d').font('Helvetica-Bold')
           .text('Period Comparison:', 60, comparisonHeaderY + 5);
        doc.moveDown(1.5);
        
        const revenueGrowth = stats.previous_total !== 0
          ? ((totalRevenue - stats.previous_total) / stats.previous_total) * 100
          : 0;
        const yoyGrowth = stats.yoy_total !== 0
          ? ((totalRevenue - stats.yoy_total) / stats.yoy_total) * 100
          : 0;
          
        doc.fontSize(12).fillColor(revenueGrowth >= 0 ? '#2f855a' : '#c53030').font('Helvetica')
           .text(`${revenueGrowth >= 0 ? '▲' : '▼'} Revenue Change vs Previous Period: ${revenueGrowth.toFixed(1)}%`, { indent: 20 });
        doc.moveDown(0.5);
        
        doc.fontSize(12).fillColor(yoyGrowth >= 0 ? '#2f855a' : '#c53030').font('Helvetica')
           .text(`${yoyGrowth >= 0 ? '▲' : '▼'} Year-over-Year Growth: ${yoyGrowth.toFixed(1)}%`, { indent: 20 });
        doc.moveDown(1.5);
      }


      const tableHeaderY = doc.y;
      doc.rect(50, tableHeaderY, doc.page.width - 100, 24).fillColor('#f0f5ff').fill();
      doc.fontSize(16).fillColor('#1a365d').font('Helvetica-Bold')
         .text('Detailed Data', 60, tableHeaderY + 5);
      doc.moveDown(1.5);

      const tableTop = doc.y;
      const colWidths = { 
        period: 80, 
        service: 180,  
        stylist: 150,  
        revenue: 115   
      };
      const tableWidth = doc.page.width - 100;
     
      const rowHeight = 35;  
      const startX = 50;

      // Table header with better styling
      doc.rect(startX, doc.y, tableWidth, 30).fillColor('#2c5282').fill();
      const headerY = doc.y + 10;
      doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(12);
      doc.text('Period', startX + 5, headerY, { width: colWidths.period });
      doc.text('Service', startX + colWidths.period + 5, headerY, { width: colWidths.service });
      doc.text('Stylist', startX + colWidths.period + colWidths.service + 5, headerY, { width: colWidths.stylist });
      doc.text('Revenue', startX + colWidths.period + colWidths.service + colWidths.stylist + 5, headerY, { width: colWidths.revenue, align: 'left' });

      doc.font('Helvetica').fontSize(10);
      let rowY = doc.y + 30; 
      let isAlternate = false;

      const dataArray = Array.isArray(data) ? data : [];
      dataArray.forEach((row, index) => {
        if (rowY + rowHeight > doc.page.height - 120) {
          doc.addPage();
          rowY = 50;
          isAlternate = false;
          
          // Repeat table header on new page
          doc.rect(startX, rowY, tableWidth, 30).fillColor('#2c5282').fill();
          const newHeaderY = rowY + 10;
          doc.fillColor('#ffffff').font('Helvetica-Bold').fontSize(12);
          doc.text('Period', startX + 5, newHeaderY, { width: colWidths.period });
          doc.text('Service', startX + colWidths.period + 5, newHeaderY, { width: colWidths.service });
          doc.text('Stylist', startX + colWidths.period + colWidths.service + 5, newHeaderY, { width: colWidths.stylist });
          doc.text('Revenue', startX + colWidths.period + colWidths.service + colWidths.stylist + 5, newHeaderY, { width: colWidths.revenue, align: 'left' });
          
          rowY += 30;
        }

        const rowRevenue = Number(row.total_revenue || row.revenue || 0);
        const revenuePercent = totalRevenue !== 0 ? (rowRevenue / totalRevenue) * 100 : 0;
        const stylistName = row.stylist_name || 'N/A';
        const periodLabel = row.period_label || row.period || 'N/A';
        const serviceName = row.service_name || 'N/A';

        // Row background alternate with subtle colors
        if (isAlternate) {
          doc.rect(startX, rowY, tableWidth, rowHeight).fillColor('#f5f8fc').fill();
        }
        isAlternate = !isAlternate;

        const revenueColor = rowRevenue >= 5000 ? '#2f855a'  
                            : rowRevenue >= 3000 ? '#2b6cb0'  
                            : '#c53030';  

       
        const textY = rowY + (rowHeight - 12) / 2;  
        
        doc.fillColor('#333').font('Helvetica').fontSize(10);
        doc.text(periodLabel, startX + 5, textY, { 
          width: colWidths.period - 10,
          height: rowHeight - 10,
          ellipsis: true
        });
        
        // Service name with proper wrapping
        doc.text(serviceName, startX + colWidths.period + 5, textY, { 
          width: colWidths.service - 10,
          height: rowHeight - 10,
          ellipsis: true
        });
        
        // Stylist name with proper wrapping
        doc.text(stylistName, startX + colWidths.period + colWidths.service + 5, textY, { 
          width: colWidths.stylist - 10,
          height: rowHeight - 10,
          ellipsis: true
        });

        // Revenue with % contribution
        doc.fillColor(revenueColor).font('Helvetica-Bold')
           .text(`${formatCurrency(rowRevenue)} (${revenuePercent.toFixed(1)}%)`, 
                 startX + colWidths.period + colWidths.service + colWidths.stylist + 5, textY, { 
                   width: colWidths.revenue - 10, 
                   height: rowHeight - 10,
                   align: 'left',
                   ellipsis: true
                 });

        rowY += rowHeight;
      });

      const totalPages = doc.bufferedPageRange().count;
      for (let i = 0; i < totalPages; i++) {
        doc.switchToPage(i);
        
        const footerY = doc.page.height - 80;
        
        // Footer with gradient bar
        doc.rect(50, footerY, doc.page.width - 100, 2).fillColor('#8daed6').fill();
       
        doc.fontSize(9).fillColor('#555').font('Helvetica')
           .text(`Generated ${new Date().toLocaleString()} | Page ${i + 1} of ${totalPages}`,
             50, footerY + 10, { align: 'center', width: doc.page.width - 100 });
      }

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
};