import React from "react";
import { 
  Box, 
  Typography, 
  Button, 
  IconButton, 
  Container
} from "@mui/material";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Phone, Email, LocationOn } from "@mui/icons-material";
import { FaTiktok } from "react-icons/fa";
import logo from "../assets/logo.png";

const Footer = () => {
  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/services", label: "Services" },
    { path: "/gallery", label: "Gallery" },
    { path: "/stylists", label: "Stylists" },
    { path: "/contact", label: "Contact" },
    { path: "/careers", label: "Careers" }
  ];

  return (
    <Box 
      component="footer" 
      sx={{
        background: "linear-gradient(to right, #E3DAD0, #F0E9E2)",
        color: "#453C33",
        pt: 2.5,
        pb: 1.5,
        overflow: "hidden",
        height: { xs: "auto", sm: "250px" }
      }}
    >
      <Container maxWidth="lg">
        {/* Logo and Social Media */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            mb: { xs: 1.2, sm: 1.5 },
            mt: { xs: 1.5, sm: 0 }
          }}
        >
          {/* Logo and Tagline */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              component="img"
              src={logo}
              alt="Salon Logo"
              sx={{
                height: 60,
                borderRadius: "50%",
                objectFit: "cover",
                aspectRatio: "1/1"
              }}
            />
            <Box>
              <Typography 
                variant="body2"
                sx={{
                  fontFamily: "'Poppins', 'Roboto', sans-serif",
                  color: "rgba(69, 60, 51, 0.85)",
                  fontSize: "0.9rem"
                }}
              >
                Salon Shadow White
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontFamily: "'Poppins', 'Roboto', sans-serif",
                  color: "rgba(69, 60, 51, 0.7)",
                  fontSize: "0.85rem",
                  mt: "2px"
                }}
              >
                Beauty starts with you
              </Typography>
            </Box>
          </Box>

          {/* Social Icons */}
          <Box sx={{ display: "flex", gap: 0.5, mt: { xs: 1, sm: 0 } }}>
            <IconButton size="small" component="a" href="https://www.facebook.com/share/1YQGdgk1nC/" target="_blank">
              <Facebook fontSize="small" sx={{ color: "#453C33" }} />
            </IconButton>
            <IconButton size="small" component="a" href="https://www.instagram.com/salon_shadow_white/" target="_blank">
              <Instagram fontSize="small" sx={{ color: "#453C33" }} />
            </IconButton>
            <IconButton size="small" component="a" href="https://www.tiktok.com/@_salon_shadow_white_" target="_blank">
              <FaTiktok style={{ fontSize: "14px", color: "#453C33" }} />
            </IconButton>
          </Box>
        </Box>

        {/* Navigation Links */}
        <Box sx={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: 1,
          mb: 1
        }}>
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              style={{
                color: "#453C33",
                textDecoration: "none",
                fontFamily: "'Poppins', 'Roboto', sans-serif",
                fontSize: "0.8rem",
                fontWeight: 500,
                padding: "2px 6px"
              }}
            >
              {link.label}
            </Link>
          ))}
        </Box>

        {/* Book Now Button */}
        <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
          <Button
            component={Link}
            to="/book"
            size="small"
            sx={{
              background: "linear-gradient(to right, #BEAF9B, #D9CFC2)",
              color: "#453C33",
              px: 2,
              py: 0.5,
              borderRadius: "6px",
              textTransform: "none",
              fontSize: "0.8rem",
              fontWeight: 500,
              minWidth: "120px",
              "&:hover": { 
                background: "linear-gradient(to right, #D9CFC2, #E8E0D6)"
              }
            }}
          >
            Book Now
          </Button>
        </Box>

        {/* Contact Info */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "center",
            alignItems: "center",
            gap: { xs: 0.5, sm: 1.5 },
            mb: 1,
            fontSize: "0.7rem"
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <LocationOn sx={{ color: "#BEAF9B", mr: 0.5, fontSize: "16px" }} />
            <span>13A Ranimadama, Enderamulla</span>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Phone sx={{ color: "#BEAF9B", mr: 0.5, fontSize: "16px" }} />
            <span>=94 77 744 5657</span>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Email sx={{ color: "#BEAF9B", mr: 0.5, fontSize: "16px" }} />
            <span>salonshadowwhite98@gmail.com</span>
          </Box>
        </Box>

        {/* Copyright */}
        <Typography 
          variant="body2" 
          sx={{ 
            textAlign: "center", 
            color: "rgba(69, 60, 51, 0.6)",
            fontSize: "0.65rem"
          }}
        >
          &copy; {new Date().getFullYear()} Salon Shadow White
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
