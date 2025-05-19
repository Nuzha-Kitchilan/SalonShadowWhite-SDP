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
  // Initialize service-stylist assignments when modal opens
//   useEffect(() => {
//   if (showEditModal && selectedAppointment) {
//     // Get service names or IDs from the selected appointment
//     let serviceData = [];
//     if (selectedAppointment.services) {
//       if (typeof selectedAppointment.services === 'string') {
//         serviceData = selectedAppointment.services.split(',').map(s => s.trim());
//       } else if (Array.isArray(selectedAppointment.services)) {
//         serviceData = selectedAppointment.services;
//       }
//     }

//     // Create a name-to-ID mapping for services
//     const serviceNameToIdMap = services.reduce((map, service) => {
//       map[service.service_name] = service.service_ID || service.service_id;
//       return map;
//     }, {});

//     // Get stylist ID from various possible fields
//     const stylistId = selectedAppointment.stylist_ID || 
//                      (selectedAppointment.stylists_IDs ? 
//                       selectedAppointment.stylists_IDs.split(',')[0].trim() : 
//                       null) ||
//                      (editForm.stylists && editForm.stylists.length ? editForm.stylists[0] : null);

//     if (serviceData.length > 0) {
//       const assignments = serviceData.map(serviceIdentifier => {
//         // Determine if this is a name or ID
//         let serviceId;
//         let serviceName;
        
//         // Check if it's a name that exists in our map
//         if (serviceNameToIdMap[serviceIdentifier]) {
//           serviceId = serviceNameToIdMap[serviceIdentifier];
//           serviceName = serviceIdentifier;
//         }
//         // Otherwise, assume it's an ID (or invalid)
//         else {
//           serviceId = serviceIdentifier;
//           const foundService = services.find(s => 
//             (s.service_ID || s.service_id) == serviceIdentifier
//           );
//           serviceName = foundService?.service_name || `Service ${serviceIdentifier}`;
//         }

//         // Find the full service object
//         const serviceObj = services.find(s => 
//           (s.service_ID || s.service_id) == serviceId
//         ) || {
//           service_ID: serviceId,
//           service_name: serviceName,
//           price: '0.00',
//           time_duration: '0'
//         };

//         return {
//           service_id: serviceId,
//           service_ID: serviceId,
//           service_name: serviceObj.service_name,
//           stylist_id: stylistId || ''
//         };
//       });

//       setEditForm(prev => ({
//         ...prev,
//         service_stylist_assignments: assignments,
//         services: assignments.map(a => a.service_id),
//         service_objects: assignments.map(a => {
//           const service = services.find(s => 
//             (s.service_ID || s.service_id) == a.service_id
//           );
//           return service || {
//             service_id: a.service_id,
//             service_ID: a.service_id,
//             service_name: a.service_name,
//             price: '0.00',
//             time_duration: '0'
//           };
//         })
//       }));
//     }
//   }
// }, [showEditModal, selectedAppointment, services, editForm.stylists]);



useEffect(() => {
  if (showEditModal && selectedAppointment) {
    // Only initialize if we don't already have assignments
    if (!editForm.service_stylist_assignments || editForm.service_stylist_assignments.length === 0) {
      const serviceNames = selectedAppointment.services?.split(',').map(s => s.trim()) || [];
      const serviceObjects = services.filter(service => 
        serviceNames.includes(service.service_name)
      );
      
      const assignments = serviceObjects.map(service => ({
        service_id: service.service_ID || service.service_id,
        service_ID: service.service_ID || service.service_id,
        service_name: service.service_name,
        stylist_id: '' // Leave unassigned by default
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