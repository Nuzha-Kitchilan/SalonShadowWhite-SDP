import React from 'react';
import { Box, Typography, Grid, Card, CardActionArea, CardMedia, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import servicesImage from '../assets/services.png';
import hairImg from '../assets/Hair.png';
import faceImg from '../assets/Face.png';
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
      maxWidth: '100vw', 
      minHeight: '100vh',
      overflowX: 'hidden',
      position: 'relative',
      bgcolor: '#f5f5f7',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header Banner */}
      <Box
        sx={{
          width: '100%',
          height: { xs: '300px', md: '400px' },
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
      </Box>

      {/* Main Content */}
      <Box sx={{
        flex: 1,
        py: 4,
        px: { xs: 2, md: 4 },
        width: '100%',
      }}>
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            gutterBottom
            sx={{ 
              fontFamily: 'Dream Avenue', 
              fontWeight: 'bold', 
              textAlign: 'center',
              mb: 4
            }}
          >
            Our Service Categories
          </Typography>

          <Typography
            variant="body1"
            sx={{ 
              fontFamily: 'Dream Avenue', 
              fontWeight: 'bold', 
              textAlign: 'center',
              mb: 6,
              maxWidth: '800px',
              mx: 'auto'
            }}
          >
            Discover a range of personalized beauty services tailored to enhance your natural glow.
            Whether you're preparing for a big event or just indulging in a self-care day, 
            our categories offer something special for everyone.
          </Typography>

          <Grid container spacing={3}>
            {categories.map((category) => (
              <Grid item xs={12} sm={6} md={4} key={category.id}>
                <Card
                  sx={{
                    borderRadius: 3,
                    boxShadow: 3,
                    overflow: 'hidden',
                    transition: '0.3s',
                    '&:hover': { 
                      transform: 'scale(1.03)',
                      boxShadow: 6
                    },
                  }}
                >
                  <CardActionArea 
                    onClick={() => navigate(category.path)}
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={category.image}
                      alt={category.name}
                      sx={{
                        width: '100%',
                        height: '250px',
                        objectFit: 'cover',
                      }}
                    />
                    <Box sx={{ p: 2, textAlign: 'center' }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {category.name}
                      </Typography>
                    </Box>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Global Styles */}
      <style>
        {`
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }
          body {
            overflow-x: hidden;
          }
        `}
      </style>
    </Box>
  );
};

export default Services;