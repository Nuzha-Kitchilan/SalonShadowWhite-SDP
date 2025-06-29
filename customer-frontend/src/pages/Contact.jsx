import React, { useEffect, useState } from 'react';
import { TextField, Button, Typography, Box, Grid, Container, Snackbar, Alert } from '@mui/material';
import contactPic from '../assets/contact2.png';
import "leaflet/dist/leaflet.css";
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const ContactPage = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Form validation
    if (!formData.name || !formData.email || !formData.message) {
      setSnackbar({
        open: true,
        message: 'Please fill in all fields',
        severity: 'error'
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setSnackbar({
        open: true,
        message: 'Please enter a valid email address',
        severity: 'error'
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:5001/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSnackbar({
          open: true,
          message: 'Message sent successfully! We will get back to you soon.',
          severity: 'success'
        });
        // Reset form
        setFormData({
          name: '',
          email: '',
          message: ''
        });
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to send message');
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Error: ${error.message || 'Something went wrong. Please try again.'}`,
        severity: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({
      ...prev,
      open: false
    }));
  };

  return (
    <Box sx={{ 
      width: '100%', 
      maxWidth: '100%', 
      minHeight: '100vh',
      overflowX: 'hidden',
      position: 'relative',
      bgcolor: '#faf5f0',
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
          src={contactPic}
          alt="Contact Us"
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
            Get In Touch
          </Typography>

          <Box sx={{
            background: '#fff',
            borderRadius: '8px',
            boxShadow: '0 8px 25px rgba(0,0,0,0.08)',
            overflow: 'hidden',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '0 12px 30px rgba(0,0,0,0.12)',
              transform: 'translateY(-3px)'
            }
          }}>
            <Grid container>
              <Grid item xs={12} md={6} sx={{
                p: { xs: 3, md: 4 },
                borderRight: { md: '1px solid #eee' }
              }}>
                <Typography variant="h5" sx={{ 
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
                }}>
                  Send Us a Message
                </Typography>
                
                <form onSubmit={handleSubmit}>
                  <TextField 
                    label="Name" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    fullWidth 
                    variant="outlined" 
                    margin="normal"
                    InputProps={{
                      sx: { borderRadius: '8px' }
                    }}
                  />
                  <TextField 
                    label="Email Address" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    fullWidth 
                    variant="outlined" 
                    margin="normal"
                    InputProps={{
                      sx: { borderRadius: '8px' }
                    }}
                  />
                  <TextField 
                    label="Message" 
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    fullWidth 
                    variant="outlined" 
                    margin="normal" 
                    multiline 
                    rows={4}
                    InputProps={{
                      sx: { borderRadius: '8px' }
                    }}
                  />

                  <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={isSubmitting}
                      sx={{
                        mt: 3,
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
                      }}
                    >
                      {isSubmitting ? 'Sending...' : 'Submit'}
                    </Button>
                  </Box>
                </form>
              </Grid>

              <Grid item xs={12} md={6} sx={{ 
                p: { xs: 3, md: 4 },
                bgcolor: 'rgba(250,245,240,0.5)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}>
                <Box sx={{ 
                  mb: 4,
                  display: 'flex',
                  alignItems: 'flex-start',
                  '&:hover': {
                    transform: 'translateX(5px)',
                    transition: 'transform 0.3s ease'
                  }
                }}>
                  <Box sx={{ 
                    mr: 2, 
                    bgcolor: 'rgba(0,0,0,0.03)', 
                    color: '#000', 
                    width: 40, 
                    height: 40, 
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.03)',
                  }}>
                    <PhoneIcon fontSize="small" />
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: "500", mb: 0.5 }}>
                      Phone
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#555' }}>
                      +94 77 744 5657
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ 
                  mb: 4,
                  display: 'flex',
                  alignItems: 'flex-start',
                  '&:hover': {
                    transform: 'translateX(5px)',
                    transition: 'transform 0.3s ease'
                  }
                }}>
                  <Box sx={{ 
                    mr: 2, 
                    bgcolor: 'rgba(0,0,0,0.03)', 
                    color: '#000', 
                    width: 40, 
                    height: 40, 
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.03)',
                  }}>
                    <LocationOnIcon fontSize="small" />
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: "500", mb: 0.5 }}>
                      Address
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#555' }}>
                      13A Ranimadama, Enderamulla
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ 
                  mb: 4,
                  display: 'flex',
                  alignItems: 'flex-start',
                  '&:hover': {
                    transform: 'translateX(5px)',
                    transition: 'transform 0.3s ease'
                  }
                }}>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>

      {/* Map Section*/}
      <Box sx={{ 
        width: '100%', 
        padding: { xs: '20px', md: '30px' },
        background: '#faf5f0'
      }}>
        <Container maxWidth="lg">
          <Box sx={{ 
            width: '100%', 
            height: '300px', 
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 8px 25px rgba(0,0,0,0.08)',
            position: 'relative',
          }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.1313733323905!2d79.91970597475772!3d6.993804593007297!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae2f9833171c479%3A0x5684bf10940ceb6e!2sSalon%20Shadow%20White!5e0!3m2!1sen!2slk!4v1741943959196!5m2!1sen!2slk"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
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

export default ContactPage;