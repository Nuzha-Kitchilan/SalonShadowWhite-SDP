import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, CircularProgress, Select, MenuItem, FormControl } from '@mui/material';
import { AttachMoney, People, Receipt } from '@mui/icons-material';

const AverageTicketCard = () => {
  const [data, setData] = useState({
    average: 0,
    count: 0,
    total: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState('weekly');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/revenue/average-ticket?range=${period}`);
        setData(response.data.data);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching average ticket:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [period]);

  return (
    <Box sx={{ 
      p: 0, 
      height: '100%', 
      borderRadius: '8px',
      border: '1px solid rgba(190, 175, 155, 0.3)',
      boxShadow: 'none',
      background: 'linear-gradient(135deg, rgba(190,175,155,0.3), rgba(255,255,255,0.9))'
    }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography 
          variant="subtitle1" 
          sx={{ 
            fontFamily: "'Poppins', 'Roboto', sans-serif", 
            fontWeight: 600,
            color: '#666666'
          }}
        >
          Average Ticket Value
        </Typography>
        <Select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          size="small"
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

      {error ? (
        <Typography 
          color="error" 
          align="center"
          sx={{ 
            fontFamily: "'Poppins', 'Roboto', sans-serif",
            color: '#d32f2f'
          }}
        >
          Error loading data: {error}
        </Typography>
      ) : loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" height="70%">
          <CircularProgress sx={{ color: '#BEAF9B' }} />
        </Box>
      ) : (
        <Box>
          <Box display="flex" alignItems="center" mb={2}>
            <AttachMoney sx={{ mr: 1, color: '#BEAF9B', fontSize: 32 }} />
            <Typography 
              variant="h4" 
              sx={{ 
                fontFamily: "'Poppins', 'Roboto', sans-serif",
                fontWeight: 600,
                color: '#453C33'
              }}
            >
              Rs.{data.average.toFixed(2)}
            </Typography>
          </Box>
          <Box display="flex" justifyContent="space-between">
            <Box display="flex" alignItems="center">
              <People sx={{ mr: 1, fontSize: 16, color: '#8A7B6C' }} />
              <Typography 
                variant="body2"
                sx={{ 
                  fontFamily: "'Poppins', 'Roboto', sans-serif",
                  color: '#666666'
                }}
              >
                {data.count} transactions
              </Typography>
            </Box>
            <Box display="flex" alignItems="center">
              <Receipt sx={{ mr: 1, fontSize: 16, color: '#8A7B6C' }} />
              <Typography 
                variant="body2"
                sx={{ 
                  fontFamily: "'Poppins', 'Roboto', sans-serif",
                  color: '#666666'
                }}
              >
                Rs.{data.total.toFixed(2)} total
              </Typography>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default AverageTicketCard;