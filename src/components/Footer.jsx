import React from "react";
import { Grid, Typography, Button, IconButton, Link, Box } from "@mui/material";
import { Facebook, Instagram } from "@mui/icons-material"; // MUI Icons
import { FaTiktok } from "react-icons/fa"; // React Icons for TikTok

const Footer = () => {
  return (
    <Box component="footer" sx={{ backgroundColor: "#000", color: "#fff", py: 4 }}>
      {/* First Line */}
      <Grid container alignItems="center" justifyContent="space-between" sx={{ px: 5 }}>
        {/* Left: Logo */}
        <Grid item>
          <Typography variant="h5" sx={{ fontWeight: "bold", cursor: "pointer",
            "&:hover": { color: "#a36a4f" } }}>
            SalonLogo
          </Typography>
        </Grid>

        {/* Center: Links */}
        <Grid item>
          <Box sx={{ display: "flex", gap: 3 }}>
            {["Home", "Services", "Gallery", "Stylists", "Contact", "Careers"].map((text, index) => (
              <Link key={index} href={`/${text.toLowerCase()}`} color="inherit" underline="none"
                sx={{ cursor: "pointer", transition: "color 0.3s", 
                  "&:hover": { color: "#a36a4f" } }}>
                {text}
              </Link>
            ))}
          </Box>
        </Grid>

        {/* Right: Book Button */}
        <Grid item>
          <Button variant="outlined" sx={{ color: "#fff", borderColor: "#fff", transition: "0.3s",
            "&:hover": { color: "#a36a4f", borderColor: "#a36a4f" } }} href="/book">
            Book Now
          </Button>
        </Grid>
      </Grid>

      {/* Second Line: Social Media Icons with Hover Effect */}
      <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 3 }}>
        <IconButton href="https://www.facebook.com/share/1BsVRUS5iJ/"
          sx={{ color: "#fff", transition: "color 0.3s", "&:hover": { color: "#a36a4f" } }}>
          <Facebook />
        </IconButton>
        <IconButton href="https://tiktok.com"
          sx={{ color: "#fff", transition: "color 0.3s", "&:hover": { color: "#a36a4f" } }}>
          <FaTiktok style={{ fontSize: "24px" }} />
        </IconButton>
        <IconButton href="https://www.instagram.com/salon_shadow_white/"
          sx={{ color: "#fff", transition: "color 0.3s", "&:hover": { color: "#a36a4f" } }}>
          <Instagram />
        </IconButton>
      </Box>

      {/* Bottom Line: Copyright and Contact */}
      <Box sx={{ textAlign: "center", mt: 3 }}>
        <Typography variant="body2" sx={{ transition: "color 0.3s", "&:hover": { color: "#a36a4f" } }}>
          &copy; 2025 Salon Shadow White. All rights reserved.
        </Typography>
        <Typography variant="body2" sx={{ mt: 1 }}>
          <Link href="tel:+123456789" color="inherit" underline="none"
            sx={{ transition: "color 0.3s", "&:hover": { color: "#a36a4f" } }}>
            +123 456 789
          </Link> | 
          <Link href="mailto:info@salon.com" color="inherit" underline="none"
            sx={{ transition: "color 0.3s", "&:hover": { color: "#a36a4f" } }}>
            info@salon.com
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default Footer;
