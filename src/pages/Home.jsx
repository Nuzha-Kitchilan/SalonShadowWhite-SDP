import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Container, CircularProgress } from '@mui/material';
import ReviewCard from '../components/ReviewCard';

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
    <Container maxWidth="lg">
      <Typography variant="h4" component="h2" sx={{ my: 4, textAlign: 'center' }}>
        What Our Customers Say
      </Typography>
      
      {loading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : (
        <Box 
          display="flex" 
          flexDirection="row" 
          flexWrap="wrap" 
          justifyContent="center"
        >
          {reviews.map((review) => (
            <ReviewCard key={review.review_ID} review={review} />
          ))}
        </Box>
      )}
    </Container>
  );
};

export default Home;