// Dashboard.jsx
import React, { useState } from 'react';
import { Box, Typography, Grid, Tabs, Tab } from '@mui/material';
import { styled } from '@mui/material/styles';
import CalendarCard from '../components/dashboard/main dasboard/CalendarCard';
import UpcomingAptCard from '../components/dashboard/main dasboard/UpcomingAptCard';
import ServicePopularityChart from '../components/dashboard/main dasboard/ServicePopularityChart';
import StylistPopularityChart from '../components/dashboard/main dasboard/StylistPopularityChart';
import TimeHeatmap from '../components/dashboard/main dasboard/TimeHeatmap';
import RevenueDashboard from '../components/dashboard/finance/RevenueDashboard';
import CancellationRateChart from '../components/dashboard/main dasboard/CancellationRateChart';
import DashboardLayout from '../components/dashboard/main dasboard/TopLayout';

// Custom styled tabs to match password.txt style
const StyledTabs = styled(Tabs)({
  borderBottom: '1px solid rgba(190, 175, 155, 0.3)',
  '& .MuiTabs-indicator': {
    backgroundColor: '#BEAF9B',
    height: 3,
  },
});

// Custom styled tab
const StyledTab = styled((props) => <Tab disableRipple {...props} />)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '0.9rem',
  fontFamily: "'Poppins', 'Roboto', sans-serif",
  color: '#666666',
  marginRight: theme.spacing(1),
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  transition: 'all 0.2s',
  '&.Mui-selected': {
    color: '#453C33',
    fontWeight: 700,
  },
  '&.Mui-focusVisible': {
    backgroundColor: 'rgba(190, 175, 155, 0.1)',
  },
  '&:hover': {
    color: '#453C33',
    backgroundColor: 'rgba(190, 175, 155, 0.1)',
  },
}));

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ px: 0, mt: 4, mb: 4 }}>
      <Typography 
        variant="h4" 
        component="h1" 
        sx={{ 
          mb: 3,
          fontFamily: "'Poppins', 'Roboto', sans-serif",
          fontWeight: 600,
          color: '#453C33'
        }}
      >
        Dashboard Overview
      </Typography>

      <StyledTabs 
        value={activeTab} 
        onChange={handleTabChange} 
        sx={{ mb: 3 }}
      >
        <StyledTab label="Main Dashboard" />
        <StyledTab label="Revenue Analytics" />
      </StyledTabs>

      {activeTab === 0 && (
        <Grid container spacing={2}>
          {/* Main content area */}
          <Grid item xs={12} md={9}>
            {/* Top section with Dashboard Layout and CancellationRateChart side by side */}
            <Grid container spacing={2} sx={{ mb: 4 }}>
              <Grid item xs={12} md={6} sx={{ mb: 0 }}>
                <DashboardLayout />
              </Grid>
              <Grid item xs={12} md={6}>
                <CancellationRateChart />
              </Grid>
            </Grid>

            {/* Pie Charts Row */}
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <ServicePopularityChart />
              </Grid>
              <Grid item xs={12} md={6}>
                <StylistPopularityChart />
              </Grid>
            </Grid>

            {/* Heatmap Row */}
            <Box mt={4}>
              <TimeHeatmap />
            </Box>
          </Grid>

          {/* Right Sidebar */}
          <Grid item xs={12} md={3}>
            <Box sx={{ height: '100%' }}>
              <UpcomingAptCard />
            </Box>
          </Grid>
        </Grid>
      )}

      {activeTab === 1 && <RevenueDashboard />}
    </Box>
  );
};

export default Dashboard;