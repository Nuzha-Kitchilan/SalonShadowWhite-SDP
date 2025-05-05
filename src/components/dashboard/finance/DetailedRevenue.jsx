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
  AttachMoney,
  Payment,
  CreditCard,
  PointOfSale,
  HourglassEmpty,
  CheckCircle
} from '@mui/icons-material';

const DetailedRevenueCard = () => {
  const [period, setPeriod] = useState('weekly');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5001/api/revenue/detailed?range=${period}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        setData(result.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching revenue data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [period]);

  const handlePeriodChange = (e) => {
    setPeriod(e.target.value);
  };

  const StatBox = ({ icon, title, value, color = 'primary' }) => (
    <Paper 
      sx={{ 
        p: 0, 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        minHeight: 100,
        mb: 2
      }}
    >
      <Box display="flex" alignItems="center" mb={4} minHeight={24} minWidth={30}>
        {React.cloneElement(icon, { 
          color, 
          sx: { 
            fontSize: 20,
            mr: 2 
          } 
        })}
        <Typography 
          variant="subtitle2" 
          color="text.secondary"
          sx={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {title}
        </Typography>
      </Box>
      <Typography 
        variant="h5" 
        color={color}
        sx={{
          mt: 'auto',
          fontWeight: 600,
          wordBreak: 'break-word'
        }}
      >
        {value}
      </Typography>
    </Paper>
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height={400}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        height={1000}
        color="error.main"
      >
        Error: {error}
      </Box>
    );
  }

  if (!data) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        height={200}
      >
        No revenue data available
      </Box>
    );
  }

  return (
    <Box sx={{ mb: 4 }}> {/* Container with margin bottom */}
      <Paper 
        elevation={3} 
        sx={{ 
          p: 3,
          height: '100%',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Box 
          display="flex" 
          justifyContent="space-between" 
          alignItems="center" 
          mb={3}
          sx={{
            [theme.breakpoints.down('sm')]: {
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: 10
            }
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            Detailed Revenue Breakdown
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

        <Box flex={1}>
          <Grid container spacing={2} sx={{ mb: 4 }}>
            {/* Row 1 */}
            <Grid item xs={12} sm={6} md={4}>
              <StatBox
                icon={<AttachMoney />}
                title="Total Revenue"
                value={`$${(data.total_revenue || 0).toFixed(2)}`}
                color="primary"
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <StatBox
                icon={<CheckCircle />}
                title="Paid Amount"
                value={`$${(data.paid_amount || 0).toFixed(2)}`}
                color="success"
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <StatBox
                icon={<HourglassEmpty />}
                title="Pending Payment"
                value={`$${(data.pending_amount || 0).toFixed(2)}`}
                color="warning"
              />
            </Grid>

            {/* Row 2 */}
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <StatBox
                    icon={<CreditCard />}
                    title="Online Payments"
                    value={`$${(data.online_payments || 0).toFixed(2)}`}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <StatBox
                    icon={<PointOfSale />}
                    title="In-Salon Payments"
                    value={`$${(data.onsite_payments || 0).toFixed(2)}`}
                  />
                </Grid>
              </Grid>
            </Grid>

            {/* Row 3 */}
            <Grid item xs={12} sm={6} md={4}>
              <StatBox
                icon={<Payment />}
                title="Avg. Transaction"
                value={`$${(data.average_transaction || 0).toFixed(2)}`}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <StatBox
                icon={<AttachMoney />}
                title="Total Transactions"
                value={data.total_transactions || '0'}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <StatBox
                icon={<Payment />}
                title="Online Payment %"
                value={`${(data.online_percentage || 0).toFixed(1)}%`}
              />
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
};

export default DetailedRevenueCard;