import React from 'react';
import { Dialog, Box, Typography } from "@mui/material";
import AppointmentForm from './AppointmentForm';

export default function CreateAppointmentModal({
  showCreateModal,
  setShowCreateModal,
  editForm,
  setEditForm,
  services,
  stylists,
  customers,
  statusOptions,
  paymentStatusOptions,
  paymentTypeOptions,
  handleSubmit,
  handleInputChange,
  handleMultiSelectChange,
  loadingTimeSlots,
  availableTimeSlots,
  selectedAppointment,
  renderTimeSlots
}) {
  return (
    <Dialog 
      open={showCreateModal} 
      onClose={() => setShowCreateModal(false)}
      maxWidth="md"
      fullWidth
    >
      
      <AppointmentForm
        isEdit={false}
        editForm={editForm}
        setEditForm={setEditForm}
        services={services}
        stylists={stylists}
        customers={customers}
        statusOptions={statusOptions}
        paymentStatusOptions={paymentStatusOptions}
        paymentTypeOptions={paymentTypeOptions}
        handleSubmit={handleSubmit}
        handleInputChange={handleInputChange}
        handleMultiSelectChange={handleMultiSelectChange}
        loadingTimeSlots={loadingTimeSlots}
        availableTimeSlots={availableTimeSlots}
        selectedAppointment={selectedAppointment}
        renderTimeSlots={renderTimeSlots}
        onClose={() => setShowCreateModal(false)}
      />
    </Dialog>
  );
}