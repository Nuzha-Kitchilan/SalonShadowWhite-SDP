
import React, { useState, useEffect } from 'react';
import {
  Typography,
  Avatar,
  Button,
  TextField,
  Box,
  Grid,
  IconButton,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  Snackbar,
  Alert
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Cancel';
import SaveIcon from '@mui/icons-material/Save';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import DeleteIcon from '@mui/icons-material/Delete';

const ProfileSection = ({ adminData, onUpdateProfile }) => {
  const [editMode, setEditMode] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [openImageDialog, setOpenImageDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ ...adminData });

  // Update formData when adminData changes
  useEffect(() => {
    setFormData({ ...adminData });
    if (!editMode) {
      setPreviewImage(null);
    }
  }, [adminData, editMode]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file
    if (!file.type.match('image.*')) {
      setSnackbar({ open: true, message: 'Please select an image file', severity: 'error' });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setSnackbar({ open: true, message: 'File size should be less than 5MB', severity: 'error' });
      return;
    }

    setFormData(prev => ({ 
      ...prev, 
      profileFile: file,
      profile_url: '' 
    }));

    const reader = new FileReader();
    reader.onload = () => setPreviewImage(reader.result);
    reader.readAsDataURL(file);
    setOpenImageDialog(false);
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ 
      ...prev, 
      profileFile: null,
      profile_url: '' 
    }));
    setPreviewImage(null);
    setOpenImageDialog(false);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formDataObj = new FormData();
    formDataObj.append('first_name', formData.first_name);
    formDataObj.append('last_name', formData.last_name);
    formDataObj.append('email', formData.email);
    formDataObj.append('role', formData.role);
    
    // Include existing profile_url if no new file is uploaded
    if (!formData.profileFile && formData.profile_url) {
      formDataObj.append('profile_url', formData.profile_url);
    }
    
    // Append file if it exists
    if (formData.profileFile) {
      formDataObj.append('profile_picture', formData.profileFile);
    }
  
    try {
      const response = await fetch(`http://localhost:5001/api/auth/update/${adminData.id}`, {
        method: 'PUT',
        body: formDataObj,
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
  
      const data = await response.json();
      
      if (response.ok) {
        onUpdateProfile(data.admin);
        setEditMode(false);
        setPreviewImage(null);
        setSnackbar({ open: true, message: 'Profile updated successfully!', severity: 'success' });
      } else {
        throw new Error(data.message || 'Failed to update profile');
      }
    } catch (error) {
      setSnackbar({ open: true, message: error.message, severity: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleCancel = () => {
    setFormData({ ...adminData });
    setEditMode(false);
    setPreviewImage(null);
  };

  const firstName = formData.first_name || '';
  const lastName = formData.last_name || '';
  const email = formData.email || '';
  const role = formData.role || '';
  const profileUrl = formData.profile_url || '';
  const imageUrl = previewImage || profileUrl || '/default-profile.png';

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
          <Box sx={{ position: 'relative' }}>
            <Avatar 
              src={imageUrl} 
              alt={`${firstName} ${lastName}`} 
              sx={{ 
                width: 150, 
                height: 150, 
                mb: 2,
                border: '2px solid',
                borderColor: 'primary.main'
              }}
            >
              {!imageUrl || imageUrl === '/default-profile.png' ? `${firstName?.[0]}${lastName?.[0]}` : null}
            </Avatar>
            {editMode && (
              <IconButton
                color="primary"
                sx={{
                  position: 'absolute', 
                  bottom: 10, 
                  right: 10, 
                  backgroundColor: 'background.paper',
                  '&:hover': { backgroundColor: 'action.hover' },
                  boxShadow: 2
                }}
                onClick={() => setOpenImageDialog(true)}
              >
                <PhotoCameraIcon />
              </IconButton>
            )}
          </Box>
          
          <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
            {firstName} {lastName}
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 2 }}>{role}</Typography>
          
          {!isSubmitting && (
            <Button
              variant={editMode ? "outlined" : "contained"}
              startIcon={editMode ? <CancelIcon /> : <EditIcon />}
              onClick={() => editMode ? handleCancel() : setEditMode(true)}
              sx={{ mb: 2 }}
              color={editMode ? "error" : "primary"}
            >
              {editMode ? 'Cancel' : 'Edit Profile'}
            </Button>
          )}
        </Box>

        {editMode ? (
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  name="first_name"
                  value={firstName}
                  onChange={handleInputChange}
                  required
                  margin="normal"
                  disabled={isSubmitting}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  name="last_name"
                  value={lastName}
                  onChange={handleInputChange}
                  required
                  margin="normal"
                  disabled={isSubmitting}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={handleInputChange}
                  required
                  margin="normal"
                  disabled={isSubmitting}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Profile Image URL"
                  name="profile_url"
                  value={profileUrl}
                  onChange={handleInputChange}
                  placeholder="Enter image URL"
                  margin="normal"
                  disabled={isSubmitting || !!formData.profileFile}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton 
                          onClick={() => setOpenImageDialog(true)} 
                          edge="end"
                          disabled={isSubmitting || !!formData.profileFile}
                        >
                          <PhotoCameraIcon />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                  helperText={formData.profileFile 
                    ? "Using uploaded file (clear to use URL instead)" 
                    : "Enter a URL or click the camera icon to upload"}
                />
              </Grid>
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 2 }}>
              <Button 
                variant="outlined" 
                onClick={handleCancel}
                startIcon={<CancelIcon />}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="contained" 
                startIcon={<SaveIcon />}
                disabled={isSubmitting}
              >
                Save Changes
              </Button>
            </Box>
          </Box>
        ) : (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography><strong>Email:</strong> {email}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography><strong>Role:</strong> {role}</Typography>
            </Grid>
          </Grid>
        )}

        {/* Image Upload Dialog */}
        <Dialog open={openImageDialog} onClose={() => setOpenImageDialog(false)}>
          <DialogTitle>Update Profile Picture</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2 }}>
              <Avatar 
                src={imageUrl} 
                sx={{ width: 120, height: 120, mb: 3 }}
              />
              <Button
                variant="contained"
                component="label"
                startIcon={<PhotoCameraIcon />}
                sx={{ mb: 2, width: '100%' }}
                disabled={isSubmitting}
              >
                Upload New Photo
                <input type="file" hidden accept="image/*" onChange={handleFileChange} />
              </Button>
              {(previewImage || profileUrl) && (
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={handleRemoveImage}
                  sx={{ width: '100%' }}
                  disabled={isSubmitting}
                >
                  Remove Photo
                </Button>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenImageDialog(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      </CardContent>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Card>
  );
};

export default ProfileSection;