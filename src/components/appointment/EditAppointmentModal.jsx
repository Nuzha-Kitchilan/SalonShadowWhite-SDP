import React from 'react';
import { Dialog, Box, Typography } from "@mui/material";
import AppointmentForm from './AppointmentForm';

export default function EditAppointmentModal({
  showEditModal,
  setShowEditModal,
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
      open={showEditModal} 
      onClose={() => setShowEditModal(false)}
      maxWidth="md"
      fullWidth
    >
      
      <AppointmentForm
        isEdit={true}
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
        onClose={() => setShowEditModal(false)}
      />
    </Dialog>
  );
}