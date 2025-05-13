const express = require('express');
const router = express.Router();
const ReviewController = require('../controllers/reviewController');
const { authenticateCustomer, authenticateAdmin } = require('../middleware/auth');

// Customer-side routes (protected with customer authentication)
router.post('/appointment/:appointmentId', authenticateCustomer, ReviewController.submitReviewForAppointment);


// Admin-side routes (protected with admin authentication)
router.get('/pending', authenticateAdmin, ReviewController.listPendingReviews);
router.put('/approve/:id', authenticateAdmin, ReviewController.approveReview);
router.delete('/:id', authenticateAdmin, ReviewController.deleteReview);
router.get('/approved', authenticateAdmin, ReviewController.listApprovedReviews);
router.get('/average-ratings', ReviewController.getAverageRatings);
router.get('/random', ReviewController.getRandomReviews);
router.post('/random/refresh', authenticateAdmin, ReviewController.forceRefreshCache);
router.get('/by-stylist/:stylistId', ReviewController.getReviewsByStylist);

module.exports = router;








