



// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Box, TextField, Button, Alert, Typography, CircularProgress, MenuItem, Autocomplete } from "@mui/material";
// import jwtDecode from "jwt-decode";
// import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
// import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

// const SpecialRequestForm = () => {
//   const [formData, setFormData] = useState({
//     firstName: "",
//     lastName: "",
//     email: "",
//     phone: "",
//     message: "",
//     service: null, // Changed to null to store the selected service object
//     dateTime: null
//   });
//   const [success, setSuccess] = useState(false);
//   const [error, setError] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [customerId, setCustomerId] = useState(null);
//   const [services, setServices] = useState([]);
//   const [serviceInputValue, setServiceInputValue] = useState("");

//   useEffect(() => {
//     const fetchCustomerInfo = async () => {
//       const token = localStorage.getItem('token');
      
//       if (token) {
//         try {
//           setIsLoading(true);
//           const decoded = jwtDecode(token);
//           setCustomerId(decoded.customer_ID);

//           // Fetch complete customer info from backend
//           const response = await axios.get("http://localhost:5001/api/specialRequest/customer-info", {
//             headers: {
//               Authorization: `Bearer ${token}`
//             }
//           });

//           if (response.data.success && response.data.data) {
//             const customerInfo = response.data.data;
//             setFormData(prev => ({
//               ...prev,
//               firstName: customerInfo.first_name || prev.firstName,
//               lastName: customerInfo.last_name || prev.lastName,
//               email: customerInfo.email || prev.email,
//               phone: customerInfo.phone_numbers?.[0] || prev.phone
//             }));
//           }
//         } catch (error) {
//           console.error("Error fetching customer info:", error);
//         } finally {
//           setIsLoading(false);
//         }
//       }
//     };

//     const fetchServices = async () => {
//       try {
//         const response = await axios.get("http://localhost:5001/api/services");
//         if (response.data) {
//           setServices(response.data);
//         }
//       } catch (error) {
//         console.error("Error fetching services:", error);
//       }
//     };

//     fetchCustomerInfo();
//     fetchServices();
//   }, []);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//     if (success) setSuccess(false);
//     if (error) setError(null);
//   };

//   const handleDateTimeChange = (newValue) => {
//     setFormData({ ...formData, dateTime: newValue });
//     if (success) setSuccess(false);
//     if (error) setError(null);
//   };

//   const handleServiceChange = (event, newValue) => {
//     setFormData({ ...formData, service: newValue });
//     if (success) setSuccess(false);
//     if (error) setError(null);
//   };

//   const handleSubmit = async (e) => {
//   e.preventDefault();
  
//   if (!formData.message.trim()) {
//     setError("Please enter your special request details");
//     return;
//   }

//   if (!formData.dateTime) {
//     setError("Please select a date and time");
//     return;
//   }

//   if (!formData.service) {
//     setError("Please select a service");
//     return;
//   }

//   try {
//     setIsLoading(true);
//     const token = localStorage.getItem('token');
    
//     // Format date and time for backend
//     const dateObj = new Date(formData.dateTime);
//     const preferred_date = dateObj.toISOString().split('T')[0]; // YYYY-MM-DD
//     const preferred_time = dateObj.toTimeString().split(' ')[0]; // HH:MM:SS

//     const response = await axios.post(
//       "http://localhost:5001/api/specialRequest",
//       {
//         firstName: formData.firstName,
//         lastName: formData.lastName,
//         email: formData.email,
//         phone_number: formData.phone,
//         request_details: formData.message,
//         service_id: formData.service.service_id,
//         preferred_date,  // Send as separate date
//         preferred_time   // Send as separate time
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     if (response.data.success) {
//       setSuccess(true);
//       setFormData(prev => ({ ...prev, message: "", service: null, dateTime: null }));
//       setServiceInputValue("");
//     } else {
//       setError(response.data.message || "Failed to submit request");
//     }
//   } catch (err) {
//     console.error("Submission error:", err.response?.data || err.message);
//     setError(err.response?.data?.message || "Failed to submit request. Please try again.");
//   } finally {
//     setIsLoading(false);
//   }
// };

//   return (
//     <Box
//       component="form"
//       onSubmit={handleSubmit}
//       sx={{
//         mt: 3,
//         maxWidth: 600,
//         mx: "auto",
//         px: 2
//       }}
//     >
//       <Typography variant="h5" align="center" sx={{ fontWeight: "bold", mb: 3, color: "#333" }}>
//         Special Booking Request Form
//       </Typography>

//       {success && (
//         <Alert severity="success" sx={{ mb: 2 }}>
//           <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
//             Thank you for your request!
//           </Typography>
//           <Typography variant="body2">
//             Our team will review your request and get back to you within 48 hours.
//           </Typography>
//           <Typography variant="body2" sx={{ mt: 1 }}>
//             You can track the status of this request in your profile section.
//           </Typography>
//         </Alert>
//       )}

//       {error && (
//         <Alert severity="error" sx={{ mb: 2 }}>
//           {error}
//         </Alert>
//       )}

//       <TextField
//         label="First Name"
//         name="firstName"
//         fullWidth
//         required
//         margin="normal"
//         value={formData.firstName}
//         onChange={handleChange}
//         disabled={isLoading}
//       />
//       <TextField
//         label="Last Name"
//         name="lastName"
//         fullWidth
//         required
//         margin="normal"
//         value={formData.lastName}
//         onChange={handleChange}
//         disabled={isLoading}
//       />
//       <TextField
//         label="Email"
//         name="email"
//         type="email"
//         fullWidth
//         required
//         margin="normal"
//         value={formData.email}
//         onChange={handleChange}
//         disabled={isLoading}
//       />
//       <TextField
//         label="Phone Number"
//         name="phone"
//         fullWidth
//         required
//         margin="normal"
//         value={formData.phone}
//         onChange={handleChange}
//         disabled={isLoading}
//       />

//       <LocalizationProvider dateAdapter={AdapterDateFns}>
//         <DateTimePicker
//           label="Preferred Date & Time"
//           value={formData.dateTime}
//           onChange={handleDateTimeChange}
//           renderInput={(params) => (
//             <TextField
//               {...params}
//               fullWidth
//               required
//               margin="normal"
//               disabled={isLoading}
//             />
//           )}
//           minDateTime={new Date()}
//         />
//       </LocalizationProvider>

//       <Autocomplete
//         options={services}
//         getOptionLabel={(option) => option.service_name || ""}
//         value={formData.service}
//         onChange={handleServiceChange}
//         inputValue={serviceInputValue}
//         onInputChange={(event, newInputValue) => {
//           setServiceInputValue(newInputValue);
//         }}
//         freeSolo={false} // Changed to false to only allow selection from options
//         renderInput={(params) => (
//           <TextField
//             {...params}
//             label="Select Service"
//             margin="normal"
//             required
//             fullWidth
//             disabled={isLoading}
//           />
//         )}
//         renderOption={(props, option) => (
//           <MenuItem {...props} key={option.service_id}>
//             {option.service_name}
//           </MenuItem>
//         )}
//       />

//       <TextField
//         label="Special Request Details"
//         name="message"
//         fullWidth
//         multiline
//         rows={4}
//         required
//         margin="normal"
//         value={formData.message}
//         onChange={handleChange}
//         disabled={isLoading}
//         placeholder="Please describe your special request in detail..."
//       />

//       <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
//         <Button
//           type="submit"
//           variant="contained"
//           disabled={isLoading}
//           sx={{
//             backgroundColor: "#d3d3d3",
//             color: "#333",
//             px: 4,
//             py: 1.5,
//             fontWeight: "bold",
//             fontSize: "1rem",
//             borderRadius: "30px",
//             '&:hover': {
//               backgroundColor: "#c0c0c0"
//             }
//           }}
//         >
//           {isLoading ? (
//             <CircularProgress size={24} color="inherit" />
//           ) : (
//             "Submit Request"
//           )}
//         </Button>
//       </Box>
//     </Box>
//   );
// };

// export default SpecialRequestForm;






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
  Divider,
  Grid,
  InputAdornment
} from "@mui/material";
import jwtDecode from "jwt-decode";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EmailIcon from '@mui/icons-material/Email';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import SpaIcon from '@mui/icons-material/Spa';
import MessageIcon from '@mui/icons-material/Message';

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
    
    // Clear any previous errors
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

    // Additional check to ensure services have service_id
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
      const preferred_date = dateObj.toISOString().split('T')[0]; // YYYY-MM-DD
      const preferred_time = dateObj.toTimeString().split(' ')[0]; // HH:MM:SS

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
          service_ids: service_ids, // Send array of service IDs
          preferred_date,  // Send as separate date
          preferred_time   // Send as separate time
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

  return (
    <Paper
      elevation={0}
      sx={{
        mt: 3,
        maxWidth: 800,
        mx: "auto",
        p: 4,
        borderRadius: 2,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        border: '1px solid rgba(190, 175, 155, 0.15)',
        boxShadow: '0 4px 12px rgba(190, 175, 155, 0.1)',
        transition: 'transform 0.2s ease, box-shadow 0.3s ease',
        '&:hover': {
          boxShadow: '0 6px 16px rgba(190, 175, 155, 0.2)',
        }
      }}
    >
      <Typography 
        variant="h4" 
        align="center" 
        sx={{ 
          fontWeight: 500, 
          mb: 3, 
          color: '#282520',
          fontFamily: "'Poppins', 'Roboto', sans-serif",
        }}
      >
        Special Booking Request
      </Typography>
      
      <Divider sx={{ mb: 4, borderColor: 'rgba(190, 175, 155, 0.2)' }} />

      {success && (
        <Alert 
          severity="success" 
          sx={{ 
            mb: 4,
            backgroundColor: 'rgba(190, 175, 155, 0.1)',
            color: '#8C7B6B',
            border: '1px solid rgba(190, 175, 155, 0.3)',
            '& .MuiAlert-icon': {
              color: '#BEAF9B'
            }
          }}
        >
          <Typography variant="body1" sx={{ fontWeight: 500 }}>
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
        <Alert 
          severity="error" 
          sx={{ 
            mb: 4,
            backgroundColor: 'rgba(211, 47, 47, 0.05)',
            color: '#d32f2f',
            border: '1px solid rgba(211, 47, 47, 0.2)'
          }}
        >
          {error}
        </Alert>
      )}

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 3
        }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="First Name"
              name="firstName"
              fullWidth
              required
              value={formData.firstName}
              onChange={handleChange}
              disabled={isLoading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon sx={{ color: '#BEAF9B' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'rgba(190, 175, 155, 0.3)',
                  },
                  '&:hover fieldset': {
                    borderColor: '#BEAF9B',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#BEAF9B',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#8C7B6B',
                },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Last Name"
              name="lastName"
              fullWidth
              required
              value={formData.lastName}
              onChange={handleChange}
              disabled={isLoading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon sx={{ color: '#BEAF9B' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'rgba(190, 175, 155, 0.3)',
                  },
                  '&:hover fieldset': {
                    borderColor: '#BEAF9B',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#BEAF9B',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#8C7B6B',
                },
              }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6}>
            <TextField
              label="Email"
              name="email"
              type="email"
              fullWidth
              required
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon sx={{ color: '#BEAF9B' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'rgba(190, 175, 155, 0.3)',
                  },
                  '&:hover fieldset': {
                    borderColor: '#BEAF9B',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#BEAF9B',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#8C7B6B',
                },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Phone Number"
              name="phone"
              fullWidth
              required
              value={formData.phone}
              onChange={handleChange}
              disabled={isLoading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneIcon sx={{ color: '#BEAF9B' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'rgba(190, 175, 155, 0.3)',
                  },
                  '&:hover fieldset': {
                    borderColor: '#BEAF9B',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#BEAF9B',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#8C7B6B',
                },
              }}
            />
          </Grid>
        </Grid>

        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DateTimePicker
            label="Preferred Date & Time"
            value={formData.dateTime}
            onChange={handleDateTimeChange}
            textField={(params) => (
              <TextField
                {...params}
                fullWidth
                required
                disabled={isLoading}
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <InputAdornment position="start">
                      <CalendarMonthIcon sx={{ color: '#BEAF9B' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: 'rgba(190, 175, 155, 0.3)',
                    },
                    '&:hover fieldset': {
                      borderColor: '#BEAF9B',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#BEAF9B',
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#8C7B6B',
                  },
                }}
              />
            )}
            minDateTime={new Date()}
          />
        </LocalizationProvider>

        <Autocomplete
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
            <TextField
              {...params}
              label="Select Services"
              placeholder={formData.services.length === 0 ? "Choose one or more services..." : ""}
              required
              disabled={isLoading}
              helperText={`Services selected: ${formData.services.length}`}
              error={error && formData.services.length === 0}
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <>
                    <InputAdornment position="start">
                      <SpaIcon sx={{ color: '#BEAF9B' }} />
                    </InputAdornment>
                    {params.InputProps.startAdornment}
                  </>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'rgba(190, 175, 155, 0.3)',
                  },
                  '&:hover fieldset': {
                    borderColor: '#BEAF9B',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#BEAF9B',
                  },
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#8C7B6B',
                },
              }}
            />
          )}
          renderOption={(props, option) => (
            <MenuItem {...props} key={option.service_id}>
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
                  backgroundColor: 'rgba(190, 175, 155, 0.05)',
                  color: '#8C7B6B',
                  border: '1px solid rgba(190, 175, 155, 0.3)',
                  '& .MuiChip-deleteIcon': {
                    color: '#BEAF9B',
                    '&:hover': {
                      color: '#8C7B6B'
                    }
                  }
                }}
              />
            ))
          }
          isOptionEqualToValue={(option, value) => option?.service_id === value?.service_id}
          noOptionsText="No services found"
          loadingText="Loading services..."
          sx={{
            '& .MuiAutocomplete-tag': {
              margin: '3px',
            }
          }}
        />

        <TextField
          label="Special Request Details"
          name="message"
          fullWidth
          multiline
          rows={4}
          required
          value={formData.message}
          onChange={handleChange}
          disabled={isLoading}
          placeholder="Please describe your special request in detail..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.5 }}>
                <MessageIcon sx={{ color: '#BEAF9B' }} />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'rgba(190, 175, 155, 0.3)',
              },
              '&:hover fieldset': {
                borderColor: '#BEAF9B',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#BEAF9B',
              },
            },
            '& .MuiInputLabel-root.Mui-focused': {
              color: '#8C7B6B',
            },
          }}
        />

        <Divider sx={{ my: 2, borderColor: 'rgba(190, 175, 155, 0.2)' }} />

        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
            sx={{
              background: 'linear-gradient(135deg, #282520 0%, #3a352e 100%)',
              color: 'white',
              px: 6,
              py: 1.5,
              fontWeight: 500,
              fontSize: "1rem",
              borderRadius: "30px",
              fontFamily: "'Poppins', 'Roboto', sans-serif",
              '&:hover': {
                background: 'linear-gradient(135deg, #3a352e 0%, #4a453e 100%)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
              },
              '&:disabled': {
                background: 'rgba(190, 175, 155, 0.3)',
                color: 'rgba(0, 0, 0, 0.26)'
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
    </Paper>
  );
};

export default SpecialRequestForm;