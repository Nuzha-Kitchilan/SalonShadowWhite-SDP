import React, { useState } from 'react';
import {
  Typography,
  Button,
  TextField,
  Box,
  Grid,
  Divider,
  Collapse,
  InputAdornment,
  IconButton
} from '@mui/material';
import LockResetIcon from '@mui/icons-material/LockReset';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const PasswordSection = ({ userId, onUpdatePassword }) => {
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

    if (passwordData.newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters');
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
        <Typography 
          variant="h5" 
          component="h3"
          sx={{ 
            fontFamily: "'Poppins', 'Roboto', sans-serif",
            fontWeight: 500,
            color: '#453C33',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <LockResetIcon sx={{ verticalAlign: 'middle', mr: 1, color: '#BEAF9B' }} />
          Security Settings
        </Typography>
        {showPasswordChange ? 
          <ExpandLessIcon sx={{ color: '#BEAF9B' }} /> : 
          <ExpandMoreIcon sx={{ color: '#BEAF9B' }} />
        }
      </Box>
      
      <Collapse in={showPasswordChange}>
        <Divider sx={{ mb: 3, backgroundColor: 'rgba(190, 175, 155, 0.3)' }} />
        <Box component="form" onSubmit={handlePasswordUpdate}>
          {passwordError && (
            <Typography 
              color="error" 
              variant="body2" 
              sx={{ 
                mb: 2, 
                p: 1.5,
                backgroundColor: 'rgba(211, 47, 47, 0.1)',
                borderRadius: '4px',
                fontWeight: 500
              }}
            >
              {passwordError}
            </Typography>
          )}
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Current Password"
                name="currentPassword"
                type={showCurrentPassword ? "text" : "password"}
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                required
                margin="normal"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        edge="end"
                      >
                        {showCurrentPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                  sx: { borderRadius: '8px' }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: 'rgba(190, 175, 155, 0.5)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#BEAF9B',
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#BEAF9B',
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="New Password"
                name="newPassword"
                type={showNewPassword ? "text" : "password"}
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                required
                margin="normal"
                inputProps={{ minLength: 6 }}
                helperText="Password must be at least 6 characters"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        edge="end"
                      >
                        {showNewPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                  sx: { borderRadius: '8px' }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: 'rgba(190, 175, 155, 0.5)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#BEAF9B',
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#BEAF9B',
                  },
                  '& .MuiFormHelperText-root': {
                    marginLeft: '4px',
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Confirm New Password"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                required
                margin="normal"
                inputProps={{ minLength: 6 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                  sx: { borderRadius: '8px' }
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: 'rgba(190, 175, 155, 0.5)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#BEAF9B',
                    },
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#BEAF9B',
                  },
                }}
              />
            </Grid>
          </Grid>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 2 }}>
            <Button
              variant="outlined"
              onClick={handleCancel}
              sx={{
                borderColor: 'rgba(190, 175, 155, 0.5)',
                color: '#453C33',
                borderRadius: '8px',
                textTransform: 'none',
                fontFamily: "'Poppins', 'Roboto', sans-serif",
                fontWeight: 500,
                padding: '8px 16px',
                '&:hover': {
                  borderColor: '#BEAF9B',
                  backgroundColor: 'rgba(190, 175, 155, 0.04)',
                }
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              startIcon={<LockResetIcon />}
              sx={{
                backgroundColor: "#BEAF9B",
                color: "white",
                padding: "8px 16px",
                borderRadius: "8px",
                fontFamily: "'Poppins', 'Roboto', sans-serif",
                textTransform: "none",
                fontWeight: 500,
                boxShadow: "0 4px 8px rgba(190, 175, 155, 0.3)",
                transition: "all 0.3s ease",
                '&:hover': { 
                  backgroundColor: "#a49683",
                  boxShadow: "0 6px 12px rgba(190, 175, 155, 0.4)",
                  transform: "translateY(-2px)"
                }
              }}
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