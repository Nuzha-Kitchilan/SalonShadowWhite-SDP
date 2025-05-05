// import React from 'react';
// import { Grid, Box, Paper, Typography } from '@mui/material';

// // Import all revenue components
// import DetailedRevenueCard from './DetailedRevenue';
// //import AverageTicketCard from './AverageTicketCard';
// import RevenueByServiceChart from './RevenueByServiceChart';
// import StylistRevenueChart from './StylistRevenueChart';
// //import RevenueTrend from './RevenueTrend';
// import Layout from './Layout'; // Importing the newly created layout component

// const RevenueDashboard = () => {
//   return (
//     <Box sx={{ p: 1 }}>
//       <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
//         Revenue Analytics
//       </Typography>
      
//       {/* Top Row - Two main cards */}
//       <Grid container spacing={3} sx={{ mb: 3 }}>
//         <Grid item xs={12} md={6}>
//           <Paper 
//             elevation={2} 
//             sx={{ 
//               height: '100%', 
//               borderRadius: 2,
//               transition: 'transform 0.2s, box-shadow 0.2s',
//               '&:hover': {
//                 transform: 'translateY(-4px)',
//                 boxShadow: 3
//               }
//             }}
//           >
//             <DetailedRevenueCard />
//           </Paper>
//         </Grid>
//         <Grid item xs={12} md={6}>
//           <Paper 
//             elevation={2} 
//             sx={{ 
//               height: 500, 
//               borderRadius: 2,
//               transition: 'transform 0.2s, box-shadow 0.2s',
//               '&:hover': {
//                 transform: 'translateY(-4px)',
//                 boxShadow: 3
//               }
//             }}
//           >
//             <RevenueByServiceChart />
//           </Paper>
//         </Grid>
//       </Grid>
      
//       {/* Bottom Row - Charts */}
//       <Grid container spacing={3}>
//       <Grid item xs={12} md={6}>
//               <Paper 
//                 elevation={2} 
//                 sx={{ 
//                   height: '100%', 
//                   borderRadius: 2,
//                   transition: 'transform 0.2s, box-shadow 0.2s',
//                   '&:hover': {
//                     transform: 'translateY(-4px)',
//                     boxShadow: 3
//                   }
//                 }}
//               >
//                 <Layout /> {/* Using the newly created layout component here */}
//               </Paper>
//             </Grid>
//         <Grid item xs={12} md={6}>
//           <Paper 
//             elevation={2} 
//             sx={{ 
//               height: 450, 
//               borderRadius: 2,
//               transition: 'transform 0.2s, box-shadow 0.2s',
//               '&:hover': {
//                 transform: 'translateY(-4px)',
//                 boxShadow: 3
//               }
//             }}
//           >
//             <StylistRevenueChart />
//           </Paper>
//         </Grid>

        
//       </Grid>
//     </Box>
//   );
// };

// export default RevenueDashboard;








//     <Grid item xs={12} md={6}>
//               <Paper 
//                 elevation={2} 
//                 sx={{ 
//                   height: '100%', 
//                   borderRadius: 2,
//                   transition: 'transform 0.2s, box-shadow 0.2s',
//                   '&:hover': {
//                     transform: 'translateY(-4px)',
//                     boxShadow: 3
//                   }
//                 }}
//               >
//                 <Layout /> {/* Using the newly created layout component here */}
//               </Paper>
//             </Grid>













import React from 'react';
import { Grid, Box, Typography } from '@mui/material';
import DetailedRevenueCard from './DetailedRevenue';
import RevenueByServiceChart from './RevenueByServiceChart';
import StylistRevenueChart from './StylistRevenueChart';
import Layout from './Layout';

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
        {/* Top Row */}
        <Grid item xs={12} md={6}>
          <DetailedRevenueCard />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <RevenueByServiceChart />
        </Grid>
        
        {/* Bottom Row */}
        <Grid item xs={12} md={6}>
          <Layout />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <StylistRevenueChart />
        </Grid>
      </Grid>
    </Box>
  );
};

export default RevenueDashboard;