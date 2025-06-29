import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  Box, 
  TextField, 
  Button, 
  Alert, 
  Typography, 
  CircularProgress, 
  MenuItem, 
  Autocomplete, 
  Chip,
  Paper,
  Container,
  useMediaQuery,
  useTheme
} from "@mui/material";
import { styled } from '@mui/material/styles';
import jwtDecode from "jwt-decode";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import SpaIcon from '@mui/icons-material/Spa';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import MessageIcon from '@mui/icons-material/Message';

// Styled components to match the design aesthetic
const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: 'rgba(190, 175, 155, 0.3)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(190, 175, 155, 0.5)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#BEAF9B',
    },
  },
  '& .MuiInputLabel-root': {
    color: '#666666',
    fontFamily: "'Poppins', 'Roboto', sans-serif",
    '&.Mui-focused': {
      color: '#453C33',
    },
  },
  '& .MuiInputBase-input': {
    fontFamily: "'Poppins', 'Roboto', sans-serif",
  },
}));

const StyledAutocomplete = styled(Autocomplete)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: 'rgba(190, 175, 155, 0.3)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(190, 175, 155, 0.5)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#BEAF9B',
    },
  },
  '& .MuiInputLabel-root': {
    color: '#666666',
    fontFamily: "'Poppins', 'Roboto', sans-serif",
    '&.Mui-focused': {
      color: '#453C33',
    },
  },
  '& .MuiChip-root': {
    backgroundColor: 'rgba(190, 175, 155, 0.1)',
    borderColor: 'rgba(190, 175, 155, 0.3)',
    color: '#453C33',
    fontFamily: "'Poppins', 'Roboto', sans-serif",
    '& .MuiChip-deleteIcon': {
      color: '#666666',
      '&:hover': {
        color: '#453C33',
      },
    },
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#BEAF9B',
  color: '#FFFFFF',
  fontFamily: "'Poppins', 'Roboto', sans-serif",
  fontWeight: 600,
  borderRadius: '30px',
  padding: '10px 30px',
  '&:hover': {
    backgroundColor: '#a39383',
  },
  '&.Mui-disabled': {
    backgroundColor: 'rgba(190, 175, 155, 0.5)',
    color: '#FFFFFF',
  },
}));

const StyledAlert = styled(Alert)(({ theme }) => ({
  borderRadius: '8px',
  fontFamily: "'Poppins', 'Roboto', sans-serif",
  '&.MuiAlert-standardSuccess': {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderLeft: '4px solid #4caf50',
  },
  '&.MuiAlert-standardError': {
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    borderLeft: '4px solid #f44336',
  },
}));

const SpecialRequestForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
    services: [],
    dateTime: null
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [customerId, setCustomerId] = useState(null);
  const [services, setServices] = useState([]);
  const [serviceInputValue, setServiceInputValue] = useState("");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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

    const fetchServices = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/services");
        if (response.data) {
          setServices(response.data);
        }
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchCustomerInfo();
    fetchServices();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (success) setSuccess(false);
    if (error) setError(null);
  };

  const handleDateTimeChange = (newValue) => {
    setFormData({ ...formData, dateTime: newValue });
    if (success) setSuccess(false);
    if (error) setError(null);
  };

  const handleServicesChange = (event, newValue) => {
    // Ensure newValue is always an array
    const servicesArray = Array.isArray(newValue) ? newValue : [];
    setFormData({ ...formData, services: servicesArray });
    if (success) setSuccess(false);
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setError(null);
    
    if (!formData.message.trim()) {
      setError("Please enter your special request details");
      return;
    }

    if (!formData.dateTime) {
      setError("Please select a date and time");
      return;
    }

    // Enhanced validation for services
    if (!formData.services || !Array.isArray(formData.services) || formData.services.length === 0) {
      setError("Please select at least one service");
      return;
    }

    const validServices = formData.services.filter(service => service && service.service_id);
    if (validServices.length === 0) {
      setError("Please select valid services");
      return;
    }

    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      
      // Format date and time for backend
      const dateObj = new Date(formData.dateTime);
      const preferred_date = dateObj.toISOString().split('T')[0];
      const preferred_time = dateObj.toTimeString().split(' ')[0]; 

      // Extract service IDs for the backend
      const service_ids = validServices.map(service => service.service_id);

      const response = await axios.post(
        "http://localhost:5001/api/specialRequest",
        {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone_number: formData.phone,
          request_details: formData.message,
          service_ids: service_ids,
          preferred_date,
          preferred_time
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setSuccess(true);
        setFormData(prev => ({ ...prev, message: "", services: [], dateTime: null }));
        setServiceInputValue("");
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

  // Get current time to display greeting
  const getCurrentTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <Container maxWidth="md" sx={{ mt: { xs: 2, md: 4 }, mb: 4 }}>
      <Paper 
        elevation={0}
        sx={{ 
          borderRadius: '8px',
          overflow: 'hidden',
          border: '1px solid rgba(190, 175, 155, 0.2)',
          background: 'linear-gradient(to right, rgba(190, 175, 155, 0.1), rgba(255, 255, 255, 0.8))',
        }}
      >
        <Box sx={{ p: { xs: 2, md: 3 }, borderBottom: '1px solid rgba(190, 175, 155, 0.2)' }}>
          <Typography 
            variant={isMobile ? "h5" : "h4"} 
            component="h1" 
            sx={{ 
              fontFamily: "'Poppins', 'Roboto', sans-serif",
              fontWeight: 600,
              color: '#453C33',
              mb: 1
            }}
          >
            Special Request Form
          </Typography>
          
          <Typography 
            variant="body1" 
            sx={{ 
              fontFamily: "'Poppins', 'Roboto', sans-serif",
              color: '#666',
              mb: 1
            }}
          >
            {getCurrentTimeGreeting()}. Please fill out this form to make a special booking request.
          </Typography>
        </Box>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            p: { xs: 2, md: 3 },
          }}
        >
          {success && (
            <StyledAlert severity="success" sx={{ mb: 3 }}>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                Thank you for your request!
              </Typography>
              <Typography variant="body2">
                Our team will review your request and get back to you within 48 hours.
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                You can track the status of this request in your profile section.
              </Typography>
            </StyledAlert>
          )}

          {error && (
            <StyledAlert severity="error" sx={{ mb: 3 }}>
              {error}
            </StyledAlert>
          )}

          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, mb: 2 }}>
            <StyledTextField
              label="First Name"
              name="firstName"
              fullWidth
              required
              value={formData.firstName}
              onChange={handleChange}
              disabled={isLoading}
            />
            <StyledTextField
              label="Last Name"
              name="lastName"
              fullWidth
              required
              value={formData.lastName}
              onChange={handleChange}
              disabled={isLoading}
            />
          </Box>

          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, mb: 2 }}>
            <StyledTextField
              label="Email"
              name="email"
              type="email"
              fullWidth
              required
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
            />
            <StyledTextField
              label="Phone Number"
              name="phone"
              fullWidth
              required
              value={formData.phone}
              onChange={handleChange}
              disabled={isLoading}
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1, 
                fontFamily: "'Poppins', 'Roboto', sans-serif",
                color: '#453C33',
                fontWeight: 600,
                mb: 1
              }}
            >
              <SpaIcon fontSize="small" />
              <span>Service Selection</span>
            </Typography>
            <StyledAutocomplete
              multiple
              options={services}
              getOptionLabel={(option) => option?.service_name || ""}
              value={formData.services}
              onChange={handleServicesChange}
              inputValue={serviceInputValue}
              onInputChange={(event, newInputValue) => {
                setServiceInputValue(newInputValue);
              }}
              freeSolo={false}
              onClose={() => setServiceInputValue("")}
              renderInput={(params) => (
                <StyledTextField
                  {...params}
                  label="Select Services"
                  placeholder={formData.services.length === 0 ? "Choose one or more services..." : ""}
                  helperText={`You can select multiple services. Selected: ${formData.services.length}`}
                  error={formData.services.length === 0}
                  InputProps={{
                    ...params.InputProps,
                    required: false,
                  }}
                />
              )}
              renderOption={(props, option) => (
                <MenuItem {...props} key={option.service_id} sx={{ fontFamily: "'Poppins', 'Roboto', sans-serif" }}>
                  {option.service_name}
                </MenuItem>
              )}
              renderTags={(tagValue, getTagProps) =>
                tagValue.map((option, index) => (
                  <Chip
                    variant="outlined"
                    label={option?.service_name || "Unknown Service"}
                    {...getTagProps({ index })}
                    key={option?.service_id || index}
                    sx={{
                      backgroundColor: 'rgba(190, 175, 155, 0.1)',
                      border: '1px solid rgba(190, 175, 155, 0.3)',
                      color: '#453C33',
                      fontFamily: "'Poppins', 'Roboto', sans-serif",
                      '& .MuiChip-deleteIcon': {
                        color: '#666666',
                        '&:hover': {
                          color: '#453C33',
                        },
                      },
                    }}
                  />
                ))
              }
              isOptionEqualToValue={(option, value) => option?.service_id === value?.service_id}
              noOptionsText="No services found"
              loadingText="Loading services..."
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1, 
                fontFamily: "'Poppins', 'Roboto', sans-serif",
                color: '#453C33',
                fontWeight: 600,
                mb: 1
              }}
            >
              <AccessTimeIcon fontSize="small" />
              <span>Preferred Date & Time</span>
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                label="Select Date & Time"
                value={formData.dateTime}
                onChange={handleDateTimeChange}
                renderInput={(params) => (
                  <StyledTextField
                    {...params}
                    fullWidth
                    required
                    disabled={isLoading}
                  />
                )}
                minDateTime={new Date()}
              />
            </LocalizationProvider>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography 
              variant="subtitle1" 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1, 
                fontFamily: "'Poppins', 'Roboto', sans-serif",
                color: '#453C33',
                fontWeight: 600,
                mb: 1
              }}
            >
              <MessageIcon fontSize="small" />
              <span>Special Request Details</span>
            </Typography>
            <StyledTextField
              name="message"
              fullWidth
              multiline
              rows={4}
              required
              value={formData.message}
              onChange={handleChange}
              disabled={isLoading}
              placeholder="Please describe your special request in detail..."
            />
          </Box>

          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            <StyledButton
              type="submit"
              disabled={isLoading}
              startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
            >
              {isLoading ? "Submitting..." : "Submit Request"}
            </StyledButton>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default SpecialRequestForm;