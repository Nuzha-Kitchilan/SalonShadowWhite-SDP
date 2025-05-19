// ReportInsights.jsx
import React from 'react';
import { Paper, Typography } from '@mui/material';

const safeNumber = (value) => {
  const num = Number(value);
  return isNaN(num) ? 0 : num;
};

const ReportInsights = ({ previewData, reportConfig }) => {
  const generateInsightsText = () => {
    if (!previewData) return "Generate a report to see insights.";
    
    if (reportConfig.reportType === 'comparison' && previewData.metrics) {
      const currentTotal = safeNumber(previewData.metrics.current_total);
      const prevTotal = safeNumber(previewData.metrics.previous_total);
      const yoyTotal = safeNumber(previewData.metrics.yoy_total);
      const prevChange = prevTotal ? ((currentTotal - prevTotal) / Math.max(prevTotal, 1)) * 100 : 0;
      const yoyChange = yoyTotal ? ((currentTotal - yoyTotal) / Math.max(yoyTotal, 1)) * 100 : 0;
      
      return `The current period generated $${currentTotal.toFixed(2)} in revenue. This represents ${
        prevChange >= 0 ? 'an increase' : 'a decrease'
      } of ${Math.abs(prevChange).toFixed(1)}% compared to the previous period and ${
        yoyChange >= 0 ? 'an increase' : 'a decrease'
      } of ${Math.abs(yoyChange).toFixed(1)}% compared to the same period last year.`;
    }
    
    if (reportConfig.reportType === 'trend') {
      if (!previewData.rows || previewData.rows.length === 0) return "No trend data available.";
      
      const first = previewData.rows[0];
      const last = previewData.rows[previewData.rows.length - 1];
      const firstRevenue = safeNumber(first.revenue);
      const lastRevenue = safeNumber(last.revenue);
      const totalChange = firstRevenue ? ((lastRevenue - firstRevenue) / Math.max(firstRevenue, 1)) * 100 : 0;
      
      const validGrowthRates = previewData.rows
        .map(row => safeNumber(row.growth_rate))
        .filter(rate => !isNaN(rate));
      
      const avgGrowth = validGrowthRates.length > 0 ? 
        validGrowthRates.reduce((sum, rate) => sum + rate, 0) / validGrowthRates.length : 0;
      
      return `Over the selected period, revenue ${
        totalChange >= 0 ? 'increased' : 'decreased'
      } by ${Math.abs(totalChange).toFixed(1)}%, with an average ${
        avgGrowth >= 0 ? 'growth' : 'decline'
      } rate of ${Math.abs(avgGrowth).toFixed(1)}% per ${reportConfig.groupBy}. The 7-period moving average ${
        safeNumber(last.moving_avg_7) > safeNumber(first.moving_avg_7) ? 'increased' : 'decreased'
      } from $${safeNumber(first.moving_avg_7).toFixed(2)} to $${safeNumber(last.moving_avg_7).toFixed(2)}.`;
    }
    
    if (reportConfig.reportType === 'stylist') {
      if (!previewData.rows || previewData.rows.length === 0) return "No stylist data available.";
      
      const sortedStylists = [...previewData.rows].sort((a, b) => 
        safeNumber(b.total_revenue) - safeNumber(a.total_revenue));
      
      const topStylist = sortedStylists[0];
      const totalRevenue = sortedStylists.reduce((sum, row) => sum + safeNumber(row.total_revenue), 0);
      const topPercentage = totalRevenue ? (safeNumber(topStylist.total_revenue) / Math.max(totalRevenue, 1)) * 100 : 0;
      const totalAppointments = sortedStylists.reduce((sum, row) => sum + safeNumber(row.total_appointments), 0);
      
      return `The top performing stylist was ${topStylist.stylist_name || 'Unknown'}, generating $${safeNumber(topStylist.total_revenue).toFixed(2)} (${topPercentage.toFixed(1)}% of total revenue) from ${safeNumber(topStylist.total_appointments)} appointments. The average revenue per appointment across all stylists was $${(totalRevenue / Math.max(totalAppointments, 1)).toFixed(2)}.`;
    }
    
    // Default insights
    if (!previewData.rows || previewData.rows.length === 0) return "No data available.";
    
    const totalRevenue = previewData.rows.reduce((sum, row) => 
      sum + safeNumber(row.revenue || row.total_revenue), 0);
    
    const totalAppointments = previewData.rows.reduce((sum, row) => 
      sum + safeNumber(row.appointments || row.total_appointments), 0);
    
    const avgRevenue = totalRevenue / Math.max(totalAppointments, 1);
    
    return `The report covers ${totalAppointments} appointments generating $${totalRevenue.toFixed(2)} in total revenue, with an average of $${avgRevenue.toFixed(2)} per appointment.`;
  };

  return (
    <Paper elevation={2} sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Key Insights
      </Typography>
      <Typography paragraph>
        {generateInsightsText()}
      </Typography>
    </Paper>
  );
};

export default ReportInsights;