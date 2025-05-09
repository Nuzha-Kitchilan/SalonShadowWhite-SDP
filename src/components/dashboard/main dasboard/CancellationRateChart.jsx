import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  CircularProgress,
  useTheme
} from '@mui/material';
import {
  Cancel,
  CalendarToday,
  TrendingUp,
  TrendingDown
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';

const CancellationRateChart = () => {
  const [period, setPeriod] = useState('weekly');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();

  // const calculateMetrics = (dataArray) => {
  //   const totalCancelled = dataArray.reduce((sum, item) => sum + (item.cancelled || 0), 0);
  //   const totalBooked = dataArray.reduce((sum, item) => sum + (item.booked || 0), 0);
  //   const cancellationRate = totalBooked > 0 ? (totalCancelled / totalBooked) * 100 : 0;
  //   const trend = dataArray.length > 1
  //     ? dataArray[dataArray.length - 1].cancellation_rate - dataArray[0].cancellation_rate
  //     : 0;

  //   return {
  //     totalCancelled,
  //     totalBooked,
  //     cancellationRate,
  //     trend
  //   };
  // };



  const calculateMetrics = (dataArray) => {
    const latestPeriod = dataArray[dataArray.length - 1] || {};
    
    const totalCancelled = Number(latestPeriod.cancelled) || 0;
    const totalBooked = Number(latestPeriod.booked) || 0;
    const cancellationRate = Number(latestPeriod.cancellation_rate) || 0;
    
    const prevPeriod = dataArray.length > 1 ? dataArray[dataArray.length - 2] : null;
    const trend = prevPeriod
      ? Number(latestPeriod.cancellation_rate) - Number(prevPeriod.cancellation_rate)
      : 0;
  
    return {
      totalCancelled,
      totalBooked,
      cancellationRate,
      trend
    };
  };
  
  


  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5001/api/dashboard/appointments/cancellation-rates?range=${period}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (isMounted) {
          setData(result.data);
          setError(null);
          setLoading(false);
        }
      } catch (err) {
        console.error('Error fetching cancellation data:', err);
        if (isMounted) {
          setError(err.message);
          setLoading(false);
        }
      }
    };

    fetchData();
    return () => {
      isMounted = false;
    };
  }, [period]);

  const handlePeriodChange = (e) => {
    setPeriod(e.target.value);
  };

  const metrics = calculateMetrics(data);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height={400}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height={200} color="error.main">
        Error: {error}
      </Box>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height={150}>
        No cancellation data available
      </Box>
    );
  }

  return (
    <Paper
      elevation={3}
      sx={{
        p: 1,
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Header */}
      <Box 
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
        sx={{
          [theme.breakpoints.down('sm')]: {
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: 2,
            mb: 2
          }
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          Cancellation Rate Analysis
        </Typography>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Period</InputLabel>
          <Select
            value={period}
            label="Period"
            onChange={handlePeriodChange}
          >
            <MenuItem value="weekly">Weekly</MenuItem>
            <MenuItem value="monthly">Monthly</MenuItem>
            <MenuItem value="yearly">Yearly</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={1} mb={5}>
        <Grid item xs={12} sm={6} md={4}>
          <Paper sx={{ p: 1, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Box display="flex" alignItems="center" mb={1}>
              <Cancel color="error" sx={{ mr: 1 }} />
              <Typography variant="subtitle2" color="text.secondary">
                Cancellation Rate
              </Typography>
            </Box>
            <Box display="flex" alignItems="center">
              <Typography variant="h7" color="error">
                {metrics.cancellationRate.toFixed(1)}%
              </Typography>
              {metrics.trend !== 0 && (
                <>
                  {metrics.trend > 0 ? (
                    <TrendingUp color="error" sx={{ ml: 1 }} />
                  ) : (
                    <TrendingDown color="success" sx={{ ml: 1 }} />
                  )}
                  <Typography
                    variant="caption"
                    color={metrics.trend > 0 ? 'error' : 'success'}
                    sx={{ ml: 0.5 }}
                  >
                    {Math.abs(metrics.trend).toFixed(1)}%
                  </Typography>
                </>
              )}
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Paper sx={{ p: 1, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Box display="flex" alignItems="center" mb={1}>
              <Cancel color="action" sx={{ mr: 1 }} />
              <Typography variant="subtitle2" color="text.secondary">
                Total Cancelled
              </Typography>
            </Box>
            <Typography variant="h7">
              {metrics.totalCancelled}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Paper sx={{ p: 1, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Box display="flex" alignItems="center" mb={1}>
              <CalendarToday color="action" sx={{ mr: 1 }} />
              <Typography variant="subtitle2" color="text.secondary">
                Total Booked
              </Typography>
            </Box>
            <Typography variant="h7">
              {metrics.totalBooked}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Chart */}
      <Box sx={{ height: 250 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 2 }}
          >
            <XAxis dataKey="period" tick={{ fontSize: 12 }} />
            <YAxis tickFormatter={(value) => `${value}%`} domain={[0, 100]} />
            <Tooltip
              formatter={(value) => [`${value}%`, 'Cancellation Rate']}
              labelFormatter={(label) => `Period: ${label}`}
            />
            <Legend />
            <Bar
              dataKey="cancellation_rate"
              name="Cancellation Rate"
              fill={theme.palette.error.main}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    entry.cancellation_rate > 30
                      ? theme.palette.error.main
                      : entry.cancellation_rate > 15
                        ? theme.palette.warning.main
                        : theme.palette.success.main
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default CancellationRateChart;
