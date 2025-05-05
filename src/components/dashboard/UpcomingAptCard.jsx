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
import { Schedule, Person, Spa, People } from '@mui/icons-material';

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
    if (isToday(date)) return 'success.main';
    if (isTomorrow(date)) return 'info.main';
    return 'secondary.main';
  };

  if (loading) {
    return (
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
          <CircularProgress />
        </Box>
      </Card>
    );
  }

  if (error) {
    return (
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CardHeader
          title="Upcoming Appointments"
          sx={{ backgroundColor: 'primary.main', color: 'primary.contrastText', padding: 2 }}
        />
        <CardContent sx={{ flexGrow: 1, padding: 0 }}>
          <Typography color="error" sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
            Error: {error}
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardHeader
        title={
          <Box display="flex" alignItems="center">
            <Typography variant="h6">Upcoming Appointments</Typography>
            <Badge badgeContent={appointments.length} color="secondary" showZero sx={{ ml: 2 }} />
          </Box>
        }
        avatar={<Schedule />}
        sx={{ backgroundColor: 'primary.main', color: 'primary.contrastText', padding: 2 }}
      />
      <CardContent sx={{ flexGrow: 1, padding: 0 }}>
        {appointments.length === 0 ? (
          <Typography sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
            No upcoming appointments in the next 48 hours
          </Typography>
        ) : (
          <List disablePadding>
            {appointments.map((appointment, index) => (
              <React.Fragment key={appointment.appointment_ID}>
                <ListItem
                  sx={{
                    padding: 2,
                    '&:hover': { backgroundColor: 'action.hover' }
                  }}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: getDayBadgeColor(appointment.date) }}>
                      {format(parseISO(appointment.date), 'dd')}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box display="flex" alignItems="center">
                        <Typography variant="subtitle1" component="span" sx={{ mr: 1 }}>
                          {appointment.client_name}
                        </Typography>
                        <Chip
                          label={appointment.appointment_status}
                          size="small"
                          color={appointment.appointment_status === 'Scheduled' ? 'primary' : 'default'}
                        />
                      </Box>
                    }
                    secondary={
                      <>
                        <Box display="flex" alignItems="center" mt={0.5}>
                          <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
                            <Schedule fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                            {appointment.time}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            <People fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                            {appointment.stylists}
                          </Typography>
                        </Box>
                        <Box mt={1}>
                          {appointment.services && appointment.services.split(', ').map((service) => (
                            <Chip
                              key={service}
                              label={service}
                              size="small"
                              icon={<Spa fontSize="small" />}
                              sx={{ mr: 0.5, mb: 0.5 }}
                            />
                          ))}
                        </Box>
                      </>
                    }
                  />
                </ListItem>
                {index < appointments.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
};

export default UpcomingAppointmentsCard;