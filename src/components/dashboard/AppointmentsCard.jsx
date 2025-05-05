import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Select, MenuItem, Box } from '@mui/material';

const AppointmentsCard = () => {
  const [period, setPeriod] = useState('daily');
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!period) return;

    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:5001/api/dashboard/appointments/count/${period}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || 'Network response was not ok');
        }

        setCount(data.count);
        setError(null);
      } catch (error) {
        console.error('Fetch error:', error);
        setError(error.message || 'Failed to load data');
        setCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [period]);

  return (
    <Card sx={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <CardContent sx={{ p: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="subtitle1" color="text.secondary">
            Appointments
          </Typography>
          <Select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            size="small"
            disabled={loading}
            sx={{ 
              height: 30,
              fontSize: '0.875rem',
              '& .MuiSelect-select': { py: 0.5 }
            }}
          >
            <MenuItem value="daily" sx={{ fontSize: '0.875rem' }}>Daily</MenuItem>
            <MenuItem value="weekly" sx={{ fontSize: '0.875rem' }}>Weekly</MenuItem>
            <MenuItem value="monthly" sx={{ fontSize: '0.875rem' }}>Monthly</MenuItem>
            <MenuItem value="yearly" sx={{ fontSize: '0.875rem' }}>Yearly</MenuItem>
          </Select>
        </Box>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          {loading ? '...' : error ? 'Error' : count}
        </Typography>
        {error && (
          <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
            {error}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default AppointmentsCard;