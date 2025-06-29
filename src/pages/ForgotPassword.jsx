import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  IconButton,
  CircularProgress,
  Link,
  Divider,
  InputAdornment
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import ConfirmationNumberOutlinedIcon from '@mui/icons-material/ConfirmationNumberOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Login from "../assets/login.jpeg";

const ForgotPassword = ({ onBackToLogin }) => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState(1); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await axios.post('http://localhost:5001/api/auth/forgot-password', { email });
      setSuccess('OTP sent to your email');
      setStep(2);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      setError('Please enter the OTP');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await axios.post('http://localhost:5001/api/auth/verify-otp', { email, otp });
      setSuccess('OTP verified successfully');
      setStep(3);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      setError('Please enter and confirm your new password');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await axios.post('http://localhost:5001/api/auth/reset-password', { email, newPassword });
      setSuccess('Password reset successfully! You can now login with your new password');
      setTimeout(() => {
        if (onBackToLogin) {
          onBackToLogin();
        } else {
          navigate('/login');
        }
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else if (onBackToLogin) {
      onBackToLogin();
    } else {
      navigate('/login');
    }
    setError('');
    setSuccess('');
  };

  // Common TextField styling
  const textFieldStyle = {
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
    mb: 3
  };

  const buttonStyle = {
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
  };

  return (
    <Box 
      sx={{ 
        width: "100%", 
        maxWidth: "100%", 
        minHeight: "100vh",
        overflowX: "hidden",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        scrollbarWidth: "none", 
        msOverflowStyle: "none",
        "&::-webkit-scrollbar": {
          display: "none", 
        },
      }}
    >
      {/* Full-screen background image with semi-transparency */}
      <Box
        component="img"
        src={Login}
        alt="Background"
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: -2,
        }}
      />
      
      {/* Additional semi-transparent overlay */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(249, 245, 240, 0.4)",
          backdropFilter: "blur(2px)",
          zIndex: -1,
        }}
      />

      <Paper
        elevation={3}
        sx={{
          position: "relative",
          maxWidth: 450,
          width: "90%",
          p: 4,
          borderRadius: "12px",
          background: "linear-gradient(to right, rgba(255,255,255,0.95), rgba(249, 245, 240, 0.95))",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
          border: "1px solid rgba(190, 175, 155, 0.3)",
        }}
      >
        <Typography 
          variant="h4" 
          gutterBottom 
          sx={{ 
            color: "#453C33",
            fontWeight: 500,
            textAlign: "center",
            mb: 3,
            fontFamily: "'Poppins', 'Roboto', sans-serif",
            letterSpacing: "0.5px",
          }}
        >
          Reset Your Password
        </Typography>

        {error && (
          <Box 
            sx={{ 
              p: 2, 
              mb: 3, 
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
              <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={() => setError('')}
                sx={{ ml: 1, p: 0.5 }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Typography>
          </Box>
        )}

        {success && (
          <Box 
            sx={{ 
              p: 2, 
              mb: 3, 
              backgroundColor: "rgba(76, 175, 80, 0.1)",
              borderRadius: "8px",
              borderLeft: "4px solid #4caf50",
            }}
          >
            <Typography 
              variant="body2"
              sx={{ 
                fontFamily: "'Poppins', 'Roboto', sans-serif",
                color: "#2e7d32"
              }}
            >
              {success}
              <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={() => setSuccess('')}
                sx={{ ml: 1, p: 0.5 }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Typography>
          </Box>
        )}

        {step === 1 && (
          <>
            <Typography 
              variant="body1" 
              sx={{ 
                mb: 3, 
                textAlign: "center",
                color: "#666",
                fontFamily: "'Poppins', 'Roboto', sans-serif" 
              }}
            >
              Enter your email address and we'll send you a code to reset your password.
            </Typography>
            
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailOutlinedIcon sx={{ color: "#BEAF9B" }} />
                  </InputAdornment>
                ),
              }}
              sx={textFieldStyle}
            />
            
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleSendOtp}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
              sx={buttonStyle}
            >
              Send Verification Code
            </Button>
          </>
        )}

        {step === 2 && (
          <>
            <Typography 
              variant="body1" 
              sx={{ 
                mb: 3, 
                textAlign: "center",
                color: "#666",
                fontFamily: "'Poppins', 'Roboto', sans-serif" 
              }}
            >
              We sent a verification code to {email}. Enter it below to continue.
            </Typography>
            
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="otp"
              label="Verification Code"
              name="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              inputProps={{ maxLength: 6 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <ConfirmationNumberOutlinedIcon sx={{ color: "#BEAF9B" }} />
                  </InputAdornment>
                ),
              }}
              sx={textFieldStyle}
            />
            
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleVerifyOtp}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
              sx={buttonStyle}
            >
              Verify Code
            </Button>
          </>
        )}

        {step === 3 && (
          <>
            <Typography 
              variant="body1" 
              sx={{ 
                mb: 3, 
                textAlign: "center",
                color: "#666",
                fontFamily: "'Poppins', 'Roboto', sans-serif" 
              }}
            >
              Create a new password for your account.
            </Typography>
            
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="newPassword"
              label="New Password"
              type={showPassword ? "text" : "password"}
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              inputProps={{ minLength: 6 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon sx={{ color: "#BEAF9B" }} />
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
              sx={textFieldStyle}
            />
            
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm New Password"
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              inputProps={{ minLength: 6 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon sx={{ color: "#BEAF9B" }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                      sx={{ color: "#BEAF9B" }}
                    >
                      {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={textFieldStyle}
            />
            
            <Button
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleResetPassword}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
              sx={buttonStyle}
            >
              Reset Password
            </Button>
          </>
        )}

        <Divider sx={{ width: '100%', my: 3, borderColor: "rgba(190, 175, 155, 0.3)" }} />
        
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Link 
            component="button" 
            onClick={handleBack}
            sx={{
              color: "#BEAF9B",
              textDecoration: "none",
              fontFamily: "'Poppins', 'Roboto', sans-serif",
              fontSize: "0.9rem",
              display: 'flex',
              alignItems: 'center',
              '&:hover': {
                textDecoration: "underline",
              }
            }}
          >
            <ArrowBackIcon sx={{ mr: 1, fontSize: "1rem" }} />
            Back to {step > 1 ? 'previous step' : 'login'}
          </Link>
        </Box>
      </Paper>

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
      `}</style>
    </Box>
  );
};

export default ForgotPassword;