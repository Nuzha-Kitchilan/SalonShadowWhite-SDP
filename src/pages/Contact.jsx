import React, { useEffect, useState } from "react";
import { TextField, Button, Typography, Box, Grid, Container } from "@mui/material";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import contactPic from "../assets/contact-bg.jpeg";
import "leaflet/dist/leaflet.css";
import { motion } from "framer-motion";

const ContactPage = () => {
  const position = [6.994113, 79.92228];
  const accentColor = "#a36a4f"; // Brown accent color
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Animation for the underline (draws in a straight line)
  const strokeVariants = {
    hidden: { pathLength: 0 },
    visible: {
      pathLength: 1,
      transition: { duration: 2, ease: "easeInOut" },
    },
  };

  return (
    <Box sx={{ width: "100%", overflow: "hidden" }}>
      {/* Centered Content Container with Background Image */}
      <Box
        sx={{
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundImage: `url(${contactPic})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 1,  // Increased opacity to 0.6 for better visibility
            zIndex: 0,
          },
        }}
      >
        <Container maxWidth="md" sx={{ textAlign: "center", py: 5, position: "relative", zIndex: 1 }}>
          <Typography variant="h6" sx={{ letterSpacing: 2, color: accentColor }}>
            CONTACT
          </Typography>

          {/* Title with Hand-Drawn Straight Line Underline */}
          <Box sx={{ position: "relative", height: "60px", mb: 0 }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: "bold",
                position: "absolute",
                width: "100%",
                textAlign: "center",
                zIndex: 1,
              }}
            >
              Get In Touch
            </Typography>

            {/* Animated straight underline effect - repositioned directly under the text */}
            <motion.svg
              width="100%"
              height="10px"
              viewBox="0 0 500 10"
              initial="hidden"
              animate={isLoaded ? "visible" : "hidden"}
              style={{
                position: "absolute",
                bottom: "0px", // Moved directly below the text
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 0,
              }}
            >
              {/* Single Line */}
              <motion.line
                x1="50"
                y1="5"
                x2="450"
                y2="5"
                stroke={accentColor}
                strokeWidth="5"
                strokeLinecap="round"
                variants={strokeVariants}
              />
            </motion.svg>
          </Box>

          {/* Added more margin-top to create space between heading and subtitle */}
          <Typography 
            variant="subtitle1" 
            sx={{ 
              mt: 3, // Increased from -1 to 3 to move it down
              mb: 2, 
              color: "#666",
              pt: 0
            }}
          >
            We'd love to hear from you
          </Typography>

          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField label="Name" fullWidth variant="standard" margin="normal" />
              <TextField label="Email Address" fullWidth variant="standard" margin="normal" />
              <TextField label="Message" fullWidth variant="standard" margin="normal" multiline rows={4} />

              {/* Submit Button properly left-aligned */}
              <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
                <Button
                  variant="contained"
                  sx={{
                    mt: 2,
                    backgroundColor: accentColor,
                    "&:hover": { backgroundColor: "#8b5743" },
                  }}
                >
                  Submit
                </Button>
              </Box>
            </Grid>

            <Grid item xs={12} md={6} textAlign="left">
              <Typography variant="h6" sx={{ color: accentColor, fontWeight: "bold" }}>
                Phone
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                (255) 352-6258
              </Typography>

              <Typography variant="h6" sx={{ color: accentColor, fontWeight: "bold" }}>
                Address
              </Typography>
              <Typography variant="body1">1534 Dec St #9000, San Francisco, CA 94502</Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Full Width Map Section */}
      <Box sx={{ position: "relative", height: 400, width: "100%", left: 0, right: 0 }}>
        <MapContainer center={position} zoom={13} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={position}>
            <Popup>Our Location</Popup>
          </Marker>
        </MapContainer>
      </Box>
    </Box>
  );
};

export default ContactPage;
