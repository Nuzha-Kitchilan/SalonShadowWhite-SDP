import React from 'react';
import { Box, Typography, Grid, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import servicesImage from '../assets/services.png';
import hairImg from '../assets/Hair.png';
import faceImg from '../assets/face.jpg';
import nailsImg from '../assets/Nails.png';
import bodyImg from '../assets/Body.png';
import makeupImg from '../assets/Makeup.png';
import bridalImg from '../assets/Bridal.png';

const categories = [
  { id: 1, name: 'Hair', path: '/services/hair', image: hairImg },
  { id: 2, name: 'Face', path: '/services/face', image: faceImg },
  { id: 3, name: 'Nails', path: '/services/nails', image: nailsImg },
  { id: 4, name: 'Body', path: '/services/body', image: bodyImg },
  { id: 5, name: 'Makeup', path: '/services/makeup', image: makeupImg },
  { id: 6, name: 'Bridal', path: '/services/bridal', image: bridalImg },
];

const Services = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ 
      width: '100%', 
      maxWidth: '100%', 
      minHeight: '100vh',
      overflowX: 'hidden',
      position: 'relative',
      bgcolor: '#faf8f5',
      display: 'flex',
      flexDirection: 'column',
      scrollbarWidth: 'none',
      msOverflowStyle: 'none',
      '&::-webkit-scrollbar': {
        display: 'none',
      },
    }}>
      {/* Header Banner */}
      {/* <Box
        sx={{
          width: '100%',
          height: { xs: '200px', sm: '250px', md: '300px' },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box
          component="img"
          src={servicesImage}
          alt="Services"
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block'
          }}
        />
      </Box> */}
      
      {/* <Box 
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
            Our Service Categories
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
            Discover a range of personalized beauty services tailored to enhance your natural glow
          </Typography>
        </Container>
      </Box> */}

      {/* Main Content */}
      {/* <Box sx={{
        flex: 1,
        py: 4,
        px: { xs: 2, md: 3 },
        width: '100%',
        overflowX: 'hidden',
        mt: -2,
      }}>
        <Container maxWidth="lg" sx={{ px: { xs: 1, sm: 2 } }}>
          <Grid container spacing={3} justifyContent="center">
            {categories.map((category) => (
              <Grid item xs={12} sm={6} md={4} key={category.id} sx={{ 
                display: 'flex', 
                justifyContent: 'center',
                mb: { xs: 1, sm: 2 } 
              }}>
                <Box
                  sx={{
                    width: '300px',
                    height: '375px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.08)',
                    '&:hover': { 
                      transform: 'translateY(-5px) scale(1.02)',
                      boxShadow: '0 10px 20px rgba(0,0,0,0.12)',
                    },
                  }}
                  onClick={() => navigate(category.path)}
                >
                  <Box
                    component="img"
                    src={category.image}
                    alt={category.name}
                    sx={{
                      width: '300px',
                      height: '375px',
                      display: 'block',
                    }}
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box> */}

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
        .MuiBox-root, .MuiContainer-root {
          max-width: 100%;
        }
      `}</style>
    </Box>
  );
};

export default Services;