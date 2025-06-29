import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip
} from 'recharts';
import { Equalizer } from '@mui/icons-material';
import TableChart from '@mui/icons-material/TableChart';
import PieChartIcon from '@mui/icons-material/PieChart';
import {
  Card, CardContent, Box, Typography,
  CircularProgress, MenuItem, Select, FormControl,
  InputLabel, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, ToggleButton,
  ToggleButtonGroup
} from '@mui/material';


const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const ServicePopularityChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState('monthly');
  const [view, setView] = useState('chart');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5001/api/dashboard/services/popularity?period=${period}`);
        setData(response.data);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching service popularity:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [period]);

  const handlePeriodChange = (event) => {
    setPeriod(event.target.value);
  };

  const handleViewChange = (event, newView) => {
    if (newView !== null) {
      setView(newView);
    }
  };

  return (
    <Card sx={{ 
      width: 450, 
      borderRadius: '8px',
      border: '1px solid rgba(190, 175, 155, 0.3)',
      boxShadow: 'none',
      background: 'linear-gradient(135deg, rgba(190,175,155,0.3), rgba(255,255,255,0.9))'
    }}>
      <Box
        display="flex" 
        alignItems="center" 
        justifyContent="space-between"
        px={2}
        py={1.5}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <Equalizer sx={{ color: '#666666' }} />
          <Typography 
            variant="subtitle1" 
            fontWeight={600}
            sx={{ 
              color: '#666666', 
              fontFamily: "'Poppins', 'Roboto', sans-serif" 
            }}
          >
            Service Popularity
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" gap={1}>
          <FormControl size="small" sx={{ minWidth: 100 }}>
            <Select
              value={period}
              onChange={handlePeriodChange}
              size="small"
              displayEmpty
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
          </FormControl>
          
          <ToggleButtonGroup
            value={view}
            exclusive
            onChange={handleViewChange}
            size="small"
            sx={{
              '& .MuiToggleButton-root': {
                borderColor: 'rgba(190, 175, 155, 0.5)',
                color: '#666666',
                '&.Mui-selected': {
                  backgroundColor: 'rgba(190, 175, 155, 0.2)',
                  color: '#453C33',
                },
                '&:hover': {
                  backgroundColor: 'rgba(190, 175, 155, 0.1)',
                }
              }
            }}
          >
            <ToggleButton value="chart" aria-label="chart view">
              <PieChartIcon fontSize="small" />
            </ToggleButton>
            <ToggleButton value="table" aria-label="table view">
              <TableChart fontSize="small" />
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Box>
      <CardContent sx={{ p: 1, height: '260px' }}>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="100%">
            <CircularProgress size={40} sx={{ color: '#BEAF9B' }} />
          </Box>
        ) : error ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="100%">
            <Typography 
              color="error" 
              variant="body2"
              sx={{ fontFamily: "'Poppins', 'Roboto', sans-serif" }}
            >
              Error: {error}
            </Typography>
          </Box>
        ) : data.length === 0 ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="100%">
            <Typography 
              variant="body2"
              sx={{ 
                color: '#666666',
                fontFamily: "'Poppins', 'Roboto', sans-serif" 
              }}
            >
              No service data available
            </Typography>
          </Box>
        ) : view === 'chart' ? (
          <Box sx={{ height: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={70}
                  fill="#8884d8"
                  dataKey="count"
                  nameKey="service_name"
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name, props) => [
                    `${value} (${props.payload.percentage}%)`,
                    name
                  ]}
                  contentStyle={{
                    borderRadius: '4px',
                    border: '1px solid rgba(190, 175, 155, 0.5)',
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    color: '#453C33',
                    fontFamily: "'Poppins', 'Roboto', sans-serif",
                    fontSize: '0.75rem'
                  }}
                />
                <Legend 
                  layout="horizontal" 
                  verticalAlign="bottom" 
                  align="center"
                  wrapperStyle={{ 
                    fontSize: '0.75rem', 
                    marginTop: '5px',
                    fontFamily: "'Poppins', 'Roboto', sans-serif",
                    color: '#453C33'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        ) : (
          <TableContainer 
            component={Paper} 
            sx={{ 
              height: '100%', 
              maxHeight: '250px',
              '& .MuiPaper-root': {
                boxShadow: 'none',
                border: '1px solid rgba(190, 175, 155, 0.3)',
              }
            }}
          >
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell 
                    sx={{ 
                      fontWeight: 600, 
                      py: 0.5,
                      color: '#666666',
                      fontFamily: "'Poppins', 'Roboto', sans-serif",
                      backgroundColor: 'rgba(190, 175, 155, 0.1)',
                      borderBottom: '1px solid rgba(190, 175, 155, 0.3)'
                    }}
                  >
                    Service
                  </TableCell>
                  <TableCell 
                    align="right" 
                    sx={{ 
                      fontWeight: 600, 
                      py: 0.5,
                      color: '#666666',
                      fontFamily: "'Poppins', 'Roboto', sans-serif",
                      backgroundColor: 'rgba(190, 175, 155, 0.1)',
                      borderBottom: '1px solid rgba(190, 175, 155, 0.3)'
                    }}
                  >
                    Count
                  </TableCell>
                  <TableCell 
                    align="right" 
                    sx={{ 
                      fontWeight: 600, 
                      py: 0.5,
                      color: '#666666',
                      fontFamily: "'Poppins', 'Roboto', sans-serif",
                      backgroundColor: 'rgba(190, 175, 155, 0.1)',
                      borderBottom: '1px solid rgba(190, 175, 155, 0.3)'
                    }}
                  >
                    %
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((row) => (
                  <TableRow 
                    key={row.service_name} 
                    hover
                    sx={{
                      '&:hover': {
                        backgroundColor: 'rgba(190, 175, 155, 0.05)',
                      },
                      '&:last-child td': {
                        borderBottom: 0,
                      }
                    }}
                  >
                    <TableCell 
                      sx={{ 
                        py: 0.5,
                        color: '#453C33',
                        fontFamily: "'Poppins', 'Roboto', sans-serif",
                        borderBottom: '1px solid rgba(190, 175, 155, 0.15)'
                      }}
                    >
                      {row.service_name}
                    </TableCell>
                    <TableCell 
                      align="right" 
                      sx={{ 
                        py: 0.5,
                        color: '#453C33',
                        fontFamily: "'Poppins', 'Roboto', sans-serif",
                        borderBottom: '1px solid rgba(190, 175, 155, 0.15)'
                      }}
                    >
                      {row.count}
                    </TableCell>
                    <TableCell 
                      align="right" 
                      sx={{ 
                        py: 0.5,
                        color: '#453C33',
                        fontFamily: ('Poppins', 'Roboto', 'sans-serif') ,
                        borderBottom: '1px solid rgba(190, 175, 155, 0.15)'
                      }}
                    >
                      {row.percentage}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default ServicePopularityChart;