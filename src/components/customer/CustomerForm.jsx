import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  IconButton,
  Grid,
  Box,
  Typography,
  CircularProgress,
  Paper,
  Divider,
  alpha
} from '@mui/material';
import { 
  Add as AddIcon, 
  Delete as DeleteIcon,
  Person as PersonIcon,
  ContactPhone as ContactPhoneIcon,
  Save as SaveIcon
} from '@mui/icons-material';

const CustomerForm = ({ customer, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    username: '',
    phoneNumbers: ['']
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (customer) {
      setFormData({
        firstname: customer.firstname || '',
        lastname: customer.lastname || '',
        email: customer.email || '',
        username: customer.username || '',
        phoneNumbers: customer.phoneNumbers?.length > 0 ? [...customer.phoneNumbers] : ['']
      });
    }
  }, [customer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handlePhoneChange = (index, value) => {
    const updatedPhones = [...formData.phoneNumbers];
    updatedPhones[index] = value;
    setFormData({
      ...formData,
      phoneNumbers: updatedPhones
    });
  };

  const addPhoneField = () => {
    setFormData({
      ...formData,
      phoneNumbers: [...formData.phoneNumbers, '']
    });
  };

  const removePhoneField = (index) => {
    const updatedPhones = formData.phoneNumbers.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      phoneNumbers: updatedPhones.length > 0 ? updatedPhones : ['']
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.firstname.trim()) newErrors.firstname = 'First name is required';
    if (!formData.lastname.trim()) newErrors.lastname = 'Last name is required';
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = 'Invalid email';
    if (formData.username.length < 3) newErrors.username = 'Username must be at least 3 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const filteredPhones = formData.phoneNumbers.filter(phone => phone.trim() !== '');
    onSubmit({
      ...formData,
      phoneNumbers: filteredPhones
    });
  };

  // Section heading with icon helper
  const SectionHeading = ({ icon: Icon, title }) => (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: 1.5,
      mb: 2,
      pb: 1.5,
      borderBottom: "1px solid rgba(190, 175, 155, 0.2)"
    }}>
      <Icon sx={{ color: "#BEAF9B" }} />
      <Typography 
        variant="h6" 
        component="h3" 
        sx={{ 
          color: "#453C33", 
          fontFamily: "'Poppins', 'Roboto', sans-serif",
          fontWeight: 600,
          fontSize: "1rem"
        }}
      >
        {title}
      </Typography>
    </Box>
  );

  const textFieldStyles = {
    '& .MuiInputLabel-root': {
      fontFamily: "'Poppins', 'Roboto', sans-serif",
      color: "#5D4037",
      opacity: 0.8
    },
    '& .MuiOutlinedInput-root': {
      fontFamily: "'Poppins', 'Roboto', sans-serif",
      '& fieldset': {
        borderColor: "rgba(190, 175, 155, 0.5)",
      },
      '&:hover fieldset': {
        borderColor: "#BEAF9B",
      },
      '&.Mui-focused fieldset': {
        borderColor: "#BEAF9B",
      },
    },
    '& .MuiFormHelperText-root': {
      fontFamily: "'Poppins', 'Roboto', sans-serif",
      fontSize: "0.7rem"
    },
    '& .Mui-error .MuiOutlinedInput-notchedOutline': {
      borderColor: '#FF5252 !important'
    },
    '& .Mui-error': {
      color: '#FF5252'
    }
  };

  return (
    <Paper 
      elevation={1} 
      sx={{ 
        borderRadius: "10px",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06)",
        overflow: 'hidden',
        p: 3,
        mb: 3
      }}
    >
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <SectionHeading icon={PersonIcon} title="Customer Information" />
        
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              name="firstname"
              label="First Name"
              fullWidth
              value={formData.firstname}
              onChange={handleChange}
              error={!!errors.firstname}
              helperText={errors.firstname}
              required
              sx={textFieldStyles}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="lastname"
              label="Last Name"
              fullWidth
              value={formData.lastname}
              onChange={handleChange}
              error={!!errors.lastname}
              helperText={errors.lastname}
              required
              sx={textFieldStyles}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="email"
              label="Email"
              type="email"
              fullWidth
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              required
              sx={textFieldStyles}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              name="username"
              label="Username"
              fullWidth
              value={formData.username}
              onChange={handleChange}
              error={!!errors.username}
              helperText={errors.username}
              required
              sx={textFieldStyles}
            />
          </Grid>

          <Grid item xs={12} sx={{ mt: 1 }}>
            <Divider sx={{ 
              my: 1.5,
              borderColor: "rgba(190, 175, 155, 0.15)"
            }} />
            
            <SectionHeading icon={ContactPhoneIcon} title="Phone Numbers" />
            
            {formData.phoneNumbers.map((phone, index) => (
              <Box 
                key={index} 
                sx={{ 
                  display: "flex", 
                  alignItems: "center", 
                  mb: 2,
                  '&:last-of-type': {
                    mb: 3
                  }
                }}
              >
                <TextField
                  fullWidth
                  type="tel"
                  value={phone}
                  onChange={(e) => handlePhoneChange(index, e.target.value)}
                  placeholder="Enter phone number"
                  size="medium"
                  sx={textFieldStyles}
                />
                <IconButton
                  onClick={() => removePhoneField(index)}
                  disabled={formData.phoneNumbers.length === 1}
                  aria-label="Remove phone number"
                  sx={{
                    ml: 1,
                    color: alpha("#FF5252", 0.7),
                    '&:hover': {
                      backgroundColor: alpha("#FF5252", 0.04),
                    },
                    '&.Mui-disabled': {
                      color: alpha("#FF5252", 0.3)
                    }
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))}
            
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={addPhoneField}
              sx={{
                borderColor: "rgba(190, 175, 155, 0.5)",
                color: "#5D4037",
                fontFamily: "'Poppins', 'Roboto', sans-serif",
                fontWeight: 500,
                borderRadius: "8px",
                py: 0.75,
                px: 2,
                '&:hover': {
                  borderColor: "#BEAF9B",
                  backgroundColor: "rgba(190, 175, 155, 0.04)",
                },
                '& .MuiSvgIcon-root': {
                  color: "#BEAF9B"
                }
              }}
            >
              Add Phone Number
            </Button>
          </Grid>

          <Grid item xs={12} sx={{ mt: 3 }}>
            <Divider sx={{ 
              mb: 3,
              borderColor: "rgba(190, 175, 155, 0.15)"
            }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                sx={{
                  backgroundColor: "#BEAF9B",
                  color: "#fff",
                  fontFamily: "'Poppins', 'Roboto', sans-serif",
                  fontWeight: 500,
                  borderRadius: "8px",
                  py: 1.25,
                  px: 3,
                  boxShadow: "0 2px 8px rgba(190, 175, 155, 0.3)",
                  '&:hover': {
                    backgroundColor: "#A89683",
                    boxShadow: "0 4px 10px rgba(190, 175, 155, 0.4)",
                  },
                  '&.Mui-disabled': {
                    backgroundColor: "rgba(190, 175, 155, 0.4)",
                    color: "rgba(255, 255, 255, 0.6)"
                  }
                }}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default CustomerForm;