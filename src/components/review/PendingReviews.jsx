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

const PendingReviews = ({ reviews = [], onApprove, onDelete }) => {
  if (!reviews || reviews.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body1">No pending reviews to display.</Typography>
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
            // Use the new field names from backend
            const customerName = review?.customer_name || 'Unknown Customer';
            const customerInitial = customerName.charAt(0);
            const stylistName = review?.stylist_name || 'N/A';
            const stylistInitial = stylistName.charAt(0);
            const reviewText = review?.review_text || 'No review text provided';
            const rating = review?.rating || 0;
            const date = review?.created_at ? moment(review.created_at).format('MMM D, YYYY') : 'N/A';

            return (
              <TableRow key={review.review_ID}>
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
                <TableCell>{date}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="success"
                    size="small"
                    onClick={() => onApprove(review.review_ID)}
                    sx={{ mr: 1 }}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => onDelete(review.review_ID)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PendingReviews;