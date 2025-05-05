import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Box, Typography, CircularProgress, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

const StylistRevenueChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState('weekly');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5001/api/revenue/by-stylist?range=${period}`);
        setData(response.data.data);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching stylist revenue:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [period]);

  return (
    <Box sx={{ p: 2, height: 400 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Stylist Revenue Contribution</Typography>
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
        <Box display="flex" justifyContent="center" alignItems="center" height="100%">
          <CircularProgress />
        </Box>
      ) : data.length === 0 ? (
        <Typography align="center">No stylist data available</Typography>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 60 }}
            layout="vertical"
          >
            <XAxis type="number" />
            <YAxis 
              dataKey="stylist_name" 
              type="category" 
              width={100}
              tick={{ fontSize: 12 }}
            />
            <Tooltip 
              formatter={(value) => [`$${value.toFixed(2)}`, 'Revenue']}
              labelFormatter={(label) => `Stylist: ${label}`}
            />
            <Bar dataKey="revenue" fill="#8884d8" name="Revenue" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </Box>
  );
};

export default StylistRevenueChart;