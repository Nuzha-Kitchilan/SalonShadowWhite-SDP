import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Box, Typography, Select, MenuItem, Card, CardContent } from '@mui/material';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const RevenueByServiceChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState('weekly');

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
    return (
      <Card sx={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '8px',
        border: '1px solid rgba(190, 175, 155, 0.3)',
        boxShadow: 'none',
        background: 'linear-gradient(135deg, rgba(190,175,155,0.3), rgba(255,255,255,0.9))'
      }}>
        <CardContent>
          <Typography sx={{ fontFamily: "'Poppins', 'Roboto', sans-serif" }}>Loading...</Typography>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card sx={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '8px',
        border: '1px solid rgba(190, 175, 155, 0.3)',
        boxShadow: 'none',
        background: 'linear-gradient(135deg, rgba(190,175,155,0.3), rgba(255,255,255,0.9))'
      }}>
        <CardContent>
          <Typography color="error.main" sx={{ fontFamily: "'Poppins', 'Roboto', sans-serif" }}>Error: {error}</Typography>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card sx={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '8px',
        border: '1px solid rgba(190, 175, 155, 0.3)',
        boxShadow: 'none',
        background: 'linear-gradient(135deg, rgba(190,175,155,0.3), rgba(255,255,255,0.9))'
      }}>
        <CardContent>
          <Typography sx={{ fontFamily: "'Poppins', 'Roboto', sans-serif" }}>No revenue data available</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{
      height: '100%',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      borderRadius: '8px',
      border: '1px solid rgba(190, 175, 155, 0.3)',
      boxShadow: 'none',
      background: 'linear-gradient(135deg, rgba(190,175,155,0.3), rgba(255,255,255,0.9))',
      maxHeight: 520,
      overflow: 'auto'
    }}>
      <CardContent sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Box>
            <Typography 
              variant="subtitle1" 
              color="#666666"
              sx={{ 
                fontFamily: "'Poppins', 'Roboto', sans-serif", 
                fontWeight: 600 
              }}
            >
              Revenue by Service
            </Typography>
            <Typography 
              variant="body2" 
              color="#453C33"
              sx={{ fontFamily: "'Poppins', 'Roboto', sans-serif" }}
            >
              Total: ${totalRevenue.toFixed(2)} • {period.charAt(0).toUpperCase() + period.slice(1)}
            </Typography>
          </Box>
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
              color: '#453C33',
              minWidth: 120
            }}
          >
            <MenuItem value="weekly" sx={{ fontSize: '0.875rem', fontFamily: "'Poppins', 'Roboto', sans-serif" }}>Weekly</MenuItem>
            <MenuItem value="monthly" sx={{ fontSize: '0.875rem', fontFamily: "'Poppins', 'Roboto', sans-serif" }}>Monthly</MenuItem>
            <MenuItem value="yearly" sx={{ fontSize: '0.875rem', fontFamily: "'Poppins', 'Roboto', sans-serif" }}>Yearly</MenuItem>
          </Select>
        </Box>

        <Box flex={1} minHeight={0} mb={2}>
          <ResponsiveContainer width="100%" height={200}>
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

        <Box pt={2} sx={{ borderTop: '1px solid rgba(190, 175, 155, 0.5)' }}>
          <Typography 
            variant="subtitle2" 
            sx={{ 
              fontWeight: 600, 
              mb: 1, 
              fontFamily: "'Poppins', 'Roboto', sans-serif",
              color: '#453C33'
            }}
          >
            Service Breakdown:
          </Typography>
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
                    maxWidth: '60%',
                    fontFamily: "'Poppins', 'Roboto', sans-serif",
                    fontWeight: 500
                  }}
                >
                  {item.category}
                </Typography>
                <Typography 
                  variant="body2"
                  sx={{ 
                    fontFamily: "'Poppins', 'Roboto', sans-serif",
                    color: '#453C33'
                  }}
                >
                  ${item.revenue.toFixed(2)} ({item.service_count} services)
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default RevenueByServiceChart;