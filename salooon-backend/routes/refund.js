const express = require('express');
const router = express.Router();
const refundController = require('../controllers/refundController');
const { authenticateAdmin } = require('../middleware/auth');

// Process Stripe refund
router.post('/process', authenticateAdmin, refundController.processStripeRefund);

// Get refunds by appointment 
router.get('/appointment/:id', authenticateAdmin, refundController.getRefundsByAppointment);

module.exports = router;