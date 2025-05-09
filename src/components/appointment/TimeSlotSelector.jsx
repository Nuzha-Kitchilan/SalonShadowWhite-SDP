
import React from 'react';
import {
  Box, Typography, Chip, RadioGroup,
  FormControlLabel, Radio, FormControl, CircularProgress
} from "@mui/material";
import { Schedule as ScheduleIcon } from "@mui/icons-material";

export default function TimeSlotSelector({
  loadingTimeSlots,
  editForm,
  setEditForm,
  availableTimeSlots,
  selectedAppointment
}) {
  // Color definitions matching your filters
  const primaryColor = '#BEAF9B';
  const lightBackground = '#f9f5f0';
  const borderColor = 'rgba(190, 175, 155, 0.3)';
  const hoverBorderColor = 'rgba(190, 175, 155, 0.5)';
  const textColor = '#453C33';

  if (loadingTimeSlots) {
    return (
      <Box sx={{ 
        mb: 3, 
        p: 3, 
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(190, 175, 155, 0.2)",
        border: `1px solid ${borderColor}`,
        background: "linear-gradient(to right, #f9f5f0, #ffffff)",
        display: 'flex', 
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <CircularProgress size={24} sx={{ color: primaryColor }} />
        <Typography variant="body2" sx={{ ml: 2, color: textColor }}>
          Loading available time slots...
        </Typography>
      </Box>
    );
  }

  if (!editForm.appointment_date || !editForm.stylists.length || !editForm.services.length) {
    return (
      <Box sx={{ 
        mb: 3, 
        p: 3, 
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(190, 175, 155, 0.2)",
        border: `1px solid ${borderColor}`,
        background: "linear-gradient(to right, #f9f5f0, #ffffff)",
        textAlign: 'center'
      }}>
        <Typography variant="body2" sx={{ color: textColor }}>
          Please select date, stylist, and services to view available time slots
        </Typography>
      </Box>
    );
  }
  
  const originalTimeSlot = selectedAppointment?.appointment_time 
    ? selectedAppointment.appointment_time.substring(0, 5)
    : null;

  return (
    <Box sx={{ 
      mb: 3, 
      p: 3, 
      borderRadius: "8px",
      overflow: "hidden",
      boxShadow: "0 2px 8px rgba(190, 175, 155, 0.2)",
      border: `1px solid ${borderColor}`,
      background: "linear-gradient(to right, #f9f5f0, #ffffff)",
      transition: "box-shadow 0.3s ease",
      "&:hover": {
        boxShadow: "0 4px 12px rgba(190, 175, 155, 0.3)",
      },
    }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        mb: 2.5
      }}>
        <ScheduleIcon sx={{ 
          mr: 1.5, 
          color: primaryColor 
        }} />
        <Typography variant="h6" sx={{ 
          fontWeight: 500, 
          color: textColor,
          fontFamily: "'Poppins', 'Roboto', sans-serif",
        }}>
          Time Slot Selection
        </Typography>
      </Box>

      {originalTimeSlot && (
        <Box sx={{ 
          mb: 3, 
          p: 2, 
          backgroundColor: lightBackground, 
          borderRadius: "6px",
          borderLeft: `4px solid ${primaryColor}`
        }}>
          <Typography variant="subtitle2" sx={{ 
            fontWeight: 'bold',
            color: textColor,
            mb: 1,
            fontFamily: "'Poppins', 'Roboto', sans-serif",
          }}>
            Currently Booked Time:
          </Typography>
          <Chip 
            label={originalTimeSlot} 
            sx={{ 
              backgroundColor: primaryColor,
              color: 'white',
              fontWeight: 'bold',
              fontSize: '0.9rem',
              p: 1.5,
              fontFamily: "'Poppins', 'Roboto', sans-serif",
              '&:hover': {
                backgroundColor: '#A89583'
              }
            }}
          />
        </Box>
      )}
      
      <Typography variant="subtitle2" sx={{ 
        fontWeight: 'bold',
        color: textColor,
        mb: 2,
        fontFamily: "'Poppins', 'Roboto', sans-serif",
      }}>
        Available Time Slots:
      </Typography>
      
      {availableTimeSlots.length === 0 ? (
        <Box sx={{ 
          p: 2,
          backgroundColor: lightBackground,
          borderRadius: "6px",
          borderLeft: `4px solid ${primaryColor}`
        }}>
          <Typography variant="body2" sx={{ 
            color: textColor,
            fontFamily: "'Poppins', 'Roboto', sans-serif",
          }}>
            No available time slots for the selected date and stylist
          </Typography>
        </Box>
      ) : (
        <RadioGroup
          name="appointment_time"
          value={editForm.appointment_time || ''}
          onChange={(e) => {
            setEditForm(prev => ({ 
              ...prev, 
              appointment_time: e.target.value 
            }));
          }}
          sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(auto-fill, minmax(120px, 1fr))' }, 
            gap: 1.5 
          }}
        >
          {availableTimeSlots.map((time) => (
            <FormControlLabel
              key={time}
              value={time}
              control={
                <Radio 
                  size="small" 
                  sx={{ 
                    color: borderColor,
                    '&.Mui-checked': {
                      color: primaryColor,
                    },
                  }} 
                />
              }
              label={time}
              sx={{ 
                m: 0,
                '& .MuiFormControlLabel-label': {
                  width: '100%'
                }
              }}
              componentsProps={{
                typography: {
                  sx: {
                    border: `1px solid ${borderColor}`,
                    borderRadius: "6px",
                    p: 1.5,
                    textAlign: 'center',
                    backgroundColor: editForm.appointment_time === time ? lightBackground : 'white',
                    color: textColor,
                    fontFamily: "'Poppins', 'Roboto', sans-serif",
                    fontWeight: editForm.appointment_time === time ? 500 : 400,
                    transition: "all 0.2s ease",
                    '&:hover': { 
                      backgroundColor: lightBackground,
                      borderColor: hoverBorderColor,
                      boxShadow: "0 2px 6px rgba(190, 175, 155, 0.2)"
                    },
                    ...(editForm.appointment_time === time ? {
                      backgroundColor: lightBackground,
                      borderColor: primaryColor,
                      color: textColor,
                      fontWeight: 500,
                      boxShadow: "0 2px 6px rgba(190, 175, 155, 0.2)"
                    } : {})
                  }
                }
              }}
            />
          ))}
        </RadioGroup>
      )}
      
      <Box sx={{ 
        mt: 2, 
        pt: 1.5, 
        borderTop: "1px dashed rgba(190, 175, 155, 0.2)"
      }}>
        <Typography variant="caption" sx={{ 
          color: "text.secondary",
          fontStyle: "italic",
          fontFamily: "'Poppins', 'Roboto', sans-serif",
        }}>
          Select an available time slot for the appointment
        </Typography>
      </Box>
    </Box>
  );
}





