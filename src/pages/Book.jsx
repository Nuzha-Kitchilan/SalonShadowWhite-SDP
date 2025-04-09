import React from "react";
import { Box, Typography, Container, List, ListItem, ListItemText, ListItemIcon, Button, Divider } from "@mui/material";
import { motion } from "framer-motion";
import EventNoteIcon from "@mui/icons-material/EventNote";
import CancelIcon from "@mui/icons-material/Cancel";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import stylistImage from "../assets/appointment.png";  // Header image
import bookingImage from "../assets/booking.jpg";  // Policies image
import SpecialRequestForm from "../components/SpecialRequest"; // 👈 New form component

const AppointmentBooking = () => {
  return (
    <Box 
      sx={{ 
        width: "100%", 
        maxWidth: "100vw", 
        minHeight: "100vh",
        overflowX: "hidden",
        position: "relative",
        bgcolor: "#faf5f0"
      }}
    >
      {/* Header Section */}
      <Box sx={{ width: "100%", position: "relative", overflow: "hidden" }}>
        <Box
          sx={{
            backgroundImage: `url(${stylistImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: { xs: "300px", md: "400px" },
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            flexDirection: "column"
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
            style={{ marginTop: "250px" }}
          >
            <Button
              variant="contained"
              size="large"
              sx={{
                backgroundColor: "#d3d3d3",
                color: "#333",
                px: 4,
                py: 1.5,
                fontWeight: "bold",
                fontSize: "1rem",
                borderRadius: "30px",
                '&:hover': {
                  backgroundColor: "#c0c0c0"
                }
              }}
            >
              Book Now
            </Button>
          </motion.div>
        </Box>
      </Box>

      {/* Salon Policies Section */}
      <Box sx={{ width: "100%", bgcolor: "#faf5f0", py: 6 }}>
        <Container maxWidth="lg">
          <Box 
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              borderRadius: 2,
              overflow: "hidden",
              boxShadow: 3,
            }}
          >
            {/* Image */}
            <Box 
              sx={{
                flex: { xs: "1 1 100%", md: "1 1 40%" },
                position: "relative",
                minHeight: { xs: "300px", md: "auto" },
                "& img": {
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center",
                  display: "block"
                }
              }}
            >
              <img src={bookingImage} alt="Makeup artist applying eye makeup" />
            </Box>

            {/* Text Content */}
            <Box 
              sx={{
                flex: { xs: "1 1 100%", md: "1 1 60%" },
                bgcolor: "#b8a99a",
                p: { xs: 3, sm: 4, md: 5 },
                color: "white",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center"
              }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Typography variant="h5" component="h3" sx={{ fontWeight: 500, mb: 2 }}>
                  Our Booking Policies
                </Typography>

                <List sx={{ mb: 3 }}>
                  <ListItem sx={{ pb: 1 }}>
                    <ListItemIcon sx={{ color: "white", minWidth: "40px" }}>
                      <EventNoteIcon />
                    </ListItemIcon>
                    <ListItemText primary="Appointments should be booked at least 24 hours in advance." />
                  </ListItem>
                  <ListItem sx={{ pb: 1 }}>
                    <ListItemIcon sx={{ color: "white", minWidth: "40px" }}>
                      <CancelIcon />
                    </ListItemIcon>
                    <ListItemText primary="Cancellation should be done 48 hours prior to the appointment." />
                  </ListItem>
                  <ListItem sx={{ pb: 1 }}>
                    <ListItemIcon sx={{ color: "white", minWidth: "40px" }}>
                      <AccessTimeIcon />
                    </ListItemIcon>
                    <ListItemText primary="Arrive 10 minutes before your scheduled appointment." />
                  </ListItem>
                </List>

                <Divider sx={{ borderColor: "rgba(255,255,255,0.2)", my: 3 }} />

                <Typography variant="h6" component="h4" sx={{ fontWeight: 500, mb: 2 }}>
                  Need a Special Booking?
                </Typography>

                <Typography variant="body1" sx={{ mb: 3, fontSize: { xs: "0.95rem", sm: "1rem" } }}>
                  Need us during non-business hours? We understand that special occasions sometimes require flexibility. If you require:
                </Typography>

                <List sx={{ mb: 3, pl: 2 }}>
                  <ListItem sx={{ py: 0.5, display: 'list-item' }}><Typography variant="body1">Early morning appointments</Typography></ListItem>
                  <ListItem sx={{ py: 0.5, display: 'list-item' }}><Typography variant="body1">After-hours services</Typography></ListItem>
                  <ListItem sx={{ py: 0.5, display: 'list-item' }}><Typography variant="body1">On-location makeup or styling</Typography></ListItem>
                  <ListItem sx={{ py: 0.5, display: 'list-item' }}><Typography variant="body1">Bridal party packages</Typography></ListItem>
                  <ListItem sx={{ py: 0.5, display: 'list-item' }}><Typography variant="body1">Special event group bookings</Typography></ListItem>
                </List>

                <Typography variant="body1" sx={{ fontSize: { xs: "0.95rem", sm: "1rem" } }}>
                  Please contact us, and our team will get back to you within 24–48 hours to discuss availability and pricing options.
                </Typography>
              </motion.div>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* 👇 Special Request Form Component (Centering added) */}
      <Box sx={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        mt: 4
      }}>
        <Box sx={{
          maxWidth: '800px',
          width: '100%',
          padding: '20px',
          backgroundColor: 'white',
          borderRadius: 2,
          boxShadow: 3
        }}>
          <SpecialRequestForm />
        </Box>
      </Box>

      {/* Global Styles */}
      <style>
        {`
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }
          body {
            overflow-x: hidden;
          }
        `}
      </style>
    </Box>
  );
};

export default AppointmentBooking;
