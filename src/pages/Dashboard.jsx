

// import React, { useState } from 'react';
// import { Box, Typography, Grid, Tabs, Tab } from '@mui/material';
// import CalendarCard from '../components/dashboard/CalendarCard';
// import UpcomingAptCard from '../components/dashboard/UpcomingAptCard';
// import ServicePopularityChart from '../components/dashboard/ServicePopularityChart';
// import StylistPopularityChart from '../components/dashboard/StylistPopularityChart';
// import TimeHeatmap from '../components/dashboard/TimeHeatmap';
// import RevenueDashboard from '../components/dashboard/finance/RevenueDashboard';
// import CancellationRateChart from '../components/dashboard/CancellationRateChart';
// // Import the new dashboard layout that contains Revenue, Appointments and TopCustomers
// import DashboardLayout from '../components/dashboard/TopLayout';

// const Dashboard = () => {
//   const [activeTab, setActiveTab] = useState(0);

//   const handleTabChange = (event, newValue) => {
//     setActiveTab(newValue);
//   };

//   return (
//     <Box sx={{ px: 0, mt: 4, mb: 4 }}>
//       <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
//         Dashboard Overview
//       </Typography>

//       <Tabs 
//         value={activeTab} 
//         onChange={handleTabChange} 
//         sx={{ mb: 3 }}
//         indicatorColor="primary"
//         textColor="primary"
//       >
//         <Tab label="Main Dashboard" />
//         <Tab label="Revenue Analytics" />
//       </Tabs>

//       {activeTab === 0 && (
//         <Grid container spacing={2}>
//           {/* Main content area */}
//           <Grid item xs={12} md={9}>
//             {/* Top section with Dashboard Layout and CancellationRateChart side by side */}
//             <Grid container spacing={2} sx={{ mb: 1 }}>
//               <Grid item xs={12} md={7}>
//                 <DashboardLayout />
//               </Grid>
//               <Grid item xs={12} md={5}>
//                 <CancellationRateChart />
//               </Grid>
//             </Grid>

//             {/* Pie Charts Row */}
//             <Grid container spacing={2}>
//               <Grid item xs={12} md={6}>
//                 <ServicePopularityChart />
//               </Grid>
//               <Grid item xs={12} md={6}>
//                 <StylistPopularityChart />
//               </Grid>
//             </Grid>

//             {/* Heatmap Row */}
//             <Box mt={4}>
//               <TimeHeatmap />
//             </Box>
//           </Grid>

//           {/* Right Sidebar */}
//           <Grid item xs={12} md={3}>
//             <Box sx={{ height: '100%' }}>
//               <UpcomingAptCard />
//             </Box>
//           </Grid>
//         </Grid>
//       )}

//       {activeTab === 1 && <RevenueDashboard />}
//     </Box>
//   );
// };

// export default Dashboard;






















import React, { useState } from 'react';
import { Box, Typography, Grid, Tabs, Tab } from '@mui/material';
import CalendarCard from '../components/dashboard/CalendarCard';
import UpcomingAptCard from '../components/dashboard/UpcomingAptCard';
import ServicePopularityChart from '../components/dashboard/ServicePopularityChart';
import StylistPopularityChart from '../components/dashboard/StylistPopularityChart';
import TimeHeatmap from '../components/dashboard/TimeHeatmap';
import RevenueDashboard from '../components/dashboard/finance/RevenueDashboard';
import CancellationRateChart from '../components/dashboard/CancellationRateChart';
import DashboardLayout from '../components/dashboard/TopLayout';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ px: 0, mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
        Dashboard Overview
      </Typography>

      <Tabs 
        value={activeTab} 
        onChange={handleTabChange} 
        sx={{ mb: 3 }}
        indicatorColor="primary"
        textColor="primary"
      >
        <Tab label="Main Dashboard" />
        <Tab label="Revenue Analytics" />
      </Tabs>

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