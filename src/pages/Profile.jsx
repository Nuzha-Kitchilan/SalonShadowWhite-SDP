// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import {
//   Container,
//   Typography,
//   Avatar,
//   Button,
//   TextField,
//   Paper,
//   Box,
//   Grid,
//   Alert,
//   Divider,
//   Collapse,
//   IconButton
// } from '@mui/material';
// import EditIcon from '@mui/icons-material/Edit';
// import CancelIcon from '@mui/icons-material/Cancel';
// import SaveIcon from '@mui/icons-material/Save';
// import LockResetIcon from '@mui/icons-material/LockReset';
// import CloseIcon from '@mui/icons-material/Close';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import ExpandLessIcon from '@mui/icons-material/ExpandLess';

// const AdminProfile = () => {
//   const [adminData, setAdminData] = useState({
//     first_name: '',
//     last_name: '',
//     email: '',
//     role: '',
//     profile_url: ''
//   });
//   const [editMode, setEditMode] = useState(false);
//   const [showPasswordChange, setShowPasswordChange] = useState(false);
//   const [passwordData, setPasswordData] = useState({
//     currentPassword: '',
//     newPassword: '',
//     confirmPassword: ''
//   });
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchAdminProfile = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         if (!token) {
//           navigate('/login');
//           return;
//         }

//         const response = await axios.get('/auth/profile', {
//           headers: {
//             Authorization: `Bearer ${token}`
//           }
//         });
//         setAdminData(response.data);
//       } catch (err) {
//         setError(err.response?.data?.message || 'Failed to fetch profile');
//       }
//     };

//     fetchAdminProfile();
//   }, [navigate]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setAdminData(prev => ({ ...prev, [name]: value }));
//   };

//   const handlePasswordChange = (e) => {
//     const { name, value } = e.target;
//     setPasswordData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleProfileUpdate = async (e) => {
//     e.preventDefault();
//     try {
//       const token = localStorage.getItem('token');
//       await axios.put(
//         `/auth/update/${adminData.id}`,
//         adminData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`
//           }
//         }
//       );
//       setSuccess('Profile updated successfully');
//       setEditMode(false);
//       setTimeout(() => setSuccess(''), 3000);
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to update profile');
//     }
//   };

//   const handlePasswordUpdate = async (e) => {
//     e.preventDefault();
//     if (passwordData.newPassword !== passwordData.confirmPassword) {
//       setError('New passwords do not match');
//       return;
//     }

//     try {
//       const token = localStorage.getItem('token');
//       await axios.put(
//         `/auth/update-password/${adminData.id}`,
//         { newPassword: passwordData.newPassword },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`
//           }
//         }
//       );
//       setSuccess('Password updated successfully');
//       setPasswordData({
//         currentPassword: '',
//         newPassword: '',
//         confirmPassword: ''
//       });
//       setShowPasswordChange(false);
//       setTimeout(() => setSuccess(''), 3000);
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to update password');
//     }
//   };

//   return (
//     <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
//       <Typography variant="h4" component="h1" gutterBottom>
//         Admin Profile
//       </Typography>
      
//       {error && (
//         <Alert 
//           severity="error" 
//           sx={{ mb: 3 }} 
//           action={
//             <IconButton
//               size="small"
//               aria-label="close"
//               color="inherit"
//               onClick={() => setError('')}
//             >
//               <CloseIcon fontSize="small" />
//             </IconButton>
//           }
//         >
//           {error}
//         </Alert>
//       )}
      
//       {success && (
//         <Alert 
//           severity="success" 
//           sx={{ mb: 3 }} 
//           action={
//             <IconButton
//               size="small"
//               aria-label="close"
//               color="inherit"
//               onClick={() => setSuccess('')}
//             >
//               <CloseIcon fontSize="small" />
//             </IconButton>
//           }
//         >
//           {success}
//         </Alert>
//       )}

//       <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
//         <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
//           <Avatar
//             src={adminData.profile_url || '/default-profile.png'}
//             alt="Profile"
//             sx={{ width: 120, height: 120, mb: 2 }}
//           />
//           <Typography variant="h5" component="h2">
//             {adminData.first_name} {adminData.last_name}
//           </Typography>
//           <Typography color="text.secondary" sx={{ mb: 2 }}>
//             {adminData.role}
//           </Typography>
//           <Button
//             variant={editMode ? "outlined" : "contained"}
//             startIcon={editMode ? <CancelIcon /> : <EditIcon />}
//             onClick={() => setEditMode(!editMode)}
//             sx={{ mb: 2 }}
//           >
//             {editMode ? 'Cancel' : 'Edit Profile'}
//           </Button>
//         </Box>

//         {editMode ? (
//           <Box component="form" onSubmit={handleProfileUpdate}>
//             <Grid container spacing={2}>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   fullWidth
//                   label="First Name"
//                   name="first_name"
//                   value={adminData.first_name}
//                   onChange={handleInputChange}
//                   required
//                   margin="normal"
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   fullWidth
//                   label="Last Name"
//                   name="last_name"
//                   value={adminData.last_name}
//                   onChange={handleInputChange}
//                   required
//                   margin="normal"
//                 />
//               </Grid>
//               <Grid item xs={12}>
//                 <TextField
//                   fullWidth
//                   label="Email"
//                   name="email"
//                   type="email"
//                   value={adminData.email}
//                   onChange={handleInputChange}
//                   required
//                   margin="normal"
//                 />
//               </Grid>
//               <Grid item xs={12}>
//                 <TextField
//                   fullWidth
//                   label="Profile Image URL"
//                   name="profile_url"
//                   value={adminData.profile_url || ''}
//                   onChange={handleInputChange}
//                   placeholder="Enter image URL"
//                   margin="normal"
//                 />
//               </Grid>
//             </Grid>
//             <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
//               <Button
//                 type="submit"
//                 variant="contained"
//                 color="primary"
//                 startIcon={<SaveIcon />}
//               >
//                 Save Changes
//               </Button>
//             </Box>
//           </Box>
//         ) : (
//           <Grid container spacing={2}>
//             <Grid item xs={12} sm={6}>
//               <Typography variant="subtitle1">
//                 <strong>Email:</strong> {adminData.email}
//               </Typography>
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <Typography variant="subtitle1">
//                 <strong>Role:</strong> {adminData.role}
//               </Typography>
//             </Grid>
//           </Grid>
//         )}
//       </Paper>

//       <Paper elevation={3} sx={{ p: 3 }}>
//         <Box 
//           sx={{ 
//             display: 'flex', 
//             justifyContent: 'space-between', 
//             alignItems: 'center',
//             cursor: 'pointer',
//             mb: showPasswordChange ? 2 : 0
//           }}
//           onClick={() => setShowPasswordChange(!showPasswordChange)}
//         >
//           <Typography variant="h5" component="h3">
//             <LockResetIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
//             Change Password
//           </Typography>
//           {showPasswordChange ? <ExpandLessIcon /> : <ExpandMoreIcon />}
//         </Box>
        
//         <Collapse in={showPasswordChange}>
//           <Divider sx={{ mb: 3 }} />
//           <Box component="form" onSubmit={handlePasswordUpdate}>
//             <Grid container spacing={2}>
//               <Grid item xs={12}>
//                 <TextField
//                   fullWidth
//                   label="Current Password"
//                   name="currentPassword"
//                   type="password"
//                   value={passwordData.currentPassword}
//                   onChange={handlePasswordChange}
//                   required
//                   margin="normal"
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   fullWidth
//                   label="New Password"
//                   name="newPassword"
//                   type="password"
//                   value={passwordData.newPassword}
//                   onChange={handlePasswordChange}
//                   required
//                   margin="normal"
//                   inputProps={{ minLength: 6 }}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   fullWidth
//                   label="Confirm New Password"
//                   name="confirmPassword"
//                   type="password"
//                   value={passwordData.confirmPassword}
//                   onChange={handlePasswordChange}
//                   required
//                   margin="normal"
//                   inputProps={{ minLength: 6 }}
//                 />
//               </Grid>
//             </Grid>
//             <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 2 }}>
//               <Button
//                 variant="outlined"
//                 onClick={() => {
//                   setShowPasswordChange(false);
//                   setPasswordData({
//                     currentPassword: '',
//                     newPassword: '',
//                     confirmPassword: ''
//                   });
//                 }}
//               >
//                 Cancel
//               </Button>
//               <Button
//                 type="submit"
//                 variant="contained"
//                 color="primary"
//                 startIcon={<LockResetIcon />}
//               >
//                 Update Password
//               </Button>
//             </Box>
//           </Box>
//         </Collapse>
//       </Paper>
//     </Container>
//   );
// };

// export default AdminProfile;
































// AdminProfile.jsx
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

  // Use useCallback to memoize the fetchAdminProfile function
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

      console.log('Fetched profile data:', response.data);
      setAdminData(response.data);
    } catch (err) {
      console.error('Error fetching profile:', err);
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
        
        // Set proper content type for multipart/form-data
        config.headers['Content-Type'] = 'multipart/form-data';
      } else {
        // For JSON data without file uploads
        payload = { ...updatedData };
        delete payload.profileFile; // Remove undefined profileFile if present
      }
      
      console.log('Sending update with payload:', payload);
      
      const response = await axios.put(
        `/auth/update/${adminData.id}`,
        payload,
        config
      );
      
      console.log('Update response:', response.data);
      
      // Update local state immediately with server response
      if (response.data) {
        // Make sure to preserve any fields that might not be returned by the API
        setAdminData(prevData => ({
          ...prevData,
          ...response.data
        }));
      }
      
      // Refetch to ensure we have the latest data
      await fetchAdminProfile();
      
      setSuccess('Profile updated successfully');
      setTimeout(() => setSuccess(''), 3000);
      return true;
    } catch (err) {
      console.error('Error updating profile:', err);
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
      console.error('Error updating password:', err);
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