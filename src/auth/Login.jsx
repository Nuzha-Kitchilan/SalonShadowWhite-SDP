import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TextField,
  Button,
  Typography,
  Container,
  Box,
} from '@mui/material';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }

    try {
      // Make sure this URL matches your backend API endpoint exactly
      const response = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
        // Add credentials if you're using cookies
        credentials: 'include'
      });
      
      // Check content type to avoid JSON parse errors
      const contentType = response.headers.get('content-type');
      
      if (!contentType || !contentType.includes('application/json')) {
        // Handle non-JSON responses
        const text = await response.text();
        console.error('Received non-JSON response:', text);
        setError(`Server responded with non-JSON content. Please check server logs.`);
        return;
      }
      
      const data = await response.json();
      
      if (!response.ok) {
        setError(data.message || `Login failed with status: ${response.status}`);
        return;
      }

      if (!data.token) {
        setError('No authentication token received');
        return;
      }

      // Store token and redirect
      localStorage.setItem('token', data.token);
      navigate('/dashboard');
      
    } catch (error) {
      console.error('Login error:', error);
      setError(`Connection error: ${error.message}`);
    }
  };

  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Box
        component="form"
        onSubmit={handleLogin}
        autoComplete="off"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
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
          autoComplete="off"
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
          autoComplete="new-password"
        />
        {error && (
          <Typography color="error" variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
            {error}
          </Typography>
        )}
        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{
            mt: 3,
            backgroundColor: '#DCA1A1',
            '&:hover': {
              backgroundColor: '#C68888',
            },
          }}
        >
          Login
        </Button>
      </Box>
    </Container>
  );
};

export default Login;