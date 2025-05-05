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
  CircularProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import LockResetIcon from '@mui/icons-material/LockReset';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [forgotPasswordData, setForgotPasswordData] = useState({
    email: '',
    otp: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [forgotPasswordStep, setForgotPasswordStep] = useState(1); // 1: email, 2: OTP, 3: new password
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const { login } = React.useContext(AuthContext);

  // const handleLogin = async (e) => {
  //   e.preventDefault();
  //   setError('');

  //   if (!username || !password) {
  //     setError('Please enter both username and password');
  //     return;
  //   }

  //   try {
  //     const response = await fetch('http://localhost:5001/api/auth/login', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ username, password }),
  //     });

  //     const data = await response.json();

  //     if (!response.ok) {
  //       setError(data.message || 'Login failed');
  //       return;
  //     }

  //     if (!data.token) {
  //       setError('No authentication token received');
  //       return;
  //     }

  //     localStorage.setItem('token', data.token);
  //     login(data.token);
  //     navigate('/');
  //   } catch (error) {
  //     console.error('Login error:', error);
  //     setError('Login failed. Please try again.');
  //   }
  // };

  

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
        const response = await fetch('http://localhost:5001/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
            credentials: 'include' // Important for cookies if using them
        });

        const data = await response.json();

        if (!response.ok) {
            setError(data.message || 'Login failed');
            return;
        }

        // Store the token and user data
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));

        // Update auth context
        login(data.token, data.user);

        // Force a hard redirect to ensure proper state update
        window.location.href = data.user.role === 'admin' ? '/admin' : '/stylist';

    } catch (error) {
        console.error('Login error:', error);
        setError('Login failed. Please try again.');
    }
};
  
  
  const handleForgotPassword = async () => {
    if (!forgotPasswordData.email) {
      setError('Please enter your email address');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await fetch('http://localhost:5001/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotPasswordData.email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send OTP');
      }

      setSuccessMessage('OTP sent to your email');
      setForgotPasswordStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!forgotPasswordData.otp) {
      setError('Please enter the OTP');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await fetch('http://localhost:5001/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: forgotPasswordData.email,
          otp: forgotPasswordData.otp 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Invalid OTP');
      }

      setSuccessMessage('OTP verified successfully');
      setForgotPasswordStep(3);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!forgotPasswordData.newPassword || !forgotPasswordData.confirmPassword) {
      setError('Please enter and confirm your new password');
      return;
    }

    if (forgotPasswordData.newPassword !== forgotPasswordData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await fetch('http://localhost:5001/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: forgotPasswordData.email,
          newPassword: forgotPasswordData.newPassword 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to reset password');
      }

      setSuccessMessage('Password reset successfully! You can now login with your new password');
      setTimeout(() => {
        setForgotPasswordOpen(false);
        setForgotPasswordStep(1);
        setForgotPasswordData({
          email: '',
          otp: '',
          newPassword: '',
          confirmPassword: ''
        });
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseForgotPassword = () => {
    setForgotPasswordOpen(false);
    setForgotPasswordStep(1);
    setError('');
    setSuccessMessage('');
    setForgotPasswordData({
      email: '',
      otp: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const handleForgotPasswordChange = (e) => {
    const { name, value } = e.target;
    setForgotPasswordData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Box
        component="form"
        onSubmit={handleLogin}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: 400,
          padding: 3,
          backgroundColor: '#fff',
          borderRadius: 2,
          boxShadow: 3,
        }}
      > 
        <Typography variant="h5" gutterBottom>
          Welcome Back! 
        </Typography>

        <TextField
          label="Username"
          variant="outlined"
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && (
          <Alert severity="error" sx={{ width: '100%', mt: 2 }}>
            {error}
          </Alert>
        )}

        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{
            mt: 3,
            backgroundColor: '#DCA1A1',
            '&:hover': { backgroundColor: '#C68888' },
          }}
        >
          Login
        </Button>

        {/* Updated layout: Forgot Password on left, Don't have account centered */}
        <Box sx={{ width: '100%', mt: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Typography variant="body2">
            <Link 
              component="button" 
              onClick={() => setForgotPasswordOpen(true)}
              sx={{ color: '#DCA1A1' }}
            >
              Forgot Password?
            </Link>
          </Typography>
          <Typography variant="body2" sx={{ textAlign: 'center' }}>
            Don't have an account?{' '}
            <Link href="/register" sx={{ color: '#DCA1A1' }}>
              Sign Up
            </Link>
          </Typography>
        </Box>
      </Box>

      {/* Forgot Password Dialog */}
      <Dialog open={forgotPasswordOpen} onClose={handleCloseForgotPassword}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}>
          <LockResetIcon sx={{ mr: 1 }} />
          Reset Your Password
        </DialogTitle>
        <DialogContent>
          {successMessage && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {successMessage}
            </Alert>
          )}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {forgotPasswordStep === 1 && (
            <>
              <Typography sx={{ mb: 2 }}>
                Enter your email address to receive a verification code
              </Typography>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={forgotPasswordData.email}
                onChange={handleForgotPasswordChange}
                margin="normal"
                required
              />
            </>
          )}

          {forgotPasswordStep === 2 && (
            <>
              <Typography sx={{ mb: 2 }}>
                Enter the verification code sent to {forgotPasswordData.email}
              </Typography>
              <TextField
                fullWidth
                label="Verification Code"
                name="otp"
                value={forgotPasswordData.otp}
                onChange={handleForgotPasswordChange}
                margin="normal"
                required
                inputProps={{ maxLength: 6 }}
              />
            </>
          )}

          {forgotPasswordStep === 3 && (
            <>
              <Typography sx={{ mb: 2 }}>
                Create your new password
              </Typography>
              <TextField
                fullWidth
                label="New Password"
                name="newPassword"
                type="password"
                value={forgotPasswordData.newPassword}
                onChange={handleForgotPasswordChange}
                margin="normal"
                required
                inputProps={{ minLength: 6 }}
              />
              <TextField
                fullWidth
                label="Confirm New Password"
                name="confirmPassword"
                type="password"
                value={forgotPasswordData.confirmPassword}
                onChange={handleForgotPasswordChange}
                margin="normal"
                required
                inputProps={{ minLength: 6 }}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseForgotPassword}>
            Cancel
          </Button>
          <Button
            onClick={
              forgotPasswordStep === 1 ? handleForgotPassword :
              forgotPasswordStep === 2 ? handleVerifyOtp :
              handleResetPassword
            }
            color="primary"
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {forgotPasswordStep === 1 ? 'Send OTP' :
             forgotPasswordStep === 2 ? 'Verify OTP' :
             'Reset Password'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Login;
























// import React, { useState } from 'react';
// import { useAuth } from '../auth/AuthContext';
// import { useNavigate } from 'react-router-dom';

// import {
//   TextField,
//   Button,
//   Typography,
//   Container,
//   Box,
//   Link,
//   CircularProgress
// } from '@mui/material';

// const Login = () => {
//   const { login } = useAuth(); // No need to check isAuthenticated here
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setError('');
//     setIsLoading(true);

//     try {
//       if (!username || !password) throw new Error('Please enter both fields');

//       const result = await login(username, password);

//       if (!result.success) {
//         throw new Error(result.error || 'Login failed');
//       }

//       // Navigate based on user role after successful login
//       if (result.role === 'Admin') {
//         navigate('/dashboard', { replace: true });
//       } else {
//         navigate('/todayapt', { replace: true });
//       }
//     } catch (error) {
//       setError(error.message);
//     } finally {
//       setIsLoading(false);
//     }
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
//           disabled={isLoading}
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
//           disabled={isLoading}
//         />

//         {error && (
//           <Typography color="error" variant="body2" sx={{ mt: 2 }}>
//             {error}
//           </Typography>
//         )}

//         <Button
//           type="submit"
//           variant="contained"
//           fullWidth
//           disabled={isLoading}
//           sx={{
//             mt: 3,
//             backgroundColor: '#DCA1A1',
//             '&:hover': { backgroundColor: '#C68888' },
//             height: 48,
//           }}
//           startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
//         >
//           {isLoading ? 'Logging in...' : 'Login'}
//         </Button>

//         <Typography variant="body2" sx={{ mt: 2 }}>
//           Don't have an account?{' '}
//           <Link href="/register" sx={{ color: '#DCA1A1' }}>
//             Sign Up
//           </Link>
//         </Typography>
//       </Box>
//     </Container>
//   );
// };

// export default Login;
