import React from 'react';
import { Box, Typography, Grid, Card, CardActionArea, CardMedia } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import servicesImage from '../assets/services.png';

import hairImg from '../assets/Hair.png';
import faceImg from '../assets/Face.png';
import nailsImg from '../assets/Nails.png';
import bodyImg from '../assets/Body.png';
import makeupImg from '../assets/Makeup.png';
import bridalImg from '../assets/Bridal.png';

const categories = [
  { id: 1, name: 'Hair ', path: '/services/hair', image: hairImg },
  { id: 2, name: 'Face', path: '/services/face', image: faceImg },
  { id: 3, name: 'Nails', path: '/services/nails', image: nailsImg },
  { id: 4, name: 'Body', path: '/services/body', image: bodyImg },
  { id: 5, name: 'Makeup', path: '/services/makeup', image: makeupImg },
  { id: 6, name: 'Bridal', path: '/services/bridal', image: bridalImg },
];

const Services = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ width: '100%', bgcolor: '#f5f5f7', minHeight: '100vh' }}>
      {/* Header Banner */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: { xs: '200px', sm: '300px', md: '400px' },
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
          }}
        />
      </Box>

      {/* Category Cards */}
      <Box sx={{ p: { xs: 2, sm: 3, md: 5 } }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{ fontFamily: 'Dream Avenue', fontWeight: 'bold', textAlign: 'center' }}
        >
          Our Service Categories
        </Typography>

        <Typography
          variant="body1"
            sx={{ fontFamily: 'Dream Avenue', fontWeight: 'bold', textAlign: 'center'
          }}
        >
          Discover a range of personalized beauty services tailored to enhance your natural glow.
          Whether you're preparing for a big event or just indulging in a self-care day, our categories offer something special for everyone.
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
                  '&:hover': { transform: 'scale(1.03)' },
                }}
              >
                <CardActionArea onClick={() => navigate(category.path)}>
                  <CardMedia
                    component="img"
                    image={category.image}
                    alt={category.name}
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain', // or 'cover' depending on your image design
                    }}
                  />
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default Services;
