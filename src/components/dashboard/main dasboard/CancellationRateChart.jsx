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

  const calculateMetrics = (dataArray) => {
    
    const getCurrentISOYearWeek = () => {
  const date = new Date();
  const tempDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = tempDate.getUTCDay() || 7;
  tempDate.setUTCDate(tempDate.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(tempDate.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((tempDate - yearStart) / 86400000) + 1) / 7);
  return `${tempDate.getUTCFullYear()}${weekNo < 10 ? '0' + weekNo : weekNo}`;
};

const currentWeek = getCurrentISOYearWeek();
const latestPeriod = dataArray.find(d => d.period.toString() === currentWeek) || {};


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
        <CircularProgress sx={{ color: '#BEAF9B' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        height={200} 
        sx={{ 
          color: '#ff6b6b', 
          fontFamily: "'Poppins', 'Roboto', sans-serif" 
        }}
      >
        Error: {error}
      </Box>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        height={150}
        sx={{ 
          color: '#666666', 
          fontFamily: "'Poppins', 'Roboto', sans-serif" 
        }}
      >
        No cancellation data available
      </Box>
    );
  }

  return (
    <Paper
      elevation={0}
      sx={{
        p: 1,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '8px',
        border: '1px solid rgba(190, 175, 155, 0.3)',
        boxShadow: 'none',
        background: 'linear-gradient(135deg, rgba(190,175,155,0.3), rgba(255,255,255,0.9))'
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
        <Typography 
          variant="h6" 
          fontWeight="bold"
          sx={{ 
            fontFamily: "'Poppins', 'Roboto', sans-serif",
            color: '#453C33'
          }}
        >
          Cancellation Rate Analysis
        </Typography>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel sx={{ 
            fontFamily: "'Poppins', 'Roboto', sans-serif",
            color: '#666666',
            '&.Mui-focused': {
              color: '#BEAF9B'
            }
          }}>
            Period
          </InputLabel>
          <Select
            value={period}
            label="Period"
            onChange={handlePeriodChange}
            sx={{
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
              fontFamily: "'Poppins', 'Roboto', sans-serif"
            }}
          >
            <MenuItem value="weekly" sx={{ fontFamily: "'Poppins', 'Roboto', sans-serif" }}>Weekly</MenuItem>
            <MenuItem value="monthly" sx={{ fontFamily: "'Poppins', 'Roboto', sans-serif" }}>Monthly</MenuItem>
            <MenuItem value="yearly" sx={{ fontFamily: "'Poppins', 'Roboto', sans-serif" }}>Yearly</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={1} mb={5}>
        <Grid item xs={12} sm={6} md={4}>
          <Paper 
            elevation={0}
            sx={{ 
              p: 1, 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'center',
              borderRadius: '6px',
              border: '1px solid rgba(190, 175, 155, 0.2)',
              background: 'rgba(255, 255, 255, 0.6)'
            }}
          >
            <Box display="flex" alignItems="center" mb={1}>
              <Cancel sx={{ mr: 1, color: '#BEAF9B' }} />
              <Typography 
                variant="subtitle2" 
                sx={{ 
                  color: '#666666',
                  fontFamily: "'Poppins', 'Roboto', sans-serif",
                  fontWeight: 600
                }}
              >
                Cancellation Rate
              </Typography>
            </Box>
            <Box display="flex" alignItems="center">
              <Typography 
                variant="h7" 
                sx={{ 
                  color: '#ff6b6b',
                  fontFamily: "'Poppins', 'Roboto', sans-serif",
                  fontWeight: 600
                }}
              >
                {metrics.cancellationRate.toFixed(1)}%
              </Typography>
              {metrics.trend !== 0 && (
                <>
                  {metrics.trend > 0 ? (
                    <TrendingUp sx={{ ml: 1, color: '#ff6b6b' }} />
                  ) : (
                    <TrendingDown sx={{ ml: 1, color: '#4caf50' }} />
                  )}
                  <Typography
                    variant="caption"
                    sx={{ 
                      ml: 0.5,
                      color: metrics.trend > 0 ? '#ff6b6b' : '#4caf50',
                      fontFamily: "'Poppins', 'Roboto', sans-serif"
                    }}
                  >
                    {Math.abs(metrics.trend).toFixed(1)}%
                  </Typography>
                </>
              )}
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Paper 
            elevation={0}
            sx={{ 
              p: 1, 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'center',
              borderRadius: '6px',
              border: '1px solid rgba(190, 175, 155, 0.2)',
              background: 'rgba(255, 255, 255, 0.6)'
            }}
          >
            <Box display="flex" alignItems="center" mb={1}>
              <Cancel sx={{ mr: 1, color: '#BEAF9B' }} />
              <Typography 
                variant="subtitle2" 
                sx={{ 
                  color: '#666666',
                  fontFamily: "'Poppins', 'Roboto', sans-serif",
                  fontWeight: 600
                }}
              >
                Total Cancelled
              </Typography>
            </Box>
            <Typography 
              variant="h7"
              sx={{ 
                color: '#453C33',
                fontFamily: "'Poppins', 'Roboto', sans-serif",
                fontWeight: 600
              }}
            >
              {metrics.totalCancelled}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Paper 
            elevation={0}
            sx={{ 
              p: 1, 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'center',
              borderRadius: '6px',
              border: '1px solid rgba(190, 175, 155, 0.2)',
              background: 'rgba(255, 255, 255, 0.6)'
            }}
          >
            <Box display="flex" alignItems="center" mb={1}>
              <CalendarToday sx={{ mr: 1, color: '#BEAF9B' }} />
              <Typography 
                variant="subtitle2" 
                sx={{ 
                  color: '#666666',
                  fontFamily: "'Poppins', 'Roboto', sans-serif",
                  fontWeight: 600
                }}
              >
                Total Booked
              </Typography>
            </Box>
            <Typography 
              variant="h7"
              sx={{ 
                color: '#453C33',
                fontFamily: "'Poppins', 'Roboto', sans-serif",
                fontWeight: 600
              }}
            >
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
            <XAxis 
              dataKey="period" 
              tick={{ 
                fontSize: 12,
                fontFamily: "'Poppins', 'Roboto', sans-serif",
                fill: '#666666'
              }} 
            />
            <YAxis 
              tickFormatter={(value) => `${value}%`} 
              domain={[0, 100]} 
              tick={{ 
                fontSize: 12,
                fontFamily: "'Poppins', 'Roboto', sans-serif",
                fill: '#666666'
              }}
            />
            <Tooltip
              formatter={(value) => [`${value}%`, 'Cancellation Rate']}
              labelFormatter={(label) => `Period: ${label}`}
              contentStyle={{
                fontFamily: "'Poppins', 'Roboto', sans-serif",
                borderRadius: '4px',
                border: '1px solid rgba(190, 175, 155, 0.3)',
                boxShadow: 'none'
              }}
              labelStyle={{
                fontWeight: 600,
                color: '#453C33'
              }}
            />
            <Legend 
              wrapperStyle={{
                fontFamily: "'Poppins', 'Roboto', sans-serif",
                color: '#666666'
              }}
            />
            <Bar
              dataKey="cancellation_rate"
              name="Cancellation Rate"
              fill="#BEAF9B"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    entry.cancellation_rate > 30
                      ? '#ff6b6b'
                      : entry.cancellation_rate > 15
                        ? '#ffb74d'
                        : '#7cb342'
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













