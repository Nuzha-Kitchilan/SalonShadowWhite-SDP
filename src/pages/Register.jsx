import React, { useState, useEffect } from "react";
import { 
  TextField, 
  Button, 
  Grid, 
  Typography, 
  Box, 
  Link, 
  IconButton,
  Paper,
  InputAdornment,
  useMediaQuery,
  useTheme,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  AddCircle, 
  RemoveCircle, 
  Person, 
  Email,
  Phone, 
  Lock,
  PersonOutline,
  Check,
  Close
} from "@mui/icons-material";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import BackgroundImg from "../assets/login.jpeg"; 

const RegisterPage = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumbers, setPhoneNumbers] = useState([""]);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Password validation states
  const [passwordValidation, setPasswordValidation] = useState({
    minLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecial: false
  });

  useEffect(() => {
    // Check password requirements
    setPasswordValidation({
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecial: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)
    });
  }, [password]);

  const handlePhoneChange = (index, value) => {
    const newPhoneNumbers = [...phoneNumbers];
    newPhoneNumbers[index] = value;
    setPhoneNumbers(newPhoneNumbers);
  };

  const handleAddPhone = () => {
    setPhoneNumbers([...phoneNumbers, ""]);
  };

  const handleRemovePhone = (index) => {
    const newPhoneNumbers = [...phoneNumbers];
    newPhoneNumbers.splice(index, 1);
    setPhoneNumbers(newPhoneNumbers);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    // Check if password validation requirements are met
    const isPasswordValid = passwordValidation.minLength && 
                           passwordValidation.hasUppercase && 
                           passwordValidation.hasLowercase && 
                           passwordValidation.hasNumber;

    if (!isPasswordValid) {
      setError("Please ensure your password meets all requirements");
      return;
    }

    // Filter out empty phone numbers
    const filteredPhoneNumbers = phoneNumbers.filter(phone => phone.trim() !== "");

    // Match case with backend expectations (firstname vs firstName)
    const data = {
      firstname: firstName,
      lastname: lastName,
      phoneNumbers: filteredPhoneNumbers,
      email,
      username,
      password,
    };

    try {
      const response = await axios.post("http://localhost:5001/api/customers/register", data);
      console.log("Registration successful:", response.data);
      navigate("/login");
    } catch (err) {
      console.error("Registration error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    }
  };

  // Common text field styling
  const textFieldSx = {
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
  };

  // Get validation status icon
  const getValidationIcon = (isValid) => {
    return isValid ? (
      <Check fontSize="small" sx={{ color: "#4caf50" }} />
    ) : (
      <Close fontSize="small" sx={{ color: "#d32f2f" }} />
    );
  };

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "fixed", // Fix the container to prevent scrolling
        top: 0,
        left: 0,
        overflow: "hidden", // Prevent scrolling
      }}
    >
      {/* Full-screen background image with semi-transparency */}
      <Box
        component="img"
        src={BackgroundImg}
        alt="Background"
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: 0.7,
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
          maxWidth: 600,
          width: "90%",
          maxHeight: "90vh", // Limit the height to prevent overflow
          overflowY: "auto", // Add scrolling only within the form if needed
          p: { xs: 3, sm: 4 },
          borderRadius: "12px",
          background: "linear-gradient(to right, rgba(255,255,255,0.95), rgba(249, 245, 240, 0.95))",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
          border: "1px solid rgba(190, 175, 155, 0.3)",
          "&::-webkit-scrollbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-track": {
            background: "rgba(0,0,0,0.05)",
            borderRadius: "8px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "rgba(190, 175, 155, 0.5)",
            borderRadius: "8px",
          },
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
            fontSize: { xs: "1.75rem", sm: "2.125rem" }
          }}
        >
          Create Account
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
        
        <form onSubmit={handleRegister}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="First Name"
                fullWidth
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person sx={{ color: "#BEAF9B" }} />
                    </InputAdornment>
                  ),
                }}
                sx={textFieldSx}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                label="Last Name"
                fullWidth
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person sx={{ color: "#BEAF9B" }} />
                    </InputAdornment>
                  ),
                }}
                sx={textFieldSx}
              />
            </Grid>

            {phoneNumbers.map((phone, index) => (
              <Grid item xs={12} key={index}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <TextField
                    label={`Phone Number ${index + 1}`}
                    fullWidth
                    value={phone}
                    onChange={(e) => handlePhoneChange(index, e.target.value)}
                    required={index === 0}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Phone sx={{ color: "#BEAF9B" }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={textFieldSx}
                  />
                  <IconButton
                    onClick={() => handleRemovePhone(index)}
                    disabled={phoneNumbers.length === 1}
                    sx={{
                      color: phoneNumbers.length === 1 ? "#ccc" : "#d32f2f",
                      p: { xs: 0.5, sm: 1 }
                    }}
                  >
                    <RemoveCircle />
                  </IconButton>
                  {index === phoneNumbers.length - 1 && (
                    <IconButton 
                      onClick={handleAddPhone}
                      sx={{
                        color: "#BEAF9B",
                        p: { xs: 0.5, sm: 1 }
                      }}
                    >
                      <AddCircle />
                    </IconButton>
                  )}
                </Box>
              </Grid>
            ))}

            <Grid item xs={12}>
              <TextField
                label="Email"
                type="email"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email sx={{ color: "#BEAF9B" }} />
                    </InputAdornment>
                  ),
                }}
                sx={textFieldSx}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Username"
                fullWidth
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonOutline sx={{ color: "#BEAF9B" }} />
                    </InputAdornment>
                  ),
                }}
                sx={textFieldSx}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                type={showPassword ? "text" : "password"}
                label="Password"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: "#BEAF9B" }} />
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
                sx={textFieldSx}
              />
            </Grid>

            {/* Password requirements checklist */}
            {password.length > 0 && (
              <Grid item xs={12}>
                <Box
                  sx={{
                    p: 2,
                    backgroundColor: "rgba(190, 175, 155, 0.1)",
                    borderRadius: "8px",
                    mt: 1,
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    sx={{
                      color: "#453C33",
                      fontWeight: 500,
                      mb: 1,
                      fontFamily: "'Poppins', 'Roboto', sans-serif",
                    }}
                  >
                    Password Requirements:
                  </Typography>
                  <List dense disablePadding>
                    <ListItem disableGutters sx={{ py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 30 }}>
                        {getValidationIcon(passwordValidation.minLength)}
                      </ListItemIcon>
                      <ListItemText 
                        primary="At least 6 characters" 
                        primaryTypographyProps={{
                          fontSize: "0.875rem",
                          fontFamily: "'Poppins', 'Roboto', sans-serif",
                          color: passwordValidation.minLength ? "#4caf50" : "#666",
                        }}
                      />
                    </ListItem>
                    <ListItem disableGutters sx={{ py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 30 }}>
                        {getValidationIcon(passwordValidation.hasUppercase)}
                      </ListItemIcon>
                      <ListItemText 
                        primary="At least one uppercase letter" 
                        primaryTypographyProps={{
                          fontSize: "0.875rem",
                          fontFamily: "'Poppins', 'Roboto', sans-serif",
                          color: passwordValidation.hasUppercase ? "#4caf50" : "#666",
                        }}
                      />
                    </ListItem>
                    <ListItem disableGutters sx={{ py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 30 }}>
                        {getValidationIcon(passwordValidation.hasLowercase)}
                      </ListItemIcon>
                      <ListItemText 
                        primary="At least one lowercase letter" 
                        primaryTypographyProps={{
                          fontSize: "0.875rem",
                          fontFamily: "'Poppins', 'Roboto', sans-serif",
                          color: passwordValidation.hasLowercase ? "#4caf50" : "#666",
                        }}
                      />
                    </ListItem>
                    <ListItem disableGutters sx={{ py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 30 }}>
                        {getValidationIcon(passwordValidation.hasNumber)}
                      </ListItemIcon>
                      <ListItemText 
                        primary="At least one number" 
                        primaryTypographyProps={{
                          fontSize: "0.875rem",
                          fontFamily: "'Poppins', 'Roboto', sans-serif",
                          color: passwordValidation.hasNumber ? "#4caf50" : "#666",
                        }}
                      />
                    </ListItem>
                    <ListItem disableGutters sx={{ py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 30 }}>
                        {getValidationIcon(passwordValidation.hasSpecial)}
                      </ListItemIcon>
                      <ListItemText 
                        primary="Special character (recommended)" 
                        primaryTypographyProps={{
                          fontSize: "0.875rem",
                          fontFamily: "'Poppins', 'Roboto', sans-serif",
                          color: passwordValidation.hasSpecial ? "#4caf50" : "#666",
                        }}
                      />
                    </ListItem>
                  </List>
                </Box>
              </Grid>
            )}

            <Grid item xs={12} sx={{ mt: 2 }}>
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
                Register
              </Button>
            </Grid>
          </Grid>
        </form>

        <Box 
          sx={{ 
            mt: 3, 
            pt: 2,
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
            Already have an account?{" "}
            <Link 
              href="#" 
              onClick={() => navigate("/login")}
              sx={{
                color: "#BEAF9B",
                fontWeight: 500,
                textDecoration: "none",
                '&:hover': {
                  textDecoration: "underline",
                }
              }}
            >
              Sign In
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default RegisterPage;