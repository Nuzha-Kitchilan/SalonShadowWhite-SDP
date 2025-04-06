import React, { useState } from "react";
import { TextField, Button, Grid, Typography, Link, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5001/api/customers/login", {
        username,
        password,
      });
      
      // Save token to localStorage
      localStorage.setItem("token", response.data.token);
      
      // Force a reload to update the navbar state
      // This is a simple approach - you could also use context or Redux for more complex apps
      window.location.href = "/";
      
      // Alternative if you prefer not to reload:
      // navigate("/");
    } catch (err) {
      setError("Invalid credentials");
    }
  };

  return (
    <Box sx={{ maxWidth: 400, margin: "auto", padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Login
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      <form onSubmit={handleLogin}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Username"
              fullWidth
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              type="password"
              label="Password"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" fullWidth>
              Login
            </Button>
          </Grid>
        </Grid>
      </form>
      <Box sx={{ marginTop: 2 }}>
        <Link href="#" onClick={() => navigate("/forgot-password")}>
          Forgot Password?
        </Link>
      </Box>
      <Box sx={{ marginTop: 2 }}>
        <Typography>
          Don't have an account?{" "}
          <Link href="#" onClick={() => navigate("/register")}>
            Register
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default LoginPage;