import React from "react";
import { Grid, Typography, Box, Paper } from "@mui/material";

const ProfileDetails = ({ email, role }) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: "8px",
        border: "1px solid rgba(190, 175, 155, 0.2)",
        background: "linear-gradient(to right, rgba(190, 175, 155, 0.05), rgba(255, 255, 255, 0.6))",
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Typography
            sx={{
              fontFamily: "'Poppins', 'Roboto', sans-serif",
              color: "#453C33",
              fontSize: "0.95rem",
            }}
          >
            <Box component="span" sx={{ fontWeight: 600 }}>
              Email:
            </Box>{" "}
            {email || "Not provided"}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography
            sx={{
              fontFamily: "'Poppins', 'Roboto', sans-serif",
              color: "#453C33",
              fontSize: "0.95rem",
            }}
          >
            <Box component="span" sx={{ fontWeight: 600 }}>
              Role:
            </Box>{" "}
            {role || "Not specified"}
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default ProfileDetails;