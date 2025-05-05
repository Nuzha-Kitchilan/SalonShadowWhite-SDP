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
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   CircularProgress
// } from '@mui/material';
// import EditIcon from '@mui/icons-material/Edit';
// import CancelIcon from '@mui/icons-material/Cancel';
// import SaveIcon from '@mui/icons-material/Save';
// import LockResetIcon from '@mui/icons-material/LockReset';
// import EmailIcon from '@mui/icons-material/Email';
// import VerifiedIcon from '@mui/icons-material/Verified';

// const AdminProfile = () => {
//   const [adminData, setAdminData] = useState({
//     first_name: '',
//     last_name: '',
//     email: '',
//     role: '',
//     profile_url: ''
//   });
//   const [editMode, setEditMode] = useState(false);
//   const [passwordData, setPasswordData] = useState({
//     currentPassword: '',
//     newPassword: '',
//     confirmPassword: ''
//   });
//   const [forgotPasswordData, setForgotPasswordData] = useState({
//     email: '',
//     otp: '',
//     newPassword: '',
//     confirmNewPassword: ''
//   });
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
//   const [otpStep, setOtpStep] = useState(false);
//   const [resetStep, setResetStep] = useState(false);
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

//   const handleForgotPasswordChange = (e) => {
//     const { name, value } = e.target;
//     setForgotPasswordData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleProfileUpdate = async (e) => {
//     e.preventDefault();
//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.put(
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
//       setTimeout(() => setSuccess(''), 3000);
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to update password');
//     }
//   };

//   const handleForgotPassword = async () => {
//     try {
//       setLoading(true);
//       await axios.post('/auth/forgot-password', { 
//         email: forgotPasswordData.email 
//       });
//       setSuccess('OTP sent to your email');
//       setOtpStep(true);
//       setTimeout(() => setSuccess(''), 3000);
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to send OTP');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleVerifyOtp = async () => {
//     try {
//       setLoading(true);
//       await axios.post('/auth/verify-otp', { 
//         email: forgotPasswordData.email,
//         otp: forgotPasswordData.otp 
//       });
//       setSuccess('OTP verified successfully');
//       setOtpStep(false);
//       setResetStep(true);
//       setTimeout(() => setSuccess(''), 3000);
//     } catch (err) {
//       setError(err.response?.data?.message || 'Invalid OTP');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleResetPassword = async () => {
//     if (forgotPasswordData.newPassword !== forgotPasswordData.confirmNewPassword) {
//       setError('Passwords do not match');
//       return;
//     }

//     try {
//       setLoading(true);
//       await axios.post('/auth/reset-password', { 
//         email: forgotPasswordData.email,
//         newPassword: forgotPasswordData.newPassword 
//       });
//       setSuccess('Password reset successfully');
//       setForgotPasswordOpen(false);
//       setOtpStep(false);
//       setResetStep(false);
//       setForgotPasswordData({
//         email: '',
//         otp: '',
//         newPassword: '',
//         confirmNewPassword: ''
//       });
//       setTimeout(() => setSuccess(''), 3000);
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to reset password');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCloseForgotPassword = () => {
//     setForgotPasswordOpen(false);
//     setOtpStep(false);
//     setResetStep(false);
//     setForgotPasswordData({
//       email: '',
//       otp: '',
//       newPassword: '',
//       confirmNewPassword: ''
//     });
//   };

//   return (
//     <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
//       <Typography variant="h4" component="h1" gutterBottom>
//         Admin Profile
//       </Typography>
      
//       {error && (
//         <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
//           {error}
//         </Alert>
//       )}
      
//       {success && (
//         <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess('')}>
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

//       <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
//         <Typography variant="h5" component="h3" gutterBottom>
//           <LockResetIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
//           Change Password
//         </Typography>
//         <Divider sx={{ mb: 3 }} />
        
//         <Box component="form" onSubmit={handlePasswordUpdate}>
//           <Grid container spacing={2}>
//             <Grid item xs={12}>
//               <TextField
//                 fullWidth
//                 label="Current Password"
//                 name="currentPassword"
//                 type="password"
//                 value={passwordData.currentPassword}
//                 onChange={handlePasswordChange}
//                 required
//                 margin="normal"
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="New Password"
//                 name="newPassword"
//                 type="password"
//                 value={passwordData.newPassword}
//                 onChange={handlePasswordChange}
//                 required
//                 margin="normal"
//                 inputProps={{ minLength: 6 }}
//               />
//             </Grid>
//             <Grid item xs={12} sm={6}>
//               <TextField
//                 fullWidth
//                 label="Confirm New Password"
//                 name="confirmPassword"
//                 type="password"
//                 value={passwordData.confirmPassword}
//                 onChange={handlePasswordChange}
//                 required
//                 margin="normal"
//                 inputProps={{ minLength: 6 }}
//               />
//             </Grid>
//           </Grid>
//           <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
//             <Button
//               variant="text"
//               color="primary"
//               onClick={() => setForgotPasswordOpen(true)}
//             >
//               Forgot Password?
//             </Button>
//             <Button
//               type="submit"
//               variant="contained"
//               color="warning"
//               startIcon={<LockResetIcon />}
//             >
//               Update Password
//             </Button>
//           </Box>
//         </Box>
//       </Paper>

//       {/* Forgot Password Dialog */}
//       <Dialog open={forgotPasswordOpen} onClose={handleCloseForgotPassword}>
//         <DialogTitle>
//           <LockResetIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
//           Password Recovery
//         </DialogTitle>
//         <DialogContent>
//           {!otpStep && !resetStep ? (
//             <>
//               <Typography sx={{ mb: 2 }}>
//                 Enter your email address to receive a verification code
//               </Typography>
//               <TextField
//                 fullWidth
//                 label="Email"
//                 name="email"
//                 type="email"
//                 value={forgotPasswordData.email}
//                 onChange={handleForgotPasswordChange}
//                 margin="normal"
//                 required
//               />
//               <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
//                 <Button onClick={handleCloseForgotPassword}>Cancel</Button>
//                 <Button
//                   variant="contained"
//                   onClick={handleForgotPassword}
//                   disabled={loading || !forgotPasswordData.email}
//                   startIcon={loading ? <CircularProgress size={20} /> : <EmailIcon />}
//                 >
//                   Send OTP
//                 </Button>
//               </Box>
//             </>
//           ) : otpStep ? (
//             <>
//               <Typography sx={{ mb: 2 }}>
//                 Enter the verification code sent to {forgotPasswordData.email}
//               </Typography>
//               <TextField
//                 fullWidth
//                 label="Verification Code"
//                 name="otp"
//                 value={forgotPasswordData.otp}
//                 onChange={handleForgotPasswordChange}
//                 margin="normal"
//                 required
//               />
//               <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
//                 <Button onClick={() => {
//                   setOtpStep(false);
//                   setResetStep(false);
//                 }}>Back</Button>
//                 <Button
//                   variant="contained"
//                   onClick={handleVerifyOtp}
//                   disabled={loading || !forgotPasswordData.otp}
//                   startIcon={loading ? <CircularProgress size={20} /> : <VerifiedIcon />}
//                 >
//                   Verify
//                 </Button>
//               </Box>
//             </>
//           ) : (
//             <>
//               <Typography sx={{ mb: 2 }}>
//                 Enter your new password
//               </Typography>
//               <TextField
//                 fullWidth
//                 label="New Password"
//                 name="newPassword"
//                 type="password"
//                 value={forgotPasswordData.newPassword}
//                 onChange={handleForgotPasswordChange}
//                 margin="normal"
//                 required
//                 inputProps={{ minLength: 6 }}
//               />
//               <TextField
//                 fullWidth
//                 label="Confirm New Password"
//                 name="confirmNewPassword"
//                 type="password"
//                 value={forgotPasswordData.confirmNewPassword}
//                 onChange={handleForgotPasswordChange}
//                 margin="normal"
//                 required
//                 inputProps={{ minLength: 6 }}
//               />
//               <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
//                 <Button onClick={() => {
//                   setOtpStep(true);
//                   setResetStep(false);
//                 }}>Back</Button>
//                 <Button
//                   variant="contained"
//                   onClick={handleResetPassword}
//                   disabled={loading || !forgotPasswordData.newPassword || !forgotPasswordData.confirmNewPassword}
//                   startIcon={loading ? <CircularProgress size={20} /> : <LockResetIcon />}
//                 >
//                   Reset Password
//                 </Button>
//               </Box>
//             </>
//           )}
//         </DialogContent>
//       </Dialog>
//     </Container>
//   );
// };

// export default AdminProfile;


















import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Avatar,
  Button,
  TextField,
  Paper,
  Box,
  Grid,
  Alert,
  Divider,
  Collapse,
  IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Cancel';
import SaveIcon from '@mui/icons-material/Save';
import LockResetIcon from '@mui/icons-material/LockReset';
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

const AdminProfile = () => {
  const [adminData, setAdminData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    role: '',
    profile_url: ''
  });
  const [editMode, setEditMode] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get('/auth/profile', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setAdminData(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch profile');
      }
    };

    fetchAdminProfile();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAdminData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `/auth/update/${adminData.id}`,
        adminData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setSuccess('Profile updated successfully');
      setEditMode(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `/auth/update-password/${adminData.id}`,
        { newPassword: passwordData.newPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setSuccess('Password updated successfully');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setShowPasswordChange(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update password');
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Admin Profile
      </Typography>
      
      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 3 }} 
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
          sx={{ mb: 3 }} 
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

      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
          <Avatar
            src={adminData.profile_url || '/default-profile.png'}
            alt="Profile"
            sx={{ width: 120, height: 120, mb: 2 }}
          />
          <Typography variant="h5" component="h2">
            {adminData.first_name} {adminData.last_name}
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            {adminData.role}
          </Typography>
          <Button
            variant={editMode ? "outlined" : "contained"}
            startIcon={editMode ? <CancelIcon /> : <EditIcon />}
            onClick={() => setEditMode(!editMode)}
            sx={{ mb: 2 }}
          >
            {editMode ? 'Cancel' : 'Edit Profile'}
          </Button>
        </Box>

        {editMode ? (
          <Box component="form" onSubmit={handleProfileUpdate}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  name="first_name"
                  value={adminData.first_name}
                  onChange={handleInputChange}
                  required
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  name="last_name"
                  value={adminData.last_name}
                  onChange={handleInputChange}
                  required
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={adminData.email}
                  onChange={handleInputChange}
                  required
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Profile Image URL"
                  name="profile_url"
                  value={adminData.profile_url || ''}
                  onChange={handleInputChange}
                  placeholder="Enter image URL"
                  margin="normal"
                />
              </Grid>
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                startIcon={<SaveIcon />}
              >
                Save Changes
              </Button>
            </Box>
          </Box>
        ) : (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">
                <strong>Email:</strong> {adminData.email}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1">
                <strong>Role:</strong> {adminData.role}
              </Typography>
            </Grid>
          </Grid>
        )}
      </Paper>

      <Paper elevation={3} sx={{ p: 3 }}>
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
                onClick={() => {
                  setShowPasswordChange(false);
                  setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                  });
                }}
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
      </Paper>
    </Container>
  );
};

export default AdminProfile;