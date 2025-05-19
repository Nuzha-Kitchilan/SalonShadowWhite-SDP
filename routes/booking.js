// routes/bookingRoutes.js
const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

router.post('/available-timeslots', bookingController.getAvailableTimeSlots);
router.post('/available-dates', bookingController.getAvailableDates);

module.exports = router;
