// ReportCharts.jsx
import React, { useMemo } from 'react';
import { Grid, Paper, Typography } from '@mui/material';
import { Chart } from 'react-chartjs-2';
import 'chart.js/auto';

const ReportCharts = ({ reportConfig, previewData }) => {
  const generateChartData = useMemo(() => {
    if (!previewData) return null;
    
    const data = previewData.rows || [];
    if (data.length === 0) {
      return {
        labels: [],
        datasets: [{
          label: 'Revenue',
          data: [],
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      };
    }
    
    const isComparison = reportConfig.reportType === 'comparison';
    
    if (reportConfig.reportType === 'trend') {
      return {
        labels: data.map(item => item.period_label || ''),
        datasets: [
          {
            label: 'Revenue',
            data: data.map(item => {
              const revenue = Number(item.revenue || 0);
              return isNaN(revenue) ? 0 : revenue;
            }),
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
            yAxisID: 'y',
          },
          {
            label: '7-Period Moving Avg',
            data: data.map(item => {
              const movingAvg = Number(item.moving_avg_7 || 0); 
              return isNaN(movingAvg) ? 0 : movingAvg;
            }),
            borderColor: 'rgb(153, 102, 255)',
            backgroundColor: 'rgba(153, 102, 255, 0.5)',
            borderDash: [5, 5],
            yAxisID: 'y',
          },
          {
            label: 'Growth Rate (%)',
            data: data.map(item => {
              const growthRate = Number(item.growth_rate || 0);
              return isNaN(growthRate) ? 0 : growthRate;
            }),
            borderColor: 'rgb(255, 159, 64)',
            backgroundColor: 'rgba(255, 159, 64, 0.5)',
            yAxisID: 'y1',
            type: 'line'
          }
        ]
      };
    }
    
    if (reportConfig.reportType === 'stylist') {
      return {
        labels: data.map(item => item.stylist_name || 'Unknown'),
        datasets: [
          {
            label: 'Revenue',
            data: data.map(item => {
              const revenue = Number(item.total_revenue || 0);
              return isNaN(revenue) ? 0 : revenue;
            }),
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          }
        ]
      };
    }
    
    return {
      labels: data.map(item => item.period_label || item.service_name || item.stylist_name || 'Unknown'),
      datasets: [
        {
          label: 'Revenue',
          data: data.map(item => {
            const revenue = Number(item.revenue || item.total_revenue || 0);
            return isNaN(revenue) ? 0 : revenue;
          }),
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }
      ]
    };
  }, [previewData, reportConfig.reportType]);

  if (!generateChartData) return null;

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={reportConfig.reportType === 'trend' ? 12 : 8}>
        <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
          <Typography variant="h6" gutterBottom>
            {reportConfig.reportType === 'comparison' ? 'Period Comparison' : 
             reportConfig.reportType === 'trend' ? 'Revenue Trend Analysis' :
             reportConfig.reportType === 'stylist' ? 'Stylist Performance' :
             'Revenue Overview'}
          </Typography>
          <Chart
            type={reportConfig.reportType === 'stylist' ? 'bar' : 'line'}
            data={generateChartData}
            options={{
              responsive: true,
              scales: reportConfig.reportType === 'trend' ? {
                y: {
                  type: 'linear',
                  display: true,
                  position: 'left',
                  title: { display: true, text: 'Revenue ($)' }
                },
                y1: {
                  type: 'linear',
                  display: true,
                  position: 'right',
                  title: { display: true, text: 'Growth Rate (%)' },
                  grid: { drawOnChartArea: false }
                }
              } : undefined
            }}
          />
        </Paper>
      </Grid>
      
      {reportConfig.reportType !== 'trend' && previewData.serviceChartData && (
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              {reportConfig.reportType === 'stylist' ? 'Services Distribution' : 'Revenue Breakdown'}
            </Typography>
            <Chart
              type={reportConfig.reportType === 'stylist' ? 'pie' : 'doughnut'}
              data={previewData.serviceChartData}
              options={{ responsive: true }}
            />
          </Paper>
        </Grid>
      )}
    </Grid>
  );
};

export default ReportCharts;