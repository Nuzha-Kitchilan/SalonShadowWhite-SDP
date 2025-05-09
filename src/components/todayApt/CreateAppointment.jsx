import React, { useState } from 'react';
import AppointmentFormBase from './AppointmentFormBase';
import { format } from 'date-fns';

/**
 * Component for creating new appointments
 */
const CreateAppointmentForm = ({
  open,
  onClose,
  onSubmit,
  customers = [],
  services = [],
  stylists = [],
  selectedCustomerId = null,
  fetchTimeSlots
}) => {
  const [loadingTimeSlots, setLoadingTimeSlots] = useState(false);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);

  // Function to fetch available time slots for the selected date, stylist and services
  const handleFetchTimeSlots = async (date, stylistIds, serviceNames) => {
    if (!date || !stylistIds || !serviceNames?.length) {
      return;
    }
  
    setLoadingTimeSlots(true);
    try {
      const slots = await fetchTimeSlots(date, stylistIds, serviceNames);
      setAvailableTimeSlots(slots || []);
    } catch (error) {
      console.error('Error fetching time slots:', error);
      setAvailableTimeSlots([]);
    } finally {
      setLoadingTimeSlots(false);
    }
  };

  return (
    <AppointmentFormBase
      open={open}
      onClose={onClose}
      onSubmit={onSubmit}
      title="New Appointment"
      customers={customers}
      services={services}
      stylists={stylists}
      initialData={{
        customer_ID: selectedCustomerId || '',
        appointment_date: format(new Date(), 'yyyy-MM-dd'),
        appointment_time: '',
        appointment_status: 'Scheduled',
        services: [],
        stylists: [],
        payment_status: 'Pending',
        payment_amount: '0',
        payment_type: 'Pay at Salon',
        amount_paid: '0',
        is_partial: false,
        notes: '',
        payment_notes: '',
        cancellation_reason: ''
      }}
      loadingTimeSlots={loadingTimeSlots}
      availableTimeSlots={availableTimeSlots}
      isEdit={false}
      skipTimeSlots={false}
      fetchTimeSlots={handleFetchTimeSlots}
    />
  );
};

export default CreateAppointmentForm;