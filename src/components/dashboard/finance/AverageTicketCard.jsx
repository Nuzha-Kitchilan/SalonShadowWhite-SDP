import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Typography, CircularProgress, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
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
    <Box sx={{ p: 2, height: '100%', bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Average Ticket Value</Typography>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Period</InputLabel>
          <Select value={period} label="Period" onChange={(e) => setPeriod(e.target.value)}>
            <MenuItem value="weekly">Weekly</MenuItem>
            <MenuItem value="monthly">Monthly</MenuItem>
            <MenuItem value="yearly">Yearly</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {error ? (
        <Typography color="error" align="center">
          Error loading data: {error}
        </Typography>
      ) : loading ? (
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      ) : (
        <Box>
          <Box display="flex" alignItems="center" mb={2}>
            <AttachMoney sx={{ mr: 1, color: 'primary.main', fontSize: 32 }} />
            <Typography variant="h4">${data.average.toFixed(2)}</Typography>
          </Box>
          <Box display="flex" justifyContent="space-between">
            <Box display="flex" alignItems="center">
              <People sx={{ mr: 1, fontSize: 16 }} />
              <Typography variant="body2">{data.count} transactions</Typography>
            </Box>
            <Box display="flex" alignItems="center">
              <Receipt sx={{ mr: 1, fontSize: 16 }} />
              <Typography variant="body2">${data.total.toFixed(2)} total</Typography>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default AverageTicketCard;