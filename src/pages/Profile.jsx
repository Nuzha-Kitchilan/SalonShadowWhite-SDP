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
  Box
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ProfileSection from '../components/profile/ProfileSection';
import PasswordSection from '../components/profile/PasswordSection';

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
  const navigate = useNavigate();

  const fetchAdminProfile = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get('/auth/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setAdminData(response.data);
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
        // Handle file upload with FormData
        payload = new FormData();
        payload.append('profileFile', updatedData.profileFile);
        
        // Add other form fields to FormData
        Object.keys(updatedData).forEach(key => {
          if (key !== 'profileFile' && updatedData[key] !== undefined) {
            payload.append(key, updatedData[key]);
          }
        });
        
        config.headers['Content-Type'] = 'multipart/form-data';
      } else {
        // For JSON data without file uploads
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

  if (loading && !adminData.id) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>Admin Profile</Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}
          action={<IconButton size="small" onClick={() => setError('')}><CloseIcon fontSize="small" /></IconButton>}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}
          action={<IconButton size="small" onClick={() => setSuccess('')}><CloseIcon fontSize="small" /></IconButton>}>
          {success}
        </Alert>
      )}

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <CircularProgress size={24} />
        </Box>
      )}

      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <ProfileSection
          adminData={adminData}
          onUpdateProfile={handleProfileUpdate}
        />
      </Paper>

      <Paper elevation={3} sx={{ p: 3 }}>
        <PasswordSection
          userId={adminData.id}
          onUpdatePassword={handlePasswordUpdate}
        />
      </Paper>
    </Container>
  );
};

export default AdminProfile;