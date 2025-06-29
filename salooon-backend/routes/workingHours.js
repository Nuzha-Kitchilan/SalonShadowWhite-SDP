const express = require('express');
const router = express.Router();
const {
  createWorkingHours,
  getAllWorkingHours,
  getWorkingHoursByDate,
  updateWorkingHours,
  deleteWorkingHours
} = require('../controllers/workingHoursController');

// Route to create working hours
router.post('/', createWorkingHours);

// Route to get all working hours
router.get('/', getAllWorkingHours);

// Route to get working hours by date
router.get('/:date', getWorkingHoursByDate);

// Route to update working hours
router.put('/:id', updateWorkingHours);

// Route to delete working hours
router.delete('/:id', deleteWorkingHours);

module.exports = router;
