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
import { CalendarToday} from '@mui/icons-material';

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
    <Paper 
      elevation={0} 
      sx={{ 
        p: 2, 
        height: 300, 
        borderRadius: '8px',
        border: '1px solid rgba(190, 175, 155, 0.2)',
        background: 'linear-gradient(to right, rgba(190, 175, 155, 0.4), rgba(255, 255, 255, 0.95))'
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
        <Typography 
          variant="subtitle1" 
          fontWeight={600}
          sx={{ 
            fontFamily: "'Poppins', 'Roboto', sans-serif",
            color: '#453C33'
          }}
        >
          Top Customers
        </Typography>
        <FormControl size="small" sx={{ minWidth: 100 }}>
          <InputLabel sx={{ 
            fontFamily: "'Poppins', 'Roboto', sans-serif",
            color: '#666666',
            '&.Mui-focused': {
              color: '#BEAF9B'
            }
          }}>
            Period
          </InputLabel>
          <Select 
            value={period} 
            label="Period" 
            onChange={e => setPeriod(e.target.value)}
            sx={{
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
              color: '#453C33',
              fontFamily: "'Poppins', 'Roboto', sans-serif"
            }}
          >
            <MenuItem value="weekly" sx={{ fontSize: '0.875rem', fontFamily: "'Poppins', 'Roboto', sans-serif" }}>Weekly</MenuItem>
            <MenuItem value="monthly" sx={{ fontSize: '0.875rem', fontFamily: "'Poppins', 'Roboto', sans-serif" }}>Monthly</MenuItem>
            <MenuItem value="yearly" sx={{ fontSize: '0.875rem', fontFamily: "'Poppins', 'Roboto', sans-serif" }}>Yearly</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" height={100}>
          <CircularProgress size={24} sx={{ color: '#BEAF9B' }} />
        </Box>
      ) : error ? (
        <Typography 
          color="error" 
          align="center" 
          variant="body2"
          sx={{ fontFamily: "'Poppins', 'Roboto', sans-serif" }}
        >
          {error}
        </Typography>
      ) : data.length === 0 ? (
        <Typography 
          align="center" 
          variant="body2"
          sx={{ 
            color: '#666666',
            fontFamily: "'Poppins', 'Roboto', sans-serif" 
          }}
        >
          No customer data available
        </Typography>
      ) : (
        <Grid container spacing={1}>
          {data.slice(0, 3).map((c, i) => (
            <Grid item xs={12} key={c.customer_ID}>
              <Card 
                variant="outlined" 
                sx={{ 
                  p: 1,
                  borderColor: 'rgba(190, 175, 155, 0.3)',
                  borderRadius: '6px',
                  '&:hover': {
                    borderColor: '#BEAF9B',
                    backgroundColor: 'rgba(190, 175, 155, 0.05)'
                  },
                  transition: 'all 0.2s'
                }}
              >
                <Box display="flex" alignItems="center" mb={0.5}>
                  <Avatar sx={{ 
                    bgcolor: i === 0 ? 'rgba(255, 215, 0, 0.8)' : i === 1 ? 'rgba(192, 192, 192, 0.8)' : 'rgba(205, 127, 50, 0.8)', 
                    width: 28, 
                    height: 28, 
                    fontSize: 14, 
                    mr: 1,
                    fontFamily: "'Poppins', 'Roboto', sans-serif"
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
                        textOverflow: 'ellipsis',
                        fontFamily: "'Poppins', 'Roboto', sans-serif",
                        color: '#453C33',
                        fontWeight: 600
                      }}
                    >
                      {c.customer_name}
                    </Typography>
                  </Tooltip>
                </Box>
                <Box display="flex" justifyContent="space-between" fontSize={12}>
                  <Box display="flex" alignItems="center">
                    <CalendarToday sx={{ fontSize: 16, mr: 0.5, color: '#BEAF9B' }} />
                    <Typography 
                      variant="caption"
                      sx={{ 
                        fontFamily: "'Poppins', 'Roboto', sans-serif",
                        color: '#666666'
                      }}
                    >
                      {c.booking_count} bookings
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center">

                    <Typography 
                      variant="caption"
                      sx={{ 
                        fontFamily: "'Poppins', 'Roboto', sans-serif",
                        color: '#666666'
                      }}
                    >
                      Rs.{c.total_spent.toFixed(2)}
                    </Typography>
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