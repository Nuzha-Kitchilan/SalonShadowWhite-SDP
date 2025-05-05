import React, { useState, useEffect } from "react";
import axios from "axios";
import { Box, TextField, Button, Alert, Typography, CircularProgress } from "@mui/material";
import jwtDecode from "jwt-decode";

const SpecialRequestForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: ""
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [customerId, setCustomerId] = useState(null);

  useEffect(() => {
    const fetchCustomerInfo = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          setIsLoading(true);
          const decoded = jwtDecode(token);
          setCustomerId(decoded.customer_ID);

          // Fetch complete customer info from backend
          const response = await axios.get("http://localhost:5001/api/specialRequest/customer-info", {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          if (response.data.success && response.data.data) {
            const customerInfo = response.data.data;
            setFormData(prev => ({
              ...prev,
              firstName: customerInfo.first_name || prev.firstName,
              lastName: customerInfo.last_name || prev.lastName,
              email: customerInfo.email || prev.email,
              phone: customerInfo.phone_numbers?.[0] || prev.phone
            }));
          }
        } catch (error) {
          console.error("Error fetching customer info:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchCustomerInfo();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (success) setSuccess(false);
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.message.trim()) {
      setError("Please enter your special request details");
      return;
    }

    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await axios.post(
        "http://localhost:5001/api/specialRequest",
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone_number: formData.phone,
          request_details: formData.message
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setSuccess(true);
        setFormData(prev => ({ ...prev, message: "" }));
      } else {
        setError(response.data.message || "Failed to submit request");
      }
    } catch (err) {
      console.error("Submission error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to submit request. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        mt: 3,
        maxWidth: 600,
        mx: "auto",
        px: 2
      }}
    >
      <Typography variant="h5" align="center" sx={{ fontWeight: "bold", mb: 3, color: "#333" }}>
        Special Booking Request Form
      </Typography>

      {success && (
        <Alert severity="success" sx={{ mb: 2 }}>
          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
            Thank you for your request!
          </Typography>
          <Typography variant="body2">
            Our team will review your request and get back to you within 48 hours.
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            You can track the status of this request in your profile section.
          </Typography>
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
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
        disabled={isLoading}
      />
      <TextField
        label="Last Name"
        name="lastName"
        fullWidth
        required
        margin="normal"
        value={formData.lastName}
        onChange={handleChange}
        disabled={isLoading}
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
        disabled={isLoading}
      />
      <TextField
        label="Phone Number"
        name="phone"
        fullWidth
        required
        margin="normal"
        value={formData.phone}
        onChange={handleChange}
        disabled={isLoading}
      />
      <TextField
        label="Special Request Details"
        name="message"
        fullWidth
        multiline
        rows={4}
        required
        margin="normal"
        value={formData.message}
        onChange={handleChange}
        disabled={isLoading}
        placeholder="Please describe your special request in detail..."
      />

      <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
        <Button
          type="submit"
          variant="contained"
          disabled={isLoading}
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
          {isLoading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Submit Request"
          )}
        </Button>
      </Box>
    </Box>
  );
};

export default SpecialRequestForm;