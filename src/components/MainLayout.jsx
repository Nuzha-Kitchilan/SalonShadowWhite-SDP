import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Outlet } from "react-router-dom"; // Renders child routes
import { Box, CssBaseline } from "@mui/material";

const MainLayout = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh", // Full height of the viewport
      }}
    >
      {/* Sticky Navbar */}
      <Box sx={{ position: "sticky", top: 0, zIndex: 1000 }}>
        <Navbar />
      </Box>

      {/* Main Content - Pushes footer to the bottom */}
      <Box component="main" sx={{ flex: 1 }}>
        <Outlet />
      </Box>

      {/* Footer at the bottom */}
      <Footer />
    </Box>
  );
};

export default MainLayout;
