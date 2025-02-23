import React from "react";
import { AppBar, Toolbar, Typography, Box, Avatar } from "@mui/material";
import logo from "../assets/logo.jpg";  
import profilePic from "../assets/profile.jpg";  

const Header = () => {
  return (
    <AppBar
      position="fixed"
      sx={{
        width: "100vw", 
        backgroundColor: "#000", 
        color: "#fff", 
        boxShadow: "none",
        zIndex: 1000, // Ensures it's on top
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Left Side - Logo */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Avatar src={logo} sx={{ width: 40, height: 40, marginRight: 1 }} />
          <Typography variant="h6" sx={{ fontWeight: "bold", textShadow: "2px 2px 4px rgba(255,255,255,0.3)" }}>
            Salon Shadow White
          </Typography>
        </Box>

        {/* Right Side - Admin Profile */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Avatar src={profilePic} sx={{ width: 40, height: 40, marginRight: 1 }} />
          <Box>
            <Typography variant="body1" sx={{ fontWeight: "bold" }}>John Doe</Typography>
            <Typography variant="body2" sx={{ fontSize: "12px", color: "#aaa" }}>Admin</Typography>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
// Compare this snippet from src/components/Header.jsx:
// import React from "react";