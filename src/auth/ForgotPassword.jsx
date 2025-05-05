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
  Divider
} from '@mui/material';
import LockResetIcon from '@mui/icons-material/LockReset';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';

const ForgotPassword = ({ onBackToLogin }) => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState(1); // 1: email, 2: OTP, 3: new password
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await axios.post('/auth/forgot-password', { email });
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
      await axios.post('/auth/verify-otp', { email, otp });
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
      await axios.post('/auth/reset-password', { email, newPassword });
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

  return (
    <Container component="main" maxWidth="xs" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <LockResetIcon color="primary" sx={{ fontSize: 50, mb: 2 }} />
        <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
          Reset Your Password
        </Typography>

        {error && (
          <Alert 
            severity="error" 
            sx={{ width: '100%', mb: 2 }}
            action={
              <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={() => setError('')}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            }
          >
            {error}
          </Alert>
        )}

        {success && (
          <Alert 
            severity="success" 
            sx={{ width: '100%', mb: 2 }}
            action={
              <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={() => setSuccess('')}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            }
          >
            {success}
          </Alert>
        )}

        {step === 1 && (
          <>
            <Typography variant="body1" sx={{ mb: 3, textAlign: 'center' }}>
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
            />
            <Button
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleSendOtp}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              Send Verification Code
            </Button>
          </>
        )}

        {step === 2 && (
          <>
            <Typography variant="body1" sx={{ mb: 3, textAlign: 'center' }}>
              We sent a 6-digit code to {email}. Enter it below to continue.
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
            />
            <Button
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleVerifyOtp}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              Verify Code
            </Button>
          </>
        )}

        {step === 3 && (
          <>
            <Typography variant="body1" sx={{ mb: 3, textAlign: 'center' }}>
              Create a new password for your account.
            </Typography>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="newPassword"
              label="New Password"
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              inputProps={{ minLength: 6 }}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm New Password"
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              inputProps={{ minLength: 6 }}
            />
            <Button
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleResetPassword}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : null}
            >
              Reset Password
            </Button>
          </>
        )}

        <Divider sx={{ width: '100%', my: 2 }} />
        
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <ArrowBackIcon sx={{ mr: 1 }} />
          <Link 
            component="button" 
            variant="body2"
            onClick={handleBack}
            sx={{ color: 'text.primary' }}
          >
            Back to {step > 1 ? 'previous step' : 'login'}
          </Link>
        </Box>
      </Paper>
    </Container>
  );
};

export default ForgotPassword;