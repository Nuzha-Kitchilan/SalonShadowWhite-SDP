import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Box,
  Alert,
  Snackbar,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Chip
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import LockIcon from '@mui/icons-material/Lock';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import PhoneIcon from '@mui/icons-material/Phone';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import { motion } from "framer-motion";
import axios from '../utils/axiosWithAuth'; // Import the axios with auth

const CustomerProfileManagement = () => {
  // State for profile data
  const [profileData, setProfileData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    username: '',
    phoneNumbers: [] 
  });

  // State for password data
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // State for messages/alerts
  const [profileMessage, setProfileMessage] = useState({ text: '', type: '' });
  const [passwordMessage, setPasswordMessage] = useState({ text: '', type: '' });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  // State for tracking if we're actually updating or just viewing
  const [isEditing, setIsEditing] = useState(false);
  
  // New phone number input
  const [newPhoneNumber, setNewPhoneNumber] = useState('');

  // Load profile data on component mount
  useEffect(() => {
    loadCustomerProfile();
  }, []);

  // Load customer profile data
  const loadCustomerProfile = async () => {
    try {
      // Use axios with auth instead of direct fetch
      const response = await axios.get('http://localhost:5001/api/customers/profile');
      
      if (!response.data || !response.data.customer_ID) {
        throw new Error('Invalid profile data');
      }
      
      const data = response.data;
      console.log("Loaded profile data:", data);
      console.log("Phone numbers from API:", data.phoneNumbers);
      
      // Load basic profile data - ensure phoneNumbers is always an array
      setProfileData({
        firstname: data.firstname || '',
        lastname: data.lastname || '',
        email: data.email || '',
        username: data.username || '',
        phoneNumbers: Array.isArray(data.phoneNumbers) ? data.phoneNumbers : []
      });
      
    } catch (error) {
      console.error('Error loading profile:', error);
      showSnackbar('Error loading profile', 'error');
    }
  };

  // Handle profile form input changes
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  // Add new phone number
  const addPhoneNumber = () => {
    if (!newPhoneNumber.trim()) return;
    
    // Update the profileData state with the new phone number
    const updatedPhoneNumbers = [...(profileData.phoneNumbers || []), newPhoneNumber.trim()];
    
    console.log("Adding phone number:", newPhoneNumber.trim());
    console.log("Updated phone numbers array:", updatedPhoneNumbers);
    
    setProfileData(prevData => ({
      ...prevData,
      phoneNumbers: updatedPhoneNumbers
    }));
    
    setNewPhoneNumber('');
  };

  // Remove phone number
  const removePhoneNumber = (index) => {
    setProfileData(prevData => ({
      ...prevData,
      phoneNumbers: prevData.phoneNumbers.filter((_, i) => i !== index)
    }));
  };

  // Handle password form input changes
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  // Update profile
  const updateProfile = async (e) => {
    e.preventDefault();
    
    try {
      // Ensure we have the phoneNumbers array (even if empty)
      const phoneNumbers = profileData.phoneNumbers || [];
      
      // Prepare data for the API call
      const updateData = {
        firstname: profileData.firstname,
        lastname: profileData.lastname,
        email: profileData.email,
        username: profileData.username,
        phoneNumbers: phoneNumbers
      };
      
      console.log("Sending profile update with data:", updateData);
      console.log("Phone numbers being sent:", phoneNumbers);
      
      const response = await axios.put('http://localhost:5001/api/customers/profile-update', updateData);
      
      // Success case
      setProfileMessage({ 
        text: response.data.message || 'Profile updated successfully', 
        type: 'success' 
      });
      
      // Exit edit mode
      setIsEditing(false);
      
      // Reload customer profile to verify changes were saved
      setTimeout(() => {
        loadCustomerProfile();
      }, 500); // Small delay to ensure backend has processed the update
      
    } catch (error) {
      // Enhanced error handling
      const serverMessage = error.response?.data?.message;
      const validationError = error.response?.data?.error;
      
      setProfileMessage({
        text: serverMessage || validationError || 'Failed to update profile',
        type: 'error'
      });
      
      console.error('Update error details:', {
        status: error.response?.status,
        data: error.response?.data,
        config: error.config
      });
    }
  };

  // Change password
  const changePassword = async (e) => {
    e.preventDefault();
    
    // Check if passwords match
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMessage({ text: 'New passwords do not match', type: 'error' });
      return;
    }
    
    try {
      const response = await axios.put('http://localhost:5001/api/customers/profile/password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      const data = response.data;
      
      setPasswordMessage({ text: data.message || 'Password changed successfully', type: 'success' });
      showSnackbar('Password changed successfully', 'success');
      
      // Clear password fields
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to change password';
      setPasswordMessage({ text: errorMessage, type: 'error' });
      showSnackbar(errorMessage, 'error');
      console.error('Error changing password:', error);
    }
  };

  // Show snackbar notification
  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  // Handle snackbar close
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  // Custom styled TextFields
  const StyledTextField = (props) => (
    <TextField
      {...props}
      InputProps={{
        sx: {
          borderRadius: 2,
          '&.Mui-focused': {
            boxShadow: '0 0 0 2px rgba(184, 169, 154, 0.25)',
          }
        },
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          '& fieldset': {
            borderColor: '#b8a99a50',
          },
          '&:hover fieldset': {
            borderColor: '#b8a99a',
          },
          '&.Mui-focused fieldset': {
            borderColor: '#b8a99a',
          },
        },
        '& .MuiFormLabel-root': {
          color: '#72614e99',
          '&.Mui-focused': {
            color: '#72614e',
          },
        },
      }}
    />
  );

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography 
        variant="h4" 
        component="h1" 
        sx={{ 
          mb: 4, 
          color: "#72614e", 
          fontWeight: 500,
          borderBottom: "2px solid #b8a99a",
          pb: 1,
          display: "inline-block"
        }}
      >
        Customer Profile Management
      </Typography>
      
      {/* Profile Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Paper 
          elevation={0} 
          sx={{ 
            p: 3, 
            mb: 4, 
            backgroundColor: "#fff", 
            borderRadius: 2,
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            overflow: "hidden",
            transition: "all 0.3s ease"
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography 
              variant="h5" 
              component="h2" 
              sx={{ 
                fontWeight: '500', 
                color: "#72614e", 
                borderBottom: "2px solid #b8a99a",
                pb: 1
              }}
            >
              {isEditing ? 'Edit Profile' : 'Your Profile'}
            </Typography>
            
            {!isEditing && (
              <Button 
                variant="outlined" 
                sx={{ 
                  color: "#b8a99a", 
                  borderColor: "#b8a99a",
                  borderRadius: 2,
                  "&:hover": {
                    backgroundColor: "rgba(184, 169, 154, 0.08)",
                    borderColor: "#a89987"
                  }
                }}
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </Button>
            )}
          </Box>
          
          <Box component="form" onSubmit={updateProfile} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <StyledTextField
                  margin="normal"
                  required
                  fullWidth
                  id="firstname"
                  label="First Name"
                  name="firstname"
                  value={profileData.firstname}
                  onChange={handleProfileChange}
                  disabled={!isEditing}
                  InputProps={{
                    startAdornment: <PersonIcon sx={{ mr: 1, color: '#72614e80' }} />,
                    sx: {
                      borderRadius: 2,
                      '&.Mui-focused': {
                        boxShadow: '0 0 0 2px rgba(184, 169, 154, 0.25)',
                      }
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <StyledTextField
                  margin="normal"
                  required
                  fullWidth
                  id="lastname"
                  label="Last Name"
                  name="lastname"
                  value={profileData.lastname}
                  onChange={handleProfileChange}
                  disabled={!isEditing}
                  InputProps={{
                    startAdornment: <PersonIcon sx={{ mr: 1, color: '#72614e80' }} />,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <StyledTextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  type="email"
                  value={profileData.email}
                  onChange={handleProfileChange}
                  disabled={!isEditing}
                  InputProps={{
                    startAdornment: <EmailIcon sx={{ mr: 1, color: '#72614e80' }} />,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <StyledTextField
                  margin="normal"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  value={profileData.username}
                  onChange={handleProfileChange}
                  disabled={!isEditing}
                  InputProps={{
                    startAdornment: <PersonIcon sx={{ mr: 1, color: '#72614e80' }} />,
                  }}
                />
              </Grid>
            </Grid>
            
            {/* Phone Numbers Section */}
            <Box sx={{ mt: 3, backgroundColor: "#f9f7f4", p: 2, borderRadius: 2 }}>
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  fontWeight: '500', 
                  mb: 1, 
                  color: "#72614e" 
                }}
              >
                Phone Numbers
              </Typography>
              
              {profileData.phoneNumbers && profileData.phoneNumbers.length > 0 ? (
                <List dense>
                  {profileData.phoneNumbers.map((phone, index) => (
                    <ListItem
                      key={index}
                      secondaryAction={
                        isEditing && (
                          <IconButton 
                            edge="end" 
                            aria-label="delete" 
                            onClick={() => removePhoneNumber(index)}
                            sx={{ 
                              color: "#d47777", 
                              "&:hover": { 
                                backgroundColor: "rgba(212, 119, 119, 0.08)" 
                              } 
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        )
                      }
                      sx={{ backgroundColor: "white", mb: 1, borderRadius: 2 }}
                    >
                      <PhoneIcon sx={{ mr: 1, color: '#72614e' }} />
                      <ListItemText 
                        primary={
                          <Typography sx={{ fontWeight: 'medium', color: "#72614e" }}>
                            {phone}
                          </Typography>
                        } 
                        secondary={`Phone ${index + 1}`} 
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontStyle: 'italic', 
                    color: '#999',
                    p: 2,
                    backgroundColor: "white",
                    borderRadius: 2
                  }}
                >
                  No phone numbers added.
                </Typography>
              )}
              
              {isEditing && (
                <Box sx={{ display: 'flex', mt: 2 }}>
                  <StyledTextField
                    fullWidth
                    label="Add Phone Number"
                    value={newPhoneNumber}
                    onChange={(e) => setNewPhoneNumber(e.target.value)}
                    sx={{ mr: 1, backgroundColor: "white", borderRadius: 2 }}
                    InputProps={{
                      startAdornment: <PhoneIcon sx={{ mr: 1, color: '#72614e80' }} />,
                    }}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addPhoneNumber();
                      }
                    }}
                  />
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={addPhoneNumber}
                    sx={{ 
                      color: "#b8a99a", 
                      borderColor: "#b8a99a",
                      borderRadius: 2,
                      "&:hover": {
                        backgroundColor: "rgba(184, 169, 154, 0.08)",
                        borderColor: "#a89987"
                      }
                    }}
                  >
                    Add
                  </Button>
                </Box>
              )}
            </Box>
            
            {profileMessage.text && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Alert 
                  severity={profileMessage.type} 
                  sx={{ 
                    mt: 2,
                    borderRadius: 2
                  }}
                >
                  {profileMessage.text}
                </Alert>
              </motion.div>
            )}
            
            {isEditing && (
              <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<SaveIcon />}
                  sx={{ 
                    backgroundColor: "#b8a99a",
                    borderRadius: 2,
                    "&:hover": {
                      backgroundColor: "#a89987"
                    }
                  }}
                >
                  Save Changes
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setIsEditing(false);
                    loadCustomerProfile(); // Reset to original data
                  }}
                  sx={{ 
                    color: "#72614e", 
                    borderColor: "#72614e",
                    borderRadius: 2,
                    "&:hover": {
                      backgroundColor: "rgba(114, 97, 78, 0.08)",
                      borderColor: "#5a4d3e"
                    }
                  }}
                >
                  Cancel
                </Button>
              </Box>
            )}
          </Box>
        </Paper>
      </motion.div>
      
      {/* Password Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Paper 
          elevation={0} 
          sx={{ 
            p: 3, 
            backgroundColor: "#fff", 
            borderRadius: 2,
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            overflow: "hidden",
            transition: "all 0.3s ease"
          }}
        >
          <Typography 
            variant="h5" 
            component="h2" 
            sx={{ 
              fontWeight: '500', 
              mb: 2, 
              color: "#72614e", 
              borderBottom: "2px solid #b8a99a",
              pb: 1,
              display: "inline-block"
            }}
          >
            Change Password
          </Typography>
          <Box component="form" onSubmit={changePassword} noValidate>
            <StyledTextField
              margin="normal"
              required
              fullWidth
              name="currentPassword"
              label="Current Password"
              type="password"
              id="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              InputProps={{
                startAdornment: <LockIcon sx={{ mr: 1, color: '#72614e80' }} />,
              }}
            />
            <StyledTextField
              margin="normal"
              required
              fullWidth
              name="newPassword"
              label="New Password"
              type="password"
              id="newPassword"
              inputProps={{ minLength: 8 }}
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              helperText="Password must be at least 8 characters long"
              InputProps={{
                startAdornment: <LockIcon sx={{ mr: 1, color: '#72614e80' }} />,
              }}
            />
            <StyledTextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm New Password"
              type="password"
              id="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              error={passwordData.newPassword !== passwordData.confirmPassword && passwordData.confirmPassword !== ''}
              helperText={
                passwordData.newPassword !== passwordData.confirmPassword && passwordData.confirmPassword !== ''
                  ? 'Passwords do not match'
                  : ''
              }
              InputProps={{
                startAdornment: <LockIcon sx={{ mr: 1, color: '#72614e80' }} />,
              }}
            />
            
            {passwordMessage.text && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Alert 
                  severity={passwordMessage.type} 
                  sx={{ 
                    mt: 2,
                    borderRadius: 2
                  }}
                >
                  {passwordMessage.text}
                </Alert>
              </motion.div>
            )}
            
            <Button
              type="submit"
              variant="contained"
              startIcon={<LockIcon />}
              sx={{ 
                mt: 3, 
                backgroundColor: "#72614e",
                borderRadius: 2,
                "&:hover": {
                  backgroundColor: "#5a4d3e"
                }
              }}
            >
              Change Password
            </Button>
          </Box>
        </Paper>
      </motion.div>
      
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbarSeverity} 
          sx={{ 
            width: '100%', 
            borderRadius: 2,
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default CustomerProfileManagement;