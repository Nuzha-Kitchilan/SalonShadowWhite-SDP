
const adminModel = require('../models/adminAppointmentModel');
const { create } = require('../models/SpecialRequestModel');
const  serviceModel  = require('../models/serviceModel');
const db = require('../config/db');

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

//working one

const updateAppointment = async (req, res) => {
  try {
    // Clone the request body to avoid modifying the original
    const appointmentData = { ...req.body };

    // Process service-stylist assignments if they exist
    if (appointmentData.serviceStylists && Array.isArray(appointmentData.serviceStylists)) {
      const validatedAssignments = await Promise.all(
        appointmentData.serviceStylists.map(async (assignment) => {
          // If service_ID is not a number, try to find by name
          if (isNaN(assignment.service_ID)) {
            const serviceId = await serviceModel.getServiceIdByName(assignment.service_ID);
            if (!serviceId) {
              throw new Error(`Service not found: ${assignment.service_ID}`);
            }
            return {
              ...assignment,
              service_ID: serviceId
            };
          }
          return assignment;
        })
      );

      // Replace with validated assignments
      appointmentData.serviceStylists = validatedAssignments;
    }

    // Process services array if it exists (for backward compatibility)
    if (appointmentData.services && Array.isArray(appointmentData.services)) {
      const validatedServices = await Promise.all(
        appointmentData.services.map(async (serviceIdentifier) => {
          // If not a number, try to find by name
          if (isNaN(serviceIdentifier)) {
            const serviceId = await serviceModel.getServiceIdByName(serviceIdentifier);
            if (!serviceId) {
              throw new Error(`Service not found: ${serviceIdentifier}`);
            }
            return serviceId;
          }
          return serviceIdentifier;
        })
      );

      // Replace with validated service IDs
      appointmentData.services = validatedServices;
    }

    // Now update with validated data
    const success = await adminModel.updateAppointment(req.params.id, appointmentData);
    
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
    
    // Provide more specific error messages
    let errorMessage = 'Failed to update appointment';
    if (error.message.includes('Service not found')) {
      errorMessage = error.message;
    } else if (error.code === 'ER_TRUNCATED_WRONG_VALUE_FOR_FIELD') {
      errorMessage = 'Invalid data format for one of the fields';
    }

    res.status(500).json({
      success: false,
      message: errorMessage,
      detail: process.env.NODE_ENV === 'development' ? error.message : undefined
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

const createBridalAppointment = async (req, res) => {
  try {
    console.log('Creating bridal appointment with data:', req.body);
    
    // Validate required fields
    if (!req.body.customer_ID || !req.body.appointment_date || !req.body.appointment_time) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: customer_ID, appointment_date, appointment_time'
      });
    }

    // Validate services and stylists
    // if (!req.body.services || !Array.isArray(req.body.services) || req.body.services.length === 0) {
    //   return res.status(400).json({
    //     success: false,
    //     message: 'At least one service must be selected'
    //   });
    // }


    if (!req.body.service_stylist_assignments || 
    !Array.isArray(req.body.service_stylist_assignments) || 
    req.body.service_stylist_assignments.length === 0 ||
    !req.body.service_stylist_assignments.some(a => a.stylist_id)
) {
  return res.status(400).json({
    success: false,
    message: 'At least one service must have a stylist assigned'
  });
}


    if (!req.body.stylists || !Array.isArray(req.body.stylists) || req.body.stylists.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one stylist must be selected'
      });
    }

    const appointmentId = await adminModel.createBridalAppointment(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Bridal appointment created successfully',
      data: { appointmentId }
    });
  } catch (error) {
    console.error('Error creating bridal appointment:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create bridal appointment'
    });
  }
};



const deleteBridalAppointment = async (req, res) => {
  try {
    const result = await adminModel.deleteBridalAppointment(req.params.id);
    if (result) {
      res.json({ 
        success: true, 
        message: 'Bridal appointment deleted successfully' 
      });
    } else {
      res.status(404).json({ 
        success: false, 
        message: 'Bridal appointment not found' 
      });
    }
  } catch (error) {
    console.error('Error deleting bridal appointment:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to delete bridal appointment' 
    });
  }
};



const updateBridalAppointment = async (req, res) => {
  try {
    const appointmentId = req.params.id;
    console.log('Updating bridal appointment ID:', appointmentId, 'with data:', req.body);
    
    // Check if appointment exists
    const [appointmentExists] = await db.query(
      'SELECT appointment_ID FROM Appointment WHERE appointment_ID = ?',
      [appointmentId]
    );

    if (!appointmentExists || appointmentExists.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Bridal appointment not found'
      });
    }
    
  
    await adminModel.updateBridalAppointment(appointmentId, req.body);
    
    res.status(200).json({
      success: true,
      message: 'Bridal appointment updated successfully',
      data: { appointmentId }
    });
  } catch (error) {
    console.error('Error updating bridal appointment:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update bridal appointment'
    });
  }
};



const getAllBridalAppointments = async (req, res) => {
  try {
    const appointments = await adminModel.getAllBridalAppointments();
    res.json({
      success: true,
      data: appointments
    });
  } catch (error) {
    console.error('Error fetching bridal appointments:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch bridal appointments'
    });
  }
};


const getBridalAppointmentById = async (req, res) => {
  try {
    const appointmentId = req.params.id;
    
    if (!appointmentId) {
      return res.status(400).json({
        success: false,
        message: 'Appointment ID is required'
      });
    }
    
    const appointment = await adminModel.getBridalAppointmentById(appointmentId);
    
    res.json({
      success: true,
      data: appointment
    });
  } catch (error) {
    console.error('Error fetching bridal appointment by ID:', error);
    res.status(error.message.includes('not found') ? 404 : 500).json({
      success: false,
      message: error.message || 'Failed to fetch bridal appointment'
    });
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
  getTodayAppointments,
  createBridalAppointment,
  updateBridalAppointment,
  deleteBridalAppointment,
  getAllBridalAppointments,
  getBridalAppointmentById
};