// routes/appointments.js
const express = require('express');
const router = express.Router();
const appointmentsController = require('../../controllers/dashboard/appointmentController');

// Route to get appointments count by period (daily, weekly, monthly, yearly)
router.get('/count/:period', appointmentsController.getAppointmentsCount);

router.get('/calendar/:year/:month', appointmentsController.getCalendarView);

router.get('/upcoming', appointmentsController.getUpcomingAppointments);

router.get('/cancellation-rates', appointmentsController.fetchCancellationRates);

module.exports = router;
