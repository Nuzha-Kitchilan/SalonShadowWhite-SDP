// const adminModel = require('../models/adminAppointmentModel');

// // Appointments
// const getAppointments = async (req, res) => {
//   try {
//     const { appointments } = await adminModel.getAppointmentsList();
//     res.json({ 
//       success: true, 
//       data: appointments // Send just the appointments array
//     });
//   } catch (error) {
//     console.error('Error getting appointments:', error);
//     res.status(500).json({ 
//       success: false, 
//       message: 'Failed to get appointments' 
//     });
//   }
// };

// const getAppointment = async (req, res) => {
//   try {
//     const appointment = await adminModel.getAppointmentDetails(req.params.id);
//     if (!appointment) {
//       return res.status(404).json({ 
//         success: false, 
//         message: 'Appointment not found' 
//       });
//     }
//     res.json({ 
//       success: true, 
//       data: appointment 
//     });
//   } catch (error) {
//     console.error('Error getting appointment details:', error);
//     res.status(500).json({ 
//       success: false, 
//       message: 'Failed to get appointment details' 
//     });
//   }
// };

// const updateAppointment = async (req, res) => {
//   try {
//     await adminModel.updateAppointment(req.params.id, req.body);
//     res.json({ 
//       success: true, 
//       message: 'Appointment updated successfully' 
//     });
//   } catch (error) {
//     console.error('Error updating appointment:', error);
//     res.status(500).json({ 
//       success: false, 
//       message: 'Failed to update appointment' 
//     });
//   }
// };

// // Add delete appointment function
// const deleteAppointment = async (req, res) => {
//   try {
//     const result = await adminModel.deleteAppointment(req.params.id);
//     if (result) {
//       res.json({
//         success: true,
//         message: 'Appointment deleted successfully'
//       });
//     } else {
//       res.status(404).json({
//         success: false,
//         message: 'Appointment not found or already deleted'
//       });
//     }
//   } catch (error) {
//     console.error('Error deleting appointment:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Failed to delete appointment'
//     });
//   }
// };

// // Payments
// const getPayments = async (req, res) => {
//   try {
//     const { payments } = await adminModel.getPaymentsList();
//     res.json({ 
//       success: true, 
//       data: payments 
//     });
//   } catch (error) {
//     console.error('Error getting payments:', error);
//     res.status(500).json({ 
//       success: false, 
//       message: 'Failed to get payments' 
//     });
//   }
// };

// const getPayment = async (req, res) => {
//   try {
//     const payment = await adminModel.getPaymentDetails(req.params.id);
//     if (!payment) {
//       return res.status(404).json({ 
//         success: false, 
//         message: 'Payment not found' 
//       });
//     }
//     res.json({ 
//       success: true, 
//       data: payment 
//     });
//   } catch (error) {
//     console.error('Error getting payment details:', error);
//     res.status(500).json({ 
//       success: false, 
//       message: 'Failed to get payment details' 
//     });
//   }
// };

// const updatePayment = async (req, res) => {
//   try {
//     await adminModel.updatePayment(req.params.id, req.body);
//     res.json({ 
//       success: true, 
//       message: 'Payment updated successfully' 
//     });
//   } catch (error) {
//     console.error('Error updating payment:', error);
//     res.status(500).json({ 
//       success: false, 
//       message: 'Failed to update payment' 
//     });
//   }
// };

// module.exports = {
//   getAppointments,
//   getAppointment,
//   updateAppointment,
//   deleteAppointment, // Export the new function
//   getPayments,
//   getPayment,
//   updatePayment
// };




const adminModel = require('../models/adminAppointmentModel');

const getAppointments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const filters = {
      appointmentId: req.query.appointmentId || null,
      date: req.query.date || null,
      customerName: req.query.customerName || null
    };

    const { appointments, pagination } = await adminModel.getAppointmentsList(page, limit, filters);

    res.json({ 
      success: true, 
      data: appointments,
      pagination
    });
  } catch (error) {
    console.error('Error getting appointments:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get appointments' 
    });
  }
};

const getAppointment = async (req, res) => {
  try {
    const appointment = await adminModel.getAppointmentDetails(req.params.id);
    if (!appointment) {
      return res.status(404).json({ 
        success: false, 
        message: 'Appointment not found' 
      });
    }
    res.json({ 
      success: true, 
      data: appointment 
    });
  } catch (error) {
    console.error('Error getting appointment details:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get appointment details' 
    });
  }
};

const createAppointment = async (req, res) => {
  try {
    console.log('Creating appointment with data:', JSON.stringify(req.body, null, 2));
    
    // Validate required fields
    if (!req.body.customer_ID || !req.body.appointment_date || !req.body.appointment_time) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: customer_ID, appointment_date, appointment_time'
      });
    }

    // Validate serviceStylists if provided
    if (req.body.serviceStylists && !Array.isArray(req.body.serviceStylists)) {
      return res.status(400).json({
        success: false,
        message: 'serviceStylists must be an array'
      });
    }

    const appointmentId = await adminModel.createAppointment(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Appointment created successfully',
      data: { appointmentId }
    });
  } catch (error) {
    console.error('Error creating appointment:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create appointment'
    });
  }
};

const updateAppointment = async (req, res) => {
  try {
    const success = await adminModel.updateAppointment(req.params.id, req.body);
    if (success) {
      res.json({
        success: true,
        message: 'Appointment updated successfully'
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update appointment'
    });
  }
};

const deleteAppointment = async (req, res) => {
  try {
    const result = await adminModel.deleteAppointment(req.params.id);
    if (result) {
      res.json({ 
        success: true, 
        message: 'Appointment deleted successfully' 
      });
    } else {
      res.status(404).json({ 
        success: false, 
        message: 'Appointment not found' 
      });
    }
  } catch (error) {
    console.error('Error deleting appointment:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete appointment' 
    });
  }
};

const getServices = async (req, res) => {
  try {
    const services = await adminModel.getAllServices();
    res.json({ 
      success: true, 
      data: services 
    });
  } catch (error) {
    console.error('Error getting services:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get services' 
    });
  }
};

const getStylists = async (req, res) => {
  try {
    const stylists = await adminModel.getAllStylists();
    res.json({ 
      success: true, 
      data: stylists 
    });
  } catch (error) {
    console.error('Error getting stylists:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get stylists' 
    });
  }
};

const getCustomers = async (req, res) => {
  try {
    const customers = await adminModel.getAllCustomers();
    res.json({ 
      success: true, 
      data: customers 
    });
  } catch (error) {
    console.error('Error getting customers:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get customers' 
    });
  }
};

const getTodayAppointments = async (req, res) => {
  try {
    const { date, stylistId } = req.query;
    const appointments = await adminModel.getAppointmentsForToday(date, stylistId);
    res.json({ success: true, data: appointments });
  } catch (error) {
    console.error('Error fetching today\'s appointments:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  getAppointments,
  getAppointment,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getServices,
  getStylists,
  getCustomers,
  getTodayAppointments
};