// ReportConfigForm.jsx
import React from 'react';
import { 
  Box, Button, Grid, Paper, 
  FormControl, InputLabel, Select, MenuItem 
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { BarChart, Download } from '@mui/icons-material';
import { CircularProgress } from '@mui/material';

const reportTypes = [
  { value: 'summary', label: 'Summary', icon: <BarChart /> },
  { value: 'detailed', label: 'Detailed', icon: <BarChart /> },
  { value: 'trend', label: 'Trend Analysis', icon: <BarChart /> },
  { value: 'comparison', label: 'Period Comparison', icon: <BarChart /> },
  { value: 'stylist', label: 'Stylist Performance', icon: <BarChart /> }
];

const groupByOptions = [
  { value: 'day', label: 'Daily' },
  { value: 'week', label: 'Weekly' },
  { value: 'month', label: 'Monthly' },
  { value: 'quarter', label: 'Quarterly' },
  { value: 'year', label: 'Yearly' }
];

const ReportConfigForm = ({ 
  reportConfig, 
  setReportConfig, 
  handlePreview, 
  handleDownload, 
  loading, 
  previewData 
}) => {
  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <DatePicker
            label="Start Date"
            value={reportConfig.startDate}
            onChange={(newValue) => setReportConfig({...reportConfig, startDate: newValue})}
            renderInput={(params) => <TextField {...params} fullWidth />}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <DatePicker
            label="End Date"
            value={reportConfig.endDate}
            onChange={(newValue) => setReportConfig({...reportConfig, endDate: newValue})}
            renderInput={(params) => <TextField {...params} fullWidth />}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <FormControl fullWidth>
            <InputLabel>Report Type</InputLabel>
            <Select
              value={reportConfig.reportType}
              onChange={(e) => setReportConfig({...reportConfig, reportType: e.target.value})}
              label="Report Type"
            >
              {reportTypes.map((type) => (
                <MenuItem key={type.value} value={type.value}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {type.icon}
                    {type.label}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={3}>
          <FormControl fullWidth>
            <InputLabel>Group By</InputLabel>
            <Select
              value={reportConfig.groupBy}
              onChange={(e) => setReportConfig({...reportConfig, groupBy: e.target.value})}
              label="Group By"
              disabled={reportConfig.reportType === 'stylist'}
            >
              {groupByOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      
      <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
        <Button
          variant="contained"
          color="primary"
          startIcon={loading ? <CircularProgress size={20} /> : <BarChart />}
          onClick={handlePreview}
          disabled={loading}
        >
          Generate Report
        </Button>
        
        <Button
          variant="contained"
          color="success"
          startIcon={loading ? <CircularProgress size={20} /> : <Download />}
          onClick={() => handleDownload('pdf')}
          disabled={loading || !previewData}
          sx={{ ml: 2 }}
        >
          Download PDF
        </Button>
        
        <Button
          variant="outlined"
          color="primary"
          startIcon={loading ? <CircularProgress size={20} /> : <Download />}
          onClick={() => handleDownload('csv')}
          disabled={loading || !previewData}
        >
          Download CSV
        </Button>
      </Box>
    </Paper>
  );
};

export default ReportConfigForm;