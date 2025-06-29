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
    <Card sx={{
      height: '100%',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      borderRadius: '8px',
      border: '1px solid rgba(190, 175, 155, 0.3)',
      boxShadow: 'none',
      background: 'linear-gradient(135deg, rgba(190,175,155,0.3), rgba(255,255,255,0.9))'
    }}>
      <CardContent sx={{ p: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography
            variant="subtitle1"
            color="#666666"
            sx={{ fontFamily: "'Poppins', 'Roboto', sans-serif", fontWeight: 600 }}
          >
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
              '& .MuiSelect-select': { py: 0.5 },
              '&.MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'rgba(190, 175, 155, 0.5)',
                },
                '&:hover fieldset': {
                  borderColor: '#BEAF9B',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#BEAF9B',
                },
              },
              color: '#453C33'
            }}
          >
            <MenuItem value="daily" sx={{ fontSize: '0.875rem', fontFamily: "'Poppins', 'Roboto', sans-serif" }}>Daily</MenuItem>
            <MenuItem value="weekly" sx={{ fontSize: '0.875rem', fontFamily: "'Poppins', 'Roboto', sans-serif" }}>Weekly</MenuItem>
            <MenuItem value="monthly" sx={{ fontSize: '0.875rem', fontFamily: "'Poppins', 'Roboto', sans-serif" }}>Monthly</MenuItem>
            <MenuItem value="yearly" sx={{ fontSize: '0.875rem', fontFamily: "'Poppins', 'Roboto', sans-serif" }}>Yearly</MenuItem>
          </Select>
        </Box>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            fontFamily: "'Poppins', 'Roboto', sans-serif",
            color: '#453C33'
          }}
        >
          {loading ? '...' : error ? 'Error' : count}
        </Typography>
        {error && (
          <Typography
            variant="caption"
            color="error"
            sx={{
              mt: 0.5,
              fontFamily: "'Poppins', 'Roboto', sans-serif"
            }}
          >
            {error}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default AppointmentsCard;
