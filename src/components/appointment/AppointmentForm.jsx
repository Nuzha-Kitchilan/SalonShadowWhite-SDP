import React from 'react';
import {
  Box, FormControl, InputLabel, Select,
  MenuItem, TextField, Button, DialogActions,
  Typography, Divider, Paper, FormHelperText,
  InputAdornment, Chip
} from "@mui/material";
import {
  Save as SaveIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  Spa as SpaIcon,
  People as PeopleIcon,
  Payment as PaymentIcon
} from "@mui/icons-material";
import TimeSlotSelector from './TimeSlotSelector';

export default function AppointmentForm({
  isEdit,
  editForm,
  setEditForm,
  services,
  stylists,
  customers,
  statusOptions,
  paymentStatusOptions,
  paymentTypeOptions,
  handleSubmit,
  handleInputChange,
  handleMultiSelectChange,
  loadingTimeSlots,
  availableTimeSlots,
  selectedAppointment,
  onClose
}) {

  // Add this at the top of your AppointmentForm component
console.log('Current form values:', {
  services: editForm.services,
  stylists: editForm.stylists,
  customer_ID: editForm.customer_ID,
  payment_amount: editForm.payment_amount
});

console.log('Available options:', {
  services: services.map(s => s.service_name),
  stylists: stylists.map(s => s.stylist_ID),
  customers: customers.map(c => c.customer_ID)
});
  // Helper to generate service price total
  const calculateTotalPrice = () => {
    if (!editForm.services.length || !services.length) return 0;
    
    return services
      .filter(service => editForm.services.includes(service.service_name))
      .reduce((total, service) => total + (parseFloat(service.price) || 0), 0)
      .toFixed(2);
  };

  return (
    <Box component="form" onSubmit={(e) => handleSubmit(e, isEdit)}>
      {/* Form title */}
      <Box sx={{ mb: 3 }}>
        <Typography 
          variant="h5" 
          component="h2"
          sx={{ 
            color: "#453C33",
            fontFamily: "'Poppins', 'Roboto', sans-serif",
            fontWeight: 500,
            mb: 1
          }}
        >
          {isEdit ? 'Edit Appointment' : 'Create New Appointment'}
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ 
            color: "text.secondary",
            fontFamily: "'Poppins', 'Roboto', sans-serif",
          }}
        >
          {isEdit 
            ? 'Update the appointment details below' 
            : 'Fill in the details to create a new appointment'}
        </Typography>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
        {/* Customer and Appointment Date section */}
        <Paper 
          elevation={0} 
          sx={{ 
            p: 2.5, 
            borderRadius: "8px",
            border: "1px solid rgba(190, 175, 155, 0.3)",
            background: "linear-gradient(to right bottom, rgba(249, 245, 240, 0.5), rgba(255, 255, 255, 0.8))"
          }}
        >
          <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
            <PersonIcon sx={{ color: "#BEAF9B", mr: 1.5 }} />
            <Typography 
              variant="subtitle1" 
              sx={{ 
                fontWeight: 600, 
                color: "#453C33",
                fontFamily: "'Poppins', 'Roboto', sans-serif",
              }}
            >
              Customer Details
            </Typography>
          </Box>
          <FormControl fullWidth margin="normal" required>
            <InputLabel sx={{ 
              '&.Mui-focused': { color: '#BEAF9B' } 
            }}>Customer</InputLabel>
            <Select
              name="customer_ID"
              value={editForm.customer_ID}
              onChange={handleInputChange}
              sx={{
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(190, 175, 155, 0.3)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(190, 175, 155, 0.5)',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#BEAF9B',
                },
              }}
            >
              {customers.length > 0 ? (
                customers.map(customer => (
                  <MenuItem key={customer.customer_ID} value={customer.customer_ID}>
                    {customer.firstname} {customer.lastname}
                  </MenuItem>
                ))
              ) : (
                <MenuItem value="" disabled>Loading customers...</MenuItem>
              )}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal" required>
            <TextField
              label="Appointment Date"
              type="date"
              name="appointment_date"
              value={editForm.appointment_date}
              onChange={handleInputChange}
              InputLabelProps={{ 
                shrink: true,
              }}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CalendarIcon sx={{ color: "#BEAF9B" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
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
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#BEAF9B',
                },
              }}
            />
          </FormControl>
        </Paper>

        {/* Services section */}
        <Paper 
          elevation={0} 
          sx={{ 
            p: 2.5, 
            borderRadius: "8px",
            border: "1px solid rgba(190, 175, 155, 0.3)",
            background: "linear-gradient(to right bottom, rgba(249, 245, 240, 0.5), rgba(255, 255, 255, 0.8))"
          }}
        >
          <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
            <SpaIcon sx={{ color: "#BEAF9B", mr: 1.5 }} />
            <Typography 
              variant="subtitle1" 
              sx={{ 
                fontWeight: 600, 
                color: "#453C33",
                fontFamily: "'Poppins', 'Roboto', sans-serif",
              }}
            >
              Services
            </Typography>
          </Box>
          <FormControl fullWidth margin="normal" required>
            <InputLabel sx={{ 
              '&.Mui-focused': { color: '#BEAF9B' } 
            }}>Services</InputLabel>
            <Select
              name="services"
              multiple
              value={editForm.services || []}
              onChange={handleMultiSelectChange}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip 
                      key={value} 
                      label={value} 
                      size="small"
                      sx={{ 
                        backgroundColor: "rgba(190, 175, 155, 0.15)", 
                        color: "#453C33",
                        borderRadius: "4px",
                      }} 
                    />
                  ))}
                </Box>
              )}
              required
              sx={{
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(190, 175, 155, 0.3)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(190, 175, 155, 0.5)', 
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#BEAF9B',
                },
              }}
            >
              {services.length > 0 ? (
                services.map(service => (
                  <MenuItem key={service.service_ID} value={service.service_name}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                      <Typography>{service.service_name}</Typography>
                      <Box>
                        <Typography component="span" sx={{ fontWeight: 'bold', mr: 1 }}>
                          ${service.price || '0'}
                        </Typography>
                        <Typography component="span" sx={{ color: 'text.secondary', fontSize: '0.85rem' }}>
                          ({service.time_duration || '0'} min)
                        </Typography>
                      </Box>
                    </Box>
                  </MenuItem>
                ))
              ) : (
                <MenuItem value="" disabled>Loading services...</MenuItem>
              )}
            </Select>
            {editForm.services.length > 0 && (
              <FormHelperText sx={{ textAlign: 'right', fontWeight: '500', color: '#453C33' }}>
                Total: ${calculateTotalPrice()}
              </FormHelperText>
            )}
          </FormControl>
          <FormControl fullWidth margin="normal" required>
            <InputLabel sx={{ 
              '&.Mui-focused': { color: '#BEAF9B' } 
            }}>Stylists</InputLabel>
            <Select
              name="stylists"
              multiple
              value={editForm.stylists}
              onChange={handleMultiSelectChange}
              renderValue={(selected) => {
                const selectedStylists = stylists.filter(stylist => 
                  selected.includes(stylist.stylist_ID)
                );
                return (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selectedStylists.map(s => (
                      <Chip 
                        key={s.stylist_ID} 
                        label={`${s.firstname} ${s.lastname}`} 
                        size="small"
                        sx={{ 
                          backgroundColor: "rgba(190, 175, 155, 0.15)", 
                          color: "#453C33",
                          borderRadius: "4px",
                        }} 
                      />
                    ))}
                  </Box>
                );
              }}
              required
              sx={{
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(190, 175, 155, 0.3)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(190, 175, 155, 0.5)',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#BEAF9B',
                },
              }}
            >
              {stylists.length > 0 ? (
                stylists.map(stylist => (
                  <MenuItem key={stylist.stylist_ID} value={stylist.stylist_ID}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <PeopleIcon fontSize="small" sx={{ color: '#BEAF9B', mr: 1 }} />
                      {stylist.firstname} {stylist.lastname}
                    </Box>
                  </MenuItem>
                ))
              ) : (
                <MenuItem value="" disabled>Loading stylists...</MenuItem>
              )}
            </Select>
          </FormControl>
        </Paper>

        {/* Status and Payment section */}
        <Paper 
          elevation={0} 
          sx={{ 
            p: 2.5, 
            borderRadius: "8px",
            border: "1px solid rgba(190, 175, 155, 0.3)",
            background: "linear-gradient(to right bottom, rgba(249, 245, 240, 0.5), rgba(255, 255, 255, 0.8))",
            gridColumn: '1 / -1'
          }}
        >
          <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
            <PaymentIcon sx={{ color: "#BEAF9B", mr: 1.5 }} />
            <Typography 
              variant="subtitle1" 
              sx={{ 
                fontWeight: 600, 
                color: "#453C33",
                fontFamily: "'Poppins', 'Roboto', sans-serif",
              }}
            >
              Status & Payment
            </Typography>
          </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 2 }}>
            <FormControl fullWidth margin="normal" required>
              <InputLabel sx={{ 
                '&.Mui-focused': { color: '#BEAF9B' } 
              }}>Status</InputLabel>
              <Select
                name="appointment_status"
                value={editForm.appointment_status}
                onChange={handleInputChange}
                required
                sx={{
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(190, 175, 155, 0.3)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(190, 175, 155, 0.5)',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#BEAF9B',
                  },
                }}
              >
                {statusOptions.map(status => {
                  // Define colors for different status options
                  let chipColor;
                  switch(status.toLowerCase()) {
                    case 'confirmed': chipColor = '#4caf50'; break;
                    case 'pending': chipColor = '#ff9800'; break;
                    case 'cancelled': chipColor = '#f44336'; break;
                    case 'completed': chipColor = '#2196f3'; break;
                    default: chipColor = '#BEAF9B';
                  }
                  
                  return (
                    <MenuItem key={status} value={status}>
                      <Chip 
                        label={status} 
                        size="small" 
                        sx={{ 
                          backgroundColor: chipColor,
                          color: 'white',
                          minWidth: '80px',
                          justifyContent: 'center'
                        }} 
                      />
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <TextField
                label="Payment Amount"
                type="number"
                name="payment_amount"
                value={editForm.payment_amount || calculateTotalPrice()}
                onChange={handleInputChange}
                InputProps={{ 
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  readOnly: editForm.services.length > 0
                }}
                helperText={editForm.services.length > 0 ? "Auto-calculated from services" : ""}
                sx={{
                  '& .MuiOutlinedInput-root': {
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
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#BEAF9B',
                  },
                  '& .Mui-disabled, & .Mui-readOnly': {
                    backgroundColor: 'rgba(190, 175, 155, 0.05)',
                    WebkitTextFillColor: '#453C33',
                  }
                }}
              />
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel sx={{ 
                '&.Mui-focused': { color: '#BEAF9B' } 
              }}>Payment Status</InputLabel>
              <Select
                name="payment_status"
                value={editForm.payment_status}
                onChange={handleInputChange}
                sx={{
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(190, 175, 155, 0.3)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(190, 175, 155, 0.5)',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#BEAF9B',
                  },
                }}
              >
                {paymentStatusOptions.map(status => {
                  // Define colors for payment status options
                  const color = status.toLowerCase() === 'paid' ? '#4caf50' : '#ff9800';
                  
                  return (
                    <MenuItem key={status} value={status}>
                      <Chip 
                        label={status} 
                        size="small" 
                        sx={{ 
                          backgroundColor: color,
                          color: 'white',
                          minWidth: '80px',
                          justifyContent: 'center'
                        }} 
                      />
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel sx={{ 
                '&.Mui-focused': { color: '#BEAF9B' } 
              }}>Payment Type</InputLabel>
              <Select
                name="payment_type"
                value={editForm.payment_type}
                onChange={handleInputChange}
                sx={{
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(190, 175, 155, 0.3)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(190, 175, 155, 0.5)',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#BEAF9B',
                  },
                }}
              >
                {paymentTypeOptions.map(type => (
                  <MenuItem key={type} value={type}>{type}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Paper>
      </Box>
      
      <Box sx={{ mt: 3 }}>
        <Paper 
          elevation={0} 
          sx={{ 
            p: 2.5, 
            borderRadius: "8px",
            border: "1px solid rgba(190, 175, 155, 0.3)",
            background: "linear-gradient(to right bottom, rgba(249, 245, 240, 0.5), rgba(255, 255, 255, 0.8))"
          }}
        >
          <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
            <CalendarIcon sx={{ color: "#BEAF9B", mr: 1.5 }} />
            <Typography 
              variant="subtitle1" 
              sx={{ 
                fontWeight: 600, 
                color: "#453C33",
                fontFamily: "'Poppins', 'Roboto', sans-serif",
              }}
            >
              Time Slot
            </Typography>
          </Box>
          <TimeSlotSelector
            loadingTimeSlots={loadingTimeSlots}
            editForm={editForm}
            setEditForm={setEditForm}
            availableTimeSlots={availableTimeSlots}
            selectedAppointment={selectedAppointment}
          />
        </Paper>
      </Box>
      
      <DialogActions sx={{ 
        padding: "20px 0", 
        borderTop: "1px dashed rgba(190, 175, 155, 0.3)",
        mt: 4
      }}>
        <Button 
          type="submit"
          variant="contained"
          startIcon={<SaveIcon />}
          sx={{ 
            backgroundColor: "#BEAF9B", 
            color: "white", 
            fontFamily: "'Poppins', 'Roboto', sans-serif",
            fontWeight: 500,
            boxShadow: "0 2px 6px rgba(190, 175, 155, 0.3)",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            px: 3,
            '&:hover': { 
              backgroundColor: "#A89583",
              transform: "translateY(-2px)",
              boxShadow: "0 4px 10px rgba(190, 175, 155, 0.4)"
            }
          }}
        >
          {isEdit ? 'Save Changes' : 'Create Appointment'}
        </Button>
        <Button 
          onClick={onClose}
          sx={{ 
            color: "#453C33", 
            fontFamily: "'Poppins', 'Roboto', sans-serif",
            fontWeight: 500,
            '&:hover': { 
              backgroundColor: "rgba(190, 175, 155, 0.1)" 
            } 
          }}
        >
          Cancel
        </Button>
      </DialogActions>
    </Box>
  );
}