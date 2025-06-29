import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Box, Typography, TextField, Button, CircularProgress,
  Paper, FormControl, InputLabel, Select, MenuItem, Chip,
  InputAdornment, FormHelperText, Snackbar, Alert, Stack,
  styled
} from '@mui/material';
import {
  Save as SaveIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  Spa as SpaIcon,
  People as PeopleIcon,
  Description as DescriptionIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  AccessTime as TimeIcon,
  ContentCut as StylistIcon
} from "@mui/icons-material";
import CreateAppointmentModal from './CreateAppointmentModal';

// Styled components 
const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: '12px',
    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
  }
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  backgroundColor: 'rgba(190, 175, 155, 0.1)',
  color: '#453C33',
  fontFamily: "'Poppins', 'Roboto', sans-serif",
  fontWeight: 600,
  padding: '16px 24px',
  borderBottom: '1px solid rgba(190, 175, 155, 0.3)',
}));

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  padding: '24px',
  fontFamily: "'Poppins', 'Roboto', sans-serif",
}));

const StyledDialogActions = styled(DialogActions)(({ theme }) => ({
  padding: '16px 24px',
  borderTop: '1px solid rgba(190, 175, 155, 0.1)',
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  borderRadius: '8px',
  border: '1px solid rgba(190, 175, 155, 0.2)',
  boxShadow: 'none',
  overflow: 'hidden',
  height: '100%',
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    fontFamily: "'Poppins', 'Roboto', sans-serif",
    '& fieldset': {
      borderColor: 'rgba(190, 175, 155, 0.3)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(190, 175, 155, 0.5)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#BEAF9B',
    },
  },
  '& .MuiInputLabel-root': {
    fontFamily: "'Poppins', 'Roboto', sans-serif",
    color: '#666666',
  },
  '& .MuiInputBase-input': {
    color: '#453C33',
  },
}));

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    fontFamily: "'Poppins', 'Roboto', sans-serif",
    '& fieldset': {
      borderColor: 'rgba(190, 175, 155, 0.3)',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(190, 175, 155, 0.5)',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#BEAF9B',
    },
  },
  '& .MuiInputLabel-root': {
    fontFamily: "'Poppins', 'Roboto', sans-serif",
    color: '#666666',
  },
  '& .MuiSelect-select': {
    color: '#453C33',
  },
}));

const StyledChip = styled(Chip)(({ theme, color }) => ({
  fontFamily: "'Poppins', 'Roboto', sans-serif",
  fontSize: '0.75rem',
  fontWeight: 500,
  borderRadius: '12px',
  height: '24px',
  ...(color === 'primary' && {
    backgroundColor: 'rgba(190, 175, 155, 0.1)',
    color: '#453C33',
    border: '1px solid rgba(190, 175, 155, 0.3)',
  }),
  ...(color === 'warning' && {
    backgroundColor: 'rgba(255, 193, 7, 0.1)',
    color: '#f57c00',
    border: '1px solid rgba(255, 193, 7, 0.3)',
  }),
  ...(color === 'success' && {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    color: '#388e3c',
    border: '1px solid rgba(76, 175, 80, 0.3)',
  }),
  ...(color === 'error' && {
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    color: '#d32f2f',
    border: '1px solid rgba(244, 67, 54, 0.3)',
  }),
  ...(color === 'info' && {
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
    color: '#0288d1',
    border: '1px solid rgba(33, 150, 243, 0.3)',
  }),
}));

const StyledButton = styled(Button)(({ theme, color }) => ({
  fontFamily: "'Poppins', 'Roboto', sans-serif",
  fontWeight: 600,
  fontSize: '0.75rem',
  borderRadius: '20px',
  padding: '6px 16px',
  textTransform: 'none',
  boxShadow: 'none',
  ...(color === 'primary' && {
    borderColor: '#BEAF9B',
    color: '#453C33',
    '&:hover': {
      backgroundColor: 'rgba(190, 175, 155, 0.1)',
      borderColor: '#BEAF9B',
    },
  }),
  ...(color === 'secondary' && {
    backgroundColor: '#BEAF9B',
    color: '#FFFFFF',
    border: 'none',
    '&:hover': {
      backgroundColor: '#a39383',
    },
  }),
}));

const SectionTitle = styled(Box)(({ theme }) => ({
  marginBottom: '16px',
  display: 'flex',
  alignItems: 'center',
  '& .MuiSvgIcon-root': {
    marginRight: '8px',
    color: '#BEAF9B',
  },
  '& .MuiTypography-root': {
    fontFamily: "'Poppins', 'Roboto', sans-serif",
    fontWeight: 600,
    color: '#453C33',
  },
}));

const SpecialRequestForm = ({ open, onClose, request, onUpdateStatus, processing }) => {
  const [newStatus, setNewStatus] = useState('pending');
  const [stylists, setStylists] = useState([]);
  const [selectedStylist, setSelectedStylist] = useState('');
  const [isLoadingStylists, setIsLoadingStylists] = useState(false);
  const [stylistsError, setStylistsError] = useState('');
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [appointmentSuccess, setAppointmentSuccess] = useState(false);
  const [appointmentError, setAppointmentError] = useState('');

  // Function to parse services and return them as an array
  const parseServices = (request) => {
    if (!request) return [];
    
    // If services is already an array
    if (Array.isArray(request.services)) {
      return request.services;
    }
    
    // If services is a string, try to split by comma
    if (typeof request.services === 'string') {
      return request.services.split(',').map(s => s.trim());
    }
    
    // If service_name is available
    if (request.service_name) {
      return [request.service_name];
    }
    
    if (request.service_ids) {
      // If it's an array
      if (Array.isArray(request.service_ids)) {
        return request.service_ids.map(id => `Service #${id}`);
      }
 
      if (typeof request.service_ids === 'string') {
        try {
          const parsedIds = JSON.parse(request.service_ids);
          if (Array.isArray(parsedIds)) {
            return parsedIds.map(id => `Service #${id}`);
          }
          return [`Service #${request.service_ids}`];
        } catch (e) {
          return [`Service #${request.service_ids}`];
        }
      }
    }
    
    return ['Not specified'];
  };

  useEffect(() => {
    if (request) {
      setNewStatus(request.status);
      if (request.stylist_id) {
        setSelectedStylist(request.stylist_id);
      } else {
        setSelectedStylist('');
      }
    }
  }, [request]);

  useEffect(() => {
    if (open) {
      console.log('Form opened, fetching stylists...');
      fetchStylists();
    }
  }, [open]);
  
  useEffect(() => {
    console.log('Stylists state updated:', stylists);
  }, [stylists]);

  const fetchStylists = async () => {
    try {
      setIsLoadingStylists(true);
      setStylistsError('');
      console.log('Fetching stylists from API...');
      const response = await fetch('http://localhost:5001/api/stylists');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch stylists (${response.status})`);
      }
      
      const data = await response.json();
      console.log('Stylists received:', data);
      
      if (Array.isArray(data)) {
        setStylists(data);
      } else if (data.stylists && Array.isArray(data.stylists)) {
        setStylists(data.stylists);
      } else {
        throw new Error('Invalid stylists data format');
      }
    } catch (error) {
      console.error('Error fetching stylists:', error);
      setStylistsError('Failed to load stylists. Please try again.');
    } finally {
      setIsLoadingStylists(false);
    }
  };

  const handleSubmit = () => {
    onUpdateStatus(request.id, newStatus, selectedStylist);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    if (typeof timeString === 'string') {
      const [hours, minutes] = timeString.split(':');
      const time = new Date();
      time.setHours(hours, minutes);
      return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return new Date(timeString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const offset = date.getTimezoneOffset();
    const adjustedDate = new Date(date.getTime() - (offset * 60 * 1000));
    return adjustedDate.toISOString().split('T')[0];
  };

  const handleCreateAppointment = async (appointmentData) => {
    setShowAppointmentModal(false);
    try {
      console.log('Sending appointment data:', appointmentData);
      
      // Updated endpoint to match backend route
      const response = await fetch('http://localhost:5001/api/admin/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...appointmentData,
          request_id: request.id 
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Failed to create appointment (${response.status}): ${errorData.message || ''}`);
      }
      
      // Parse response to get appointment details
      const responseData = await response.json();
      console.log('Appointment response:', responseData);
      
      const appointmentId =
        responseData?.data?.appointmentId ||
        responseData?.data?.appointment_ID ||
        responseData?.appointment_ID ||
        responseData?.appointment_id ||
        responseData?.id ||
        'N/A';
      
      setAppointmentSuccess(true);
      
      onUpdateStatus(request.id, 'completed', selectedStylist, appointmentId);
      
    } catch (error) {
      console.error('Error creating appointment:', error);
      setAppointmentError(`Failed to create appointment: ${error.message}`);
    }
  };

  if (!request) return null;

  return (
    <StyledDialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
    >
      <StyledDialogTitle>
        Special Request Review
      </StyledDialogTitle>
      
      <StyledDialogContent dividers>
        <Box component="form">
          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" component="h2" sx={{ 
              fontFamily: "'Poppins', 'Roboto', sans-serif",
              color: '#453C33',
              fontWeight: 600,
              fontSize: '1.25rem',
              mb: 1
            }}>
              Special Request #{request.id}
            </Typography>
            <Typography variant="body2" sx={{ 
              fontFamily: "'Poppins', 'Roboto', sans-serif",
              color: '#666666'
            }}>
              Review the request details and update the status if needed
            </Typography>
          </Box>
          
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mt: 2 }}>
            {/* Customer Details section */}
            <StyledPaper>
              <Box sx={{ p: 2 }}>
                <SectionTitle>
                  <PersonIcon />
                  <Typography variant="subtitle1">
                    Customer Details
                  </Typography>
                </SectionTitle>
                <StyledTextField
                  label="Full Name"
                  value={`${request.first_name || ''} ${request.last_name || ''}`}
                  fullWidth
                  margin="normal"
                  InputProps={{
                    readOnly: true,
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon sx={{ color: '#BEAF9B' }} />
                      </InputAdornment>
                    ),
                  }}
                />
                <StyledTextField
                  label="Email"
                  value={request.email || 'N/A'}
                  fullWidth
                  margin="normal"
                  InputProps={{
                    readOnly: true,
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon sx={{ color: '#BEAF9B' }} />
                      </InputAdornment>
                    ),
                  }}
                />
                <StyledTextField
                  label="Phone Number"
                  value={request.phone_number || 'N/A'}
                  fullWidth
                  margin="normal"
                  InputProps={{
                    readOnly: true,
                    startAdornment: (
                      <InputAdornment position="start">
                        <PhoneIcon sx={{ color: '#BEAF9B' }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
            </StyledPaper>

            {/* Request Details section */}
            <StyledPaper>
              <Box sx={{ p: 2 }}>
                <SectionTitle>
                  <SpaIcon />
                  <Typography variant="subtitle1">
                    Request Information
                  </Typography>
                </SectionTitle>
                
                {/* Services as chips instead of text field */}
                <Box sx={{ mt: 2, mb: 2 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ 
                    mb: 1, 
                    fontFamily: "'Poppins', 'Roboto', sans-serif",
                    fontSize: '0.85rem'
                  }}>
                    Selected Services:
                  </Typography>
                  <Stack direction="row" spacing={0.5} flexWrap="wrap" gap={0.5}>
                    {parseServices(request).map((service, idx) => (
                      <StyledChip 
                        key={idx}
                        label={service} 
                        size="small"
                        color="primary"
                      />
                    ))}
                  </Stack>
                </Box>
                
                <StyledTextField
                  label="Preferred Date"
                  value={formatDateForInput(request.preferred_date)}
                  type="date"
                  fullWidth
                  margin="normal"
                  InputProps={{
                    readOnly: true,
                    startAdornment: (
                      <InputAdornment position="start">
                        <CalendarIcon sx={{ color: '#BEAF9B' }} />
                      </InputAdornment>
                    ),
                  }}
                  InputLabelProps={{ shrink: true }}
                />
                <StyledTextField
                  label="Preferred Time"
                  value={formatTime(request.preferred_time)}
                  fullWidth
                  margin="normal"
                  InputProps={{
                    readOnly: true,
                    startAdornment: (
                      <InputAdornment position="start">
                        <TimeIcon sx={{ color: '#BEAF9B' }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
            </StyledPaper>

            {/* Request Details section */}
            <StyledPaper sx={{ gridColumn: '1 / -1' }}>
              <Box sx={{ p: 2 }}>
                <SectionTitle>
                  <DescriptionIcon />
                  <Typography variant="subtitle1">
                    Request Details
                  </Typography>
                </SectionTitle>
                <StyledTextField
                  label="Request Details"
                  value={request.request_details || 'No details provided'}
                  fullWidth
                  margin="normal"
                  multiline
                  rows={4}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </Box>
            </StyledPaper>

            {/* Status Update section */}
            <StyledPaper sx={{ gridColumn: '1 / -1' }}>
              <Box sx={{ p: 2 }}>
                <SectionTitle>
                  <PeopleIcon />
                  <Typography variant="subtitle1">
                    Update Request
                  </Typography>
                </SectionTitle>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  {/* Status field */}
                  <StyledFormControl fullWidth margin="normal">
                    <InputLabel>
                      Request Status
                    </InputLabel>
                    <Select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                    >
                      <MenuItem value="pending">
                        <StyledChip 
                          label="Pending" 
                          size="small" 
                          color="warning"
                        />
                      </MenuItem>
                      <MenuItem value="approved">
                        <StyledChip 
                          label="Approved" 
                          size="small" 
                          color="success"
                        />
                      </MenuItem>
                      <MenuItem value="rejected">
                        <StyledChip 
                          label="Rejected" 
                          size="small"
                          color="error"
                        />
                      </MenuItem>
                      <MenuItem value="completed">
                        <StyledChip 
                          label="Completed" 
                          size="small" 
                          color="info"
                        />
                      </MenuItem>
                    </Select>
                  </StyledFormControl>
                </Box>
              </Box>
            </StyledPaper>
          </Box>
        </Box>
      </StyledDialogContent>
      
      <StyledDialogActions>
        <StyledButton 
          onClick={handleSubmit} 
          variant="contained"
          startIcon={<SaveIcon />}
          disabled={processing || (request && request.status === newStatus && request.stylist_id === selectedStylist)}
          color="secondary"
        >
          {processing ? <CircularProgress size={24} color="inherit" /> : 'Update Request'}
        </StyledButton>
        <StyledButton 
          variant="contained"
          color="secondary"
          disabled={processing || newStatus !== 'approved'}
          onClick={() => setShowAppointmentModal(true)}
          sx={{ mx: 1 }}
        >
          Create Appointment
        </StyledButton>
        <StyledButton 
          onClick={onClose} 
          disabled={processing}
          variant="outlined"
          color="primary"
        >
          Cancel
        </StyledButton>
      </StyledDialogActions>
      
      {/* Import and use CreateAppointmentModal component */}
      <CreateAppointmentModal
        open={showAppointmentModal}
        onClose={() => setShowAppointmentModal(false)}
        onCreateAppointment={handleCreateAppointment}
        request={request}
        stylists={stylists}
        selectedStylist={selectedStylist}
        setSelectedStylist={setSelectedStylist}
      />
      
      {/* Success message */}
      <Snackbar 
        open={appointmentSuccess} 
        autoHideDuration={6000} 
        onClose={() => setAppointmentSuccess(false)}
      >
        <Alert 
          onClose={() => setAppointmentSuccess(false)} 
          severity="success"
          sx={{
            backgroundColor: 'rgba(76, 175, 80, 0.1)',
            color: '#388e3c',
            border: '1px solid rgba(76, 175, 80, 0.3)',
            fontFamily: "'Poppins', 'Roboto', sans-serif",
          }}
        >
          Appointment created successfully!
        </Alert>
      </Snackbar>
      
      {/* Error message */}
      <Snackbar 
        open={!!appointmentError} 
        autoHideDuration={6000} 
        onClose={() => setAppointmentError('')}
      >
        <Alert 
          onClose={() => setAppointmentError('')} 
          severity="error"
          sx={{
            backgroundColor: 'rgba(244, 67, 54, 0.1)',
            color: '#d32f2f',
            border: '1px solid rgba(244, 67, 54, 0.3)',
            fontFamily: "'Poppins', 'Roboto', sans-serif",
          }}
        >
          {appointmentError}
        </Alert>
      </Snackbar>
    </StyledDialog>
  );
};

export default SpecialRequestForm;