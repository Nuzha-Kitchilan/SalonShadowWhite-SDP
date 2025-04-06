import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Container, CircularProgress } from '@mui/material';
import stylistImage from '../assets/stylist.png';
import StylistCard from '../components/StylistCard'; // adjust path as needed

const Stylists = () => {
  const [stylists, setStylists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5001/api/stylists') // Adjust your API base URL
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
      bgcolor: '#f5f5f7', // Light grayish background
      minHeight: '100vh' // Make sure it covers the full viewport height
    }}>
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
          src={stylistImage}
          alt="Stylists"
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
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

      {/* Stylists List */}
      <Container maxWidth={false} sx={{ py: 5, px: { xs: 2, sm: 3, md: 4 } }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </Box>
        ) : (
          stylists.map((stylist, index) => (
            <StylistCard key={stylist.stylist_ID} stylist={stylist} index={index} />
          ))
        )}
      </Container>
    </Box>
  );
};

export default Stylists;