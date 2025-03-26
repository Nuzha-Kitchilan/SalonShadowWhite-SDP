import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  MenuItem,
  Card,
  CardContent,
  Grid,
  Box,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { motion } from "framer-motion";
import heroImage from "../assets/book.png";

const services = ["Haircut", "Facial", "Manicure", "Pedicure", "Hair Color"];
const stylists = ["Any Available", "Stylist A", "Stylist B", "Stylist C"];

const AppointmentBooking = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    stylist: "",
    date: null,
    time: null,
    notes: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

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
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        {/* Hero Section - Full width */}
        <Box 
          sx={{
            width: "100%",
            position: "relative",
            overflow: "hidden"
          }}
        >
          <Box
            sx={{
              backgroundImage: `linear-gradient(to right, rgba(139, 69, 19, 0.1), rgba(255, 255, 255, 0)), url(${heroImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              height: { xs: "250px", md: "300px" },
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            {/* Animated quote and subquote */}
            <motion.div
              style={{
                textAlign: "center",
                zIndex: 2,
              }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.5, type: "spring", stiffness: 100 }}
                style={{
                  color: "#8B4513", // SaddleBrown - a rich brown color
                  fontFamily: "'Playfair Display', serif", // Fancy serif font
                  fontSize: "32px",
                  fontWeight: "bold",
                  fontStyle: "italic",
                  textShadow: "2px 2px 4px rgba(255, 255, 255, 0.9)",
                  lineHeight: "1.2",
                  marginBottom: "15px"
                }}
              >
                "Beauty begins the moment you decide to be yourself."
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1.5 }}
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: "18px",
                  color: "#a67c52",
                  fontWeight: "500",
                  textShadow: "1px 1px 2px rgba(255, 255, 255, 0.8)",
                }}
              >
                So what's holding you back?
              </motion.div>
            </motion.div>
          </Box>
        </Box>

        <Container maxWidth="md" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
          {/* Rules Section */}
          <Card sx={{ mt: 4, p: 3, backgroundColor: "#f8f8f8" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Salon Booking Rules
              </Typography>
              <ul>
                <li>Appointments should be booked at least 24 hours in advance.</li>
                <li>Cancellation should be done 48 hours prior to the appointment.</li>
                <li>Arrive 10 minutes before your scheduled appointment.</li>
              </ul>
            </CardContent>
          </Card>

          {/* Booking Form */}
          <Card sx={{ mt: 4, p: { xs: 2, sm: 3, md: 4 }, mb: 4 }}>
            <Typography variant="h5" align="center" gutterBottom>
              Book an Appointment
            </Typography>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Full Name"
                    name="name"
                    fullWidth
                    required
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Email"
                    name="email"
                    fullWidth
                    required
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Phone Number"
                    name="phone"
                    fullWidth
                    required
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    label="Select Service"
                    name="service"
                    fullWidth
                    required
                    onChange={handleChange}
                  >
                    {services.map((service, index) => (
                      <MenuItem key={index} value={service}>
                        {service}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    select
                    label="Select Stylist"
                    name="stylist"
                    fullWidth
                    onChange={handleChange}
                  >
                    {stylists.map((stylist, index) => (
                      <MenuItem key={index} value={stylist}>
                        {stylist}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <DatePicker
                    label="Select Date"
                    value={formData.date}
                    onChange={(date) => setFormData({ ...formData, date })}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TimePicker
                    label="Select Time"
                    value={formData.time}
                    onChange={(time) => setFormData({ ...formData, time })}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Additional Notes"
                    name="notes"
                    fullWidth
                    multiline
                    rows={3}
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ mt: 3, display: "block", mx: "auto" }}
              >
                Submit
              </Button>
            </form>
          </Card>
        </Container>
      </LocalizationProvider>
      
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