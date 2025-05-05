const reportModel = require('../models/reportModel');
const { generatePDF } = require('../utils/pdfGenerator');
const { generateCSV } = require('../utils/csvGenerator');

exports.getRevenueReport = async (req, res) => {
  try {
    // Set default date range (last 30 days)
    const defaultStartDate = new Date();
    defaultStartDate.setDate(defaultStartDate.getDate() - 30);
    
    // Get query parameters
    const startDate = req.query.startDate || defaultStartDate.toISOString().split('T')[0];
    const endDate = req.query.endDate || new Date().toISOString().split('T')[0];
    const format = req.query.format || 'pdf';

    // Get data from database
    const reportData = await reportModel.getRevenueData(startDate, endDate);

    // Generate requested format
    if (format.toLowerCase() === 'csv') {
      const csv = generateCSV(reportData);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=revenue_${startDate}_to_${endDate}.csv`);
      return res.send(csv);
    } else {
      const pdf = await generatePDF(reportData, startDate, endDate);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=revenue_${startDate}_to_${endDate}.pdf`);
      return res.send(pdf);
    }
  } catch (error) {
    console.error('Report generation error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to generate report',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};


// Add to reportController.js
exports.testPDF = async (req, res) => {
    try {
      // Create a very simple test PDF
      const doc = new PDFDocument();
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=test.pdf');
      
      doc.pipe(res);
      doc.fontSize(25).text('This is a test PDF', 100, 100);
      doc.end();
    } catch (error) {
      console.error('Test PDF error:', error);
      res.status(500).send('PDF generation failed');
    }
  };