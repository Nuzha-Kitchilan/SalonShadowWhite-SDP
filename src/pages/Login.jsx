import React, { useState } from "react";
import { 
  TextField, 
  Button, 
  Typography, 
  Link, 
  Box, 
  Paper,
  IconButton,
  InputAdornment
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Login from "../assets/login.jpeg";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
      window.location.href = "/";
    } catch (err) {
      setError("Invalid username or password");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Box 
      sx={{ 
        width: "100%", 
        maxWidth: "100%", 
        minHeight: "100vh",
        overflowX: "hidden",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        scrollbarWidth: "none", /* Firefox */
        msOverflowStyle: "none",
        "&::-webkit-scrollbar": {
          display: "none", /* Chrome, Safari, Opera */
        },
      }}
    >
      {/* Full-screen background image with semi-transparency */}
      <Box
        component="img"
        src={Login}
        alt="Background"
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: -2,
        }}
      />
      
      {/* Additional semi-transparent overlay for better readability */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(249, 245, 240, 0.4)",
          backdropFilter: "blur(2px)",
          zIndex: -1,
        }}
      />

      <Paper
        elevation={3}
        sx={{
          position: "relative",
          maxWidth: 450,
          width: "90%",
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
            href="#" 
            onClick={() => navigate("/forgot-password")}
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
              href="#" 
              onClick={() => navigate("/register")}
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

      {/* Global Styles */}
      <style jsx global>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        html, body {
          overflow-x: hidden;
          width: 100%;
          max-width: 100%;
          margin: 0;
          padding: 0;
        }
        ::-webkit-scrollbar {
          display: none;
        }
        * {
          scrollbar-width: none;
        }
      `}</style>
    </Box>
  );
};

export default LoginPage;