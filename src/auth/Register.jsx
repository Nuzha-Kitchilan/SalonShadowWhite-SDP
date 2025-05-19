import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TextField,
  Button,
  Typography,
  Container,
  Box,
  IconButton,
  InputAdornment,
  Link,
  CircularProgress
} from '@mui/material';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
import PasswordOutlinedIcon from '@mui/icons-material/PasswordOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const Register = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    username: '',
    password: '',
    role: 'Admin',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Ensure all fields are filled
    if (!formData.first_name || !formData.last_name || !formData.email || !formData.username || !formData.password) {
      setError('All fields are required');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('http://localhost:5001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Registration failed: ${response.status}`);
      }

      // Redirect to login after successful registration
      navigate('/login');
      
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.message || 'Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Common TextField styling
  const textFieldStyles = {
    mb: 3,
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "rgba(190, 175, 155, 0.3)",
        borderRadius: "8px",
      },
      "&:hover fieldset": {
        borderColor: "rgba(190, 175, 155, 0.5)",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#BEAF9B",
      },
    },
    "& .MuiInputLabel-outlined": {
      color: "#666",
      "&.Mui-focused": {
        color: "#BEAF9B",
      },
    },
    "& .MuiInputBase-input": {
      padding: "14px 14px 14px 4px",
      fontFamily: "'Poppins', 'Roboto', sans-serif",
    },
  };

  return (
    <Container
      component="main"
      maxWidth="100%"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(to bottom right, #f8f6f3, #ffffff)',
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        autoComplete="off"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          maxWidth: 450,
          padding: 4,
          backgroundColor: '#fff',
          borderRadius: 2,
          boxShadow: '0 8px 24px rgba(149, 137, 125, 0.12)',
        }}
      >
        <Typography 
          variant="h5" 
          gutterBottom
          sx={{
            fontFamily: "'Poppins', 'Roboto', sans-serif",
            color: "#453C33",
            fontWeight: 600,
            mb: 3
          }}
        >
          Create an Admin Account
        </Typography>

        {error && (
          <Box 
            sx={{ 
              p: 2, 
              mb: 3, 
              width: '100%',
              backgroundColor: "rgba(211, 47, 47, 0.1)",
              borderRadius: "8px",
              borderLeft: "4px solid #d32f2f",
            }}
          >
            <Typography 
              color="error" 
              variant="body2"
              sx={{ fontFamily: "'Poppins', 'Roboto', sans-serif" }}
            >
              {error}
            </Typography>
          </Box>
        )}

        <TextField
          label="First Name"
          variant="outlined"
          fullWidth
          margin="normal"
          name="first_name"
          value={formData.first_name}
          onChange={handleChange}
          required
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <BadgeOutlinedIcon sx={{ color: "#BEAF9B" }} />
              </InputAdornment>
            ),
          }}
          sx={textFieldStyles}
        />

        <TextField
          label="Last Name"
          variant="outlined"
          fullWidth
          margin="normal"
          name="last_name"
          value={formData.last_name}
          onChange={handleChange}
          required
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <BadgeOutlinedIcon sx={{ color: "#BEAF9B" }} />
              </InputAdornment>
            ),
          }}
          sx={textFieldStyles}
        />

        <TextField
          label="Email"
          type="email"
          variant="outlined"
          fullWidth
          margin="normal"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EmailOutlinedIcon sx={{ color: "#BEAF9B" }} />
              </InputAdornment>
            ),
          }}
          sx={textFieldStyles}
        />

        <TextField
          label="Username"
          variant="outlined"
          fullWidth
          margin="normal"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PersonOutlineIcon sx={{ color: "#BEAF9B" }} />
              </InputAdornment>
            ),
          }}
          sx={textFieldStyles}
        />

        <TextField
          label="Password"
          type={showPassword ? 'text' : 'password'}
          variant="outlined"
          fullWidth
          margin="normal"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PasswordOutlinedIcon sx={{ color: "#BEAF9B" }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                  sx={{ color: "#BEAF9B" }}
                >
                  {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={textFieldStyles}
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
          sx={{
            mt: 2,
            background: "linear-gradient(to right, #BEAF9B, #D9CFC2)",
            color: '#fff',
            py: 1.5,
            px: 4,
            borderRadius: "8px",
            fontWeight: 500,
            letterSpacing: "0.5px",
            fontFamily: "'Poppins', 'Roboto', sans-serif",
            textTransform: "none",
            fontSize: "1rem",
            boxShadow: "0 4px 8px rgba(190, 175, 155, 0.3)",
            transition: "all 0.3s ease",
            '&:hover': { 
              background: "linear-gradient(to right, #b0a08d, #cec2b3)",
              boxShadow: "0 6px 12px rgba(190, 175, 155, 0.4)",
              transform: "translateY(-2px)"
            },
            '&:disabled': {
              background: "linear-gradient(to right, #d8d0c7, #e5e0d8)",
              color: 'rgba(255, 255, 255, 0.7)'
            }
          }}
        >
          {loading ? 'Creating Account...' : 'Register'}
        </Button>

        <Typography 
          variant="body2" 
          sx={{ 
            mt: 3,
            textAlign: 'center',
            fontFamily: "'Poppins', 'Roboto', sans-serif",
            color: "#777"
          }}
        >
          Already have an account?{' '}
          <Link 
            href="/login" 
            sx={{ 
              color: "#BEAF9B",
              textDecoration: "none",
              fontWeight: 500,
              '&:hover': {
                textDecoration: "underline",
                color: "#a39582"
              }
            }}
          >
            Sign In
          </Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default Register;