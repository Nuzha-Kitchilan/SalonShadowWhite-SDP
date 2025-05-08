// import React, { useState, useEffect, useRef } from 'react';
// import {
//   Typography,
//   Avatar,
//   Button,
//   TextField,
//   Box,
//   Grid,
//   IconButton,
//   InputAdornment
// } from '@mui/material';
// import EditIcon from '@mui/icons-material/Edit';
// import CancelIcon from '@mui/icons-material/Cancel';
// import SaveIcon from '@mui/icons-material/Save';
// import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';

// const ProfileSection = ({ adminData, onUpdateProfile }) => {
//   const [editMode, setEditMode] = useState(false);
//   const [formData, setFormData] = useState({});
//   const [previewImage, setPreviewImage] = useState(null);
//   const fileInputRef = useRef(null);

//   // Update local state when adminData changes (from parent)
//   useEffect(() => {
//     // Only update if we have actual data and avoid unnecessary updates
//     if (adminData && Object.keys(adminData).length > 0) {
//       setFormData({ ...adminData });
//     }
//   }, [adminData]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     // Update form data with the file
//     setFormData(prev => ({ ...prev, profileFile: file }));
    
//     // Create a preview URL
//     const reader = new FileReader();
//     reader.onload = () => {
//       setPreviewImage(reader.result);
//     };
//     reader.readAsDataURL(file);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     // Create FormData object if there's a file to upload
//     let dataToSubmit = { ...formData };
    
//     if (formData.profileFile) {
//       const formDataObj = new FormData();
//       Object.keys(formData).forEach(key => {
//         if (key === 'profileFile') {
//           formDataObj.append('profile_image', formData.profileFile);
//         } else if (formData[key] !== undefined && formData[key] !== null) {
//           formDataObj.append(key, formData[key]);
//         }
//       });
//       dataToSubmit = formDataObj;
//     }
    
//     const success = await onUpdateProfile(dataToSubmit);
//     if (success) {
//       setEditMode(false);
//       setPreviewImage(null);
//       // We don't reset formData here as the parent component will update adminData
//       // which will flow down through the useEffect
//     }
//   };

//   const handleCancel = () => {
//     setFormData({ ...adminData });
//     setEditMode(false);
//     setPreviewImage(null);
//   };

//   // Use fallbacks to prevent displaying "undefined" or "null"
//   const firstName = formData.first_name || '';
//   const lastName = formData.last_name || '';
//   const email = formData.email || '';
//   const role = formData.role || '';
//   const profileUrl = formData.profile_url || '';
  
//   // Use preview image if available, otherwise use the profile URL from formData
//   const imageUrl = previewImage || profileUrl || '/default-profile.png';

//   return (
//     <>
//       <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
//         <Box sx={{ position: 'relative' }}>
//           <Avatar
//             src={imageUrl}
//             alt="Profile"
//             sx={{ width: 120, height: 120, mb: 2 }}
//           />
//           {editMode && (
//             <IconButton
//               color="primary"
//               aria-label="upload picture"
//               component="span"
//               sx={{
//                 position: 'absolute',
//                 bottom: 10,
//                 right: -10,
//                 backgroundColor: 'white',
//                 '&:hover': { backgroundColor: '#f5f5f5' },
//               }}
//               onClick={() => fileInputRef.current.click()}
//             >
//               <PhotoCameraIcon />
//             </IconButton>
//           )}
//         </Box>
//         <input
//           ref={fileInputRef}
//           accept="image/*"
//           type="file"
//           onChange={handleFileChange}
//           style={{ display: 'none' }}
//         />
//         <Typography variant="h5" component="h2">
//           {firstName} {lastName}
//         </Typography>
//         <Typography color="text.secondary" sx={{ mb: 2 }}>
//           {role}
//         </Typography>
//         <Button
//           variant={editMode ? "outlined" : "contained"}
//           startIcon={editMode ? <CancelIcon /> : <EditIcon />}
//           onClick={() => editMode ? handleCancel() : setEditMode(true)}
//           sx={{ mb: 2 }}
//         >
//           {editMode ? 'Cancel' : 'Edit Profile'}
//         </Button>
//       </Box>

//       {editMode ? (
//         <Box component="form" onSubmit={handleSubmit}>
//           <Grid container spacing={2}>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="First Name"
//                 name="first_name"
//                 value={firstName}
//                 onChange={handleInputChange}
//                 required
//                 margin="normal"
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="Last Name"
//                 name="last_name"
//                 value={lastName}
//                 onChange={handleInputChange}
//                 required
//                 margin="normal"
//               />
//             </Grid>
//             <Grid item xs={12}>
//               <TextField
//                 fullWidth
//                 label="Email"
//                 name="email"
//                 type="email"
//                 value={email}
//                 onChange={handleInputChange}
//                 required
//                 margin="normal"
//               />
//             </Grid>
//             <Grid item xs={12}>
//               <TextField
//                 fullWidth
//                 label="Profile Image URL"
//                 name="profile_url"
//                 value={profileUrl}
//                 onChange={handleInputChange}
//                 placeholder="Enter image URL"
//                 margin="normal"
//                 InputProps={{
//                   endAdornment: (
//                     <InputAdornment position="end">
//                       <IconButton 
//                         onClick={() => fileInputRef.current.click()}
//                         edge="end"
//                       >
//                         <PhotoCameraIcon />
//                       </IconButton>
//                     </InputAdornment>
//                   ),
//                 }}
//                 helperText="Enter a URL or click the camera icon to upload"
//               />
//             </Grid>
//           </Grid>
//           <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
//             <Button
//               type="submit"
//               variant="contained"
//               color="primary"
//               startIcon={<SaveIcon />}
//             >
//               Save Changes
//             </Button>
//           </Box>
//         </Box>
//       ) : (
//         <Grid container spacing={2}>
//           <Grid item xs={12} sm={6}>
//             <Typography variant="subtitle1">
//               <strong>Email:</strong> {email}
//             </Typography>
//           </Grid>
//           <Grid item xs={12} sm={6}>
//             <Typography variant="subtitle1">
//               <strong>Role:</strong> {role}
//             </Typography>
//           </Grid>
//         </Grid>
//       )}
//     </>
//   );
// };

// export default ProfileSection;














// import React, { useState, useRef } from 'react';
// import {
//   Typography,
//   Avatar,
//   Button,
//   TextField,
//   Box,
//   Grid,
//   IconButton,
//   InputAdornment
// } from '@mui/material';
// import EditIcon from '@mui/icons-material/Edit';
// import CancelIcon from '@mui/icons-material/Cancel';
// import SaveIcon from '@mui/icons-material/Save';
// import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';

// const ProfileSection = ({ adminData, formData, setFormData, onUpdateProfile }) => {
//   const [editMode, setEditMode] = useState(false);
//   const [previewImage, setPreviewImage] = useState(null);
//   const fileInputRef = useRef(null);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     setFormData(prev => ({ ...prev, profileFile: file }));

//     const reader = new FileReader();
//     reader.onload = () => setPreviewImage(reader.result);
//     reader.readAsDataURL(file);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     let dataToSubmit = { ...formData };

//     if (formData.profileFile) {
//       const formDataObj = new FormData();
//       Object.entries(formData).forEach(([key, value]) => {
//         if (key === 'profileFile') formDataObj.append('profile_picture', value);
//         else formDataObj.append(key, value);
//       });
//       dataToSubmit = formDataObj;
//     }

//     const success = await onUpdateProfile(dataToSubmit);
//     if (success) {
//       setEditMode(false);
//       setPreviewImage(null);
//     }
//   };

//   const handleCancel = () => {
//     setFormData({ ...adminData }); // reset form data to parent data
//     setEditMode(false);
//     setPreviewImage(null);
//   };

//   const firstName = formData.first_name || '';
//   const lastName = formData.last_name || '';
//   const email = formData.email || '';
//   const role = formData.role || '';
//   const profileUrl = formData.profile_url || '';

//   const imageUrl = previewImage || profileUrl || '/default-profile.png';

//   return (
//     <>
//       <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
//         <Box sx={{ position: 'relative' }}>
//           <Avatar src={imageUrl} alt={`${firstName} ${lastName}`} sx={{ width: 120, height: 120, mb: 2 }}>
//             {!imageUrl || imageUrl === '/default-profile.png' ? `${firstName?.[0]}${lastName?.[0]}` : null}
//           </Avatar>
//           {editMode && (
//             <IconButton
//               color="primary"
//               sx={{
//                 position: 'absolute', bottom: 10, right: -10, backgroundColor: 'white',
//                 '&:hover': { backgroundColor: '#f5f5f5' }
//               }}
//               onClick={() => fileInputRef.current.click()}
//             >
//               <PhotoCameraIcon />
//             </IconButton>
//           )}
//         </Box>
//         <input ref={fileInputRef} accept="image/*" type="file" onChange={handleFileChange} style={{ display: 'none' }} />
//         <Typography variant="h5">{firstName} {lastName}</Typography>
//         <Typography color="text.secondary" sx={{ mb: 2 }}>{role}</Typography>
//         <Button
//           variant={editMode ? "outlined" : "contained"}
//           startIcon={editMode ? <CancelIcon /> : <EditIcon />}
//           onClick={() => editMode ? handleCancel() : setEditMode(true)}
//           sx={{ mb: 2 }}
//         >
//           {editMode ? 'Cancel' : 'Edit Profile'}
//         </Button>
//       </Box>

//       {editMode ? (
//         <Box component="form" onSubmit={handleSubmit}>
//           <Grid container spacing={2}>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="First Name"
//                 name="first_name"
//                 value={firstName}
//                 onChange={handleInputChange}
//                 required
//                 margin="normal"
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="Last Name"
//                 name="last_name"
//                 value={lastName}
//                 onChange={handleInputChange}
//                 required
//                 margin="normal"
//               />
//             </Grid>
//             <Grid item xs={12}>
//               <TextField
//                 fullWidth
//                 label="Email"
//                 name="email"
//                 type="email"
//                 value={email}
//                 onChange={handleInputChange}
//                 required
//                 margin="normal"
//               />
//             </Grid>
//             <Grid item xs={12}>
//               <TextField
//                 fullWidth
//                 label="Profile Image URL"
//                 name="profile_url"
//                 value={profileUrl}
//                 onChange={handleInputChange}
//                 placeholder="Enter image URL"
//                 margin="normal"
//                 InputProps={{
//                   endAdornment: (
//                     <InputAdornment position="end">
//                       <IconButton onClick={() => fileInputRef.current.click()} edge="end">
//                         <PhotoCameraIcon />
//                       </IconButton>
//                     </InputAdornment>
//                   )
//                 }}
//                 helperText="Enter a URL or click the camera icon to upload"
//               />
//             </Grid>
//           </Grid>
//           <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
//             <Button type="submit" variant="contained" startIcon={<SaveIcon />}>Save Changes</Button>
//           </Box>
//         </Box>
//       ) : (
//         <Grid container spacing={2}>
//           <Grid item xs={12} sm={6}><Typography><strong>Email:</strong> {email}</Typography></Grid>
//           <Grid item xs={12} sm={6}><Typography><strong>Role:</strong> {role}</Typography></Grid>
//         </Grid>
//       )}
//     </>
//   );
// };

// export default ProfileSection;









import React, { useState, useRef, useEffect } from 'react';
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
  const fileInputRef = useRef(null);
  
  // Initialize formData with adminData
  const [formData, setFormData] = useState({ ...adminData });

  // Update formData when adminData changes (important for updates)
  useEffect(() => {
    console.log('adminData changed in ProfileSection:', adminData);
    setFormData({ ...adminData });
    if (!editMode) {
      setPreviewImage(null); // Clear any preview images when not in edit mode
    }
  }, [adminData, editMode]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.match('image.*')) {
      setSnackbar({ open: true, message: 'Please select an image file (jpg, png, etc.)', severity: 'error' });
      return;
    }

    // Validate file size (e.g., 5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setSnackbar({ open: true, message: 'File size should be less than 5MB', severity: 'error' });
      return;
    }

    setFormData(prev => ({ 
      ...prev, 
      profileFile: file,
      profile_url: '' // Clear URL if file is selected
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
    try {
      setIsSubmitting(true);
      console.log('Submitting form data:', formData);
      const success = await onUpdateProfile(formData);
      
      if (success) {
        setEditMode(false);
        setSnackbar({ open: true, message: 'Profile updated successfully!', severity: 'success' });
      }
    } catch (error) {
      console.error('Error in ProfileSection submit:', error);
      setSnackbar({ open: true, message: 'Failed to update profile', severity: 'error' });
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

  // Use the preview image if available, otherwise use the profile URL, otherwise default
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
                src={previewImage || profileUrl || '/default-profile.png'} 
                sx={{ width: 120, height: 120, mb: 3 }}
              />
              <input 
                ref={fileInputRef} 
                accept="image/*" 
                type="file" 
                onChange={handleFileChange} 
                style={{ display: 'none' }} 
              />
              <Button
                variant="contained"
                component="label"
                startIcon={<PhotoCameraIcon />}
                sx={{ mb: 2, width: '100%' }}
                disabled={isSubmitting}
              >
                Upload New Photo
                <input type="file" hidden onChange={handleFileChange} />
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