
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
  useTheme,
  Card,
  CardContent
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

  const StatBox = ({ icon, title, value, color = 'primary' }) => {
    // Map color names to actual color values that match the aesthetic
    const colorMap = {
      primary: '#453C33',
      success: '#5B8A72',
      warning: '#D4A760',
      error: '#B85C5C'
    };
    
    const actualColor = colorMap[color] || colorMap.primary;
    
    return (
      <Card 
        sx={{ 
          p: 0, 
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          minHeight: 100,
          mb: 2,
          borderRadius: '8px',
          border: '1px solid rgba(190, 175, 155, 0.3)',
          boxShadow: 'none',
          background: 'linear-gradient(135deg, rgba(190,175,155,0.15), rgba(255,255,255,0.8))'
        }}
      >
        <CardContent sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Box display="flex" alignItems="center" mb={1} minHeight={24} minWidth={30}>
            {React.cloneElement(icon, { 
              sx: { 
                fontSize: 20,
                mr: 1.5,
                color: actualColor
              } 
            })}
            <Typography 
              variant="subtitle2" 
              sx={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                fontFamily: "'Poppins', 'Roboto', sans-serif",
                fontWeight: 600,
                color: '#666666'
              }}
            >
              {title}
            </Typography>
          </Box>
          <Typography 
            variant="h5" 
            sx={{
              mt: 'auto',
              fontWeight: 600,
              wordBreak: 'break-word',
              fontFamily: "'Poppins', 'Roboto', sans-serif",
              color: actualColor
            }}
          >
            {value}
          </Typography>
        </CardContent>
      </Card>
    );
  };

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
        height={400}
        color="#B85C5C"
        fontFamily="'Poppins', 'Roboto', sans-serif"
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
        fontFamily="'Poppins', 'Roboto', sans-serif"
        color="#666666"
      >
        No revenue data available
      </Box>
    );
  }

  return (
    <Box sx={{ mb: 4 }}>
      <Card 
        sx={{ 
          p: 3,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '8px',
          border: '1px solid rgba(190, 175, 155, 0.3)',
          boxShadow: 'none',
          background: 'linear-gradient(135deg, rgba(190,175,155,0.3), rgba(255,255,255,0.9))'
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
              gap: 2
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
            Detailed Revenue Breakdown
          </Typography>
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
              color: '#453C33',
              fontFamily: "'Poppins', 'Roboto', sans-serif"
            }}
          >
            <MenuItem value="daily" sx={{ fontSize: '0.875rem', fontFamily: "'Poppins', 'Roboto', sans-serif" }}>Daily</MenuItem>
            <MenuItem value="weekly" sx={{ fontSize: '0.875rem', fontFamily: "'Poppins', 'Roboto', sans-serif" }}>Weekly</MenuItem>
            <MenuItem value="monthly" sx={{ fontSize: '0.875rem', fontFamily: "'Poppins', 'Roboto', sans-serif" }}>Monthly</MenuItem>
            <MenuItem value="yearly" sx={{ fontSize: '0.875rem', fontFamily: "'Poppins', 'Roboto', sans-serif" }}>Yearly</MenuItem>
          </Select>
        </Box>

        <Box flex={1}>
          <Grid container spacing={2} sx={{ mb: 4 }}>
            {/* Row 1 */}
            <Grid item xs={12} sm={6} md={4}>
              <StatBox
                icon={<AttachMoney />}
                title="Total Revenue"
                value={`Rs.${(data.total_revenue ?? 0).toFixed(2)}`}
                color="primary"
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <StatBox
                icon={<CheckCircle />}
                title="Paid Amount"
                value={`Rs.${(data.paid_amount ?? 0).toFixed(2)}`}
                color="success"
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <StatBox
                icon={<HourglassEmpty />}
                title="Pending Payment"
                value={`Rs.${(data.pending_amount ?? 0).toFixed(2)}`}
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
                    value={`Rs.${(data.online_payments ?? 0).toFixed(2)}`}
                    color="primary"
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <StatBox
                    icon={<PointOfSale />}
                    title="In-Salon Payments"
                    value={`Rs.${(data.onsite_payments ?? 0).toFixed(2)}`}
                    color="primary"
                  />
                </Grid>
              </Grid>
            </Grid>

            {/* Row 3 */}
            <Grid item xs={12} sm={6} md={4}>
              <StatBox
                icon={<Payment />}
                title="Avg. Transaction"
                value={`Rs.${(data.average_transaction ?? 0).toFixed(2)}`}
                color="primary"
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <StatBox
                icon={<AttachMoney />}
                title="Total Transactions"
                value={data.total_transactions ?? '0'}
                color="primary"
              />
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <StatBox
                icon={<Payment />}
                title="Online Payment %"
                value={`${(data.online_percentage ?? 0).toFixed(1)}%`}
                color="primary"
              />
            </Grid>
          </Grid>
        </Box>
      </Card>
    </Box>
  );
};

export default DetailedRevenueCard;