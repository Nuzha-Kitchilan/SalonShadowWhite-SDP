// ReportMetrics.jsx
import React from 'react';
import { Grid, Paper, Typography } from '@mui/material';

const ReportMetrics = ({ previewData }) => {
  if (!previewData || !previewData.metrics) return null;
  
  const current_total = Number(previewData.metrics.current_total || 0);
  const previous_total = Number(previewData.metrics.previous_total || 0);
  const yoy_total = Number(previewData.metrics.yoy_total || 0);
  
  const prevPeriodChange = previous_total ? ((current_total - previous_total) / previous_total) * 100 : 0;
  const yoyChange = yoy_total ? ((current_total - yoy_total) / yoy_total) * 100 : 0;
  
  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      <Grid item xs={4}>
        <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="h6">Current Period</Typography>
          <Typography variant="h4" sx={{ my: 1 }}>${current_total.toFixed(2)}</Typography>
          <Typography variant="body2">Total Revenue</Typography>
        </Paper>
      </Grid>
      <Grid item xs={4}>
        <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="h6">Vs Previous Period</Typography>
          <Typography 
            variant="h4" 
            sx={{ my: 1, color: prevPeriodChange >= 0 ? 'success.main' : 'error.main' }}
          >
            {prevPeriodChange.toFixed(1)}%
          </Typography>
          <Typography variant="body2">Change</Typography>
        </Paper>
      </Grid>
      <Grid item xs={4}>
        <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
          <Typography variant="h6">Year Over Year</Typography>
          <Typography 
            variant="h4" 
            sx={{ my: 1, color: yoyChange >= 0 ? 'success.main' : 'error.main' }}
          >
            {yoyChange.toFixed(1)}%
          </Typography>
          <Typography variant="body2">Change</Typography>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default ReportMetrics;