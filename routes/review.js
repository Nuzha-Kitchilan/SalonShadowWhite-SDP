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

module.exports = router;








// const express = require('express');
// const router = express.Router();
// const reviewController = require('../controllers/reviewController');
// const { authenticateCustomer, authenticateAdmin, authorizeRole } = require('../middleware/auth');

// // Customer can submit a review
// router.post('/', authenticateCustomer, reviewController.createReview);

// // Admin-only routes
// router.get('/', authenticateAdmin, reviewController.getAllReviews);
// router.put('/approve/:reviewId', authenticateAdmin, reviewController.approveReview);
// router.delete('/:reviewId', authenticateAdmin, reviewController.deleteReview);

// module.exports = router;
