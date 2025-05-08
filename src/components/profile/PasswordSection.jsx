import React, { useState } from 'react';
import {
  Typography,
  Button,
  TextField,
  Box,
  Grid,
  Divider,
  Collapse
} from '@mui/material';
import LockResetIcon from '@mui/icons-material/LockReset';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

const PasswordSection = ({ userId, onUpdatePassword }) => {
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (passwordError) {
      setPasswordError('');
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }
    
    const success = await onUpdatePassword(passwordData);
    if (success) {
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setShowPasswordChange(false);
    }
  };

  const handleCancel = () => {
    setShowPasswordChange(false);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setPasswordError('');
  };

  return (
    <>
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          cursor: 'pointer',
          mb: showPasswordChange ? 2 : 0
        }}
        onClick={() => setShowPasswordChange(!showPasswordChange)}
      >
        <Typography variant="h5" component="h3">
          <LockResetIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
          Change Password
        </Typography>
        {showPasswordChange ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </Box>
      
      <Collapse in={showPasswordChange}>
        <Divider sx={{ mb: 3 }} />
        <Box component="form" onSubmit={handlePasswordUpdate}>
          {passwordError && (
            <Typography color="error" variant="body2" sx={{ mb: 2 }}>
              {passwordError}
            </Typography>
          )}
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Current Password"
                name="currentPassword"
                type="password"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                required
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="New Password"
                name="newPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                required
                margin="normal"
                inputProps={{ minLength: 6 }}
                helperText="Password must be at least 6 characters"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Confirm New Password"
                name="confirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                required
                margin="normal"
                inputProps={{ minLength: 6 }}
              />
            </Grid>
          </Grid>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 2 }}>
            <Button
              variant="outlined"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              startIcon={<LockResetIcon />}
            >
              Update Password
            </Button>
          </Box>
        </Box>
      </Collapse>
    </>
  );
};

export default PasswordSection;