import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Container, CircularProgress } from '@mui/material';
import stylistImage from '../assets/stylist.png';
import StylistCard from '../components/StylistCard';

const Stylists = () => {
  const [stylists, setStylists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5001/api/stylists')
      .then((res) => {
        setStylists(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch stylists:', err);
        setLoading(false);
      });
  }, []);

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
          src={stylistImage}
          alt="Stylists"
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block'
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
        </Box>
      </Box>

      {/* Main Content */}
      <Box sx={{
        flex: 1,
        py: 4,
        px: { xs: 2, md: 4 },
        width: '100%',
      }}>
        <Container maxWidth="lg">
          {loading ? (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center',
              alignItems: 'center',
              height: '300px'
            }}>
              <CircularProgress size={60} />
            </Box>
          ) : (
            <>
              <Typography variant="h4" component="h2" sx={{ 
                mb: 4,
                textAlign: 'center',
                fontWeight: 'bold'
              }}>
                Meet Our Talented Team
              </Typography>
              
              {stylists.map((stylist, index) => (
                <StylistCard 
                  key={stylist.stylist_ID} 
                  stylist={stylist} 
                  index={index} 
                />
              ))}
            </>
          )}
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

export default Stylists;