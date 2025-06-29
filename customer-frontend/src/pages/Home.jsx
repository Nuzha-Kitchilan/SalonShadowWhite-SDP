import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Container, CircularProgress, Divider } from '@mui/material';
import { motion } from 'framer-motion';
import ReviewCard from '../components/ReviewCard';
import BeautyServicesNav from '../components/ServiceNavbar';
import AboutUsCard from '../components/AboutUsCard';
import CoreValuesSection from '../components/CoreValue';
import homepageImage from '../assets/homepage2.png';
import BookNowModal from '../components/modals/BookNow';

const Home = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5001/api/review/random')
      .then((res) => {
        setReviews(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch reviews:', err);
        setLoading(false);
      });
  }, []);

  return (
    <Box 
      sx={{ 
        width: "100%", 
        maxWidth: "100%", 
        minHeight: "100vh",
        overflowX: "hidden",
        position: "relative",
        bgcolor: "#faf5f0",
        scrollbarWidth: "none",
        "&::-webkit-scrollbar": {
          display: "none",
        },
        msOverflowStyle: "none"
      }}
    >
      {/* Header Section */}
      <Box sx={{ 
        width: "100%", 
        position: "relative", 
        overflow: "hidden",
        height: { xs: '180px', sm: '300px', md: '400px' },
        "&::-webkit-scrollbar": {
          display: "none",
        },
      }}>
        <Box
          sx={{
            backgroundImage: `url(${homepageImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: "100%",
            display: "flex",
            alignItems: { xs: 'flex-start', sm: 'center' },
            justifyContent: "center",
            position: "relative",
            pt: { xs: 2, sm: 0 },
            '&::before': {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0,0,0,0.3)",
              zIndex: 0
            },
            "&::-webkit-scrollbar": {
              display: "none",
            },
          }}
        >
          {/* Book Now Button with Motion */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{
              position: "relative",
              zIndex: 1
            }}
          >
            <BookNowModal 
              sx={{ 
                fontSize: { xs: '0.8rem', sm: '1rem' },
                px: { xs: 2, sm: 3 },
                py: { xs: 1, sm: 1.5 }
              }} 
            />
          </motion.div>
        </Box>
      </Box>

      {/* About Us Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.2 }}
      >
        <AboutUsCard />
      </motion.div>
      
      {/* Core Values Section */}
      <Container maxWidth="lg" sx={{ my: 6, position: 'relative' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3 }}
        >
          <Box
            sx={{
              position: 'relative',
              overflow: 'visible',
              borderRadius: 4,
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.7) 0%, rgba(250, 245, 240, 0.9) 100%)',
              border: '1px solid #eae7e2',
              boxShadow: '0 10px 30px rgba(40, 37, 32, 0.06)',
              p: { xs: 2, sm: 4, md: 5 },
              zIndex: 1
            }}
          >
            {/* Decorative elements */}
            <Box
              sx={{
                position: 'absolute',
                top: -15,
                right: -15,
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(190,175,155,0.08) 0%, rgba(255,255,255,0) 70%)',
                zIndex: 0
              }}
            />
            
            <CoreValuesSection />
          </Box>
        </motion.div>
      </Container>
      
      {/* Beauty Services Navigation */}
      <Box sx={{ mt: { xs: -2, md: -4 }, position: 'relative', zIndex: 1 }}>
        <BeautyServicesNav />
      </Box>
      
      {/* Divider between sections */}
      <Container maxWidth="lg">
        <Divider 
          sx={{ 
            my: { xs: 2, md: 3 },
            opacity: 0.6,
            background: 'linear-gradient(to right, rgba(190, 175, 155, 0.3) 0%, rgba(190, 175, 155, 0.6) 50%, rgba(190, 175, 155, 0.3) 100%)',
          }} 
        />
      </Container>
      
      {/* Reviews Section */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Typography 
            variant="h4" 
            component="h2" 
            sx={{ 
              mb: 4, 
              textAlign: 'center',
              fontWeight: 500,
              color: '#282520',
              fontFamily: "'Poppins', 'Roboto', sans-serif",
              position: 'relative',
              display: 'inline-block',
              left: '50%',
              transform: 'translateX(-50%)',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: -8,
                left: '25%',
                width: '50%',
                height: 2,
                background: 'linear-gradient(to right, rgba(190, 175, 155, 0.3) 0%, #BEAF9B 50%, rgba(190, 175, 155, 0.3) 100%)',
                borderRadius: 2
              }
            }}
          >
            What Our Customers Say
          </Typography>
          
          {loading ? (
            <Box display="flex" justifyContent="center" my={4}>
              <CircularProgress sx={{ color: '#BEAF9B' }} />
            </Box>
          ) : (
            <Box 
              sx={{
                display: "flex", 
                flexDirection: { xs: "column", md: "row" }, 
                flexWrap: "wrap", 
                justifyContent: "center",
                gap: 3,
                mt: 5
              }}
            >
              {reviews.map((review) => (
                <Box
                  key={review.review_ID}
                  sx={{ 
                    width: { xs: '100%', md: 'calc(50% - 24px)', lg: 'calc(33.33% - 24px)' } 
                  }}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * reviews.indexOf(review) }}
                  >
                    <ReviewCard review={review} />
                  </motion.div>
                </Box>
              ))}
            </Box>
          )}
        </motion.div>
      </Container>

      {/* Footer background element */}
      <Box
        sx={{
          height: 60,
          width: '100%',
          background: 'linear-gradient(to bottom, #faf5f0 0%, rgba(40, 37, 32, 0.02) 100%)',
          mt: 4
        }}
      />

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
        .MuiBox-root {
          max-width: 100%;
        }
      `}</style>
    </Box>
  );
};

export default Home;