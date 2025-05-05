import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Box, Typography, Select, MenuItem, Paper, useTheme } from '@mui/material';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const RevenueByServiceChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState('weekly');
  const theme = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const response = await fetch(`http://localhost:5001/api/revenue/by-service?range=${period}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const result = await response.json();
        
        const formattedData = result.data.map(item => ({
          ...item,
          revenue: parseFloat(item.revenue),
          service_count: parseInt(item.service_count)
        }));
        
        setData(formattedData);
        setError(null);
      } catch (err) {
        console.error('Error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [period]);

  const totalRevenue = data.reduce((sum, item) => sum + (item.revenue || 0), 0);

  if (loading) {
    return <Box display="flex" justifyContent="center" p={4}>Loading...</Box>;
  }

  if (error) {
    return <Box color="error.main" p={2}>Error: {error}</Box>;
  }

  if (!data || data.length === 0) {
    return <Box p={2}>No revenue data available</Box>;
  }

  return (
    <Paper elevation={3} sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', maxHeight: 500, overflow: 'auto' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h6" fontWeight="bold">Revenue by Service</Typography>
          <Typography variant="body2" color="text.secondary">
            Total: ${totalRevenue.toFixed(2)} • {period.charAt(0).toUpperCase() + period.slice(1)}
          </Typography>
        </Box>
        <Select
          size="small"
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          sx={{ minWidth: 120 }}
        >
          <MenuItem value="weekly">Weekly</MenuItem>
          <MenuItem value="monthly">Monthly</MenuItem>
          <MenuItem value="yearly">Yearly</MenuItem>
        </Select>
      </Box>

      <Box flex={1} minHeight={0}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={80}
              fill="#8884d8"
              dataKey="revenue"
              nameKey="category"
              label={({ name, percent }) => `${name.split(' ')[0]}: ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value) => [`$${value.toFixed(2)}`, 'Revenue']}
              labelFormatter={(label) => `Service: ${label}`}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </Box>

      <Box mt={3} pt={2} borderTop={`1px solid ${theme.palette.divider}`}>
        <Typography variant="subtitle2" fontWeight="bold" mb={1}>Service Breakdown:</Typography>
        <Box sx={{ maxHeight: 120, overflow: 'auto' }}>
          {data.map((item, index) => (
            <Box 
              key={index} 
              display="flex" 
              justifyContent="space-between"
              alignItems="center"
              mb={1}
              sx={{
                '&:last-child': { mb: 0 }
              }}
            >
              <Typography 
                variant="body2" 
                sx={{ 
                  color: COLORS[index % COLORS.length],
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  maxWidth: '60%'
                }}
              >
                {item.category}
              </Typography>
              <Typography variant="body2">
                ${item.revenue.toFixed(2)} ({item.service_count} services)
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Paper>
  );
};

export default RevenueByServiceChart;
