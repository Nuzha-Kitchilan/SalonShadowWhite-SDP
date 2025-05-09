// src/utils/appointmentUtils.js
import { format } from 'date-fns';

/**
 * Enhanced debugging utility with color coding
 * @param {string} label - Label for the debug group
 * @param {any} data - Data to log
 * @param {string} level - Log level (log, warn, error)
 */
export const debugLog = (label, data, level = 'log') => {
  if (process.env.NODE_ENV === 'development') {
    const styles = {
      log: 'color: blue; font-weight: bold;',
      warn: 'color: orange; font-weight: bold;',
      error: 'color: red; font-weight: bold;'
    };
    console.groupCollapsed(`%c[DEBUG] ${label}`, styles[level]);
    console.dir(data, { depth: null });
    console.groupEnd();
  }
};

/**
 * Format time string to HH:MM format
 * @param {string} timeString - Time string to format
 * @returns {string} Formatted time
 */
export const formatTime = (timeString) => {
  return timeString?.substring(0, 5) || 'N/A';
};

/**
 * Format currency value with $ sign and 2 decimal places
 * @param {number|string} amount - Amount to format
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return '$0.00';
  return `$${parseFloat(amount).toFixed(2)}`;
};

/**
 * Calculate payment amount from services
 * @param {Array} selectedServiceObjects - Selected service objects
 * @returns {number} Total payment amount
 */
export const calculatePaymentAmount = (selectedServiceObjects) => {
  if (!selectedServiceObjects || !selectedServiceObjects.length) return 0;
  
  return selectedServiceObjects.reduce((total, service) => {
    return total + (service?.price ? parseFloat(service.price) : 0);
  }, 0);
};

/**
 * Calculate total service duration
 * @param {Array} selectedServices - Array of service objects or IDs
 * @param {Array} allServices - All available services
 * @returns {number} Total duration in minutes
 */
export const calculateServiceDuration = (selectedServices, allServices) => {
  if (!allServices?.length || !selectedServices?.length) return 0;
  
  let totalDuration = 0;
  
  selectedServices.forEach(service => {
    const serviceObj = allServices.find(s => 
      s.service_ID === service || 
      s.service_name === service ||
      (typeof service === 'object' && s.service_ID === service.service_ID)
    );
    
    if (serviceObj?.time_duration) {
      totalDuration += parseInt(serviceObj.time_duration);
    }
  });
  
  return totalDuration;
};

/**
 * Get remaining amount to pay
 * @param {number|string} total - Total amount
 * @param {number|string} paid - Amount paid
 * @returns {number} Remaining amount
 */
export const getRemainingAmount = (total, paid) => {
  if (total === null || paid === null) return 0;
  const remaining = parseFloat(total) - parseFloat(paid);
  return remaining > 0 ? remaining : 0;
};

/**
 * Get color for appointment status
 * @param {string} status - Appointment status
 * @returns {string} MUI color name
 */
export const getStatusColor = (status) => {
  switch (status) {
    case 'Completed': return 'success';
    case 'Cancelled': return 'error';
    case 'Confirmed': return 'info';
    case 'No-show': return 'error';
    default: return 'warning';
  }
};

/**
 * Get color for payment status
 * @param {string} status - Payment status
 * @returns {string} MUI color name
 */
export const getPaymentStatusColor = (status) => {
  switch (status) {
    case 'Paid': return 'success';
    case 'Partial': return 'warning';
    case 'Refunded': return 'info';
    default: return 'error';
  }
};

// Common options for dropdowns
export const statusOptions = ['Scheduled', 'Confirmed', 'Completed', 'Cancelled', 'No-show'];
export const paymentStatusOptions = ['Pending', 'Paid', 'Refunded', 'Failed'];
export const paymentTypeOptions = ['Online', 'Pay at Salon'];

/**
 * Normalize an appointment object for form use
 * @param {Object} appointment - Appointment data
 * @param {Array} services - All services
 * @param {Array} stylists - All stylists
 * @returns {Object} Normalized appointment data
 */
export const normalizeAppointmentData = (appointment, services = [], stylists = []) => {
  if (!appointment) {
    return {
      customer_ID: '',
      appointment_date: format(new Date(), 'yyyy-MM-dd'),
      appointment_time: '',
      appointment_status: 'Scheduled',
      services: [],
      serviceIds: [],
      stylists: [],
      payment_status: 'Pending',
      payment_amount: '0',
      payment_type: 'Pay at Salon',
      amount_paid: '0',
      is_partial: false,
      notes: '',
      payment_notes: '',
      cancellation_reason: ''
    };
  }
  
  // Handle services
  let servicesList = [];
  let serviceIds = [];
  if (appointment.services) {
    servicesList = appointment.services.split(',').map(s => s.trim());
    serviceIds = services
      .filter(service => servicesList.includes(service.service_name))
      .map(service => service.service_ID);
  } else if (appointment.serviceIds) {
    serviceIds = Array.isArray(appointment.serviceIds) ? appointment.serviceIds : [];
    servicesList = services
      .filter(service => serviceIds.includes(service.service_ID))
      .map(service => service.service_name);
  }
  
  // Handle stylists
  let stylistIds = [];
  if (appointment.stylists_IDs) {
    stylistIds = appointment.stylists_IDs.split(',').map(id => Number(id.trim()));
  } else if (appointment.stylist_ID) {
    stylistIds = [Number(appointment.stylist_ID)];
  } else if (appointment.stylists) {
    const stylistNames = appointment.stylists.split(',').map(name => name.trim());
    stylistIds = stylists
      .filter(stylist => stylistNames.includes(`${stylist.firstname} ${stylist.lastname}`))
      .map(stylist => stylist.stylist_ID);
  } else if (Array.isArray(appointment.stylists)) {
    stylistIds = appointment.stylists;
  }
  
  return {
    customer_ID: appointment.customer_ID || '',
    appointment_date: appointment.appointment_date 
      ? format(new Date(appointment.appointment_date), 'yyyy-MM-dd')
      : format(new Date(), 'yyyy-MM-dd'),
    appointment_time: formatTime(appointment.appointment_time) || '',
    appointment_status: appointment.appointment_status || 'Scheduled',
    services: servicesList,
    serviceIds: serviceIds,
    stylists: stylistIds,
    payment_status: appointment.payment_status || 'Pending',
    payment_amount: (appointment.payment_amount || 0).toString(),
    payment_type: appointment.payment_type || 'Pay at Salon',
    amount_paid: (appointment.amount_paid || 0).toString(),
    is_partial: appointment.is_partial === 1,
    notes: appointment.notes || '',
    payment_notes: appointment.payment_notes || '',
    cancellation_reason: appointment.cancellation_reason || ''
  };
};