import React from 'react';
import { 
  Box, 
  Typography, 
  Rating, 
  Button, 
  Paper, 
  Avatar, 
  Divider, 
  Chip, 
  CircularProgress 
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';

const StylistCard = ({ 
  stylist, 
  rating, 
  onViewReviews,
  loading 
}) => {
  if (loading) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 2,
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          border: '1px solid rgba(190, 175, 155, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 300
        }}
      >
        <CircularProgress 
          size={60} 
          sx={{ 
            color: '#BEAF9B',
            mb: 2
          }}
        />
        <Typography 
          variant="body1" 
          sx={{ 
            fontFamily: "'Poppins', 'Roboto', sans-serif",
            color: '#3a3529'
          }}
        >
          Loading stylist...
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 2,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        border: '1px solid rgba(190, 175, 155, 0.15)',
        transition: 'transform 0.2s ease, box-shadow 0.3s ease',
        '&:hover': {
          boxShadow: '0 8px 24px rgba(190, 175, 155, 0.25)',
          transform: 'translateY(-5px)'
        },
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'center', sm: 'flex-start' } }}>
        {/* Stylist Avatar/Image */}
        <Avatar
          sx={{ 
            width: { xs: 80, sm: 100 }, 
            height: { xs: 80, sm: 100 },
            bgcolor: '#BEAF9B',
            color: 'white',
            fontSize: '2rem',
            mb: { xs: 2, sm: 0 },
            mr: { xs: 0, sm: 3 },
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
          }}
        >
          <PersonIcon fontSize="large" />
        </Avatar>
        
        {/* Stylist Info */}
        <Box sx={{ flex: 1 }}>
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 500,
              fontFamily: "'Poppins', 'Roboto', sans-serif",
              color: '#282520',
              textAlign: { xs: 'center', sm: 'left' },
              mb: 0.5
            }}
          >
            {stylist.firstname} {stylist.lastname}
          </Typography>
          
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            justifyContent: { xs: 'center', sm: 'flex-start' },
            mb: 1.5
          }}>
            <Rating 
              value={rating || 0} 
              precision={0.5} 
              readOnly 
              sx={{ 
                color: '#BEAF9B',
                '& .MuiRating-iconFilled': {
                  color: '#BEAF9B',
                }
              }}
            />
            <Chip 
              label={rating 
                ? `${parseFloat(rating).toFixed(1)}` 
                : 'New'}
              size="small"
              sx={{ 
                ml: 1, 
                height: 22, 
                backgroundColor: '#BEAF9B', 
                color: 'white',
                fontWeight: 600,
                fontSize: '0.7rem'
              }}
            />
          </Box>
          
          <Chip 
            label={stylist.specialization || "Hair Stylist"}
            size="small"
            sx={{ 
              mb: 2,
              backgroundColor: 'rgba(190, 175, 155, 0.1)', 
              color: '#8C7B6B',
              fontSize: '0.7rem',
              border: '1px solid rgba(190, 175, 155, 0.3)'
            }}
          />
          
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#3a3529',
              fontFamily: "'Poppins', 'Roboto', sans-serif",
              lineHeight: 1.6,
              mb: 2,
              textAlign: { xs: 'center', sm: 'left' }
            }}
          >
            {stylist.bio || `${stylist.firstname} is an experienced stylist passionate about creating looks that enhance natural beauty and make clients feel confident.`}
          </Typography>
        </Box>
      </Box>
      
      <Divider sx={{ my: 2, borderColor: 'rgba(190, 175, 155, 0.2)' }} />
      
      {/* Experience/Services */}
      <Box sx={{ mb: 2, flex: 1 }}>
        <Typography 
          variant="subtitle1" 
          sx={{ 
            fontWeight: 500,
            fontFamily: "'Poppins', 'Roboto', sans-serif",
            color: '#282520',
            mb: 1
          }}
        >
          Services & Expertise
        </Typography>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {['Haircut', 'Coloring', 'Styling', 'Treatments'].map((service) => (
            <Chip 
              key={service}
              label={service}
              size="small"
              sx={{ 
                backgroundColor: 'rgba(190, 175, 155, 0.05)', 
                color: '#8C7B6B',
                fontSize: '0.75rem',
                border: '1px solid rgba(190, 175, 155, 0.2)'
              }}
            />
          ))}
        </Box>
      </Box>
      
      {/* Action Button */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
        <Button 
          variant="contained"
          component={RouterLink}
          to="/book"
          sx={{ 
            background: 'linear-gradient(135deg, #282520 0%, #3a352e 100%)',
            color: 'white',
            px: 3,
            textDecoration: 'none',
            '&:hover': {
              background: 'linear-gradient(135deg, #3a352e 0%, #4a453e 100%)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
            }
          }}
        >
          Book Appointment
        </Button>
        
        <Button 
          variant="outlined" 
          onClick={onViewReviews}
          sx={{
            borderColor: '#BEAF9B',
            color: '#8C7B6B',
            '&:hover': {
              borderColor: '#8C7B6B',
              backgroundColor: 'rgba(190, 175, 155, 0.05)',
            }
          }}
        >
          View Reviews
        </Button>
      </Box>
    </Paper>
  );
};

export default StylistCard;