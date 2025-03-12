import React from "react";
import { AppBar, Toolbar, Typography, Button, IconButton } from "@mui/material";
import { Link } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";

const Navbar = () => {
  return (
    <AppBar position="static" sx={{ backgroundColor: "#000" }}> {/* Black Header */}
      <Toolbar>
        {/* Logo as Home Button */}
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            flexGrow: 1,
            textDecoration: "none",
            color: "white",
            fontWeight: "bold",
            transition: "0.3s",
            "&:hover": { color: "#a36a4f" }, // Logo Hover Effect
          }}
        >
          Salon Logo
        </Typography>

        {/* Navigation Links */}
        {["/services", "/gallery", "/stylists", "/contact", "/join"].map(
          (path, index) => (
            <Button
              key={index}
              color="inherit"
              component={Link}
              to={path}
              sx={{
                transition: "0.3s",
                "&:hover": { color: "#a36a4f" }, // Hover Effect for All Links
              }}
            >
              {path.replace("/", "").charAt(0).toUpperCase() + path.slice(2)}
            </Button>
          )
        )}

        {/* Book Now Button - Outlined with Hover Effect */}
        <Button
          component={Link}
          to="/book"
          sx={{
            color: "#fff",
            border: "2px solid #a36a4f",
            borderRadius: "5px",
            ml: 1,
            transition: "0.3s",
            "&:hover": { backgroundColor: "#a36a4f", color: "#fff" },
          }}
        >
          Book Now
        </Button>

        {/* Mobile Menu Icon (optional) */}
        <IconButton edge="end" color="inherit" sx={{ display: { md: "none" } }}>
          <MenuIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
