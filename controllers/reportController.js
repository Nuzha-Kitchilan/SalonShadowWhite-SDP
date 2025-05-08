const reportModel = require('../models/reportModel');
const { generatePDF, generateEnhancedPDF } = require('../utils/pdfGenerator');
const { generateCSV } = require('../utils/csvGenerator');
const PDFDocument = require('pdfkit');

// Basic Revenue Report
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

// Test PDF Generation
exports.testPDF = async (req, res) => {
  try {
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

// Advanced Revenue Report
// Enhanced Advanced Revenue Report Controller
exports.getAdvancedRevenueReport = async (req, res) => {
  try {
    const { startDate, endDate, format = 'pdf', reportType = 'summary', groupBy = 'day', preview = false } = req.query;
    
    // Validate and set defaults
    const validReportTypes = ['summary', 'detailed', 'trend', 'comparison', 'stylist'];
    const reportTypeValid = validReportTypes.includes(reportType) ? reportType : 'summary';
    
    const validGroupBys = ['day', 'week', 'month', 'quarter', 'year', 'service', 'stylist'];
    const groupByValid = validGroupBys.includes(groupBy) ? groupBy : 'day';

    // Get data based on report type
    let reportData;
    switch(reportTypeValid) {
      case 'detailed':
        reportData = await reportModel.getDetailedRevenueData(startDate, endDate, groupByValid);
        break;
      case 'trend':
        reportData = await reportModel.getRevenueTrends(startDate, endDate, groupByValid);
        break;
      case 'comparison':
        reportData = await reportModel.getPeriodComparison(startDate, endDate, groupByValid);
        break;
      case 'stylist':
        reportData = await reportModel.getStylistPerformance(startDate, endDate);
        break;
      default: // summary
        reportData = await reportModel.getSummaryRevenueData(startDate, endDate, groupByValid);
    }

    // If preview requested, return JSON data
    if (preview === 'true' || preview === true) {
      const chartData = generateChartData(reportData, reportTypeValid);
      const serviceChartData = generateServiceChartData(reportData);
      
      return res.json({
        rows: Array.isArray(reportData) ? reportData : 
              (reportData?.current_period || []),
        chartData,
        serviceChartData
      });
    }

    // Generate proper visualization data for PDF
    //const visualizationData = await generatePDFVisualizationData(reportData, reportTypeValid, groupByValid);


    const visualizationData = {
      summaryStats: {
        totalRevenue: reportData.reduce((sum, row) => sum + Number(row.total_revenue || 0), 0),
        totalAppointments: reportData.reduce((sum, row) => sum + Number(row.total_appointments || 0), 0),
        // Add other metrics as needed
      },
      // Include the original data
      rows: reportData
    };


    // Generate report based on format
    if (format.toLowerCase() === 'csv') {
      const csv = generateCSV(reportData, visualizationData);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=revenue_${reportType}_${startDate}_to_${endDate}.csv`);
      return res.send(csv);
    } else {
      const pdf = await generateEnhancedPDF(reportData, visualizationData, {
        startDate, 
        endDate,
        reportType: reportTypeValid,
        groupBy: groupByValid
      });
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=revenue_${reportType}_${startDate}_to_${endDate}.pdf`);
      return res.send(pdf);
    }
  } catch (error) {
    console.error('Advanced report error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to generate advanced report',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Enhanced PDF visualization data generator
async function generatePDFVisualizationData(reportData, reportType, groupBy) {
  const data = Array.isArray(reportData) ? reportData : 
               (reportData?.current_period || []);
  
  // Calculate summary statistics
  const totalRevenue = data.reduce((sum, item) => sum + Number(item.revenue || item.total_revenue || 0), 0);
  const totalAppointments = data.reduce((sum, item) => sum + Number(item.appointments || item.total_appointments || 0), 0);
  const avgRevenuePerAppointment = totalAppointments > 0 ? (totalRevenue / totalAppointments) : 0;
  
  // Additional metrics based on report type
  let additionalMetrics = {};
  if (reportType === 'comparison') {
    additionalMetrics = {
      previous_total: reportData.previous_period?.reduce((sum, item) => sum + Number(item.total_revenue || 0), 0) || 0,
      yoy_total: reportData.year_over_year?.reduce((sum, item) => sum + Number(item.total_revenue || 0), 0) || 0
    };
  } else if (reportType === 'trend') {
    const growthRates = data.map(item => Number(item.growth_rate || 0));
    additionalMetrics = {
      avg_growth_rate: growthRates.reduce((sum, rate) => sum + rate, 0) / growthRates.length
    };
  } else if (reportType === 'stylist') {
    additionalMetrics = {
      top_stylist: data[0]?.stylist_name || 'N/A',
      top_stylist_revenue: Number(data[0]?.total_revenue || 0)
    };
  }

  return {
    summaryStats: {
      totalRevenue,
      totalAppointments,
      avgRevenuePerAppointment,
      ...additionalMetrics
    },
    chartConfig: {
      type: reportType === 'stylist' ? 'bar' : 'line',
      title: `${reportType} Revenue Report`,
      xAxisLabel: groupBy === 'stylist' ? 'Stylist' : 'Period',
      yAxisLabel: 'Revenue ($)'
    }
  };
}

// Helper function for visualization data
async function generateVisualizationData(reportData, reportType, groupBy) {
  // Process reportData based on its structure and report type
  const data = Array.isArray(reportData) ? reportData : 
               (reportData?.current_period || []);
  
  // Calculate summary statistics
  const totalRevenue = data.reduce((sum, item) => sum + Number(item.revenue || 0), 0);
  const totalAppointments = data.reduce((sum, item) => sum + Number(item.appointments || 0), 0);
  
  return {
    chartImage: null, // This would be a Buffer containing chart image
    summaryStats: {
      totalRevenue,
      totalAppointments
    }
  };
}

// Helper function to generate chart data for preview
function generateChartData(reportData, reportType) {
  // Convert reportData into a format suitable for Chart.js
  const data = Array.isArray(reportData) ? reportData :
               (reportData?.current_period || []);
  
  // Sort data by period to ensure chronological order
  const sortedData = [...data].sort((a, b) => {
    if (!a.period || !b.period) return 0;
    return String(a.period).localeCompare(String(b.period));
  });
  
  // Extract unique periods
  const periods = Array.from(new Set(sortedData.map(item => item.period_label || item.period)));
  
  // Calculate revenue per period (aggregating by period)
  const revenueByPeriod = {};
  sortedData.forEach(item => {
    const period = item.period_label || item.period;
    revenueByPeriod[period] = (revenueByPeriod[period] || 0) + Number(item.revenue || 0);
  });
  
  // Format for Chart.js
  return {
    labels: periods,
    datasets: [
      {
        label: 'Revenue',
        data: periods.map(period => revenueByPeriod[period] || 0),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.1
      }
    ]
  };
}

// Helper function to generate service breakdown chart data
function generateServiceChartData(reportData) {
  const data = Array.isArray(reportData) ? reportData :
               (reportData?.current_period || []);
  
  // Calculate revenue by service
  const serviceMap = {};
  data.forEach(item => {
    if (item.service_name) {
      serviceMap[item.service_name] = (serviceMap[item.service_name] || 0) + Number(item.revenue || 0);
    }
  });
  
  // Get top services by revenue
  const services = Object.keys(serviceMap);
  const revenues = services.map(service => serviceMap[service]);
  
  // Format for Chart.js
  return {
    labels: services,
    datasets: [
      {
        label: 'Revenue by Service',
        data: revenues,
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)',
          'rgba(255, 159, 64, 0.5)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1
      }
    ]
  };
}