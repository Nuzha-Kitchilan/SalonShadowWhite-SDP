import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Outlet } from "react-router-dom"; 
import { Box, CssBaseline } from "@mui/material";

const MainLayout = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <Box sx={{ position: "sticky", top: 0, zIndex: 1000 }}>
        <Navbar />
      </Box>

      <Box component="main" sx={{ flex: 1 }}>
        <Outlet />
      </Box>
      <Footer />
    </Box>
  );
};

export default MainLayout;
