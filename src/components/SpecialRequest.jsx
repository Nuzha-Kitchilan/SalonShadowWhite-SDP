import React, { useState } from "react";
import axios from "axios";
import { Box, TextField, Button, Alert, Typography } from "@mui/material";

const SpecialRequestForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: ""
  });
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/special-request", formData);
      setSuccess(true);
      setFormData({ firstName: "", lastName: "", email: "", phone: "", message: "" });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        mt: 3,
        maxWidth: 600,
        mx: "auto", // center horizontally
        px: 2
      }}
    >
      <Typography
        variant="h5"
        align="center"
        sx={{ fontWeight: "bold", mb: 3, color: "#333" }}
      >
        Special Booking Request Form
      </Typography>

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          Request submitted successfully!
        </Alert>
      )}

      <TextField
        label="First Name"
        name="firstName"
        fullWidth
        required
        margin="normal"
        value={formData.firstName}
        onChange={handleChange}
      />
      <TextField
        label="Last Name"
        name="lastName"
        fullWidth
        required
        margin="normal"
        value={formData.lastName}
        onChange={handleChange}
      />
      <TextField
        label="Email"
        name="email"
        type="email"
        fullWidth
        required
        margin="normal"
        value={formData.email}
        onChange={handleChange}
      />
      <TextField
        label="Phone Number"
        name="phone"
        fullWidth
        required
        margin="normal"
        value={formData.phone}
        onChange={handleChange}
      />
      <TextField
        label="Special Request"
        name="message"
        fullWidth
        multiline
        rows={4}
        required
        margin="normal"
        value={formData.message}
        onChange={handleChange}
      />

      <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
        <Button
          type="submit"
          variant="contained"
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
          Submit Request
        </Button>
      </Box>
    </Box>
  );
};

export default SpecialRequestForm;
