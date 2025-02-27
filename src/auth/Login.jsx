import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Box, Link } from '@mui/material';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); // To store error messages

  const handleLogin = async () => {
    // Clear any previous error messages
    setError('');

    try {
      // Make the POST request to the backend
      const response = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Login successful, you can handle success here, like saving the JWT token
        console.log('Logged in successfully:', data.token);
        // For example, you can store the JWT in localStorage
        localStorage.setItem('token', data.token);
      } else {
        // Login failed, show the error message
        setError(data.message || 'Login failed');
      }
    } catch (error) {
      // Handle network or server errors
      setError('An error occurred while logging in');
    }
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: 400, // Fixed height for square form
          width: 400, // Fixed width for square form
          padding: 3,
          backgroundColor: '#fff',
          borderRadius: 2,
          boxShadow: 3,
          marginTop: 5, // Adds space between the top of the box and the top of the browser
          marginBottom: 5, // Adds space between the bottom of the box and the bottom of the browser
        }}
      >
        <Typography variant="h5" gutterBottom align="center">
          Welcome Back!
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom align="center">
          Enter your credentials to access your account
        </Typography>

        {/* Username input */}
        <TextField
          label="Username"
          variant="outlined"
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          sx={{ mb: 2 }}
        />

        {/* Password input */}
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ mb: 2 }}
        />

        {/* Error message */}
        {error && (
          <Typography color="error" variant="body2" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        {/* Login button with a lighter pink */}
        <Button
          variant="contained"
          sx={{
            mt: 2,
            backgroundColor: '#DCA1A1', // Lighter pink color
            '&:hover': {
              backgroundColor: '#DCA1A1', // Slightly darker pink on hover
            },
          }}
          fullWidth
          onClick={handleLogin}
        >
          Login
        </Button>

        {/* Forgot password link */}
        <Link href="#" variant="body2" sx={{ mt: 2 }}>
          Forgot password?
        </Link>
      </Box>
    </Container>
  );
};

export default Login;
