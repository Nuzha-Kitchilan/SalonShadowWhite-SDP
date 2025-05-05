// controllers/dashboard/appointmentController.js
const appointmentsModel = require('../../models/dashboard/appointmentModel'); // Add this line

const getAppointmentsCount = async (req, res) => {
    const { period } = req.params;
    
    // Validate period
    const validPeriods = ['daily', 'weekly', 'monthly', 'yearly'];
    if (!validPeriods.includes(period)) {
      return res.status(400).json({ message: 'Invalid period specified' });
    }
  
    try {
      const count = await appointmentsModel.getAppointmentsCount(period);
      res.status(200).json({ count });
    } catch (error) {
      console.error('Database error:', error); // More detailed logging
      res.status(500).json({ 
        message: 'Internal server error',
        error: error.message // Include error details
      });
    }
};





const getCalendarView = async (req, res) => {
  const { year, month } = req.params;
  const offset = parseInt(req.query.offset) || 0;

  try {
    const calendarData = await appointmentsModel.getCalendarView(year, month, offset);
    res.status(200).json(calendarData);
  } catch (error) {
    console.error('Calendar view error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


// controllers/dashboard/appointmentController.js
const getUpcomingAppointments = async (req, res) => {
  try {
    const appointments = await appointmentsModel.getUpcomingAppointments();
    res.status(200).json(appointments);
  } catch (error) {
    console.error('Error getting upcoming appointments:', error);
    res.status(500).json({ 
      message: 'Internal server error',
      error: error.message
    });
  }
};


const fetchCancellationRates = async (req, res) => {
  const range = req.query.range || 'weekly';
  
  try {
    // Fix: Use appointmentsModel instead of AppointmentModel
    const results = await appointmentsModel.fetchCancellationRates(range);
    
    res.json({
      success: true,
      data: results
    });
    
  } catch (error) {
    console.error('Error fetching cancellation rates:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};


module.exports = {
  getAppointmentsCount,
  getCalendarView,
  getUpcomingAppointments,
  fetchCancellationRates
};