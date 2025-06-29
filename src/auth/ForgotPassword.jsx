import React, { useState } from 'react';
import {
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
} from '@mui/material';
import LockResetIcon from '@mui/icons-material/LockReset';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PasswordOutlinedIcon from '@mui/icons-material/PasswordOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

// Reusable component for both standalone page and modal
const ForgotPassword = ({ onSuccess, onCancel, inDialog = false }) => {
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [step, setStep] = useState(1); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSendOtp = async () => {
    if (!formData.email) {
      setError('Please enter your email address');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const response = await fetch('http://localhost:5001/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send OTP');
      }

      setSuccessMessage('OTP sent to your email');
      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!formData.otp) {
      setError('Please enter the OTP');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const response = await fetch('http://localhost:5001/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: formData.email,
          otp: formData.otp 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Invalid OTP');
      }

      setSuccessMessage('OTP verified successfully');
      setStep(3);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!formData.newPassword || !formData.confirmPassword) {
      setError('Please enter and confirm your new password');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const response = await fetch('http://localhost:5001/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: formData.email,
          newPassword: formData.newPassword 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to reset password');
      }

      setSuccessMessage('Password reset successfully! You can now login with your new password');
      
      // Notify parent component of success
      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
        }, 1000);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      setError('');
    } else if (onCancel) {
      onCancel();
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      {!inDialog && (
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <LockResetIcon sx={{ mr: 1 }} />
          <Typography variant="h5">Reset Your Password</Typography>
        </Box>
      )}

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
          </Typography>
        </Box>
      )}

      {successMessage && (
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
            sx={{ 
              color: "#1b5e20", 
              fontFamily: "'Poppins', 'Roboto', sans-serif" 
            }}
            variant="body2"
          >
            {successMessage}
          </Typography>
        </Box>
      )}

      {step === 1 && (
        <>
          <Typography sx={{ 
            mb: 2, 
            fontFamily: "'Poppins', 'Roboto', sans-serif",
            color: "#453C33"
          }}>
            Enter your email address to receive a verification code
          </Typography>
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailOutlinedIcon sx={{ color: "#BEAF9B" }} />
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
            fullWidth
            variant="contained"
            onClick={handleSendOtp}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
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
            }}
          >
            Send Verification Code
          </Button>
        </>
      )}

      {step === 2 && (
        <>
          <Typography sx={{ 
            mb: 2, 
            fontFamily: "'Poppins', 'Roboto', sans-serif",
            color: "#453C33"
          }}>
            Enter the verification code sent to {formData.email}
          </Typography>
          <TextField
            fullWidth
            label="Verification Code"
            name="otp"
            value={formData.otp}
            onChange={handleChange}
            margin="normal"
            required
            inputProps={{ maxLength: 6 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlinedIcon sx={{ color: "#BEAF9B" }} />
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
            fullWidth
            variant="contained"
            onClick={handleVerifyOtp}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
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
            }}
          >
            Verify Code
          </Button>
        </>
      )}

      {step === 3 && (
        <>
          <Typography sx={{ 
              mb: 2, 
              fontFamily: "'Poppins', 'Roboto', sans-serif",
              color: "#453C33"
            }}>
            Create your new password
          </Typography>
          <TextField
            fullWidth
            label="New Password"
            name="newPassword"
            type={showPassword ? "text" : "password"}
            value={formData.newPassword}
            onChange={handleChange}
            margin="normal"
            required
            inputProps={{ minLength: 6 }}
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
          <TextField
            fullWidth
            label="Confirm New Password"
            name="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            value={formData.confirmPassword}
            onChange={handleChange}
            margin="normal"
            required
            inputProps={{ minLength: 6 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PasswordOutlinedIcon sx={{ color: "#BEAF9B" }} />
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
            fullWidth
            variant="contained"
            onClick={handleResetPassword}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
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
            }}
          >
            Reset Password
          </Button>
        </>
      )}

      {/* Back button */}
      {step > 1 || onCancel ? (
        <Button
          variant="text"
          onClick={handleBack}
          sx={{ 
            mt: 3, 
            color: "#BEAF9B",
            fontFamily: "'Poppins', 'Roboto', sans-serif",
            textTransform: "none",
            '&:hover': {
              backgroundColor: 'rgba(190, 175, 155, 0.08)'
            }
          }}
        >
          {step > 1 ? 'Back to previous step' : 'Cancel'}
        </Button>
      ) : null}
    </Box>
  );
};

export default ForgotPassword;