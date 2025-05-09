// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { AuthContext } from '../auth/AuthContext';
// import {
//   TextField,
//   Button,
//   Typography,
//   Container,
//   Box,
//   Link,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Alert,
//   IconButton,
//   CircularProgress
// } from '@mui/material';
// import CloseIcon from '@mui/icons-material/Close';
// import LockResetIcon from '@mui/icons-material/LockReset';

// const Login = () => {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
//   const [forgotPasswordData, setForgotPasswordData] = useState({
//     email: '',
//     otp: '',
//     newPassword: '',
//     confirmPassword: ''
//   });
//   const [forgotPasswordStep, setForgotPasswordStep] = useState(1); // 1: email, 2: OTP, 3: new password
//   const [loading, setLoading] = useState(false);
//   const [successMessage, setSuccessMessage] = useState('');
//   const navigate = useNavigate();
//   const { login } = React.useContext(AuthContext);

//   // const handleLogin = async (e) => {
//   //   e.preventDefault();
//   //   setError('');

//   //   if (!username || !password) {
//   //     setError('Please enter both username and password');
//   //     return;
//   //   }

//   //   try {
//   //     const response = await fetch('http://localhost:5001/api/auth/login', {
//   //       method: 'POST',
//   //       headers: { 'Content-Type': 'application/json' },
//   //       body: JSON.stringify({ username, password }),
//   //     });

//   //     const data = await response.json();

//   //     if (!response.ok) {
//   //       setError(data.message || 'Login failed');
//   //       return;
//   //     }

//   //     if (!data.token) {
//   //       setError('No authentication token received');
//   //       return;
//   //     }

//   //     localStorage.setItem('token', data.token);
//   //     login(data.token);
//   //     navigate('/');
//   //   } catch (error) {
//   //     console.error('Login error:', error);
//   //     setError('Login failed. Please try again.');
//   //   }
//   // };

  

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setError('');

//     try {
//         const response = await fetch('http://localhost:5001/api/auth/login', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ username, password }),
//             credentials: 'include' // Important for cookies if using them
//         });

//         const data = await response.json();

//         if (!response.ok) {
//             setError(data.message || 'Login failed');
//             return;
//         }

//         // Store the token and user data
//         localStorage.setItem('token', data.token);
//         localStorage.setItem('user', JSON.stringify(data.user));

//         // Update auth context
//         login(data.token, data.user);

//         // Force a hard redirect to ensure proper state update
//         window.location.href = data.user.role === 'admin' ? '/admin' : '/stylist';

//     } catch (error) {
//         console.error('Login error:', error);
//         setError('Login failed. Please try again.');
//     }
// };
  
  
//   const handleForgotPassword = async () => {
//     if (!forgotPasswordData.email) {
//       setError('Please enter your email address');
//       return;
//     }

//     try {
//       setLoading(true);
//       setError('');
//       const response = await fetch('http://localhost:5001/api/auth/forgot-password', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email: forgotPasswordData.email }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || 'Failed to send OTP');
//       }

//       setSuccessMessage('OTP sent to your email');
//       setForgotPasswordStep(2);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleVerifyOtp = async () => {
//     if (!forgotPasswordData.otp) {
//       setError('Please enter the OTP');
//       return;
//     }

//     try {
//       setLoading(true);
//       setError('');
//       const response = await fetch('http://localhost:5001/api/auth/verify-otp', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ 
//           email: forgotPasswordData.email,
//           otp: forgotPasswordData.otp 
//         }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || 'Invalid OTP');
//       }

//       setSuccessMessage('OTP verified successfully');
//       setForgotPasswordStep(3);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleResetPassword = async () => {
//     if (!forgotPasswordData.newPassword || !forgotPasswordData.confirmPassword) {
//       setError('Please enter and confirm your new password');
//       return;
//     }

//     if (forgotPasswordData.newPassword !== forgotPasswordData.confirmPassword) {
//       setError('Passwords do not match');
//       return;
//     }

//     try {
//       setLoading(true);
//       setError('');
//       const response = await fetch('http://localhost:5001/api/auth/reset-password', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ 
//           email: forgotPasswordData.email,
//           newPassword: forgotPasswordData.newPassword 
//         }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || 'Failed to reset password');
//       }

//       setSuccessMessage('Password reset successfully! You can now login with your new password');
//       setTimeout(() => {
//         setForgotPasswordOpen(false);
//         setForgotPasswordStep(1);
//         setForgotPasswordData({
//           email: '',
//           otp: '',
//           newPassword: '',
//           confirmPassword: ''
//         });
//       }, 2000);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCloseForgotPassword = () => {
//     setForgotPasswordOpen(false);
//     setForgotPasswordStep(1);
//     setError('');
//     setSuccessMessage('');
//     setForgotPasswordData({
//       email: '',
//       otp: '',
//       newPassword: '',
//       confirmPassword: ''
//     });
//   };

//   const handleForgotPasswordChange = (e) => {
//     const { name, value } = e.target;
//     setForgotPasswordData(prev => ({ ...prev, [name]: value }));
//   };

//   return (
//     <Container
//       component="main"
//       maxWidth="xs"
//       sx={{
//         minHeight: '100vh',
//         display: 'flex',
//         justifyContent: 'center',
//         alignItems: 'center',
//       }}
//     >
//       <Box
//         component="form"
//         onSubmit={handleLogin}
//         sx={{
//           display: 'flex',
//           flexDirection: 'column',
//           alignItems: 'center',
//           width: 400,
//           padding: 3,
//           backgroundColor: '#fff',
//           borderRadius: 2,
//           boxShadow: 3,
//         }}
//       > 
//         <Typography variant="h5" gutterBottom>
//           Welcome Back! 
//         </Typography>

//         <TextField
//           label="Username"
//           variant="outlined"
//           fullWidth
//           margin="normal"
//           value={username}
//           onChange={(e) => setUsername(e.target.value)}
//           required
//         />
//         <TextField
//           label="Password"
//           type="password"
//           variant="outlined"
//           fullWidth
//           margin="normal"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />

//         {error && (
//           <Alert severity="error" sx={{ width: '100%', mt: 2 }}>
//             {error}
//           </Alert>
//         )}

//         <Button
//           type="submit"
//           variant="contained"
//           fullWidth
//           sx={{
//             mt: 3,
//             backgroundColor: '#DCA1A1',
//             '&:hover': { backgroundColor: '#C68888' },
//           }}
//         >
//           Login
//         </Button>

//         {/* Updated layout: Forgot Password on left, Don't have account centered */}
//         <Box sx={{ width: '100%', mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
//           <Typography variant="body2">
//             <Link 
//               component="button" 
//               onClick={() => setForgotPasswordOpen(true)}
//               sx={{ color: '#DCA1A1' }}
//             >
//               Forgot Password?
//             </Link>
//           </Typography>
//           <Typography variant="body2" sx={{ textAlign: 'center' }}>
//             Don't have an account?{' '}
//             <Link href="/register" sx={{ color: '#DCA1A1' }}>
//               Sign Up
//             </Link>
//           </Typography>
//         </Box>
//       </Box>

//       {/* Forgot Password Dialog */}
//       <Dialog open={forgotPasswordOpen} onClose={handleCloseForgotPassword}>
//         <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}>
//           <LockResetIcon sx={{ mr: 1 }} />
//           Reset Your Password
//         </DialogTitle>
//         <DialogContent>
//           {successMessage && (
//             <Alert severity="success" sx={{ mb: 2 }}>
//               {successMessage}
//             </Alert>
//           )}
//           {error && (
//             <Alert severity="error" sx={{ mb: 2 }}>
//               {error}
//             </Alert>
//           )}

//           {forgotPasswordStep === 1 && (
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
//             </>
//           )}

//           {forgotPasswordStep === 2 && (
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
//                 inputProps={{ maxLength: 6 }}
//               />
//             </>
//           )}

//           {forgotPasswordStep === 3 && (
//             <>
//               <Typography sx={{ mb: 2 }}>
//                 Create your new password
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
//                 name="confirmPassword"
//                 type="password"
//                 value={forgotPasswordData.confirmPassword}
//                 onChange={handleForgotPasswordChange}
//                 margin="normal"
//                 required
//                 inputProps={{ minLength: 6 }}
//               />
//             </>
//           )}
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleCloseForgotPassword}>
//             Cancel
//           </Button>
//           <Button
//             onClick={
//               forgotPasswordStep === 1 ? handleForgotPassword :
//               forgotPasswordStep === 2 ? handleVerifyOtp :
//               handleResetPassword
//             }
//             color="primary"
//             variant="contained"
//             disabled={loading}
//             startIcon={loading ? <CircularProgress size={20} /> : null}
//           >
//             {forgotPasswordStep === 1 ? 'Send OTP' :
//              forgotPasswordStep === 2 ? 'Verify OTP' :
//              'Reset Password'}
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Container>
//   );
// };

// export default Login;























// import React, { useState, useContext } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { AuthContext } from '../auth/AuthContext';
// import {
//   TextField,
//   Button,
//   Typography,
//   Container,
//   Box,
//   Link,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Alert,
//   InputAdornment,
//   IconButton,
//   Paper,
//   CircularProgress
// } from '@mui/material';
// import LockResetIcon from '@mui/icons-material/LockReset';
// import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
// import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
// import VisibilityIcon from '@mui/icons-material/Visibility';
// import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

// const Login = () => {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
//   const [forgotPasswordData, setForgotPasswordData] = useState({
//     email: '',
//     otp: '',
//     newPassword: '',
//     confirmPassword: ''
//   });
//   const [forgotPasswordStep, setForgotPasswordStep] = useState(1); // 1: email, 2: OTP, 3: new password
//   const [loading, setLoading] = useState(false);
//   const [successMessage, setSuccessMessage] = useState('');
//   const navigate = useNavigate();
//   const { login } = useContext(AuthContext);

//   const togglePasswordVisibility = () => {
//     setShowPassword(!showPassword);
//   };
  
//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setError('');

//     try {
//         setLoading(true);
//         const response = await fetch('http://localhost:5001/api/auth/login', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ username, password }),
//             credentials: 'include' // Important for cookies if using them
//         });

//         const data = await response.json();

//         if (!response.ok) {
//             setError(data.message || 'Login failed');
//             return;
//         }

//         // Store the token and user data
//         localStorage.setItem('token', data.token);
//         localStorage.setItem('user', JSON.stringify(data.user));

//         // Update auth context
//         login(data.token, data.user);

//         // Force a hard redirect to ensure proper state update
//         window.location.href = data.user.role === 'admin' ? '/admin' : '/stylist';

//     } catch (error) {
//         console.error('Login error:', error);
//         setError('Login failed. Please try again.');
//     } finally {
//         setLoading(false);
//     }
//   };
  
//   const handleForgotPassword = async () => {
//     if (!forgotPasswordData.email) {
//       setError('Please enter your email address');
//       return;
//     }

//     try {
//       setLoading(true);
//       setError('');
//       const response = await fetch('http://localhost:5001/api/auth/forgot-password', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email: forgotPasswordData.email }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || 'Failed to send OTP');
//       }

//       setSuccessMessage('OTP sent to your email');
//       setForgotPasswordStep(2);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleVerifyOtp = async () => {
//     if (!forgotPasswordData.otp) {
//       setError('Please enter the OTP');
//       return;
//     }

//     try {
//       setLoading(true);
//       setError('');
//       const response = await fetch('http://localhost:5001/api/auth/verify-otp', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ 
//           email: forgotPasswordData.email,
//           otp: forgotPasswordData.otp 
//         }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || 'Invalid OTP');
//       }

//       setSuccessMessage('OTP verified successfully');
//       setForgotPasswordStep(3);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleResetPassword = async () => {
//     if (!forgotPasswordData.newPassword || !forgotPasswordData.confirmPassword) {
//       setError('Please enter and confirm your new password');
//       return;
//     }

//     if (forgotPasswordData.newPassword !== forgotPasswordData.confirmPassword) {
//       setError('Passwords do not match');
//       return;
//     }

//     try {
//       setLoading(true);
//       setError('');
//       const response = await fetch('http://localhost:5001/api/auth/reset-password', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ 
//           email: forgotPasswordData.email,
//           newPassword: forgotPasswordData.newPassword 
//         }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || 'Failed to reset password');
//       }

//       setSuccessMessage('Password reset successfully! You can now login with your new password');
//       setTimeout(() => {
//         setForgotPasswordOpen(false);
//         setForgotPasswordStep(1);
//         setForgotPasswordData({
//           email: '',
//           otp: '',
//           newPassword: '',
//           confirmPassword: ''
//         });
//       }, 2000);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCloseForgotPassword = () => {
//     setForgotPasswordOpen(false);
//     setForgotPasswordStep(1);
//     setError('');
//     setSuccessMessage('');
//     setForgotPasswordData({
//       email: '',
//       otp: '',
//       newPassword: '',
//       confirmPassword: ''
//     });
//   };

//   const handleForgotPasswordChange = (e) => {
//     const { name, value } = e.target;
//     setForgotPasswordData(prev => ({ ...prev, [name]: value }));
//   };

//   return (
//     <Container
//       component="main"
//       maxWidth="xs"
//       sx={{
//         minHeight: '100vh',
//         display: 'flex',
//         justifyContent: 'center',
//         alignItems: 'center',
//         background: 'linear-gradient(to bottom, #f9f5f0, #fcfbf9)',
//       }}
//     >
//       <Paper
//         elevation={3}
//         sx={{
//           position: 'relative',
//           maxWidth: 450,
//           width: '100%',
//           p: 4,
//           borderRadius: '12px',
//           background: 'linear-gradient(to right, rgba(255,255,255,0.95), rgba(249, 245, 240, 0.95))',
//           boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
//           border: '1px solid rgba(190, 175, 155, 0.3)',
//         }}
//       >
//         <Typography 
//           variant="h4" 
//           gutterBottom 
//           sx={{ 
//             color: '#453C33',
//             fontWeight: 500,
//             textAlign: 'center',
//             mb: 3,
//             fontFamily: "'Poppins', 'Roboto', sans-serif",
//             letterSpacing: '0.5px',
//           }}
//         >
//           Welcome Back
//         </Typography>
        
//         {error && (
//           <Box 
//             sx={{ 
//               p: 2, 
//               mb: 3, 
//               backgroundColor: 'rgba(211, 47, 47, 0.1)',
//               borderRadius: '8px',
//               borderLeft: '4px solid #d32f2f',
//             }}
//           >
//             <Typography 
//               color="error" 
//               variant="body2"
//               sx={{ fontFamily: "'Poppins', 'Roboto', sans-serif" }}
//             >
//               {error}
//             </Typography>
//           </Box>
//         )}

//         <Box
//           component="form"
//           onSubmit={handleLogin}
//           sx={{
//             display: 'flex',
//             flexDirection: 'column',
//           }}
//         >
//           <Box sx={{ mb: 3 }}>
//             <TextField
//               label="Username"
//               fullWidth
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//               required
//               variant="outlined"
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <PersonOutlineIcon sx={{ color: "#BEAF9B" }} />
//                   </InputAdornment>
//                 ),
//               }}
//               sx={{
//                 "& .MuiOutlinedInput-root": {
//                   "& fieldset": {
//                     borderColor: "rgba(190, 175, 155, 0.3)",
//                     borderRadius: "8px",
//                   },
//                   "&:hover fieldset": {
//                     borderColor: "rgba(190, 175, 155, 0.5)",
//                   },
//                   "&.Mui-focused fieldset": {
//                     borderColor: "#BEAF9B",
//                   },
//                 },
//                 "& .MuiInputLabel-outlined": {
//                   color: "#666",
//                   "&.Mui-focused": {
//                     color: "#BEAF9B",
//                   },
//                 },
//                 "& .MuiInputBase-input": {
//                   padding: "14px 14px 14px 4px",
//                   fontFamily: "'Poppins', 'Roboto', sans-serif",
//                 },
//               }}
//             />
//           </Box>
          
//           <Box sx={{ mb: 4 }}>
//             <TextField
//               type={showPassword ? "text" : "password"}
//               label="Password"
//               fullWidth
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//               variant="outlined"
//               InputProps={{
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <LockOutlinedIcon sx={{ color: "#BEAF9B" }} />
//                   </InputAdornment>
//                 ),
//                 endAdornment: (
//                   <InputAdornment position="end">
//                     <IconButton
//                       onClick={togglePasswordVisibility}
//                       edge="end"
//                       sx={{ color: "#BEAF9B" }}
//                     >
//                       {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
//                     </IconButton>
//                   </InputAdornment>
//                 ),
//               }}
//               sx={{
//                 "& .MuiOutlinedInput-root": {
//                   "& fieldset": {
//                     borderColor: "rgba(190, 175, 155, 0.3)",
//                     borderRadius: "8px",
//                   },
//                   "&:hover fieldset": {
//                     borderColor: "rgba(190, 175, 155, 0.5)",
//                   },
//                   "&.Mui-focused fieldset": {
//                     borderColor: "#BEAF9B",
//                   },
//                 },
//                 "& .MuiInputLabel-outlined": {
//                   color: "#666",
//                   "&.Mui-focused": {
//                     color: "#BEAF9B",
//                   },
//                 },
//                 "& .MuiInputBase-input": {
//                   padding: "14px 14px 14px 4px",
//                   fontFamily: "'Poppins', 'Roboto', sans-serif",
//                 },
//               }}
//             />
//           </Box>

//           <Button
//             type="submit"
//             variant="contained"
//             fullWidth
//             disabled={loading}
//             sx={{
//               background: "linear-gradient(to right, #BEAF9B, #D9CFC2)",
//               color: '#fff',
//               py: 1.5,
//               px: 4,
//               borderRadius: "8px",
//               fontWeight: 500,
//               letterSpacing: "0.5px",
//               fontFamily: "'Poppins', 'Roboto', sans-serif",
//               textTransform: "none",
//               fontSize: "1rem",
//               boxShadow: "0 4px 8px rgba(190, 175, 155, 0.3)",
//               transition: "all 0.3s ease",
//               '&:hover': { 
//                 background: "linear-gradient(to right, #b0a08d, #cec2b3)",
//                 boxShadow: "0 6px 12px rgba(190, 175, 155, 0.4)",
//                 transform: "translateY(-2px)"
//               },
//             }}
//           >
//             {loading ? (
//               <CircularProgress size={24} color="inherit" />
//             ) : (
//               'Sign In'
//             )}
//           </Button>

//           <Box 
//             sx={{ 
//               mt: 3, 
//               textAlign: "center",
//               display: "flex",
//               justifyContent: "center"
//             }}
//           >
//             <Link 
//               component="button"
//               onClick={() => setForgotPasswordOpen(true)}
//               sx={{
//                 color: "#BEAF9B",
//                 textDecoration: "none",
//                 fontFamily: "'Poppins', 'Roboto', sans-serif",
//                 fontSize: "0.9rem",
//                 '&:hover': {
//                   textDecoration: "underline",
//                 }
//               }}
//             >
//               Forgot Password?
//             </Link>
//           </Box>
          
//           <Box 
//             sx={{ 
//               mt: 3, 
//               pt: 3,
//               borderTop: "1px dashed rgba(190, 175, 155, 0.3)",
//               textAlign: "center" 
//             }}
//           >
//             <Typography
//               sx={{
//                 color: "#666",
//                 fontFamily: "'Poppins', 'Roboto', sans-serif",
//                 fontSize: "0.9rem",
//               }}
//             >
//               Don't have an account?{" "}
//               <Link 
//                 href="/register"
//                 sx={{
//                   color: "#DCA1A1",
//                   fontWeight: 500,
//                   textDecoration: "none",
//                   '&:hover': {
//                     textDecoration: "underline",
//                   }
//                 }}
//               >
//                 Register
//               </Link>
//             </Typography>
//           </Box>
//         </Box>
//       </Paper>

//       {/* Forgot Password Dialog */}
//       <Dialog 
//         open={forgotPasswordOpen} 
//         onClose={handleCloseForgotPassword}
//         PaperProps={{
//           style: {
//             borderRadius: '12px',
//             padding: '8px',
//           }
//         }}
//       >
//         <DialogTitle 
//           sx={{ 
//             display: 'flex', 
//             alignItems: 'center',
//             fontFamily: "'Poppins', 'Roboto', sans-serif",
//             color: '#453C33',
//           }}
//         >
//           <LockResetIcon sx={{ mr: 1, color: '#BEAF9B' }} />
//           Reset Your Password
//         </DialogTitle>
//         <DialogContent>
//           {successMessage && (
//             <Alert 
//               severity="success" 
//               sx={{ 
//                 mb: 2,
//                 borderRadius: '8px', 
//               }}
//             >
//               {successMessage}
//             </Alert>
//           )}
//           {error && (
//             <Alert 
//               severity="error" 
//               sx={{ 
//                 mb: 2,
//                 borderRadius: '8px', 
//               }}
//             >
//               {error}
//             </Alert>
//           )}

//           {forgotPasswordStep === 1 && (
//             <>
//               <Typography 
//                 sx={{ 
//                   mb: 2,
//                   fontFamily: "'Poppins', 'Roboto', sans-serif",
//                   color: '#666',
//                 }}
//               >
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
//                 sx={{
//                   "& .MuiOutlinedInput-root": {
//                     "& fieldset": {
//                       borderColor: "rgba(190, 175, 155, 0.3)",
//                       borderRadius: "8px",
//                     },
//                     "&:hover fieldset": {
//                       borderColor: "rgba(190, 175, 155, 0.5)",
//                     },
//                     "&.Mui-focused fieldset": {
//                       borderColor: "#BEAF9B",
//                     },
//                   },
//                   "& .MuiInputLabel-outlined": {
//                     color: "#666",
//                     "&.Mui-focused": {
//                       color: "#BEAF9B",
//                     },
//                   },
//                 }}
//               />
//             </>
//           )}

//           {forgotPasswordStep === 2 && (
//             <>
//               <Typography 
//                 sx={{ 
//                   mb: 2,
//                   fontFamily: "'Poppins', 'Roboto', sans-serif",
//                   color: '#666',
//                 }}
//               >
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
//                 inputProps={{ maxLength: 6 }}
//                 sx={{
//                   "& .MuiOutlinedInput-root": {
//                     "& fieldset": {
//                       borderColor: "rgba(190, 175, 155, 0.3)",
//                       borderRadius: "8px",
//                     },
//                     "&:hover fieldset": {
//                       borderColor: "rgba(190, 175, 155, 0.5)",
//                     },
//                     "&.Mui-focused fieldset": {
//                       borderColor: "#DCA1A1",
//                     },
//                   },
//                   "& .MuiInputLabel-outlined": {
//                     color: "#666",
//                     "&.Mui-focused": {
//                       color: "#DCA1A1",
//                     },
//                   },
//                 }}
//               />
//             </>
//           )}

//           {forgotPasswordStep === 3 && (
//             <>
//               <Typography 
//                 sx={{ 
//                   mb: 2,
//                   fontFamily: "'Poppins', 'Roboto', sans-serif",
//                   color: '#666',
//                 }}
//               >
//                 Create your new password
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
//                 sx={{
//                   "& .MuiOutlinedInput-root": {
//                     "& fieldset": {
//                       borderColor: "rgba(190, 175, 155, 0.3)",
//                       borderRadius: "8px",
//                     },
//                     "&:hover fieldset": {
//                       borderColor: "rgba(190, 175, 155, 0.5)",
//                     },
//                     "&.Mui-focused fieldset": {
//                       borderColor: "#DCA1A1",
//                     },
//                   },
//                   "& .MuiInputLabel-outlined": {
//                     color: "#666",
//                     "&.Mui-focused": {
//                       color: "#DCA1A1",
//                     },
//                   },
//                 }}
//               />
//               <TextField
//                 fullWidth
//                 label="Confirm New Password"
//                 name="confirmPassword"
//                 type="password"
//                 value={forgotPasswordData.confirmPassword}
//                 onChange={handleForgotPasswordChange}
//                 margin="normal"
//                 required
//                 inputProps={{ minLength: 6 }}
//                 sx={{
//                   "& .MuiOutlinedInput-root": {
//                     "& fieldset": {
//                       borderColor: "rgba(190, 175, 155, 0.3)",
//                       borderRadius: "8px",
//                     },
//                     "&:hover fieldset": {
//                       borderColor: "rgba(190, 175, 155, 0.5)",
//                     },
//                     "&.Mui-focused fieldset": {
//                       borderColor: "#DCA1A1",
//                     },
//                   },
//                   "& .MuiInputLabel-outlined": {
//                     color: "#666",
//                     "&.Mui-focused": {
//                       color: "#DCA1A1",
//                     },
//                   },
//                 }}
//               />
//             </>
//           )}
//         </DialogContent>
//         <DialogActions sx={{ padding: '0 24px 20px' }}>
//           <Button 
//             onClick={handleCloseForgotPassword}
//             sx={{
//               color: '#666',
//               textTransform: 'none',
//               fontFamily: "'Poppins', 'Roboto', sans-serif",
//               '&:hover': {
//                 color: '#333',
//                 background: 'rgba(0,0,0,0.04)',
//               }
//             }}
//           >
//             Cancel
//           </Button>
//           <Button
//             onClick={
//               forgotPasswordStep === 1 ? handleForgotPassword :
//               forgotPasswordStep === 2 ? handleVerifyOtp :
//               handleResetPassword
//             }
//             variant="contained"
//             disabled={loading}
//             sx={{
//               background: "linear-gradient(to right, #BEAF9B, #D9CFC2)",
//               color: '#fff',
//               borderRadius: "8px",
//               textTransform: "none",
//               fontFamily: "'Poppins', 'Roboto', sans-serif",
//               boxShadow: "0 4px 8px rgba(190, 175, 155, 0.3)",
//               '&:hover': { 
//                 background: "linear-gradient(to right, #b0a08d, #cec2b3)",
//                 boxShadow: "0 6px 12px rgba(190, 175, 155, 0.4)",
//               },
//             }}
//           >
//             {loading ? (
//               <CircularProgress size={20} color="inherit" />
//             ) : (
//               forgotPasswordStep === 1 ? 'Send OTP' :
//               forgotPasswordStep === 2 ? 'Verify OTP' :
//               'Reset Password'
//             )}
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Container>
//   );
// };

// export default Login;














import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';
import {
  TextField,
  Button,
  Typography,
  Container,
  Box,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  IconButton,
  CircularProgress,
  InputAdornment,
  Paper
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import LockResetIcon from '@mui/icons-material/LockReset';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [forgotPasswordData, setForgotPasswordData] = useState({
    email: '',
    otp: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [forgotPasswordStep, setForgotPasswordStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const { login } = React.useContext(AuthContext);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
        credentials: 'include'
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Login failed');
        return;
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      login(data.token, data.user);
      window.location.href = data.user.role === 'admin' ? '/admin' : '/stylist';

    } catch (error) {
      console.error('Login error:', error);
      setError('Login failed. Please try again.');
    }
  };

  // [Keep all your existing forgot password handler functions unchanged]

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(to bottom, rgba(249, 245, 240, 0.9), rgba(255, 255, 255, 1))",
        padding: 2
      }}
    >
      <Paper
        elevation={3}
        sx={{
          maxWidth: 450,
          width: "100%",
          p: 4,
          borderRadius: "12px",
          background: "linear-gradient(to right, rgba(255,255,255,0.95), rgba(249, 245, 240, 0.95))",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
          border: "1px solid rgba(190, 175, 155, 0.3)",
        }}
      >
        <Typography 
          variant="h4" 
          gutterBottom 
          sx={{ 
            color: "#453C33",
            fontWeight: 500,
            textAlign: "center",
            mb: 3,
            fontFamily: "'Poppins', 'Roboto', sans-serif",
            letterSpacing: "0.5px",
          }}
        >
          Welcome Back
        </Typography>
        
        {error && (
          <Box 
            sx={{ 
              p: 2, 
              mb: 3, 
              backgroundColor: "rgba(211, 47, 47, 0.1)",
              borderRadius: "8px",
              borderLeft: "4px solid #d32f2f",
            }}
          >
            <Typography 
              color="error" 
              variant="body2"
              sx={{ fontFamily: "'Poppins', 'Roboto', sans-serif" }}
            >
              {error}
            </Typography>
          </Box>
        )}
        
        <form onSubmit={handleLogin}>
          <Box sx={{ mb: 3 }}>
            <TextField
              label="Username"
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonOutlineIcon sx={{ color: "#BEAF9B" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "rgba(190, 175, 155, 0.3)",
                    borderRadius: "8px",
                  },
                  "&:hover fieldset": {
                    borderColor: "rgba(190, 175, 155, 0.5)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#BEAF9B",
                  },
                },
                "& .MuiInputLabel-outlined": {
                  color: "#666",
                  "&.Mui-focused": {
                    color: "#BEAF9B",
                  },
                },
                "& .MuiInputBase-input": {
                  padding: "14px 14px 14px 4px",
                  fontFamily: "'Poppins', 'Roboto', sans-serif",
                },
              }}
            />
          </Box>
          
          <Box sx={{ mb: 4 }}>
            <TextField
              type={showPassword ? "text" : "password"}
              label="Password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockOutlinedIcon sx={{ color: "#BEAF9B" }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={togglePasswordVisibility}
                      edge="end"
                      sx={{ color: "#BEAF9B" }}
                    >
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "rgba(190, 175, 155, 0.3)",
                    borderRadius: "8px",
                  },
                  "&:hover fieldset": {
                    borderColor: "rgba(190, 175, 155, 0.5)",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#BEAF9B",
                  },
                },
                "& .MuiInputLabel-outlined": {
                  color: "#666",
                  "&.Mui-focused": {
                    color: "#BEAF9B",
                  },
                },
                "& .MuiInputBase-input": {
                  padding: "14px 14px 14px 4px",
                  fontFamily: "'Poppins', 'Roboto', sans-serif",
                },
              }}
            />
          </Box>
          
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              background: "linear-gradient(to right, #BEAF9B, #D9CFC2)",
              color: '#fff',
              py: 1.5,
              px: 4,
              borderRadius: "8px",
              fontWeight: 500,
              letterSpacing: "0.5px",
              fontFamily: "'Poppins', 'Roboto', sans-serif",
              textTransform: "none",
              fontSize: "1rem",
              boxShadow: "0 4px 8px rgba(190, 175, 155, 0.3)",
              transition: "all 0.3s ease",
              '&:hover': { 
                background: "linear-gradient(to right, #b0a08d, #cec2b3)",
                boxShadow: "0 6px 12px rgba(190, 175, 155, 0.4)",
                transform: "translateY(-2px)"
              },
            }}
          >
            Sign In
          </Button>
        </form>
        
        <Box 
          sx={{ 
            mt: 3, 
            textAlign: "center",
            display: "flex",
            justifyContent: "center"
          }}
        >
          <Link 
            component="button"
            onClick={() => setForgotPasswordOpen(true)}
            sx={{
              color: "#BEAF9B",
              textDecoration: "none",
              fontFamily: "'Poppins', 'Roboto', sans-serif",
              fontSize: "0.9rem",
              '&:hover': {
                textDecoration: "underline",
              }
            }}
          >
            Forgot Password?
          </Link>
        </Box>
        
        <Box 
          sx={{ 
            mt: 3, 
            pt: 3,
            borderTop: "1px dashed rgba(190, 175, 155, 0.3)",
            textAlign: "center" 
          }}
        >
          <Typography
            sx={{
              color: "#666",
              fontFamily: "'Poppins', 'Roboto', sans-serif",
              fontSize: "0.9rem",
            }}
          >
            Don't have an account?{" "}
            <Link 
              href="/register"
              sx={{
                color: "#BEAF9B",
                fontWeight: 500,
                textDecoration: "none",
                '&:hover': {
                  textDecoration: "underline",
                }
              }}
            >
              Register
            </Link>
          </Typography>
        </Box>
      </Paper>

      {/* Forgot Password Dialog (keep your existing dialog code) */}
      <Dialog open={forgotPasswordOpen} onClose={() => setForgotPasswordOpen(false)}>
        {/* ... your existing dialog content ... */}
      </Dialog>
    </Box>
  );
};

export default Login;