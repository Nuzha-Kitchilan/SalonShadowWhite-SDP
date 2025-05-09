import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';
import {
  TextField,
  Button,
  Typography,
  Container,
  Box,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  InputAdornment,
  CircularProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import LockResetIcon from '@mui/icons-material/LockReset';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import PasswordOutlinedIcon from '@mui/icons-material/PasswordOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

// Import the reusable ForgotPassword component
import ForgotPassword from '../auth/ForgotPassword';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
        credentials: 'include' // Important for cookies if using them
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store the token and user data
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Update auth context
      login(data.token, data.user);

      // Force a hard redirect to ensure proper state update
      window.location.href = data.user.role === 'admin' ? '/admin' : '/stylist';

    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseForgotPassword = () => {
    setForgotPasswordOpen(false);
  };

  const handleForgotPasswordSuccess = () => {
    // Close the dialog after successful password reset
    setTimeout(() => {
      setForgotPasswordOpen(false);
    }, 2000);
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
        onSubmit={handleLogin}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
          maxWidth: 400,
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
          Welcome Back
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
          label="Username"
          variant="outlined"
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PersonOutlineIcon sx={{ color: "#BEAF9B" }} />
              </InputAdornment>
            ),
          }}
          sx={{
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
          }}
        />
        
        <TextField
          label="Password"
          type={showPassword ? "text" : "password"}
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
          sx={{
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
          }}
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
          {loading ? 'Logging in...' : 'Login'}
        </Button>

        {/* Links section */}
        <Box sx={{ 
          width: '100%', 
          mt: 3, 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 2 
        }}>
          <Typography 
            variant="body2"
            sx={{ 
              fontFamily: "'Poppins', 'Roboto', sans-serif",
              color: "#777"
            }}
          >
            <Link 
              component="button" 
              type="button"
              onClick={() => setForgotPasswordOpen(true)}
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
              Forgot Password?
            </Link>
          </Typography>
          
          <Typography 
            variant="body2" 
            sx={{ 
              textAlign: 'center',
              fontFamily: "'Poppins', 'Roboto', sans-serif",
              color: "#777"
            }}
          >
            Don't have an account?{' '}
            <Link 
              href="/register" 
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
              Sign Up
            </Link>
          </Typography>
        </Box>
      </Box>

      {/* Forgot Password Dialog using the reusable component */}
      <Dialog 
        open={forgotPasswordOpen} 
        onClose={handleCloseForgotPassword}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '12px',
            padding: '16px',
            boxShadow: '0 8px 32px rgba(149, 137, 125, 0.2)'
          }
        }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <LockResetIcon sx={{ mr: 1, color: "#BEAF9B" }} />
            <Typography sx={{ 
              fontFamily: "'Poppins', 'Roboto', sans-serif",
              color: "#453C33",
              fontWeight: 600
            }}>
              Reset Your Password
            </Typography>
          </Box>
          <IconButton 
            onClick={handleCloseForgotPassword}
            sx={{
              color: "#BEAF9B",
              '&:hover': {
                backgroundColor: 'rgba(190, 175, 155, 0.08)'
              }
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent>
          {/* Using the reusable ForgotPassword component */}
          <ForgotPassword 
            onSuccess={handleForgotPasswordSuccess}
            onCancel={handleCloseForgotPassword}
            inDialog={true}
          />
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default Login;