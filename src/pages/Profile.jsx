import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Alert,
  IconButton,
  Paper,
  CircularProgress,
  Box,
  useMediaQuery,
  useTheme,
  Button,
  Dialog,
  DialogTitle,
  DialogContent
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ProfileSection from '../components/profile/ProfileSection';
import PasswordSection from '../components/profile/PasswordSection';
import { jwtDecode } from 'jwt-decode';
import Register from '../auth/Register';

const AdminProfile = () => {
  const [adminData, setAdminData] = useState({
    id: '',
    first_name: '',
    last_name: '',
    email: '',
    role: '',
    profile_url: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const getCurrentTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const fetchAdminProfile = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const decodedToken = jwtDecode(token);
        if (decodedToken.name || decodedToken.username) {
          setAdminData(prev => ({
            ...prev,
            displayName: decodedToken.name || decodedToken.username
          }));
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      }

      const response = await axios.get('/auth/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setAdminData(prevData => ({
        ...prevData,
        ...response.data
      }));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchAdminProfile();
  }, [fetchAdminProfile]);

  const handleProfileUpdate = async (updatedData) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      let payload;
      let config = { headers };

      if (updatedData.profileFile) {
        payload = new FormData();
        payload.append('profileFile', updatedData.profileFile);

        Object.keys(updatedData).forEach(key => {
          if (key !== 'profileFile' && updatedData[key] !== undefined) {
            payload.append(key, updatedData[key]);
          }
        });

        config.headers['Content-Type'] = 'multipart/form-data';
      } else {
        payload = { ...updatedData };
        delete payload.profileFile;
      }

      const response = await axios.put(
        `/auth/update/${adminData.id}`,
        payload,
        config
      );

      if (response.data) {
        setAdminData(prevData => ({
          ...prevData,
          ...response.data
        }));
      }

      await fetchAdminProfile();

      setSuccess('Profile updated successfully');
      setTimeout(() => setSuccess(''), 3000);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (passwordData) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      await axios.put(
        `/auth/update-password/${adminData.id}`,
        { newPassword: passwordData.newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess('Password updated successfully');
      setTimeout(() => setSuccess(''), 3000);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update password');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterModalOpen = () => {
    setRegisterModalOpen(true);
  };

  const handleRegisterModalClose = () => {
    setRegisterModalOpen(false);
  };

  if (loading && !adminData.id) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress size={40} sx={{ color: '#BEAF9B' }} />
      </Container>
    );
  }

  const displayName = adminData.first_name
    ? `${adminData.first_name} ${adminData.last_name}`
    : adminData.displayName || 'Admin';

  return (
    <Container
      maxWidth="lg"
      sx={{
        mt: { xs: 2, md: 4 },
        mb: 4,
        overflowY: 'auto',
        scrollbarWidth: 'none',
        '&::-webkit-scrollbar': { display: 'none' },
      }}
    >
      <Paper
        elevation={0}
        sx={{
          borderRadius: '8px',
          overflow: 'hidden',
          border: '1px solid rgba(190, 175, 155, 0.2)',
          mb: 4,
          background: 'linear-gradient(to right, rgba(190, 175, 155, 0.1), rgba(255, 255, 255, 0.8))',
        }}
      >
        <Box sx={{ p: { xs: 2, md: 3 }, borderBottom: '1px solid rgba(190, 175, 155, 0.2)' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography
              variant={isMobile ? "h5" : "h4"}
              component="h1"
              sx={{
                fontFamily: "'Poppins', 'Roboto', sans-serif",
                fontWeight: 600,
                color: '#453C33',
                mb: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <AccountCircleIcon fontSize={isMobile ? "medium" : "large"} />
              Admin Profile
            </Typography>
            
            <Button
              variant="contained"
              startIcon={<PersonAddIcon />}
              onClick={handleRegisterModalOpen}
              sx={{
                background: 'linear-gradient(to right, #BEAF9B, #D9CFC2)',
                color: '#fff',
                textTransform: 'none',
                borderRadius: '8px',
                px: 3,
                py: 1,
                '&:hover': {
                  background: 'linear-gradient(to right, #b0a08d, #cec2b3)',
                }
              }}
            >
              Register Admin
            </Button>
          </Box>

          <Typography
            variant="body1"
            sx={{
              fontFamily: "'Poppins', 'Roboto', sans-serif",
              color: '#666',
              mb: 1
            }}
          >
            {getCurrentTimeGreeting()}, {displayName}. Manage your account settings here.
          </Typography>
        </Box>

        <Box sx={{ p: { xs: 2, md: 3 } }}>
          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
                borderRadius: '8px',
                '& .MuiAlert-icon': {
                  color: '#d32f2f'
                }
              }}
              action={
                <IconButton
                  size="small"
                  onClick={() => setError('')}
                  aria-label="close"
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
              sx={{
                mb: 3,
                borderRadius: '8px',
                '& .MuiAlert-icon': {
                  color: '#2e7d32'
                }
              }}
              action={
                <IconButton
                  size="small"
                  onClick={() => setSuccess('')}
                  aria-label="close"
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              }
            >
              {success}
            </Alert>
          )}

          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
              <CircularProgress size={24} sx={{ color: '#BEAF9B' }} />
            </Box>
          )}

          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Paper
              elevation={2}
              sx={{
                p: { xs: 2, md: 3 },
                borderRadius: '8px',
                border: '1px solid rgba(190, 175, 155, 0.2)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0 6px 12px rgba(190, 175, 155, 0.2)'
                }
              }}
            >
              <ProfileSection
                adminData={adminData}
                onUpdateProfile={handleProfileUpdate}
              />
            </Paper>

            <Paper
              elevation={2}
              sx={{
                p: { xs: 2, md: 3 },
                borderRadius: '8px',
                border: '1px solid rgba(190, 175, 155, 0.2)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0 6px 12px rgba(190, 175, 155, 0.2)'
                }
              }}
            >
              <PasswordSection
                userId={adminData.id}
                onUpdatePassword={handlePasswordUpdate}
              />
            </Paper>
          </Box>
        </Box>
      </Paper>

      {/* Register Admin Modal */}
      <Dialog
        open={registerModalOpen}
        onClose={handleRegisterModalClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ 
          fontFamily: "'Poppins', 'Roboto', sans-serif",
          fontWeight: 600,
          color: '#453C33',
          borderBottom: '1px solid rgba(190, 175, 155, 0.2)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          Register New Admin
          <IconButton onClick={handleRegisterModalClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          <Register />
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default AdminProfile;