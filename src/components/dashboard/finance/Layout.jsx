// import React from "react";
// import { Grid, Box, Paper } from "@mui/material";
// import RevenueTrend from "./RevenueTrend";
// import AverageTicketCard from "./AverageTicketCard";

// const Layout = () => {
//   return (
//     <Box sx={{ mt: 2 }}>
//       <Grid container spacing={2}>
//         {/* Revenue Trend Chart - Full width rectangle on top */}
//         <Grid item xs={12}>
//           <Paper
//             elevation={1}
//             sx={{
//               height: "100%",
//               minHeight: 400,
//               p: 2,
//             }}
//           >
//             <RevenueTrend />
//           </Paper>
//         </Grid>

//         {/* Average Ticket Card - Full width rectangle below */}
//         <Grid item xs={12}>
//           <Paper
//             elevation={1}
//             sx={{
//               height: "100%",
//               minHeight: 100,
//               p: 2,
//             }}
//           >
//             <AverageTicketCard />
//           </Paper>
//         </Grid>
//       </Grid>
//     </Box>
//   );
// };

// export default Layout;











import React from "react";
import { Grid, Box, Paper } from "@mui/material";
import RevenueTrend from "./RevenueTrend";
import AverageTicketCard from "./AverageTicketCard";

const Layout = () => {
  return (
    <Box sx={{ mt: 2 }}>
      <Grid container spacing={2}>
        {/* Revenue Trend Chart - Full width rectangle on top */}
        <Grid item xs={12}>
          <Paper
            elevation={1}
            sx={{
              height: "100%",
              minHeight: 400,
              p: 2,
            }}
          >
            <RevenueTrend />
          </Paper>
        </Grid>

        {/* Average Ticket Card - Full width rectangle below */}
        <Grid item xs={12}>
          <Paper
            elevation={1}
            sx={{
              height: "90%",
              minHeight: 90, // <-- Increased from 100 to 200
              p: 2,
            }}
          >
            <AverageTicketCard />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Layout;
