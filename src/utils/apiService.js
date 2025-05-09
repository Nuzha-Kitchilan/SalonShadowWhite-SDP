// src/services/apiService.js
import axios from 'axios';
import { debugLog } from '../utils/appointmentUtils';

// Create API instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:5001/api',
  withCredentials: true,
});

// Add request/response interceptors for logging in development
api.interceptors.request.use(
  config => {
    debugLog('API Request', {
      url: config.url,
      method: config.method,
      data: config.data,
      params: config.params
    });
    return config;
  },
  error => {
    debugLog('API Request Error', error, 'error');
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  response => {
    debugLog('API Response', {
      url: response.config.url,
      status: response.status,
      data: response.data
    });
    return response;
  },
  error => {
    debugLog('API Response Error', {
      error: error.message,
      response: error.response?.data
    }, 'error');
    return Promise.reject(error);
  }
);

// Appointments API
export const appointmentsApi = {
  /**
   * Get appointments for a specific date and optionally filtered by stylist
   * @param {string} date - Appointment date in YYYY-MM-DD format
   * @param {string|number|null} stylistId - Optional stylist ID to filter by
   * @returns {Promise} API response
   */
  getAppointments: async (date, stylistId = null) => {
    const params = { date };
    if (stylistId) params.stylistId = stylistId;
    return api.get('/admin/appointments/today', { params });
  },

  /**
   * Get appointment details by ID
   * @param {string|number} id - Appointment ID
   * @returns {Promise} API response
   */
  getAppointmentById: async (id) => {
    return api.get(`/admin/appointments/${id}`);
  },

  /**
   * Create a new appointment
   * @param {Object} appointmentData - Appointment data
   * @returns {Promise} API response
   */
  createAppointment: async (appointmentData) => {
    return api.post('/admin/appointments', appointmentData);
  },

  /**
   * Update an existing appointment
   * @param {string|number} id - Appointment ID
   * @param {Object} appointmentData - Updated appointment data
   * @returns {Promise} API response
   */
  updateAppointment: async (id, appointmentData) => {
    return api.put(`/admin/appointments/${id}`, appointmentData);
  },

  /**
   * Delete an appointment
   * @param {string|number} id - Appointment ID
   * @returns {Promise} API response
   */
  deleteAppointment: async (id) => {
    return api.delete(`/admin/appointments/${id}`);
  },

  /**
   * Get available time slots for appointment
   * @param {string} date - Date in YYYY-MM-DD format
   * @param {Array|string|number} stylistId - Stylist ID(s)
   * @param {Array} serviceIds - Service IDs
   * @param {number} serviceDuration - Total service duration
   * @returns {Promise} API response
   */
  getAvailableTimeSlots: async (date, stylistId, serviceIds, serviceDuration) => {
    // Normalize stylistId to ensure it's a single value
    const singleStylistId = Array.isArray(stylistId) ? stylistId[0] : stylistId;
    
    return api.post('/booking/available-timeslots', {
      date,
      stylistId: singleStylistId,
      serviceDuration,
      serviceIds
    });
  }
};

// Customers API
export const customersApi = {
  /**
   * Get all customers
   * @returns {Promise} API response
   */
  getCustomers: async () => {
    return api.get('/admin/customers');
  },

  /**
   * Register a new walk-in customer
   * @param {Object} customerData - Customer data
   * @returns {Promise} API response
   */
  registerWalkInCustomer: async (customerData) => {
    return api.post('/admin/customers/walkin', customerData);
  }
};

// Services API
export const servicesApi = {
  /**
   * Get all services
   * @returns {Promise} API response
   */
  getServices: async () => {
    return api.get('/admin/services');
  }
};

// Stylists API
export const stylistsApi = {
  /**
   * Get all stylists
   * @returns {Promise} API response
   */
  getStylists: async () => {
    return api.get('/admin/stylists');
  }
};

/**
 * Fetch all initial data needed for appointments management
 * @param {string} date - Date in YYYY-MM-DD format
 * @param {string|number|null} stylistId - Optional stylist ID to filter by
 * @returns {Promise} Object containing all fetched data
 */
export const fetchInitialData = async (date, stylistId = null) => {
  try {
    const [appointmentsRes, servicesRes, stylistsRes, customersRes] = await Promise.all([
      appointmentsApi.getAppointments(date, stylistId),
      servicesApi.getServices(),
      stylistsApi.getStylists(),
      customersApi.getCustomers()
    ]);

    return {
      appointments: appointmentsRes.data.success ? appointmentsRes.data.data || [] : [],
      services: servicesRes.data.success ? servicesRes.data.data || [] : [],
      stylists: stylistsRes.data.success ? stylistsRes.data.data || [] : [],
      customers: customersRes.data.success ? customersRes.data.data || [] : []
    };
  } catch (error) {
    debugLog('Error fetching initial data', error, 'error');
    throw error;
  }
};

export default api;