import React from 'react';
import { Box, Grid } from '@mui/material';

// Import the three components
import RevenueCard from './RevenueCard';
import AppointmentsCard from './AppointmentsCard';
import TopCustomersCard from './TopCustomers';

const DashboardLayout = () => {
  return (
    <Box sx={{ p: 0 }}>
      <Grid container spacing={2}>
        {/* Revenue and Appointments cards in the first row, side by side */}
        <Grid item xs={12} md={6}>
          <RevenueCard />
        </Grid>
        <Grid item xs={12} md={6}>
          <AppointmentsCard />
        </Grid>
        
        {/* Top Customers card below, taking full width */}
        <Grid item xs={12}>
          <TopCustomersCard />
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardLayout;
