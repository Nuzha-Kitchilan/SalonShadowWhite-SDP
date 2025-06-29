import { format, parseISO } from 'date-fns';

export const statusOptions = ['Scheduled', 'Completed', 'Cancelled', 'No-show'];
export const paymentStatusOptions = ['Pending', 'Paid', 'Refunded', 'Failed'];
export const paymentTypeOptions = ['Online', 'Pay at Salon', 'Bridal Pacakge'];

export const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  try {
    return format(parseISO(dateString), 'MMM dd, yyyy');
  } catch (error) {
    console.error('Error formatting date:', dateString, error);
    return dateString;
  }
};

export const formatTime = (timeString) => {
  if (!timeString) return "N/A";
  return timeString.substring(0, 5);
};

export const getStatusColor = (status) => {
  switch (status) {
    case 'Completed': return 'success';
    case 'Cancelled': return 'error';
    case 'Confirmed': return 'info';
    case 'No-show': return 'error';
    default: return 'warning';
  }
};

export const getPaymentColor = (status) => {
  switch (status) {
    case 'Paid': return 'success';
    case 'Refunded': return 'info';
    case 'Failed': return 'error';
    default: return 'warning';
  }
};

export const generateMockTimeSlots = () => {
  const slots = [];
  const start = 8; 
  const end = 18; 
  
  for (let hour = start; hour <= end; hour++) {
    for (let minutes of ['00', '15']) {
      if (hour === end && minutes === '15') continue;
      slots.push(`${hour.toString().padStart(2, '0')}:${minutes}`);
    }
  }
  
  return slots;
};