// components/ReviewCard.js
import { Card, CardContent, Typography, Rating, Box } from '@mui/material';

const ReviewCard = ({ review }) => {
  return (
    <Card sx={{ minWidth: 275, m: 2, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {review.customer_name}
        </Typography>
        <Box display="flex" alignItems="center" mb={2}>
          <Rating value={review.rating} precision={0.5} readOnly />
          <Typography variant="body2" sx={{ ml: 1 }}>
            {review.rating.toFixed(1)}
          </Typography>
        </Box>
        <Typography variant="body1" paragraph>
          "{review.review_text}"
        </Typography>
        {review.stylist_name && (
          <Typography variant="caption" color="text.secondary">
            About stylist: {review.stylist_name}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default ReviewCard;