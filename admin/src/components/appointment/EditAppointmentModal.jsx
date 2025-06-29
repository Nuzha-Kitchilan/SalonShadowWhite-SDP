// import React from 'react';
// import { Dialog, Box, Typography } from "@mui/material";
// import AppointmentForm from './AppointmentForm';

// export default function EditAppointmentModal({
//   showEditModal,
//   setShowEditModal,
//   editForm,
//   setEditForm,
//   services,
//   stylists,
//   customers,
//   statusOptions,
//   paymentStatusOptions,
//   paymentTypeOptions,
//   handleSubmit,
//   handleInputChange,
//   handleMultiSelectChange,
//   loadingTimeSlots,
//   availableTimeSlots,
//   selectedAppointment,
//   renderTimeSlots
// }) {
//   return (
//     <Dialog 
//       open={showEditModal} 
//       onClose={() => setShowEditModal(false)}
//       maxWidth="md"
//       fullWidth
//     >
      
//       <AppointmentForm
//         isEdit={true}
//         editForm={editForm}
//         setEditForm={setEditForm}
//         services={services}
//         stylists={stylists}
//         customers={customers}
//         statusOptions={statusOptions}
//         paymentStatusOptions={paymentStatusOptions}
//         paymentTypeOptions={paymentTypeOptions}
//         handleSubmit={handleSubmit}
//         handleInputChange={handleInputChange}
//         handleMultiSelectChange={handleMultiSelectChange}
//         loadingTimeSlots={loadingTimeSlots}
//         availableTimeSlots={availableTimeSlots}
//         selectedAppointment={selectedAppointment}
//         renderTimeSlots={renderTimeSlots}
//         onClose={() => setShowEditModal(false)}
//       />
//     </Dialog>
//   );
// }












import React, { useEffect } from 'react';
import { Dialog, Box } from "@mui/material";
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
  fetchTimeSlots
}) {
 
useEffect(() => {
  if (showEditModal && selectedAppointment) {
    // Only initialize if don't already have assignments
    if (!editForm.service_stylist_assignments || editForm.service_stylist_assignments.length === 0) {
      const serviceNames = selectedAppointment.services?.split(',').map(s => s.trim()) || [];
      const serviceObjects = services.filter(service => 
        serviceNames.includes(service.service_name)
      );
      
      const assignments = serviceObjects.map(service => ({
        service_id: service.service_ID || service.service_id,
        service_ID: service.service_ID || service.service_id,
        service_name: service.service_name,
        stylist_id: '' 
      }));

      setEditForm(prev => ({
        ...prev,
        service_stylist_assignments: assignments,
        services: assignments.map(a => a.service_id),
        service_objects: serviceObjects
      }));
    }
  }
}, [showEditModal, selectedAppointment, services]);

  return (
    <Dialog 
      open={showEditModal} 
      onClose={() => setShowEditModal(false)} 
      maxWidth="md" 
      fullWidth
    >
      <Box p={3}>
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
          loadingTimeSlots={loadingTimeSlots}
          availableTimeSlots={availableTimeSlots}
          selectedAppointment={selectedAppointment}
          onClose={() => setShowEditModal(false)}
        />
      </Box>
    </Dialog>
  );
}