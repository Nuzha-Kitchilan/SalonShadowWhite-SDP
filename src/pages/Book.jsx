

import React from "react";
import { Box, Typography, Container, List, ListItem, ListItemText, ListItemIcon, Divider } from "@mui/material";
import { motion } from "framer-motion";
import EventNoteIcon from "@mui/icons-material/EventNote";
import CancelIcon from "@mui/icons-material/Cancel";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import stylistImage from "../assets/appointment.png";
import bookingImage from "../assets/booking.jpg";
import BookNowModal from "../components/modals/BookNow";

const AppointmentBooking = () => {
  return (
    <Box 
      sx={{ 
        width: "100%", 
        maxWidth: "100%", 
        minHeight: "100vh",
        overflowX: "hidden",
        position: "relative",
        bgcolor: "#faf5f0",
        scrollbarWidth: "none",  /* Firefox */
        "&::-webkit-scrollbar": {
          display: "none",  /* Chrome, Safari, Opera */
        },
        msOverflowStyle: "none"
      }}
    >
      {/* Header Section */}
      <Box sx={{ 
          width: "100%", 
          position: "relative", 
          overflow: "hidden",
          height: { xs: '180px', sm: '300px', md: '400px' },
          "&::-webkit-scrollbar": {
            display: "none",
          },
        }}>
        <Box
          sx={{
            backgroundImage: `url(${stylistImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: "100%",
            display: "flex",
            alignItems: { xs: 'flex-start', sm: 'center' }, // Align to top on mobile
            justifyContent: "center",
            position: "relative",
            pt: { xs: 2, sm: 0 }, // Add padding top on mobile
            '&::before': {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.3)",
              zIndex: 0
            },
            // Hide scrollbar for this element too
            "&::-webkit-scrollbar": {
              display: "none",
            },
          }}
        >
          {/* Book Now Button with Motion */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{
              position: "relative",
              zIndex: 1
            }}
          >
            <BookNowModal 
              sx={{ 
                fontSize: { xs: '0.8rem', sm: '1rem' },
                px: { xs: 2, sm: 3 },
                py: { xs: 1, sm: 1.5 }
              }} 
            />
          </motion.div>
        </Box>
      </Box>

      {/* Salon Policies Section */}
      <Box sx={{ width: "100%", bgcolor: "#faf5f0", py: 6, overflowX: "hidden" }}>
        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
          <Box 
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              borderRadius: 2,
              overflow: "hidden",
              boxShadow: 3,
              width: "100%",
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

      {/* Global Styles */}
      <style jsx global>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        html, body {
          overflow-x: hidden;
          width: 100%;
          max-width: 100%;
          margin: 0;
          padding: 0;
        }
        ::-webkit-scrollbar {
          display: none;
        }
        * {
          scrollbar-width: none;
        }
        .MuiBox-root {
          max-width: 100%;
        }
      `}</style>
    </Box>
  );
};

export default AppointmentBooking;