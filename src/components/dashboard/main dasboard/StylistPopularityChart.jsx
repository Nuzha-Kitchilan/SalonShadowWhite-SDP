import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip
} from 'recharts';
import {
  Card, CardHeader, CardContent, Box, Typography,
  CircularProgress, MenuItem, Select, FormControl,
  InputLabel, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, ToggleButton,
  ToggleButtonGroup
} from '@mui/material';
import { People, TableChart, PieChart as PieChartIcon } from '@mui/icons-material';

// New vibrant color palette
const COLORS = [
  '#FF6B6B', // Coral
  '#4ECDC4', // Tiffany Blue
  '#45B7D1', // Sky Blue
  '#FFBE0B', // Golden Yellow
  '#FB5607', // Orange
  '#8338EC', // Purple
  '#3A86FF', // Azure
  '#FF006E', // Pink
  '#A5DD9B', // Mint Green
  '#F9C74F'  // Mustard
];

const StylistPopularityChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState('monthly');
  const [view, setView] = useState('chart');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5001/api/dashboard/stylists/popularity?period=${period}`);
        setData(response.data);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching stylist popularity:', err);
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
    <Card sx={{ width: 450 }}>
      <CardHeader
        title={
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="subtitle1" fontWeight="bold">Stylist Popularity</Typography>
            <Box display="flex" alignItems="center" gap={1}>
              <FormControl size="small" sx={{ minWidth: 100 }}>
                <InputLabel>Period</InputLabel>
                <Select
                  value={period}
                  label="Period"
                  onChange={handlePeriodChange}
                  size="small"
                >
                  <MenuItem value="weekly">Weekly</MenuItem>
                  <MenuItem value="monthly">Monthly</MenuItem>
                  <MenuItem value="yearly">Yearly</MenuItem>
                </Select>
              </FormControl>
              
              <ToggleButtonGroup
                value={view}
                exclusive
                onChange={handleViewChange}
                size="small"
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
        }
        avatar={<People />}
        sx={{ 
          bgcolor: 'primary.main', 
          color: 'primary.contrastText',
          py: 1
        }}
      />
      <CardContent sx={{ p: 1, height: '260px' }}>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="100%">
            <CircularProgress size={40} />
          </Box>
        ) : error ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="100%">
            <Typography color="error" variant="body2">Error: {error}</Typography>
          </Box>
        ) : data.length === 0 ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="100%">
            <Typography variant="body2">No stylist data available</Typography>
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
                  nameKey="stylist_name"
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
                />
                <Legend 
                  layout="horizontal" 
                  verticalAlign="bottom" 
                  align="center"
                  wrapperStyle={{ fontSize: '0.75rem', marginTop: '5px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        ) : (
          <TableContainer component={Paper} sx={{ height: '100%', maxHeight: '250px' }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', py: 0.5 }}>Stylist</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold', py: 0.5 }}>Bookings</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 'bold', py: 0.5 }}>%</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((row) => (
                  <TableRow key={row.stylist_name} hover>
                    <TableCell sx={{ py: 0.5 }}>{row.stylist_name}</TableCell>
                    <TableCell align="right" sx={{ py: 0.5 }}>{row.count}</TableCell>
                    <TableCell align="right" sx={{ py: 0.5 }}>{row.percentage}%</TableCell>
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

export default StylistPopularityChart;