import React, { useState, useEffect } from "react";
import { 
  TextField, 
  Button, 
  Typography, 
  Box, 
  Grid, 
  Container,
  Paper,
  Snackbar,
  Alert,
  CircularProgress
} from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import SpaIcon from "@mui/icons-material/Spa";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import careersPic from "../assets/careers.png"; // Using careers.png for header
import thriveImage from "../assets/thrive2.png";
import axios from "axios";

const JoinOurTeam = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    resumeUrl: "",
    whyJoin: ""
  });

  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    resumeUrl: "",
    whyJoin: ""
  });
  
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    
    // Add this to remove default margins from the body
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.documentElement.style.margin = "0";
    document.documentElement.style.padding = "0";
    
    // Clean up function to restore default styles when component unmounts
    return () => {
      document.body.style.margin = "";
      document.body.style.padding = "";
      document.documentElement.style.margin = "";
      document.documentElement.style.padding = "";
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { ...errors };

    // Validate firstName
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
      valid = false;
    }
    
    // Validate lastName
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
      valid = false;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email)) {
      newErrors.email = "Valid email is required";
      valid = false;
    }

    // Validate phone
    const phoneRegex = /^\d{10}$/;
    if (!formData.phone.trim() || !phoneRegex.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = "Valid 10-digit phone number is required";
      valid = false;
    }

    // Validate resume
    if (!formData.resumeUrl.trim()) {
      newErrors.resumeUrl = "Resume URL is required";
      valid = false;
    } else if (!formData.resumeUrl.startsWith("http")) {
      newErrors.resumeUrl = "Please enter a valid URL starting with http:// or https://";
      valid = false;
    }

    // Validate whyJoin
    if (!formData.whyJoin.trim()) {
      newErrors.whyJoin = "Please tell us why you want to join";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!validateForm()) {
      setSnackbar({
        open: true,
        message: "Please fix the errors in the form",
        severity: "error",
      });
      return;
    }
  
    setLoading(true);
  
    try {
      // Create payload using firstName and lastName directly
      const payload = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone_numbers: Array.isArray(formData.phone) ? formData.phone : [formData.phone],
        reason: formData.whyJoin,
        resume_url: formData.resumeUrl,
      };
  
      // Debug: Log the payload before sending
      console.log('Submitting form data:', payload);
  
      // Check if any required field is missing
      if (!payload.first_name || !payload.email) {
        throw new Error('First name and email are required');
      }
  
      // Send as JSON
      const response = await axios.post(
        "http://localhost:5001/api/candidates/create", 
        payload, 
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  
      // Handle success
      setSnackbar({
        open: true,
        message: "Application submitted successfully!",
        severity: "success",
      });
    } catch (error) {
      console.error("Error submitting application:", error);
  
      // Get detailed error information
      if (error.response) {
        console.error("Server responded with:", {
          status: error.response.status,
          data: error.response.data,
        });
      }
  
      // Handle error cases
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Failed to submit application. Please try again later.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <Box sx={{ 
      width: '100%', 
      maxWidth: '100%', 
      minHeight: '100vh',
      overflowX: 'hidden',
      position: 'relative',
      bgcolor: '#faf5f0', // Matching the Contact page background
      display: 'flex',
      flexDirection: 'column',
      scrollbarWidth: 'none',
      msOverflowStyle: 'none',
      '&::-webkit-scrollbar': {
        display: 'none',
      },
    }}>
      {/* Header Banner */}
      <Box
        sx={{
          width: '100%',
          height: { xs: '200px', sm: '300px', md: '400px' },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box
          component="img"
          src={careersPic}
          alt="Careers"
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block'
          }}
        />
      </Box>

      {/* Main Content */}
      <Box sx={{
        flex: 1,
        py: 4,
        px: { xs: 2, md: 4 },
        width: '100%',
        overflowX: 'hidden',
        background: '#faf5f0',
      }}>
        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
          <Typography variant="h4" component="h2" sx={{ 
            mb: 4,
            textAlign: 'center',
            fontWeight: 500
          }}>
            Join Our Team
          </Typography>

          {/* What You Will Get Section */}
          <Box sx={{ mb: 6 }}>
            <Typography variant="h5" sx={{ 
              mb: 3, 
              textAlign: 'center',
              fontWeight: '500',
              position: 'relative',
              paddingBottom: '15px',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: '0',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '60px',
                height: '2px',
                backgroundColor: '#000'
              }
            }}>
              What You Will Get Working With Us
            </Typography>
            
            <Grid container spacing={3}>
              {/* Competitive Salary */}
              <Grid item xs={12} sm={6} md={3}>
                <Paper
                  sx={{
                    padding: "1.5rem",
                    textAlign: "center",
                    backgroundColor: "#fff",
                    borderRadius: "10px",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    boxShadow: '0 8px 25px rgba(0,0,0,0.08)',
                    "&:hover": {
                      transform: "scale(1.03)",
                      boxShadow: '0 12px 30px rgba(0,0,0,0.12)',
                    }
                  }}
                >
                  <Box sx={{ 
                    mb: 2, 
                    bgcolor: 'rgba(0,0,0,0.03)', 
                    color: '#000', 
                    width: 60, 
                    height: 60, 
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.03)',
                    margin: '0 auto'
                  }}>
                    <MonetizationOnIcon sx={{ fontSize: 30 }} />
                  </Box>
                  <Typography variant="h6">Competitive Salary</Typography>
                  <Typography variant="body2" sx={{ color: '#555', mt: 1 }}>
                    We offer a competitive salary based on your experience and performance.
                  </Typography>
                </Paper>
              </Grid>

              {/* Education & Growth */}
              <Grid item xs={12} sm={6} md={3}>
                <Paper
                  sx={{
                    padding: "1.5rem",
                    textAlign: "center",
                    backgroundColor: "#fff",
                    borderRadius: "10px",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    boxShadow: '0 8px 25px rgba(0,0,0,0.08)',
                    "&:hover": {
                      transform: "scale(1.03)",
                      boxShadow: '0 12px 30px rgba(0,0,0,0.12)',
                    }
                  }}
                >
                  <Box sx={{ 
                    mb: 2, 
                    bgcolor: 'rgba(0,0,0,0.03)', 
                    color: '#000', 
                    width: 60, 
                    height: 60, 
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.03)',
                    margin: '0 auto'
                  }}>
                    <SchoolIcon sx={{ fontSize: 30 }} />
                  </Box>
                  <Typography variant="h6">Education & Growth</Typography>
                  <Typography variant="body2" sx={{ color: '#555', mt: 1 }}>
                    Pursue education in beauty and hairstyling with our professional development support.
                  </Typography>
                </Paper>
              </Grid>

              {/* Beauty with Benefits */}
              <Grid item xs={12} sm={6} md={3}>
                <Paper
                  sx={{
                    padding: "1.5rem",
                    textAlign: "center",
                    backgroundColor: "#fff",
                    borderRadius: "10px",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    boxShadow: '0 8px 25px rgba(0,0,0,0.08)',
                    "&:hover": {
                      transform: "scale(1.03)",
                      boxShadow: '0 12px 30px rgba(0,0,0,0.12)',
                    }
                  }}
                >
                  <Box sx={{ 
                    mb: 2, 
                    bgcolor: 'rgba(0,0,0,0.03)', 
                    color: '#000', 
                    width: 60, 
                    height: 60, 
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.03)',
                    margin: '0 auto'
                  }}>
                    <SpaIcon sx={{ fontSize: 30 }} />
                  </Box>
                  <Typography variant="h6">Beauty with Benefits</Typography>
                  <Typography variant="body2" sx={{ color: '#555', mt: 1 }}>
                    Enjoy discounts on salon services and beauty treatments as part of our team.
                  </Typography>
                </Paper>
              </Grid>

              {/* Flexible Hours */}
              <Grid item xs={12} sm={6} md={3}>
                <Paper
                  sx={{
                    padding: "1.5rem",
                    textAlign: "center",
                    backgroundColor: "#fff",
                    borderRadius: "10px",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    boxShadow: '0 8px 25px rgba(0,0,0,0.08)',
                    "&:hover": {
                      transform: "scale(1.03)",
                      boxShadow: '0 12px 30px rgba(0,0,0,0.12)',
                    }
                  }}
                >
                  <Box sx={{ 
                    mb: 2, 
                    bgcolor: 'rgba(0,0,0,0.03)', 
                    color: '#000', 
                    width: 60, 
                    height: 60, 
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.03)',
                    margin: '0 auto'
                  }}>
                    <AccessTimeIcon sx={{ fontSize: 30 }} />
                  </Box>
                  <Typography variant="h6">Flexible Hours</Typography>
                  <Typography variant="body2" sx={{ color: '#555', mt: 1 }}>
                    Enjoy a work schedule that fits your lifestyle and personal commitments.
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Box>

          {/* Thrive Together Section */}
          {/* <Box sx={{ mb: 6 }}>
            <Box
              sx={{
                background: '#fff',
                borderRadius: '8px',
                boxShadow: '0 8px 25px rgba(0,0,0,0.08)',
                overflow: 'hidden',
                height: '600px',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0 12px 30px rgba(0,0,0,0.12)',
                }
              }}
            >
              <Grid container spacing={0}>
                <Grid item xs={12} md={5} sx={{
                  p: { xs: 0, md: 0 },
                  display: { xs: 'none', md: 'block' }
                }}>
                  <Box sx={{ height: '100%' }}>
                    <img
                      src={thriveImage}
                      alt="Shadow White Team"
                      style={{
                        width: "100%",
                        maxWidth: "400px",
                        height: "auto",
                        borderRadius: "10px",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                  </Box>
                </Grid>

                <Grid item xs={12} md={7} sx={{
                  p: { xs: 3, md: 4 },
                  bgcolor: 'rgba(250,245,240,0.5)',
                  display: 'flex',
                  position: "relative",
                  left: { xs: 0, md: "-10%" }, // Responsive positioning
                  width: { xs: "100%", md: "100%" },
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}>
                  <Box
                    sx={{
                      padding: "2rem",
                      borderRadius: "10px",
                      position: "relative",
                      marginLeft: { xs: 0, md: "10%" }, // Responsive margin
                    }}
                  >
                    <Typography
                      variant="h5"
                      sx={{
                        mb: 3,
                        fontWeight: '500',
                        position: 'relative',
                        paddingBottom: '10px',
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          bottom: '0',
                          left: '0',
                          width: '40px',
                          height: '2px',
                          backgroundColor: '#000'
                        }
                      }}
                    >
                      We Thrive Together
                    </Typography>

                    <Typography variant="body1" paragraph sx={{ color: '#555' }}>
                      Salon Shadow White works hard to build our demand, and that's why we provide you with a full schedule starting your first day – so you can grow together with our business.
                    </Typography>

                    <Typography variant="body1" paragraph sx={{ color: '#555' }}>
                      Maybe you have been a solo studio stylist, recently took time off for family or to care for a loved one, or you are just starting your career, and now you're looking to get back in the industry. If that sounds like you, we might be a good fit.
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Box> */}


            {/* Thrive Together Section */}
            <Box
                      sx={{
                        padding: "3rem 0",
                        position: "relative",
                        zIndex: 1,
                        width: "100%",
                      }}
                    >
                      <Container>
                        <Grid container spacing={4} alignItems="center">
                          <Grid item xs={12} md={6} sx={{ position: "relative" }}>
                            <Box sx={{ position: "relative", zIndex: 1 }}>
                              <img
                                src={thriveImage}
                                alt="Shadow White Team"
                                style={{
                                  width: "100%",
                                  maxWidth: "400px",
                                  height: "auto",
                                  borderRadius: "10px",
                                  boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
                                  margin: "0 auto",
                                  display: "block",
                                }}
                              />
                            </Box>
                          </Grid>
                          <Grid item xs={12} md={6} sx={{ position: "relative" }}>
                            {/* Modified background box to prevent overflow */}
                            <Box
                              sx={{
                                position: "absolute",
                                top: 0,
                                left: { xs: 0, md: "-20%" }, // Responsive positioning
                                width: { xs: "100%", md: "140%" }, // Responsive width
                                height: "120%",
                                backgroundColor: "#B8A99A",
                                zIndex: -1,
                                borderRadius: "10px",
                                opacity: 0.85,
                              }}
                            />
                            <Box
                              sx={{
                                padding: "2rem",
                                borderRadius: "10px",
                                position: "relative",
                                marginLeft: { xs: 0, md: "-20%" }, // Responsive margin
                              }}
                            >
                              <Typography
                                variant="h4"
                                gutterBottom
                                sx={{
                                  fontWeight: "bold",
                                  color: "#000000",
                                  marginBottom: "1rem",
                                }}
                              >
                                We Thrive Together
                              </Typography>
                              <Typography variant="body1" paragraph>
                                Salon Shadow White works hard to build our demand, and that's why we provide you with a full schedule starting your first day – so you can grow together with our business.
                              </Typography>
                              <Typography variant="body1" paragraph>
                                Maybe you have been a solo studio stylist, recently took time off for family or to care for a loved one, or you are just starting your career, and now you're looking to get back in the industry. If that sounds like you, we might be a good fit.
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>
                      </Container>
                    </Box>


          {/* Application Form Section */}
          <Box
            id="application-form"
            sx={{
              mb: 4
            }}
          >
            <Box
              sx={{
                background: '#fff',
                borderRadius: '8px',
                boxShadow: '0 8px 25px rgba(0,0,0,0.08)',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0 12px 30px rgba(0,0,0,0.12)',
                }
              }}
            >
              <Box sx={{ 
                p: { xs: 3, md: 4 },
              }}>
                <Typography
                  variant="h5"
                  sx={{ 
                    mb: 3, 
                    fontWeight: '500',
                    position: 'relative',
                    paddingBottom: '10px',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: '0',
                      left: '0',
                      width: '40px',
                      height: '2px',
                      backgroundColor: '#000'
                    }
                  }}
                >
                  Apply Now
                </Typography>

                <form onSubmit={handleSubmit}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="First Name"
                        variant="outlined"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        error={!!errors.firstName}
                        helperText={errors.firstName}
                        disabled={loading}
                        required
                        InputProps={{
                          sx: { borderRadius: '8px' }
                        }}
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Last Name"
                        variant="outlined"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        error={!!errors.lastName}
                        helperText={errors.lastName}
                        disabled={loading}
                        required
                        InputProps={{
                          sx: { borderRadius: '8px' }
                        }}
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Email"
                        variant="outlined"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        error={!!errors.email}
                        helperText={errors.email}
                        disabled={loading}
                        required
                        InputProps={{
                          sx: { borderRadius: '8px' }
                        }}
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Phone Number"
                        variant="outlined"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        error={!!errors.phone}
                        helperText={errors.phone}
                        disabled={loading}
                        required
                        InputProps={{
                          sx: { borderRadius: '8px' }
                        }}
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Resume URL (link to your resume)"
                        variant="outlined"
                        name="resumeUrl"
                        value={formData.resumeUrl}
                        onChange={handleChange}
                        error={!!errors.resumeUrl}
                        helperText={errors.resumeUrl}
                        disabled={loading}
                        required
                        placeholder="https://example.com/myresume.pdf"
                        InputProps={{
                          sx: { borderRadius: '8px' }
                        }}
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Why do you want to join us?"
                        variant="outlined"
                        multiline
                        rows={4}
                        name="whyJoin"
                        value={formData.whyJoin}
                        onChange={handleChange}
                        error={!!errors.whyJoin}
                        helperText={errors.whyJoin}
                        disabled={loading}
                        required
                        InputProps={{
                          sx: { borderRadius: '8px' }
                        }}
                        sx={{ mb: 2 }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
                        <Button
                          variant="contained"
                          type="submit"
                          disabled={loading}
                          sx={{
                            px: 4,
                            py: 1.2,
                            backgroundColor: '#000',
                            color: '#fff',
                            borderRadius: '8px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                            transition: 'all 0.3s ease',
                            '&:hover': { 
                              backgroundColor: '#333',
                              boxShadow: '0 6px 16px rgba(0,0,0,0.15)',
                              transform: 'translateY(-2px)'
                            },
                            position: 'relative'
                          }}
                        >
                          {loading ? (
                            <>
                              <CircularProgress 
                                size={24} 
                                sx={{ 
                                  color: "white",
                                  position: "absolute"
                                }} 
                              />
                              <Typography sx={{ visibility: "hidden" }}>Submit Application</Typography>
                            </>
                          ) : (
                            "Submit Application"
                          )}
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </form>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

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
        .MuiBox-root, .MuiContainer-root {
          max-width: 100%;
        }
      `}</style>
    </Box>
  );
};

export default JoinOurTeam;