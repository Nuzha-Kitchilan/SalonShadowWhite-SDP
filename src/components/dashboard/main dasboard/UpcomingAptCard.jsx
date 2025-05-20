import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format, parseISO, isToday, isTomorrow } from 'date-fns';
import {
  Card,
  CardHeader,
  CardContent,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
  Badge,
  Chip,
  Divider,
  CircularProgress,
  Box
} from '@mui/material';
import { Schedule, Spa, People } from '@mui/icons-material';

const UpcomingAppointmentsCard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUpcomingAppointments = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/dashboard/appointments/upcoming');
        console.log('API Response:', response.data); 
        setAppointments(response.data);
        setLoading(false);
      } catch (err) {
        console.error('API Error:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUpcomingAppointments();
  }, []);

  const getDayLabel = (dateString) => {
    const date = parseISO(dateString);
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'EEEE'); // Full day name
  };

  const getDayBadgeColor = (dateString) => {
    const date = parseISO(dateString);
    if (isToday(date)) return '#BEAF9B'; // Beige/brown color scheme
    if (isTomorrow(date)) return '#A59787'; // Darker beige
    return '#8A7B6C'; // Darkest beige
  };

  if (loading) {
    return (
      <Card sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        borderRadius: '8px',
        border: '1px solid rgba(190, 175, 155, 0.3)',
        boxShadow: 'none',
        background: 'linear-gradient(135deg, rgba(190,175,155,0.3), rgba(255,255,255,0.9))'
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
          <CircularProgress sx={{ color: '#BEAF9B' }} />
        </Box>
      </Card>
    );
  }

  if (error) {
    return (
      <Card sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        borderRadius: '8px',
        border: '1px solid rgba(190, 175, 155, 0.3)',
        boxShadow: 'none',
        background: 'linear-gradient(135deg, rgba(190,175,155,0.3), rgba(255,255,255,0.9))'
      }}>
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', borderBottom: '1px solid rgba(190, 175, 155, 0.3)' }}>
          <Schedule sx={{ color: '#453C33', mr: 1 }} />
          <Typography 
            variant="subtitle1" 
            sx={{ 
              fontFamily: "'Poppins', 'Roboto', sans-serif", 
              fontWeight: 600,
              color: '#453C33'
            }}
          >
            Upcoming Appointments
          </Typography>
          <Badge 
            badgeContent={0} 
            sx={{ 
              ml: 2,
              '& .MuiBadge-badge': {
                backgroundColor: '#BEAF9B',
                color: 'white'
              }
            }} 
          />
        </Box>
        <CardContent sx={{ flexGrow: 1, padding: 2 }}>
          <Typography 
            color="error" 
            sx={{ 
              textAlign: 'center', 
              color: '#d32f2f',
              fontFamily: "'Poppins', 'Roboto', sans-serif"
            }}
          >
            Error: {error}
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      borderRadius: '8px',
      border: '1px solid rgba(190, 175, 155, 0.3)',
      boxShadow: 'none',
      background: 'linear-gradient(135deg, rgba(190,175,155,0.3), rgba(255,255,255,0.9))'
    }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', borderBottom: '1px solid rgba(190, 175, 155, 0.3)' }}>
        <Schedule sx={{ color: '#453C33', mr: 1 }} />
        <Typography 
          variant="subtitle1" 
          sx={{ 
            fontFamily: "'Poppins', 'Roboto', sans-serif", 
            fontWeight: 600,
            color: '#666666'
          }}
        >
          Upcoming Appointments
        </Typography>
        <Badge 
          badgeContent={appointments.length} 
          showZero 
          sx={{ 
            ml: 2,
            '& .MuiBadge-badge': {
              backgroundColor: '#BEAF9B',
              color: 'white'
            }
          }} 
        />
      </Box>
      <CardContent sx={{ 
        flexGrow: 1, 
        p: 0,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {appointments.length === 0 ? (
          <Typography 
            sx={{ 
              p: 3, 
              textAlign: 'center', 
              color: '#666666',
              fontFamily: "'Poppins', 'Roboto', sans-serif"
            }}
          >
            No upcoming appointments in the next 48 hours
          </Typography>
        ) : (
          <Box sx={{ 
            flexGrow: 1,
            overflow: 'auto',
            height: '600px', 
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              background: 'rgba(190, 175, 155, 0.1)',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'rgba(190, 175, 155, 0.5)',
              borderRadius: '4px',
              '&:hover': {
                background: 'rgba(190, 175, 155, 0.7)',
              },
            },
          }}>
            <List disablePadding>
              {appointments.map((appointment, index) => (
                <React.Fragment key={appointment.appointment_ID}>
                  <ListItem
                    sx={{
                      padding: 2, 
                      minHeight: '70px', 
                      '&:hover': { backgroundColor: 'rgba(190, 175, 155, 0.1)' }
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar 
                        sx={{ 
                          bgcolor: getDayBadgeColor(appointment.date),
                          fontFamily: "'Poppins', 'Roboto', sans-serif",
                        }}
                      >
                        {format(parseISO(appointment.date), 'dd')}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center">
                          <Typography 
                            variant="subtitle1" 
                            component="span" 
                            sx={{ 
                              mr: 1,
                              fontFamily: "'Poppins', 'Roboto', sans-serif",
                              fontWeight: 500,
                              color: '#453C33'
                            }}
                          >
                            {appointment.client_name}
                          </Typography>
                          <Chip
                            label={appointment.appointment_status}
                            size="small"
                            sx={{
                              backgroundColor: appointment.appointment_status === 'Scheduled' ? 'rgba(190, 175, 155, 0.8)' : 'rgba(190, 175, 155, 0.4)',
                              color: '#453C33',
                              fontFamily: "'Poppins', 'Roboto', sans-serif",
                              fontSize: '0.75rem',
                              height: '24px'
                            }}
                          />
                        </Box>
                      }
                      secondary={
                        <>
                          <Box display="flex" alignItems="center" mt={0.25}>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                mr: 2,
                                color: '#666666',
                                fontFamily: "'Poppins', 'Roboto', sans-serif",
                                display: 'flex',
                                alignItems: 'center',
                                fontSize: '0.8rem'
                              }}
                            >
                              <Schedule fontSize="small" sx={{ mr: 0.5, color: '#8A7B6C' }} />
                              {appointment.time}
                            </Typography>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                color: '#666666',
                                fontFamily: "'Poppins', 'Roboto', sans-serif",
                                display: 'flex',
                                alignItems: 'center',
                                fontSize: '0.8rem'
                              }}
                            >
                              <People fontSize="small" sx={{ mr: 0.5, color: '#8A7B6C' }} />
                              {appointment.stylists}
                            </Typography>
                          </Box>
                          <Box mt={0.5}>
                            {appointment.services && appointment.services.split(', ').map((service) => (
                              <Chip
                                key={service}
                                label={service}
                                size="small"
                                icon={<Spa fontSize="small" sx={{ color: '#8A7B6C' }} />}
                                sx={{ 
                                  mr: 0.5, 
                                  mb: 0.25,
                                  backgroundColor: 'rgba(190, 175, 155, 0.2)',
                                  color: '#666666',
                                  fontFamily: "'Poppins', 'Roboto', sans-serif",
                                  fontSize: '0.7rem',
                                  height: '20px',
                                  border: '1px solid rgba(190, 175, 155, 0.3)',
                                  '& .MuiChip-icon': {
                                    color: '#8A7B6C'
                                  }
                                }}
                              />
                            ))}
                          </Box>
                        </>
                      }
                    />
                  </ListItem>
                  {index < appointments.length - 1 && <Divider sx={{ borderColor: 'rgba(190, 175, 155, 0.2)' }} />}
                </React.Fragment>
              ))}
            </List>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingAppointmentsCard;