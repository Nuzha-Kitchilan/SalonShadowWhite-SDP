{/* import React, { useState, useEffect } from "react";
import { Container, Grid, Typography, Button, TextField, Box, Paper } from "@mui/material";
import { School, Spa, MonetizationOn, AccessTime } from "@mui/icons-material";
import { CloudUpload } from "@mui/icons-material";
import { motion } from "framer-motion";
import heroImage from "../assets/join2.jpg"; // Import your hero image
import thriveImage from "../assets/thrive.jpg"; // Import the thrive together image
import backgroundImage from "../assets/download.jpeg"; // Import the background image
import aestheticImage from "../assets/aesthetic.jpeg"; // Import the aesthetic image

const JoinOurTeam = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    resume: null,
    whyJoin: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prevData) => ({ ...prevData, resume: e.target.files[0] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  // Improved line drawing animation variants
  const lineVariants = {
    hidden: { 
      width: 0,
      opacity: 0
    },
    visible: {
      width: "100%",
      opacity: 1,
      transition: { 
        duration: 1.5, 
        ease: "easeInOut",
        delay: 0.3
      }
    }
  };

  return (
    <Box sx={{ width: '100%', margin: 0, padding: 0 }}>
      {/* Hero Section *
      <Box
        sx={{
          textAlign: "center",
          padding: "6rem 0",
          backgroundImage: `url(${heroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "#8B4513", // Set color to SaddleBrown
          width: "100vw",
          marginLeft: 'calc(-50vw + 50%)', // Center the box
          marginRight: 'calc(-50vw + 50%)',
          boxSizing: 'border-box',
        }}
      >
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 40 }} // Start lower for smoother upward motion
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 2,
              type: "spring",
              stiffness: 80,
              damping: 20,
            }}
          >
            <Typography
              variant="h3"
              gutterBottom
              sx={{
                fontFamily: "'Playfair Display', serif", // Using Playfair Display font
                fontSize: "3rem",
                fontWeight: "bold",
                fontStyle: "italic",
                color: "#8B4513", // SaddleBrown color for the text
                textShadow: "2px 2px 4px rgba(255, 255, 255, 0.9)"
              }}
            >
              "Join Our Team and Grow Together"
            </Typography>
          </motion.div>
          <Button
            variant="contained"
            color="primary"
            href="#application-form"
            sx={{
              backgroundColor: "#8B4513",
              '&:hover': {
                backgroundColor: "#6A3B1F"
              }
            }}
          >
            Apply Now
          </Button>
        </Container>
      </Box> */}

      {/* Combined Gradient Section for "What You Will Get" and "Thrive Together" 
      <Box
        sx={{
          background: "linear-gradient(to bottom, rgba(255, 243, 224, 0.3), rgba(159, 137, 130, 0.4), rgba(249, 249, 249, 0.2))",
          position: "relative", // Added for absolute positioning of aesthetic image
        }}
      >
        {/* Aesthetic Image - positioned to the left side between the two sections 
        
<Box
  sx={{
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: "45%", // Width relative to container
    height: "100%", // Full height of the gradient container
    zIndex: 0,
    opacity: 0.2, // Low opacity as requested
    pointerEvents: "none", // Ensures the image doesn't interfere with clicks
    "@media (max-width: 900px)": {
      display: "none", // Hide on smaller screens
    },
  }}
>
  <img
    src={aestheticImage}
    alt="Aesthetic"
    style={{
      width: "100%",
      height: "100%",
      objectFit: "cover", // Ensures the image covers the entire box
    }}
  />
</Box> */}

        {/* What You Will Get Section 
        <Box
          sx={{
            padding: "3rem 0",
            position: "relative", // For z-index
            zIndex: 1, // Ensures content stays above the aesthetic image
          }}
        >
          <Container>
            <Typography variant="h4" gutterBottom textAlign="center">
              What You Will Get Working With Us
            </Typography>
            <Grid container spacing={3}> */}
              {/* Competitive Salary 
              <Grid item xs={12} md={3}>
                <Paper
                  sx={{
                    padding: "1.5rem",
                    textAlign: "center",
                    backgroundColor: "#fff3e0",
                    borderRadius: "10px",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease", // Smooth transition for transform and box-shadow
                    "&:hover": {
                      transform: "scale(1.05)", // Scale up on hover
                      boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.2)", // Add a shadow for the pop-out effect
                    }
                  }}
                >
                  <MonetizationOn sx={{ fontSize: 40, color: "#8B4513" }} />
                  <Typography variant="h6">Competitive Salary</Typography>
                  <Typography variant="body1">
                    We offer a competitive salary based on your experience and performance.
                  </Typography>
                </Paper>
              </Grid> */}

              {/* Education & Growth 
              <Grid item xs={12} md={3}>
                <Paper
                  sx={{
                    padding: "1.5rem",
                    textAlign: "center",
                    backgroundColor: "#fff3e0",
                    borderRadius: "10px",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease", // Smooth transition for transform and box-shadow
                    "&:hover": {
                      transform: "scale(1.05)", // Scale up on hover
                      boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.2)", // Add a shadow for the pop-out effect
                    }
                  }}
                >
                  <School sx={{ fontSize: 40, color: "#8B4513" }} />
                  <Typography variant="h6">Education & Growth</Typography>
                  <Typography variant="body1">
                    Pursue education in beauty and hairstyling with our professional development support.
                  </Typography>
                </Paper>
              </Grid> */}

              {/* Beauty with Benefits 
              <Grid item xs={12} md={3}>
                <Paper
                  sx={{
                    padding: "1.5rem",
                    textAlign: "center",
                    backgroundColor: "#fff3e0",
                    borderRadius: "10px",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease", // Smooth transition for transform and box-shadow
                    "&:hover": {
                      transform: "scale(1.05)", // Scale up on hover
                      boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.2)", // Add a shadow for the pop-out effect
                    }
                  }}
                >
                  <Spa sx={{ fontSize: 40, color: "#8B4513" }} />
                  <Typography variant="h6">Beauty with Benefits</Typography>
                  <Typography variant="body1">
                    Enjoy discounts on salon services and beauty treatments as part of our team.
                  </Typography>
                </Paper>
              </Grid> */}

              {/* Flexible Hours 
              <Grid item xs={12} md={3}>
                <Paper
                  sx={{
                    padding: "1.5rem",
                    textAlign: "center",
                    backgroundColor: "#fff3e0",
                    borderRadius: "10px",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease", // Smooth transition for transform and box-shadow
                    "&:hover": {
                      transform: "scale(1.05)", // Scale up on hover
                      boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.2)", // Add a shadow for the pop-out effect
                    }
                  }}
                >
                  <AccessTime sx={{ fontSize: 40, color: "#8B4513" }} />
                  <Typography variant="h6">Flexible Hours</Typography>
                  <Typography variant="body1">
                    Enjoy a work schedule that fits your lifestyle and personal commitments.
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </Box> */}

        {/* Thrive Together Section (still within the gradient container) 
        <Box
          sx={{
            padding: "3rem 0",
            position: "relative", // For z-index
            zIndex: 1, // Ensures content stays above the aesthetic image
          }}
        >
          <Container>
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={6} sx={{ position: "relative" }}>
                <Box sx={{ position: "relative", zIndex: 1 }}>
                  <img
                    src={thriveImage}
                    alt="Wild Honey Team"
                    style={{
                      width: "100%",
                      maxWidth: "400px",
                      height: "auto",
                      borderRadius: "10px",
                      boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
                      margin: "0 auto",
                      display: "block",
                    }}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} md={6} sx={{ position: "relative" }}>
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: "-550px", // Moves the box further left beyond the image
                    width: "calc(100% + 550px)", // Extends it more to the left
                    height: "120%",
                    backgroundColor: "#9F8982",
                    zIndex: -1,
                    borderRadius: "10px",
                    paddingLeft: "1rem", // Keeps text well-positioned
                    boxSizing: "border-box",
                    textAlign: "left",
                    opacity: 0.85, // Make slightly more transparent to let gradient show through
                  }}
                />
                <Box
                  sx={{
                    padding: "2rem",
                    borderRadius: "10px",
                    position: "relative",
                    marginLeft: "-100px", // Keeps text well-positioned
                  }}
                >
                  <Typography
                    variant="h4"
                    gutterBottom
                    sx={{
                      fontWeight: "bold",
                      color: "#ffffff",
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
      </Box> */}

      {/* Application Form Section with Background Image 
      <Box
        id="application-form"
        sx={{
          padding: "3rem 0",
          textAlign: "center",
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.15, // Low opacity as requested
            zIndex: -1,
          },
        }}
      >
        <Container>
          {/* Join Our Team with animated underline 
          <Box sx={{ position: "relative", display: "inline-block", mb: 4 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: "bold",
                color: "#8B4513",
                position: "relative",
                zIndex: 1,
                marginBottom: "0.5rem" // Add space below the text for the line
              }}
            >
              Join Our Team
            </Typography>
            
            {/* Improved animated underline using motion.div instead of svg 
            <motion.div
              initial="hidden"
              animate="visible"
              variants={lineVariants}
              style={{
                height: "3px",
                backgroundColor: "#8B4513",
                borderRadius: "2px"
              }}
            />
          </Box>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3} justifyContent="center">
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Name"
                  variant="outlined"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  sx={{
                    backgroundColor: "rgba(249, 249, 249, 0.9)", // Slight transparency
                    borderRadius: "8px",
                    padding: "12px",
                    "& .MuiOutlinedInput-root": {
                      borderColor: "#8B4513",
                    },
                    "& .MuiOutlinedInput-root.Mui-focused": {
                      borderColor: "#6A3B1F",
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "#6A3B1F",
                    },
                  }}
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
                  sx={{
                    backgroundColor: "rgba(249, 249, 249, 0.9)", // Slight transparency
                    borderRadius: "8px",
                    padding: "12px",
                    "& .MuiOutlinedInput-root": {
                      borderColor: "#8B4513",
                    },
                    "& .MuiOutlinedInput-root.Mui-focused": {
                      borderColor: "#6A3B1F",
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "#6A3B1F",
                    },
                  }}
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
                  sx={{
                    backgroundColor: "rgba(249, 249, 249, 0.9)", // Slight transparency
                    borderRadius: "8px",
                    padding: "12px",
                    "& .MuiOutlinedInput-root": {
                      borderColor: "#8B4513",
                    },
                    "& .MuiOutlinedInput-root.Mui-focused": {
                      borderColor: "#6A3B1F",
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "#6A3B1F",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
  <Button
    fullWidth
    variant="outlined"
    component="label"
    startIcon={<CloudUpload />}
    sx={{
      border: "2px dashed #8B4513",
      color: "#8B4513",
      borderRadius: "8px",
      padding: "15px 12px", // Adjusted padding to match other fields
      height: "56px", // Fixed height to match text fields
      backgroundColor: "rgba(255, 255, 255, 0.8)",
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-start",
      textTransform: "none",
      width: "100%", // Ensure full width
      boxSizing: "border-box", // Ensure padding is included in width calculation
      "&:hover": {
        borderColor: "#6A3B1F",
        backgroundColor: "rgba(255, 247, 229, 0.9)",
      },
    }}
  >
    Upload Resume (PDF)
    <input type="file" accept=".pdf" hidden onChange={handleFileChange} />
  </Button>
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
                  sx={{
                    backgroundColor: "rgba(249, 249, 249, 0.9)", // Slight transparency
                    borderRadius: "8px",
                    padding: "12px",
                    "& .MuiOutlinedInput-root": {
                      borderColor: "#8B4513",
                    },
                    "& .MuiOutlinedInput-root.Mui-focused": {
                      borderColor: "#6A3B1F",
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "#6A3B1F",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} textAlign="center">
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  sx={{
                    padding: "12px 30px",
                    fontSize: "1.1rem",
                    borderRadius: "30px",
                    backgroundColor: "#8B4513",
                    "&:hover": { backgroundColor: "#6A3B1F" },
                  }}
                >
                  Submit Application
                </Button>
              </Grid>
            </Grid>
          </form>
        </Container>
      </Box>
    </Box>
  );
};

export default JoinOurTeam; */}



import React, { useState, useEffect } from "react";
import { 
  Container, 
  Grid, 
  Typography, 
  Button, 
  TextField, 
  Box, 
  Paper, 
  Snackbar,
  Alert,
  CircularProgress
} from "@mui/material";
import { School, Spa, MonetizationOn, AccessTime } from "@mui/icons-material";
import { CloudUpload } from "@mui/icons-material";
import { motion } from "framer-motion";
import heroImage from "../assets/join2.jpg"; // Import your hero image
import thriveImage from "../assets/thrive.jpg"; // Import the thrive together image
import backgroundImage from "../assets/download.jpeg"; // Import the background image
import aestheticImage from "../assets/aesthetic.jpeg"; // Import the aesthetic image
import axios from "axios"; // Import axios for API calls

const JoinOurTeam = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_numbers: "",  // This will be treated as a single string for now
    resume: null,       // Keep this as null if you want to revert to file upload
    reason: ""          // This corresponds to your "whyJoin" field
  });

  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success"
  });
  const [errors, setErrors] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_numbers: "",
    resume: "",
    reason: ""
  });

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

    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
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

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
    
  //   if (!validateForm()) {
  //     setSnackbar({
  //       open: true,
  //       message: "Please fix the errors in the form",
  //       severity: "error"
  //     });
  //     return;
  //   }
  
  //   setLoading(true);
  
  //   try {
  //     // Create form data for submission
  //     const formDataToSubmit = new FormData();
      
  //     // Split name into first_name and last_name (assuming space separation)
  //     const nameParts = formData.name.split(' ');
  //     formDataToSubmit.append("first_name", nameParts[0] || '');
  //     formDataToSubmit.append("last_name", nameParts.slice(1).join(' ') || '');
      
  //     formDataToSubmit.append("email", formData.email);
  //     formDataToSubmit.append("phone_numbers", formData.phone);
  //     formDataToSubmit.append("reason", formData.whyJoin);
      
  //     // If using resume URL approach (temporary)
  //     if (formData.resumeUrl) {
  //       // Create a File object from the URL string or a placeholder
  //       const dummyFile = new File(['dummy content'], 'resume.pdf', { type: 'application/pdf' });
  //       formDataToSubmit.append("resume", dummyFile);
        
  //       // Also send the URL as a separate field
  //       formDataToSubmit.append("resume_url", formData.resumeUrl);
  //     }
      
  //     // If using file upload
  //     if (formData.resume) {
  //       formDataToSubmit.append("resume", formData.resume);
  //     }
  
  //     // Make sure to use the correct endpoint!
  //     const response = await axios.post("http://localhost:5001/candidates/create", formDataToSubmit, {
  //       headers: {
  //         "Content-Type": "multipart/form-data"
  //       }
  //     });
  
  //     // Handle success...
      
  //   } catch (error) {
  //     console.error("Error submitting application:", error);
      
  //     // Get detailed error information
  //     if (error.response) {
  //       console.error("Server responded with:", {
  //         status: error.response.status,
  //         data: error.response.data
  //       });
  //     }
      
  //     // Handle error cases
  //     setSnackbar({
  //       open: true,
  //       message: error.response?.data?.message || "Failed to submit application. Please try again later.",
  //       severity: "error"
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };


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
      // Create regular JSON payload
      const nameParts = formData.name.split(' ');
  
      // Handle case where there is no last name
      const payload = {
        first_name: nameParts[0] || '',
        last_name: nameParts.length > 1 ? nameParts.slice(1).join(' ') : ' ', // Only take remaining parts as last name
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

  // Improved line drawing animation variants
  const lineVariants = {
    hidden: { 
      width: 0,
      opacity: 0
    },
    visible: {
      width: "100%",
      opacity: 1,
      transition: { 
        duration: 1.5, 
        ease: "easeInOut",
        delay: 0.3
      }
    }
  };

  return (
    <Box sx={{ width: '100%', margin: 0, padding: 0 }}>
      {/* Hero Section */}
      <Box
        sx={{
          textAlign: "center",
          padding: "6rem 0",
          backgroundImage: `url(${heroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "#8B4513", // Set color to SaddleBrown
          width: "100vw",
          marginLeft: 'calc(-50vw + 50%)', // Center the box
          marginRight: 'calc(-50vw + 50%)',
          boxSizing: 'border-box',
        }}
      >
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 40 }} // Start lower for smoother upward motion
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 2,
              type: "spring",
              stiffness: 80,
              damping: 20,
            }}
          >
            <Typography
              variant="h3"
              gutterBottom
              sx={{
                fontFamily: "'Playfair Display', serif", // Using Playfair Display font
                fontSize: "3rem",
                fontWeight: "bold",
                fontStyle: "italic",
                color: "#8B4513", // SaddleBrown color for the text
                textShadow: "2px 2px 4px rgba(255, 255, 255, 0.9)"
              }}
            >
              "Join Our Team and Grow Together"
            </Typography>
          </motion.div>
          <Button
            variant="contained"
            color="primary"
            href="#application-form"
            sx={{
              backgroundColor: "#8B4513",
              '&:hover': {
                backgroundColor: "#6A3B1F"
              }
            }}
          >
            Apply Now
          </Button>
        </Container>
      </Box>

      {/* Combined Gradient Section for "What You Will Get" and "Thrive Together" */}
      <Box
        sx={{
          background: "linear-gradient(to bottom, rgba(255, 243, 224, 0.3), rgba(159, 137, 130, 0.4), rgba(249, 249, 249, 0.2))",
          position: "relative", // Added for absolute positioning of aesthetic image
        }}
      >
        {/* Aesthetic Image - positioned to the left side between the two sections */}
        <Box
          sx={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: "45%", // Width relative to container
            height: "100%", // Full height of the gradient container
            zIndex: 0,
            opacity: 0.2, // Low opacity as requested
            pointerEvents: "none", // Ensures the image doesn't interfere with clicks
            "@media (max-width: 900px)": {
              display: "none", // Hide on smaller screens
            },
          }}
        >
          <img
            src={aestheticImage}
            alt="Aesthetic"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover", // Ensures the image covers the entire box
            }}
          />
        </Box>

        {/* What You Will Get Section */}
        <Box
          sx={{
            padding: "3rem 0",
            position: "relative", // For z-index
            zIndex: 1, // Ensures content stays above the aesthetic image
          }}
        >
          <Container>
            <Typography variant="h4" gutterBottom textAlign="center">
              What You Will Get Working With Us
            </Typography>
            <Grid container spacing={3}>
              {/* Competitive Salary */}
              <Grid item xs={12} md={3}>
                <Paper
                  sx={{
                    padding: "1.5rem",
                    textAlign: "center",
                    backgroundColor: "#fff3e0",
                    borderRadius: "10px",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease", // Smooth transition for transform and box-shadow
                    "&:hover": {
                      transform: "scale(1.05)", // Scale up on hover
                      boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.2)", // Add a shadow for the pop-out effect
                    }
                  }}
                >
                  <MonetizationOn sx={{ fontSize: 40, color: "#8B4513" }} />
                  <Typography variant="h6">Competitive Salary</Typography>
                  <Typography variant="body1">
                    We offer a competitive salary based on your experience and performance.
                  </Typography>
                </Paper>
              </Grid>

              {/* Education & Growth */}
              <Grid item xs={12} md={3}>
                <Paper
                  sx={{
                    padding: "1.5rem",
                    textAlign: "center",
                    backgroundColor: "#fff3e0",
                    borderRadius: "10px",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease", // Smooth transition for transform and box-shadow
                    "&:hover": {
                      transform: "scale(1.05)", // Scale up on hover
                      boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.2)", // Add a shadow for the pop-out effect
                    }
                  }}
                >
                  <School sx={{ fontSize: 40, color: "#8B4513" }} />
                  <Typography variant="h6">Education & Growth</Typography>
                  <Typography variant="body1">
                    Pursue education in beauty and hairstyling with our professional development support.
                  </Typography>
                </Paper>
              </Grid>

              {/* Beauty with Benefits */}
              <Grid item xs={12} md={3}>
                <Paper
                  sx={{
                    padding: "1.5rem",
                    textAlign: "center",
                    backgroundColor: "#fff3e0",
                    borderRadius: "10px",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease", // Smooth transition for transform and box-shadow
                    "&:hover": {
                      transform: "scale(1.05)", // Scale up on hover
                      boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.2)", // Add a shadow for the pop-out effect
                    }
                  }}
                >
                  <Spa sx={{ fontSize: 40, color: "#8B4513" }} />
                  <Typography variant="h6">Beauty with Benefits</Typography>
                  <Typography variant="body1">
                    Enjoy discounts on salon services and beauty treatments as part of our team.
                  </Typography>
                </Paper>
              </Grid>

              {/* Flexible Hours */}
              <Grid item xs={12} md={3}>
                <Paper
                  sx={{
                    padding: "1.5rem",
                    textAlign: "center",
                    backgroundColor: "#fff3e0",
                    borderRadius: "10px",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease", // Smooth transition for transform and box-shadow
                    "&:hover": {
                      transform: "scale(1.05)", // Scale up on hover
                      boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.2)", // Add a shadow for the pop-out effect
                    }
                  }}
                >
                  <AccessTime sx={{ fontSize: 40, color: "#8B4513" }} />
                  <Typography variant="h6">Flexible Hours</Typography>
                  <Typography variant="body1">
                    Enjoy a work schedule that fits your lifestyle and personal commitments.
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Thrive Together Section (still within the gradient container) */}
        <Box
          sx={{
            padding: "3rem 0",
            position: "relative", // For z-index
            zIndex: 1, // Ensures content stays above the aesthetic image
          }}
        >
          <Container>
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={6} sx={{ position: "relative" }}>
                <Box sx={{ position: "relative", zIndex: 1 }}>
                  <img
                    src={thriveImage}
                    alt="Wild Honey Team"
                    style={{
                      width: "100%",
                      maxWidth: "400px",
                      height: "auto",
                      borderRadius: "10px",
                      boxShadow: "0 4px 6px rgba(0,0,0,0.3)",
                      margin: "0 auto",
                      display: "block",
                    }}
                  />
                </Box>
              </Grid>
              <Grid item xs={12} md={6} sx={{ position: "relative" }}>
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: "-550px", // Moves the box further left beyond the image
                    width: "calc(100% + 550px)", // Extends it more to the left
                    height: "120%",
                    backgroundColor: "#9F8982",
                    zIndex: -1,
                    borderRadius: "10px",
                    paddingLeft: "1rem", // Keeps text well-positioned
                    boxSizing: "border-box",
                    textAlign: "left",
                    opacity: 0.85, // Make slightly more transparent to let gradient show through
                  }}
                />
                <Box
                  sx={{
                    padding: "2rem",
                    borderRadius: "10px",
                    position: "relative",
                    marginLeft: "-100px", // Keeps text well-positioned
                  }}
                >
                  <Typography
                    variant="h4"
                    gutterBottom
                    sx={{
                      fontWeight: "bold",
                      color: "#ffffff",
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
      </Box>

      {/* Application Form Section with Background Image */}
      <Box
        id="application-form"
        sx={{
          padding: "3rem 0",
          textAlign: "center",
          position: "relative",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.15, // Low opacity as requested
            zIndex: -1,
          },
        }}
      >
        <Container>
          {/* Join Our Team with animated underline */}
          <Box sx={{ position: "relative", display: "inline-block", mb: 4 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: "bold",
                color: "#8B4513",
                position: "relative",
                zIndex: 1,
                marginBottom: "0.5rem" // Add space below the text for the line
              }}
            >
              Join Our Team
            </Typography>
            
            {/* Improved animated underline using motion.div instead of svg */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={lineVariants}
              style={{
                height: "3px",
                backgroundColor: "#8B4513",
                borderRadius: "2px"
              }}
            />
          </Box>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={3} justifyContent="center">
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Name"
                  variant="outlined"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  error={!!errors.name}
                  helperText={errors.name}
                  disabled={loading}
                  required
                  sx={{
                    backgroundColor: "rgba(249, 249, 249, 0.9)", // Slight transparency
                    borderRadius: "8px",
                    padding: "12px",
                    "& .MuiOutlinedInput-root": {
                      borderColor: "#8B4513",
                    },
                    "& .MuiOutlinedInput-root.Mui-focused": {
                      borderColor: "#6A3B1F",
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "#6A3B1F",
                    },
                  }}
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
                  sx={{
                    backgroundColor: "rgba(249, 249, 249, 0.9)", // Slight transparency
                    borderRadius: "8px",
                    padding: "12px",
                    "& .MuiOutlinedInput-root": {
                      borderColor: "#8B4513",
                    },
                    "& .MuiOutlinedInput-root.Mui-focused": {
                      borderColor: "#6A3B1F",
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "#6A3B1F",
                    },
                  }}
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
                  sx={{
                    backgroundColor: "rgba(249, 249, 249, 0.9)", // Slight transparency
                    borderRadius: "8px",
                    padding: "12px",
                    "& .MuiOutlinedInput-root": {
                      borderColor: "#8B4513",
                    },
                    "& .MuiOutlinedInput-root.Mui-focused": {
                      borderColor: "#6A3B1F",
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "#6A3B1F",
                    },
                  }}
                />
              </Grid>
              {/* Replace the file upload button with a URL input field */}
<Grid item xs={12} md={6}>
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
    sx={{
      backgroundColor: "rgba(249, 249, 249, 0.9)",
      borderRadius: "8px",
      padding: "12px",
      "& .MuiOutlinedInput-root": {
        borderColor: "#8B4513",
      },
      "& .MuiOutlinedInput-root.Mui-focused": {
        borderColor: "#6A3B1F",
      },
      "& .MuiInputLabel-root.Mui-focused": {
        color: "#6A3B1F",
      },
    }}
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
                  sx={{
                    backgroundColor: "rgba(249, 249, 249, 0.9)", // Slight transparency
                    borderRadius: "8px",
                    padding: "12px",
                    "& .MuiOutlinedInput-root": {
                      borderColor: "#8B4513",
                    },
                    "& .MuiOutlinedInput-root.Mui-focused": {
                      borderColor: "#6A3B1F",
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "#6A3B1F",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} textAlign="center">
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={loading}
                  sx={{
                    padding: "12px 30px",
                    fontSize: "1.1rem",
                    borderRadius: "30px",
                    backgroundColor: "#8B4513",
                    "&:hover": { backgroundColor: "#6A3B1F" },
                    position: "relative",
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
              </Grid>
            </Grid>
          </form>
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
    </Box>
  );
};

export default JoinOurTeam;