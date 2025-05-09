import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Card,
  CardContent,
  Box,
  Typography,
  CircularProgress,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Avatar,
  Paper,
  Grid,
  Tooltip
} from '@mui/material';
import { CalendarToday, AttachMoney } from '@mui/icons-material';

const TopCustomersCard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState('weekly');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5001/api/dashboard/customer/topCustomers?period=${period}`);
        const processed = res.data.data?.map(item => ({
          ...item,
          booking_count: Number(item.booking_count) || 0,
          total_spent: Number(item.total_spent) || 0
        })) || [];
        setData(processed);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.error || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [period]);

  return (
    <Paper elevation={2} sx={{ p: 1, height: 300 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
        <Typography variant="subtitle1" fontWeight={600}>Top Customers</Typography>
        <FormControl size="small" sx={{ minWidth: 100 }}>
          <InputLabel>Period</InputLabel>
          <Select value={period} label="Period" onChange={e => setPeriod(e.target.value)}>
            <MenuItem value="weekly">Weekly</MenuItem>
            <MenuItem value="monthly">Monthly</MenuItem>
            <MenuItem value="yearly">Yearly</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" height={100}><CircularProgress size={24} /></Box>
      ) : error ? (
        <Typography color="error" align="center" variant="body2">{error}</Typography>
      ) : data.length === 0 ? (
        <Typography align="center" variant="body2">No customer data available</Typography>
      ) : (
        <Grid container spacing={1}>
          {data.slice(0, 3).map((c, i) => (
            <Grid item xs={12} key={c.customer_ID}>
              <Card variant="outlined" sx={{ p: 1 }}>
                <Box display="flex" alignItems="center" mb={0.5}>
                  <Avatar sx={{ 
                    bgcolor: i === 0 ? 'gold' : i === 1 ? 'silver' : '#cd7f32', // bronze color
                    width: 28, 
                    height: 28, 
                    fontSize: 14, 
                    mr: 1 
                  }}>
                    {i + 1}
                  </Avatar>
                  <Tooltip title={c.customer_name} placement="top">
                    <Typography 
                      variant="subtitle2" 
                      sx={{ 
                        maxWidth: '70%',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {c.customer_name}
                    </Typography>
                  </Tooltip>
                </Box>
                <Box display="flex" justifyContent="space-between" fontSize={12}>
                  <Box display="flex" alignItems="center">
                    <CalendarToday sx={{ fontSize: 16, mr: 0.5 }} />
                    <Typography variant="caption">{c.booking_count} bookings</Typography>
                  </Box>
                  <Box display="flex" alignItems="center">
                    <AttachMoney sx={{ fontSize: 16, mr: 0.5 }} />
                    <Typography variant="caption">${c.total_spent.toFixed(2)}</Typography>
                  </Box>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Paper>
  );
};

export default TopCustomersCard;