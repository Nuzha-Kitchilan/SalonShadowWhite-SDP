import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  CircularProgress,
  Stack,
  Alert,
  Box,
  Tooltip,
  alpha,
  Divider
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  AccountCircle as AccountCircleIcon,
  DirectionsWalk as DirectionsWalkIcon,
  Phone as PhoneIcon,
  CalendarMonth as CalendarMonthIcon,
  VpnKey as VpnKeyIcon,
  Delete as DeleteIcon,
  Tag as TagIcon
} from '@mui/icons-material';

const CustomerDetail = ({ customer, onResetPassword, onDeleteCustomer, loading }) => {
  const [showResetModal, setShowResetModal] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  // Enhanced debug logging
  useEffect(() => {
    console.log("Received customer data:", {
      data: customer,
      containsAppointmentCount: customer ? 'appointmentCount' in customer : false,
      allProperties: customer ? Object.keys(customer) : []
    });
  }, [customer]);

  const formatDate = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleResetSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    onResetPassword(password);
    setPassword('');
    setConfirmPassword('');
    setShowResetModal(false);
  };

  // Robust appointment count handling
  const getAppointmentCount = () => {
    if (!customer) return 0;
    
    // Check if property exists (not just truthy check)
    if ('appointmentCount' in customer) {
      const count = Number(customer.appointmentCount);
      return isNaN(count) ? 0 : count;
    }
    
    return 0;
  };

  const appointmentCount = getAppointmentCount();

  // Section heading with icon helper
  const SectionHeading = ({ icon: Icon, title }) => (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: 1.5,
      mb: 2,
      pb: 1.5,
      borderBottom: "1px solid rgba(190, 175, 155, 0.2)"
    }}>
      <Icon sx={{ color: "#BEAF9B" }} />
      <Typography 
        variant="h6" 
        component="h3" 
        sx={{ 
          color: "#453C33", 
          fontFamily: "'Poppins', 'Roboto', sans-serif",
          fontWeight: 600,
          fontSize: "1rem"
        }}
      >
        {title}
      </Typography>
    </Box>
  );

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card 
            elevation={1} 
            sx={{ 
              mb: 3, 
              borderRadius: "10px",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06)",
              overflow: 'hidden',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <SectionHeading icon={PersonIcon} title="Basic Information" />
              
              <List disablePadding>
                <ListItem 
                  sx={{ 
                    py: 1.5, 
                    px: 0,
                    borderBottom: "1px solid rgba(190, 175, 155, 0.1)"
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                    <TagIcon sx={{ color: "#BEAF9B", fontSize: 18 }} />
                    <Typography 
                      sx={{ 
                        fontFamily: "'Poppins', 'Roboto', sans-serif",
                        color: "#5D4037",
                        fontWeight: 500,
                      }}
                    >
                      <Typography component="span" sx={{ color: "#5D4037", opacity: 0.7, fontWeight: 400 }}>ID:</Typography> {customer?.customer_ID || 'N/A'}
                    </Typography>
                  </Box>
                </ListItem>
                
                <ListItem 
                  sx={{ 
                    py: 1.5, 
                    px: 0,
                    borderBottom: "1px solid rgba(190, 175, 155, 0.1)"
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                    <PersonIcon sx={{ color: "#BEAF9B", fontSize: 18 }} />
                    <Typography 
                      sx={{ 
                        fontFamily: "'Poppins', 'Roboto', sans-serif",
                        color: "#5D4037",
                        fontWeight: 500,
                      }}
                    >
                      <Typography component="span" sx={{ color: "#5D4037", opacity: 0.7, fontWeight: 400 }}>Name:</Typography> {customer?.firstname || ''} {customer?.lastname || ''}
                    </Typography>
                  </Box>
                </ListItem>
                
                <ListItem 
                  sx={{ 
                    py: 1.5, 
                    px: 0,
                    borderBottom: "1px solid rgba(190, 175, 155, 0.1)"
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                    <EmailIcon sx={{ color: "#BEAF9B", fontSize: 18 }} />
                    <Typography 
                      sx={{ 
                        fontFamily: "'Poppins', 'Roboto', sans-serif",
                        color: "#5D4037",
                        fontWeight: 500,
                      }}
                    >
                      <Typography component="span" sx={{ color: "#5D4037", opacity: 0.7, fontWeight: 400 }}>Email:</Typography> {customer?.email || 'N/A'}
                    </Typography>
                  </Box>
                </ListItem>
                
                <ListItem 
                  sx={{ 
                    py: 1.5, 
                    px: 0,
                    borderBottom: "1px solid rgba(190, 175, 155, 0.1)"
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                    <AccountCircleIcon sx={{ color: "#BEAF9B", fontSize: 18 }} />
                    <Typography 
                      sx={{ 
                        fontFamily: "'Poppins', 'Roboto', sans-serif",
                        color: "#5D4037",
                        fontWeight: 500,
                      }}
                    >
                      <Typography component="span" sx={{ color: "#5D4037", opacity: 0.7, fontWeight: 400 }}>Username:</Typography> {customer?.username || 'N/A'}
                    </Typography>
                  </Box>
                </ListItem>
                
                <ListItem 
                  sx={{ 
                    py: 1.5, 
                    px: 0,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                    <DirectionsWalkIcon sx={{ color: "#BEAF9B", fontSize: 18 }} />
                    <Typography 
                      sx={{ 
                        fontFamily: "'Poppins', 'Roboto', sans-serif",
                        color: "#5D4037",
                        fontWeight: 500,
                      }}
                    >
                      <Typography component="span" sx={{ color: "#5D4037", opacity: 0.7, fontWeight: 400 }}>Walk-in Customer:</Typography>
                      <Box 
                        component="span"
                        sx={{ 
                          display: 'inline-block',
                          px: 1.5,
                          py: 0.5,
                          ml: 1,
                          borderRadius: "12px",
                          backgroundColor: customer?.is_walk_in 
                            ? "rgba(46, 125, 50, 0.1)" 
                            : "rgba(190, 175, 155, 0.1)",
                          color: customer?.is_walk_in ? "#2E7D32" : "#5D4037",
                          fontWeight: 500,
                          fontSize: "0.75rem",
                        }}
                      >
                        {customer?.is_walk_in ? 'Yes' : 'No'}
                      </Box>
                    </Typography>
                  </Box>
                </ListItem>
              </List>
            </CardContent>
          </Card>

          <Card 
            elevation={1} 
            sx={{ 
              borderRadius: "10px",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06)",
              overflow: 'hidden',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <SectionHeading icon={VpnKeyIcon} title="Actions" />
              
              <Stack spacing={2}>
                <Button
                  variant="contained"
                  onClick={() => setShowResetModal(true)}
                  disabled={loading}
                  fullWidth
                  sx={{
                    backgroundColor: "#BEAF9B",
                    color: "#fff",
                    fontFamily: "'Poppins', 'Roboto', sans-serif",
                    fontWeight: 500,
                    borderRadius: "8px",
                    py: 1.25,
                    boxShadow: "0 2px 8px rgba(190, 175, 155, 0.3)",
                    '&:hover': {
                      backgroundColor: "#A89683",
                      boxShadow: "0 4px 10px rgba(190, 175, 155, 0.4)",
                    },
                    '&.Mui-disabled': {
                      backgroundColor: "rgba(190, 175, 155, 0.4)",
                      color: "rgba(255, 255, 255, 0.6)"
                    }
                  }}
                >
                  Reset Password
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => customer && onDeleteCustomer(customer.customer_ID)}
                  disabled={loading || !customer}
                  fullWidth
                  startIcon={<DeleteIcon />}
                  sx={{
                    borderColor: alpha("#FF5252", 0.5),
                    color: "#FF5252",
                    fontFamily: "'Poppins', 'Roboto', sans-serif",
                    fontWeight: 500,
                    borderRadius: "8px",
                    py: 1.25,
                    '&:hover': {
                      borderColor: "#FF5252",
                      backgroundColor: alpha("#FF5252", 0.04),
                    },
                    '&.Mui-disabled': {
                      borderColor: alpha("#FF5252", 0.2),
                      color: alpha("#FF5252", 0.4)
                    }
                  }}
                >
                  Delete Customer
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card 
            elevation={1} 
            sx={{ 
              mb: 3, 
              borderRadius: "10px",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06)",
              overflow: 'hidden',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <SectionHeading icon={PhoneIcon} title="Contact Information" />
              
              {customer?.phoneNumbers?.length > 0 ? (
                <List disablePadding>
                  {customer.phoneNumbers.map((phone, index) => (
                    <ListItem 
                      key={index} 
                      sx={{ 
                        py: 1.5, 
                        px: 0,
                        borderBottom: index < customer.phoneNumbers.length - 1 ? "1px solid rgba(190, 175, 155, 0.1)" : "none"
                      }}
                    >
                      <Typography 
                        sx={{ 
                          fontFamily: "'Poppins', 'Roboto', sans-serif",
                          color: "#5D4037",
                          fontWeight: 500,
                        }}
                      >
                        {phone}
                      </Typography>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Box 
                  sx={{ 
                    textAlign: 'center', 
                    py: 3,
                    backgroundColor: "rgba(190, 175, 155, 0.05)",
                    borderRadius: "10px",
                  }}
                >
                  <Typography 
                    sx={{ 
                      color: "#5D4037", 
                      fontFamily: "'Poppins', 'Roboto', sans-serif",
                      opacity: 0.7
                    }}
                  >
                    No phone numbers registered.
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>

          <Card 
            elevation={1} 
            sx={{ 
              borderRadius: "10px",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06)",
              overflow: 'hidden',
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <SectionHeading icon={CalendarMonthIcon} title="Appointment Statistics" />
              
              <List disablePadding>
                <ListItem 
                  sx={{ 
                    py: 1.5, 
                    px: 0,
                    borderBottom: "1px solid rgba(190, 175, 155, 0.1)"
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%' }}>
                    <Typography 
                      sx={{ 
                        fontFamily: "'Poppins', 'Roboto', sans-serif",
                        color: "#5D4037",
                        fontWeight: 500,
                      }}
                    >
                      <Typography component="span" sx={{ color: "#5D4037", opacity: 0.7, fontWeight: 400 }}>Total Appointments:</Typography> {appointmentCount}
                      {!('appointmentCount' in customer) && (
                        <Typography component="span" sx={{ 
                          color: "#FF5252", 
                          fontSize: "0.75rem",
                          ml: 1
                        }}>
                          (data not available)
                        </Typography>
                      )}
                    </Typography>
                  </Box>
                </ListItem>

                {/* Enhanced Debug Information - Styled to match the theme */}
                <ListItem 
                  sx={{ 
                    py: 1.5, 
                    px: 2,
                    mt: 2,
                    backgroundColor: 'rgba(190, 175, 155, 0.05)', 
                    borderRadius: 1.5,
                    border: '1px dashed rgba(190, 175, 155, 0.3)'
                  }}
                >
                  <Typography variant="caption" sx={{ 
                    color: "#5D4037", 
                    fontFamily: "'Poppins', 'Roboto', sans-serif",
                    opacity: 0.8
                  }}>
                    <strong>Debug Information:</strong>
                    <br />
                    - Received appointment count: {'appointmentCount' in customer ? 'Yes' : 'No'}
                    <br />
                    - Value type: {typeof customer?.appointmentCount}
                    <br />
                    - Raw value: {JSON.stringify(customer?.appointmentCount)}
                    <br />
                    - All properties: {customer ? Object.keys(customer).join(', ') : 'none'}
                  </Typography>
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Password Reset Modal - Styled to match the theme */}
      <Dialog 
        open={showResetModal} 
        onClose={() => setShowResetModal(false)}
        PaperProps={{
          sx: {
            borderRadius: "10px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
          }
        }}
      >
        <DialogTitle sx={{ 
          fontFamily: "'Poppins', 'Roboto', sans-serif",
          color: "#5D4037",
          fontWeight: 600,
          pb: 1
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <VpnKeyIcon sx={{ color: "#BEAF9B" }} />
            Reset Password for {customer?.firstname} {customer?.lastname}
          </Box>
        </DialogTitle>
        <Divider sx={{ borderColor: "rgba(190, 175, 155, 0.2)" }}/>
        <form onSubmit={handleResetSubmit}>
          <DialogContent sx={{ pt: 3 }}>
            <DialogContentText sx={{ 
              fontFamily: "'Poppins', 'Roboto', sans-serif",
              color: "#5D4037",
              opacity: 0.8,
              mb: 3
            }}>
              Please enter a new password for this customer.
            </DialogContentText>

            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 2,
                  fontFamily: "'Poppins', 'Roboto', sans-serif",
                  '& .MuiAlert-icon': {
                    color: "#FF5252"
                  }
                }}
              >
                {error}
              </Alert>
            )}

            <TextField
              margin="dense"
              label="New Password"
              type="password"
              fullWidth
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              inputProps={{ minLength: 8 }}
              helperText="Password must be at least 8 characters long."
              sx={{ 
                mb: 2,
                '& .MuiInputLabel-root': {
                  fontFamily: "'Poppins', 'Roboto', sans-serif",
                  color: "#5D4037",
                  opacity: 0.8
                },
                '& .MuiOutlinedInput-root': {
                  fontFamily: "'Poppins', 'Roboto', sans-serif",
                  '& fieldset': {
                    borderColor: "rgba(190, 175, 155, 0.5)",
                  },
                  '&:hover fieldset': {
                    borderColor: "#BEAF9B",
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: "#BEAF9B",
                  },
                },
                '& .MuiFormHelperText-root': {
                  fontFamily: "'Poppins', 'Roboto', sans-serif",
                }
              }}
            />
            <TextField
              margin="dense"
              label="Confirm Password"
              type="password"
              fullWidth
              variant="outlined"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              sx={{ 
                '& .MuiInputLabel-root': {
                  fontFamily: "'Poppins', 'Roboto', sans-serif",
                  color: "#5D4037",
                  opacity: 0.8
                },
                '& .MuiOutlinedInput-root': {
                  fontFamily: "'Poppins', 'Roboto', sans-serif",
                  '& fieldset': {
                    borderColor: "rgba(190, 175, 155, 0.5)",
                  },
                  '&:hover fieldset': {
                    borderColor: "#BEAF9B",
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: "#BEAF9B",
                  },
                }
              }}
            />
          </DialogContent>
          <DialogActions sx={{ p: 2, pt: 0 }}>
            <Button 
              onClick={() => setShowResetModal(false)}
              sx={{
                fontFamily: "'Poppins', 'Roboto', sans-serif",
                color: "#5D4037",
                opacity: 0.8,
                '&:hover': {
                  backgroundColor: "rgba(190, 175, 155, 0.1)",
                }
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              startIcon={loading && <CircularProgress size={20} color="inherit" />}
              sx={{
                backgroundColor: "#BEAF9B",
                color: "#fff",
                fontFamily: "'Poppins', 'Roboto', sans-serif",
                fontWeight: 500,
                borderRadius: "8px",
                boxShadow: "0 2px 8px rgba(190, 175, 155, 0.3)",
                '&:hover': {
                  backgroundColor: "#A89683",
                  boxShadow: "0 4px 10px rgba(190, 175, 155, 0.4)",
                },
                '&.Mui-disabled': {
                  backgroundColor: "rgba(190, 175, 155, 0.4)",
                  color: "rgba(255, 255, 255, 0.6)"
                }
              }}
            >
              {loading ? 'Processing...' : 'Reset Password'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default CustomerDetail;