import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Box, Typography, CircularProgress, Select, MenuItem } from '@mui/material';

const StylistRevenueChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState('weekly');

  // Brand color palette
  const barColors = ['#BEAF9B', '#A59787', '#8A7B6C', '#CDBEAE', '#7D6E5D'];

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

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Box sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          p: 1.5,
          border: '1px solid rgba(190, 175, 155, 0.5)',
          borderRadius: '4px',
          boxShadow: '0 2px 8px rgba(138, 123, 108, 0.2)',
          fontFamily: "'Poppins', 'Roboto', sans-serif",
        }}>
          <Typography 
            sx={{ 
              fontWeight: 600, 
              color: '#453C33',
              fontSize: '0.875rem',
              mb: 0.5
            }}
          >
            {label}
          </Typography>
          <Typography 
            sx={{ 
              color: '#666666',
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <Box
              component="span"
              sx={{
                display: 'inline-block',
                width: 10,
                height: 10,
                borderRadius: '50%',
                backgroundColor: payload[0].color,
                mr: 1
              }}
            />
            Revenue: ${payload[0].value.toFixed(2)}
          </Typography>
        </Box>
      );
    }
    return null;
  };

  return (
    <Box sx={{ 
      p: 2, 
      height: 400,
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
          Stylist Revenue Contribution
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
        <Box display="flex" justifyContent="center" alignItems="center" height="80%">
          <CircularProgress sx={{ color: '#BEAF9B' }} />
        </Box>
      ) : data.length === 0 ? (
        <Typography 
          align="center"
          sx={{ 
            fontFamily: "'Poppins', 'Roboto', sans-serif",
            color: '#666666',
            mt: 8
          }}
        >
          No stylist data available
        </Typography>
      ) : (
        <Box 
          sx={{ 
            height: "calc(100% - 50px)", 
            p: 1,
            borderRadius: '4px',
            backgroundColor: 'rgba(255, 255, 255, 0.6)',
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 30 }}
              layout="vertical"
              barSize={28}
            >
              <XAxis 
                type="number" 
                tickFormatter={(value) => `$${value}`}
                tick={{ 
                  fontSize: 12, 
                  fontFamily: "'Poppins', 'Roboto', sans-serif",
                  fill: '#666666'
                }}
                axisLine={{ stroke: 'rgba(190, 175, 155, 0.5)' }}
                tickLine={{ stroke: 'rgba(190, 175, 155, 0.5)' }}
                domain={[0, 'dataMax + 500']}
              />
              <YAxis 
                dataKey="stylist_name" 
                type="category" 
                width={120}
                tick={{ 
                  fontSize: 12, 
                  fontFamily: "'Poppins', 'Roboto', sans-serif",
                  fill: '#453C33'
                }}
                axisLine={{ stroke: 'rgba(190, 175, 155, 0.5)' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="revenue" 
                name="Revenue"
                radius={[0, 4, 4, 0]}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={barColors[index % barColors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Box>
      )}
    </Box>
  );
};

export default StylistRevenueChart;