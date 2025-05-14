import React from 'react';
import { 
  Card,
  CardContent,
  Typography,
  Rating,
  Box,
  Avatar,
  Divider
} from '@mui/material';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import EventNoteIcon from '@mui/icons-material/EventNote';

const ReviewCard = ({ review }) => {
  // Format date if it exists (assuming review might have a date property)
  const formattedDate = review.review_date 
    ? new Date(review.review_date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    : null;
    
  // Generate initials for avatar
  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Card 
      elevation={0}
      sx={{ 
        position: 'relative',
        borderRadius: 2,
        mb: 3,
        background: 'linear-gradient(to bottom, #ffffff 0%, #faf8f5 100%)',
        border: '1px solid #eae7e2',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: '0 8px 24px rgba(40, 37, 32, 0.12)',
        }
      }}
    >
      <CardContent sx={{ p: 3 }}>
        {/* Review header with customer info and rating */}
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar 
              sx={{ 
                width: 50, 
                height: 50, 
                bgcolor: '#282520',
                color: '#BEAF9B',
                fontWeight: 600,
                mr: 2,
                boxShadow: '0 2px 8px rgba(40, 37, 32, 0.15)'
              }}
            >
              {getInitials(review.customer_name)}
            </Avatar>
            <Box>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 600,
                  fontSize: '1rem',
                  fontFamily: "'Poppins', 'Roboto', sans-serif",
                  color: '#282520'
                }}
              >
                {review.customer_name}
              </Typography>
              {formattedDate && (
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                  <EventNoteIcon sx={{ fontSize: 14, mr: 0.5, color: '#BEAF9B' }} />
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: '#3a352e', 
                      opacity: 0.7,
                      fontFamily: "'Poppins', 'Roboto', sans-serif",
                    }}
                  >
                    {formattedDate}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <Rating 
              value={review.rating} 
              precision={0.5} 
              readOnly 
              size="small"
              sx={{
                '& .MuiRating-iconFilled': {
                  color: '#BEAF9B',
                },
              }}
            />
            <Typography 
              variant="body2" 
              sx={{ 
                mt: 0.5,
                fontWeight: 600,
                fontSize: '0.75rem',
                color: '#282520',
                fontFamily: "'Poppins', 'Roboto', sans-serif",
              }}
            >
              {review.rating.toFixed(1)} / 5.0
            </Typography>
          </Box>
        </Box>
        
        <Divider sx={{ 
          my: 2, 
          opacity: 0.6,
          background: 'linear-gradient(to right, #BEAF9B 0%, rgba(190, 175, 155, 0.3) 100%)'
        }} />
        
        {/* Review content */}
        <Box sx={{ position: 'relative', pl: 1, pr: 1 }}>
          <FormatQuoteIcon 
            sx={{ 
              position: 'absolute', 
              left: -5, 
              top: -10, 
              fontSize: 20,
              color: '#BEAF9B',
              opacity: 0.4
            }} 
          />
          <Typography 
            variant="body1" 
            sx={{ 
              fontStyle: 'italic',
              lineHeight: 1.6,
              color: '#3a352e',
              mt: 1,
              fontFamily: "'Poppins', 'Roboto', sans-serif",
            }}
          >
            {review.review_text}
          </Typography>
        </Box>
        
        {/* Stylist reference */}
        {review.stylist_name && (
          <Box 
            sx={{ 
              mt: 2.5,
              pt: 1.5, 
              borderTop: '1px dashed rgba(190, 175, 155, 0.4)',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <Typography 
              variant="caption" 
              sx={{ 
                color: '#282520',
                fontSize: '0.75rem',
                fontFamily: "'Poppins', 'Roboto', sans-serif",
              }}
            >
              <Box component="span" sx={{ fontWeight: 600 }}>Stylist:</Box>{' '}
              {review.stylist_name}
            </Typography>
          </Box>
        )}
      </CardContent>
      
      {/* Decorative corner accent */}
      <Box 
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: 24,
          height: 24,
          background: 'linear-gradient(135deg, transparent 50%, #282520 50%)',
          opacity: 0.8
        }}
      />
    </Card>
  );
};

export default ReviewCard;