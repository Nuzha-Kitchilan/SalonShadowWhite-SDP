import React from 'react';
import { Grid, Box, Typography, Paper } from '@mui/material';
import DetailedRevenueCard from './DetailedRevenue';
import RevenueByServiceChart from './RevenueByServiceChart';
import StylistRevenueChart from './StylistRevenueChart';
import RevenueTrend from './RevenueTrend';
import AverageTicketCard from './AverageTicketCard';

const RevenueDashboard = () => {
  return (
    <Box sx={{ mt: 2 }}>
      <Typography
        variant="h5"
        sx={{
          mb: 3,
          fontWeight: 600,
          color: 'text.primary'
        }}
      >
        Revenue Analytics
      </Typography>

      <Grid container spacing={2}>
        {/* Top Left */}
        <Grid item xs={12} md={6}>
          <Paper elevation={1} sx={{ p: 2, height: '100%', minHeight: 300 }}>
            <DetailedRevenueCard />
          </Paper>
        </Grid>

        {/* Top Right */}
        <Grid item xs={12} md={6}>
          <Paper elevation={1} sx={{ p: 2, height: '100%', minHeight: 300 }}>
            <RevenueByServiceChart />
          </Paper>
        </Grid>

        {/* Bottom Left */}
        <Grid item xs={12} md={6}>
          <Paper elevation={1} sx={{ p: 2, height: '100%', minHeight: 300 }}>
            <RevenueTrend />
          </Paper>
        </Grid>


        {/* Bottom Right */}
        <Grid item xs={12} md={6}>
          <Paper elevation={1} sx={{ p: 1, height: '100%', minHeight: 300 }}>
            <StylistRevenueChart />
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={1} sx={{ p: 2, height: '100%', minHeight: 100 }}>
            <AverageTicketCard />
          </Paper>
        </Grid>

      </Grid>
    </Box>
  );
};

export default RevenueDashboard;
