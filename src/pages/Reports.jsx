import React, { useState } from 'react';
import { 
  Box,
  Button,
  Container,
  TextField,
  Typography,
  CircularProgress,
  Alert
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { Download } from '@mui/icons-material';

const RevenueReport = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setDate(new Date().getDate() - 30)),
    end: new Date()
  });

  const handleDownload = async (format) => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams({
        startDate: dateRange.start.toISOString().split('T')[0],
        endDate: dateRange.end.toISOString().split('T')[0],
        format
      });

      const response = await fetch(`http://localhost:5001/api/reports/revenue?${params}`);
      
      if (!response.ok) {
        throw new Error(await response.text());
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `revenue_report_${dateRange.start.toISOString().split('T')[0]}_to_${dateRange.end.toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Download error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ 
        mt: 4, 
        p: 3, 
        boxShadow: 1, 
        borderRadius: 2,
        backgroundColor: 'background.paper'
      }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
          Generate Revenue Report
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <DatePicker
            label="Start Date"
            value={dateRange.start}
            onChange={(newValue) => setDateRange({...dateRange, start: newValue})}
            renderInput={(params) => <TextField {...params} fullWidth />}
          />
          
          <DatePicker
            label="End Date"
            value={dateRange.end}
            onChange={(newValue) => setDateRange({...dateRange, end: newValue})}
            renderInput={(params) => <TextField {...params} fullWidth />}
          />
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={loading ? <CircularProgress size={20} /> : <Download />}
            onClick={() => handleDownload('pdf')}
            disabled={loading}
            sx={{ flex: 1 }}
          >
            PDF
          </Button>
          
          <Button
            variant="outlined"
            color="primary"
            startIcon={loading ? <CircularProgress size={20} /> : <Download />}
            onClick={() => handleDownload('csv')}
            disabled={loading}
            sx={{ flex: 1 }}
          >
            CSV
          </Button>
        </Box>
        
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </Box>
    </Container>
  );
};

export default RevenueReport;