import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Avatar,
  Box,
  Chip
} from '@mui/material';
import moment from 'moment';

const ApprovedReviews = ({ reviews = [], onDelete }) => {
  if (!reviews || reviews.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body1">No approved reviews to display.</Typography>
      </Box>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Customer</TableCell>
            <TableCell>Stylist</TableCell>
            <TableCell>Rating</TableCell>
            <TableCell>Review</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {reviews.map((review) => {
            // Safely get properties with fallbacks using the new field names
            const customerName = review?.customer_name || 'Unknown Customer';
            const customerInitial = customerName.charAt(0);
            const stylistName = review?.stylist_name || 'N/A';
            const stylistInitial = stylistName.charAt(0);
            const reviewText = review?.review_text || 'No review text provided';
            const rating = review?.rating || 0;
            const reviewDate = review?.created_at 
              ? moment(review.created_at).format('MMM D, YYYY') 
              : 'N/A';
            const reviewId = review?.review_ID;

            return (
              <TableRow key={reviewId || Math.random()}>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <Avatar sx={{ mr: 2 }}>
                      {customerInitial}
                    </Avatar>
                    {customerName}
                  </Box>
                </TableCell>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <Avatar sx={{ mr: 2 }}>
                      {stylistInitial}
                    </Avatar>
                    {stylistName}
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip 
                    color="primary" 
                    label={`${rating}/5`} 
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {reviewText}
                  </Typography>
                </TableCell>
                <TableCell>{reviewDate}</TableCell>
                <TableCell>
                  {reviewId && (
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => onDelete(reviewId)}
                    >
                      Delete
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ApprovedReviews;