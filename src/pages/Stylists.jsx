import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Box, 
  Typography, 
  Container, 
  CircularProgress, 
  Grid,
} from '@mui/material';
import stylistImage from '../assets/stylist.png';
import StylistCard from '../components/StylistCard';
import StylistReviewsModal from '../components/StylistReviewsModal';
import StarIcon from '@mui/icons-material/Star';

const Stylists = () => {
  const [stylists, setStylists] = useState([]);
  const [ratings, setRatings] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedStylist, setSelectedStylist] = useState(null);
  const [reviewsOpen, setReviewsOpen] = useState(false);
  const [stylistReviews, setStylistReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);

  useEffect(() => {
    // Fetch all stylists
    axios.get('http://localhost:5001/api/stylists')
      .then((res) => {
        setStylists(res.data);
        
        // After fetching stylists, fetch their ratings
        return axios.get('http://localhost:5001/api/review/average-ratings');
      })
      .then((ratingsRes) => {
        const ratingsObj = {};
        ratingsRes.data.forEach(rating => {
          ratingsObj[rating.stylist_ID] = rating.averageRating;
        });
        setRatings(ratingsObj);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch data:', err);
        setLoading(false);
      });
  }, []);

  const handleOpenReviews = (stylist) => {
    setSelectedStylist(stylist);
    setLoadingReviews(true);
    
    // Fetch reviews for the selected stylist
    axios.get(`http://localhost:5001/api/review/by-stylist/${stylist.stylist_ID}`)
      .then((res) => {
        setStylistReviews(res.data);
        setLoadingReviews(false);
        setReviewsOpen(true);
      })
      .catch((err) => {
        console.error('Failed to fetch stylist reviews:', err);
        setLoadingReviews(false);
        setReviewsOpen(true);
      });
  };

  const handleCloseReviews = () => {
    setReviewsOpen(false);
    setSelectedStylist(null);
    setStylistReviews([]);
  };

  return (
    <Box sx={{ 
      width: "100%", 
      maxWidth: "100%", 
      minHeight: "100vh",
      overflowX: "hidden",
      position: "relative",
      bgcolor: "#faf8f5",
      display: "flex",
      flexDirection: "column",
      scrollbarWidth: "none",
      msOverflowStyle: "none",
      "&::-webkit-scrollbar": {
        display: "none",
      },
    }}>
      {/* Header Banner */}
      <Box
        sx={{
          width: "100%",
          height: { xs: '200px', sm: '300px', md: '400px' },
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          component="img"
          src={stylistImage}
          alt="Stylists"
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block"
          }}
        />
      </Box>

      {/* Page Title */}
      <Box 
        sx={{
          background: 'linear-gradient(135deg, #282520 0%, #3a352e 100%)',
          color: 'white',
          p: { xs: 3, md: 4 },
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <Container maxWidth="lg">
          <Typography 
            variant="h4" 
            component="h1" 
            sx={{ 
              fontWeight: 500,
              fontFamily: "'Poppins', 'Roboto', sans-serif",
              textAlign: 'center',
            }}
          >
            Meet Our Talented Team
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              opacity: 0.8,
              mt: 1,
              fontFamily: "'Poppins', 'Roboto', sans-serif",
              textAlign: 'center',
            }}
          >
            Discover our experts who are passionate about bringing out your best look
          </Typography>
        </Container>
      </Box>

      {/* Main Content */}
      <Box sx={{
        flex: 1,
        py: 5,
        px: { xs: 2, md: 4 },
        width: "100%",
        overflowX: "hidden",
        mt: -2,
      }}>
        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
          {loading ? (
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              height: '300px',
              my: 4
            }}>
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
                Loading our amazing stylists...
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {stylists.map((stylist) => (
                <Grid item xs={12} md={6} key={stylist.stylist_ID}>
                  <StylistCard 
                    stylist={stylist}
                    rating={ratings[stylist.stylist_ID]}
                    onViewReviews={() => handleOpenReviews(stylist)}
                    loading={false}
                  />
                </Grid>
              ))}
              
              {stylists.length === 0 && !loading && (
                <Box 
                  sx={{ 
                    py: 6, 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    color: '#666',
                    width: '100%'
                  }}
                >
                  <StarIcon sx={{ fontSize: 60, color: '#BEAF9B', opacity: 0.4, mb: 2 }} />
                  <Typography variant="h6" sx={{ fontWeight: 500 }}>
                    No Stylists Available
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1, textAlign: 'center', maxWidth: '80%' }}>
                    We're currently updating our team. Please check back soon!
                  </Typography>
                </Box>
              )}
            </Grid>
          )}
        </Container>
      </Box>

      {/* Reviews Modal */}
      {selectedStylist && (
        <StylistReviewsModal
          open={reviewsOpen}
          handleClose={handleCloseReviews}
          reviews={loadingReviews ? [] : stylistReviews}
          stylistName={selectedStylist ? `${selectedStylist.firstname} ${selectedStylist.lastname}` : ''}
        />
      )}

      {/* Global Styles */}
      <style jsx global>{`
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }
        html, body {
            overflow-x: hidden;
            width: 100%;
            max-width: 100%;
            margin: 0;
            padding: 0;
        }
        ::-webkit-scrollbar {
            display: none;
        }
        * {
            scrollbar-width: none;
        }
        .MuiBox-root, .MuiContainer-root, .MuiDialog-paper {
            max-width: 100%;
        }
        .MuiDialog-container, .MuiDialog-root {
            overflow-x: hidden !important;
        }
      `}</style>
    </Box>
  );
};

export default Stylists;