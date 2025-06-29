import React from 'react';
import { 
  Modal, 
  Box, 
  Typography, 
  Rating, 
  Divider, 
  IconButton, 
  Paper,
  Avatar,
  Chip
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import StarIcon from '@mui/icons-material/Star';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '95%', sm: '80%', md: '60%', lg: '50%' },
  maxHeight: '85vh',
  bgcolor: '#faf8f5',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
  p: 0,
  overflowY: 'auto',
  borderRadius: 2,
  border: '1px solid rgba(190, 175, 155, 0.3)'
};

const StylistReviewsModal = ({ open, handleClose, reviews, stylistName }) => {
  // Calculate average rating
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        {/* Header */}
        <Box 
          sx={{
            background: 'linear-gradient(135deg, #282520 0%, #3a352e 100%)',
            color: 'white',
            p: 3,
            borderTopLeftRadius: 2,
            borderTopRightRadius: 2,
            position: 'relative'
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography 
              id="modal-modal-title" 
              variant="h5" 
              component="h2"
              sx={{ 
                fontWeight: 500,
                fontFamily: "'Poppins', 'Roboto', sans-serif",
              }}
            >
              Client Reviews
            </Typography>
            <IconButton 
              onClick={handleClose}
              sx={{ 
                color: 'white',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
          
          <Typography 
            variant="body2" 
            sx={{ 
              opacity: 0.8,
              mt: 0.5,
              fontFamily: "'Poppins', 'Roboto', sans-serif",
            }}
          >
            Feedback for {stylistName}
          </Typography>

          {reviews.length > 0 && (
            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
              <Rating 
                value={parseFloat(averageRating)} 
                precision={0.5} 
                readOnly 
                sx={{ 
                  color: '#BEAF9B',
                  '& .MuiRating-iconFilled': {
                    color: '#BEAF9B',
                  }
                }}
              />
              <Typography 
                variant="h6" 
                sx={{ 
                  ml: 1.5, 
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                {averageRating}
                <Typography component="span" variant="body2" sx={{ ml: 1, opacity: 0.7 }}>
                  ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
                </Typography>
              </Typography>
            </Box>
          )}
        </Box>
        
        {/* Reviews Content */}
        <Box sx={{ p: 3 }}>
          {reviews.length === 0 ? (
            <Box 
              sx={{ 
                py: 6, 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                color: '#666'
              }}
            >
              <StarIcon sx={{ fontSize: 60, color: '#BEAF9B', opacity: 0.4, mb: 2 }} />
              <Typography variant="h6" sx={{ fontWeight: 500 }}>
                No Reviews Yet
              </Typography>
              <Typography variant="body2" sx={{ mt: 1, textAlign: 'center', maxWidth: '80%' }}>
                Be the first to leave feedback about {stylistName}'s services
              </Typography>
            </Box>
          ) : (
            <Box>
              {reviews.map((review, index) => (
                <Paper
                  key={review.review_ID || index}
                  elevation={0}
                  sx={{
                    mb: 3,
                    p: 2.5,
                    borderRadius: 2,
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                    border: '1px solid rgba(190, 175, 155, 0.15)',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    '&:hover': {
                      boxShadow: '0 4px 12px rgba(190, 175, 155, 0.15)',
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                    <Avatar 
                      sx={{ 
                        width: 45, 
                        height: 45,
                        bgcolor: '#BEAF9B',
                        color: 'white',
                        fontWeight: 500,
                        fontSize: '1rem',
                        mr: 2
                      }}
                    >
                      {review.customer_name ? review.customer_name[0].toUpperCase() : 'C'}
                    </Avatar>
                    
                    <Box sx={{ width: '100%' }}>
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
                        <Typography 
                          variant="subtitle1" 
                          sx={{ 
                            fontWeight: 500,
                            color: '#282520',
                            fontFamily: "'Poppins', 'Roboto', sans-serif",
                          }}
                        >
                          {review.customer_name}
                        </Typography>
                        <Typography 
                          variant="caption" 
                          color="text.secondary"
                          sx={{ 
                            fontFamily: "'Poppins', 'Roboto', sans-serif", 
                          }}
                        >
                          {new Date(review.created_at).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </Typography>
                      </Box>
                      
                      <Box display="flex" alignItems="center" mb={1.5}>
                        <Rating 
                          value={review.rating} 
                          precision={0.5} 
                          readOnly 
                          size="small"
                          sx={{ 
                            color: '#BEAF9B',
                            '& .MuiRating-iconFilled': {
                              color: '#BEAF9B',
                            }
                          }}
                        />
                        <Chip 
                          label={`${review.rating.toFixed(1)}`}
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
                        
                        {review.service_type && (
                          <Chip 
                            label={review.service_type}
                            size="small"
                            sx={{ 
                              ml: 1, 
                              height: 22, 
                              backgroundColor: 'rgba(190, 175, 155, 0.1)', 
                              color: '#8C7B6B',
                              fontSize: '0.7rem',
                              border: '1px solid rgba(190, 175, 155, 0.3)'
                            }}
                          />
                        )}
                      </Box>
                      
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          mb: 1.5,
                          lineHeight: 1.6,
                          color: '#3a3529',
                          fontFamily: "'Poppins', 'Roboto', sans-serif",
                          fontStyle: review.review_text ? 'italic' : 'normal',
                          pb: 1,
                        }}
                      >
                        "{review.review_text || 'No written feedback provided.'}"
                      </Typography>
                      
                      {review.service_date && (
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: 'text.secondary',
                            display: 'block',
                            textAlign: 'right'
                          }}
                        >
                          Service date: {new Date(review.service_date).toLocaleDateString()}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </Paper>
              ))}
            </Box>
          )}
        </Box>
      </Box>
    </Modal>
  );
};

export default StylistReviewsModal;