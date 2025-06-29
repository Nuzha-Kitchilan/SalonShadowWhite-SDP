import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Box, Typography, Select, MenuItem, Card, CardContent, useTheme } from '@mui/material';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC0CB', '#A4DE6C'];

const RevenueByServiceChart = () => {
  const theme = useTheme();
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

  const renderCustomizedLabel = ({ name, percent, x, y, midAngle, innerRadius, outerRadius }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const xPos = x + Math.cos(-midAngle * Math.PI / 180) * radius;
    const yPos = y + Math.sin(-midAngle * Math.PI / 180) * radius;

    return (
      <text 
        x={xPos} 
        y={yPos} 
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        style={{
          fontSize: '12px',
          fontWeight: 'bold',
          fontFamily: "'Poppins', 'Roboto', sans-serif"
        }}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  if (loading) {
    return (
      <Card sx={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '12px',
        border: '1px solid rgba(190, 175, 155, 0.3)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
        background: 'linear-gradient(135deg, rgba(190,175,155,0.1), rgba(255,255,255,0.9))'
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
        borderRadius: '12px',
        border: '1px solid rgba(190, 175, 155, 0.3)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
        background: 'linear-gradient(135deg, rgba(190,175,155,0.1), rgba(255,255,255,0.9))'
      }}>
        <CardContent>
          <Typography color="error.main" sx={{ fontFamily: "'Poppins', 'Roboto', sans-serif" }}>
            Error: {error}
          </Typography>
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
        borderRadius: '12px',
        border: '1px solid rgba(190, 175, 155, 0.3)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
        background: 'linear-gradient(135deg, rgba(190,175,155,0.1), rgba(255,255,255,0.9))'
      }}>
        <CardContent>
          <Typography sx={{ fontFamily: "'Poppins', 'Roboto', sans-serif" }}>
            No revenue data available
          </Typography>
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
      borderRadius: '12px',
      border: '1px solid rgba(190, 175, 155, 0.3)',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
      background: 'linear-gradient(135deg, rgba(190,175,155,0.1), rgba(255,255,255,0.9))',
      maxHeight: 520,
      overflow: 'hidden'
    }}>
      <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Box>
            <Typography 
              variant="h6" 
              color={theme.palette.text.primary}
              sx={{ 
                fontFamily: "'Poppins', 'Roboto', sans-serif", 
                fontWeight: 600,
                mb: 0.5
              }}
            >
              Revenue by Service
            </Typography>
            <Typography 
              variant="subtitle2" 
              color={theme.palette.text.secondary}
              sx={{ fontFamily: "'Poppins', 'Roboto', sans-serif" }}
            >
              Total: Rs.{totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} • {period.charAt(0).toUpperCase() + period.slice(1)}
            </Typography>
          </Box>
          <Select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            size="small"
            sx={{
              height: 36,
              fontSize: '0.875rem',
              '& .MuiSelect-select': { py: 1 },
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
              color: theme.palette.text.primary,
              minWidth: 120,
              backgroundColor: theme.palette.background.paper
            }}
          >
            <MenuItem value="weekly" sx={{ fontSize: '0.875rem', fontFamily: "'Poppins', 'Roboto', sans-serif" }}>Weekly</MenuItem>
            <MenuItem value="monthly" sx={{ fontSize: '0.875rem', fontFamily: "'Poppins', 'Roboto', sans-serif" }}>Monthly</MenuItem>
            <MenuItem value="yearly" sx={{ fontSize: '0.875rem', fontFamily: "'Poppins', 'Roboto', sans-serif" }}>Yearly</MenuItem>
          </Select>
        </Box>

        <Box flex={1} minHeight={0} mb={2}>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={90}
                innerRadius={60}
                fill="#8884d8"
                dataKey="revenue"
                nameKey="category"
                label={renderCustomizedLabel}
                labelLine={false}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [`Rs.${value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 'Revenue']}
                labelFormatter={(label) => `Service: ${label}`}
                contentStyle={{
                  borderRadius: '8px',
                  border: 'none',
                  boxShadow: theme.shadows[3],
                  fontFamily: "'Poppins', 'Roboto', sans-serif"
                }}
              />
              <Legend 
                layout="vertical"
                verticalAlign="middle"
                align="right"
                wrapperStyle={{
                  paddingLeft: '20px',
                  overflowY: 'auto',
                  maxHeight: '200px'
                }}
                formatter={(value, entry, index) => (
                  <span style={{
                    color: theme.palette.text.primary,
                    fontFamily: "'Poppins', 'Roboto', sans-serif",
                    fontSize: '0.8rem'
                  }}>
                    {value}
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </Box>

        <Box pt={2} sx={{ borderTop: `1px solid ${theme.palette.divider}` }}>
          <Typography 
            variant="subtitle1" 
            sx={{ 
              fontWeight: 600, 
              mb: 1.5, 
              fontFamily: "'Poppins', 'Roboto', sans-serif",
              color: theme.palette.text.primary
            }}
          >
            Service Breakdown
          </Typography>
          <Box sx={{ maxHeight: 150, overflow: 'auto', pr: 1 }}>
            {data.map((item, index) => (
              <Box 
                key={index} 
                display="flex" 
                justifyContent="space-between"
                alignItems="center"
                mb={1.5}
                sx={{
                  '&:last-child': { mb: 0 }
                }}
              >
                <Box display="flex" alignItems="center">
                  <Box 
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: '2px',
                      backgroundColor: COLORS[index % COLORS.length],
                      mr: 1.5
                    }}
                  />
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: theme.palette.text.primary,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: { xs: '120px', sm: '180px' },
                      fontFamily: "'Poppins', 'Roboto', sans-serif",
                      fontWeight: 500
                    }}
                  >
                    {item.category}
                  </Typography>
                </Box>
                <Typography 
                  variant="body2"
                  sx={{ 
                    fontFamily: "'Poppins', 'Roboto', sans-serif",
                    color: theme.palette.text.secondary,
                    whiteSpace: 'nowrap'
                  }}
                >
                  Rs.{item.revenue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ({item.service_count} {item.service_count === 1 ? 'service' : 'services'})
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