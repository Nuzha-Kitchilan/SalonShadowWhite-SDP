import React from "react";
import { Box } from "@mui/material";
import Sidebar from "./Sidebar";
import Header from "./Header";

const Layout = ({ children }) => {
  const headerHeight = 64; // Header height

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", padding: 0 }}>
      {/* Sidebar fixed on the left */}
      <Box
        sx={{
          position: "fixed", // Sidebar remains fixed
          top: 0, // Sidebar starts from the top
          left: 0, // Sidebar is aligned to the left
          width: "240px", // Sidebar width
          height: "100vh", // Sidebar height takes up the full viewport height
          backgroundColor: "#000", // Sidebar background
          color: "#fff", // Sidebar text color
          zIndex: 999, // Ensures it stays on top of the content
        }}
      >
        <Sidebar />
      </Box>

      {/* Header fixed on the top */}
      <Box
        sx={{
          position: "fixed", // Header remains fixed at the top
          top: 0, // Header starts from the top
          left: 0,
          width: "100vw", // Full width
          backgroundColor: "#000", // Background color of header
          zIndex: 1000, // Ensure it stays above the sidebar
        }}
      >
        <Header />
      </Box>

      {/* Main content section */}
      <Box
        sx={{
          marginLeft: "240px", // Push content to the right of the sidebar
          marginTop: `${headerHeight}px`, // Push content below the header
          padding: "20px",
          flexGrow: 1,
          height: "calc(100vh - 64px)", // Content height takes the remaining space below header
          overflowY: "auto", // Make sure content can scroll independently
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
