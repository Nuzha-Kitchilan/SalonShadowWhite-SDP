// RevenueCard.jsx
import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Select, MenuItem, Box } from '@mui/material';
import axios from 'axios';

const RevenueCard = () => {
  const [range, setRange] = useState('weekly');
  const [revenue, setRevenue] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5001/api/revenue?range=${range}`);
        const revenueValue = typeof res.data.revenue === 'number'
          ? res.data.revenue
          : parseFloat(res.data.revenue) || 0;
        setRevenue(revenueValue);
      } catch (err) {
        console.error('Failed to fetch revenue:', err);
        setRevenue(0);
      } finally {
        setLoading(false);
      }
    };
    fetchRevenue();
  }, [range]);

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
            Revenue
          </Typography>
          <Select
            value={range}
            onChange={(e) => setRange(e.target.value)}
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
          {loading ? '...' : `$${revenue.toFixed(2)}`}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default RevenueCard;
