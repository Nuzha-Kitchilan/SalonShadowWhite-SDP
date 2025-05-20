


// import React from 'react';
// import {
//   Paper, TableContainer, Table, TableHead, TableBody,
//   TableRow, TableCell, Button, Chip, Typography, Tooltip,
//   Stack
// } from '@mui/material';
// import { Celebration as CelebrationIcon, CheckCircle as CheckCircleIcon } from '@mui/icons-material';

// const SpecialRequestsTable = ({ requests = [], onReviewRequest, onViewAppointment, onViewSuccess }) => {
//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'pending': return 'warning';
//       case 'approved': return 'success';
//       case 'rejected': return 'error';
//       case 'completed': return 'info';
//       default: return 'default';
//     }
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     });
//   };

//   const formatTime = (timeString) => {
//     if (!timeString) return 'N/A';
//     if (typeof timeString === 'string') {
//       const [hours, minutes] = timeString.split(':');
//       const time = new Date();
//       time.setHours(hours, minutes);
//       return time.toLocaleTimeString('en-US', {
//         hour: '2-digit',
//         minute: '2-digit'
//       });
//     }
//     return new Date(timeString).toLocaleTimeString('en-US', {
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   return (
//     <TableContainer component={Paper} sx={{ maxHeight: '70vh' }}>
//       <Table stickyHeader size="small">
//         <TableHead>
//           <TableRow>
//             <TableCell>Contact Info</TableCell>
//             <TableCell>Services</TableCell>
//             <TableCell>Preferred Date</TableCell>
//             <TableCell>Preferred Time</TableCell>
//             <TableCell>Request Details</TableCell>
//             <TableCell>Status</TableCell>
//             <TableCell>Actions</TableCell>
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           {requests.map((request) => (
//             <TableRow key={request.id} hover>
//               <TableCell>
//                 <Typography variant="body2">{request.email}</Typography>
//                 <Typography variant="body2">{request.phone_number}</Typography>
//               </TableCell>
//               <TableCell>
//                 {request.service_name || 'N/A'}
//               </TableCell>
//               <TableCell>
//                 {formatDate(request.preferred_date)}
//               </TableCell>
//               <TableCell>
//                 {formatTime(request.preferred_time)}
//               </TableCell>
//               <TableCell>
//                 <Tooltip title={request.request_details} arrow>
//                   <Typography
//                     noWrap
//                     sx={{
//                       maxWidth: 150,
//                       overflow: 'hidden',
//                       textOverflow: 'ellipsis'
//                     }}
//                   >
//                     {request.request_details}
//                   </Typography>
//                 </Tooltip>
//               </TableCell>
//               <TableCell>
//                 <Chip
//                   label={request.status}
//                   color={getStatusColor(request.status)}
//                   size="small"
//                 />
//               </TableCell>
//               <TableCell>
//                 <Stack direction="row" spacing={1}>
//                   <Button
//                     variant="outlined"
//                     color="primary"
//                     size="small"
//                     onClick={() => onReviewRequest(request)}
//                   >
//                     Review
//                   </Button>
//                   {(request.has_appointment || request.appointment_id || request.status === 'completed') && (
//                     <>
//                       <Button
//                         variant="outlined"
//                         color="success"
//                         size="small"
//                         startIcon={<CelebrationIcon />}
//                         onClick={() => onViewAppointment(request)}
//                       >
//                         View Appt
//                       </Button>
//                       <Button
//                         variant="contained"
//                         color="success"
//                         size="small"
//                         startIcon={<CheckCircleIcon />}
//                         onClick={() => onViewSuccess(request)}
//                         sx={{ whiteSpace: 'nowrap' }}
//                       >
//                         View Success
//                       </Button>
//                     </>
//                   )}
//                 </Stack>
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//     </TableContainer>
//   );
// };

// export default SpecialRequestsTable;


















import React from 'react';
import {
  Paper, TableContainer, Table, TableHead, TableBody,
  TableRow, TableCell, Button, Chip, Typography, Tooltip,
  Stack, Box
} from '@mui/material';
import { Celebration as CelebrationIcon, CheckCircle as CheckCircleIcon } from '@mui/icons-material';

const SpecialRequestsTable = ({ requests = [], onReviewRequest, onViewAppointment, onViewSuccess }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'approved': return 'success';
      case 'rejected': return 'error';
      case 'completed': return 'info';
      default: return 'default';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    if (typeof timeString === 'string') {
      const [hours, minutes] = timeString.split(':');
      const time = new Date();
      time.setHours(hours, minutes);
      return time.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });
    }
    return new Date(timeString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Function to parse services and return them as an array
  const parseServices = (request) => {
    // If services is already an array
    if (Array.isArray(request.services)) {
      return request.services;
    }
    
    // If services is a string, try to split by comma
    if (typeof request.services === 'string') {
      return request.services.split(',').map(s => s.trim());
    }
    
    // If service_name is available
    if (request.service_name) {
      return [request.service_name];
    }
    
    // If service_ids is available, try to parse it
    if (request.service_ids) {
      // If it's an array
      if (Array.isArray(request.service_ids)) {
        return request.service_ids.map(id => `Service #${id}`);
      }
      
      // If it's a string that might be JSON
      if (typeof request.service_ids === 'string') {
        try {
          const parsedIds = JSON.parse(request.service_ids);
          if (Array.isArray(parsedIds)) {
            return parsedIds.map(id => `Service #${id}`);
          }
          return [`Service #${request.service_ids}`];
        } catch (e) {
          // Not valid JSON, treat as single ID
          return [`Service #${request.service_ids}`];
        }
      }
    }
    
    return ['N/A'];
  };

  return (
    <TableContainer component={Paper} sx={{ maxHeight: '70vh' }}>
      <Table stickyHeader size="small">
        <TableHead>
          <TableRow>
            <TableCell>Contact Info</TableCell>
            <TableCell>Services</TableCell>
            <TableCell>Preferred Date</TableCell>
            <TableCell>Preferred Time</TableCell>
            <TableCell>Request Details</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {requests.map((request) => (
            <TableRow key={request.id} hover>
              <TableCell>
                <Typography variant="body2">{request.email}</Typography>
                <Typography variant="body2">{request.phone_number}</Typography>
              </TableCell>
              <TableCell>
                <Stack direction="row" spacing={0.5} flexWrap="wrap" gap={0.5}>
                  {parseServices(request).map((service, idx) => (
                    <Chip 
                      key={idx}
                      label={service} 
                      size="small"
                      variant="outlined"
                      color="primary"
                    />
                  ))}
                </Stack>
              </TableCell>
              <TableCell>
                {formatDate(request.preferred_date)}
              </TableCell>
              <TableCell>
                {formatTime(request.preferred_time)}
              </TableCell>
              <TableCell>
                <Tooltip title={request.request_details} arrow>
                  <Typography
                    noWrap
                    sx={{
                      maxWidth: 150,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {request.request_details}
                  </Typography>
                </Tooltip>
              </TableCell>
              <TableCell>
                <Chip
                  label={request.status}
                  color={getStatusColor(request.status)}
                  size="small"
                />
              </TableCell>
              <TableCell>
                <Stack direction="row" spacing={1}>
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    onClick={() => onReviewRequest(request)}
                  >
                    Review
                  </Button>
                  {(request.has_appointment || request.appointment_id || request.status === 'completed') && (
                    <>
                      <Button
                        variant="outlined"
                        color="success"
                        size="small"
                        startIcon={<CelebrationIcon />}
                        onClick={() => onViewAppointment(request)}
                      >
                        View Appt
                      </Button>
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        startIcon={<CheckCircleIcon />}
                        onClick={() => onViewSuccess(request)}
                        sx={{ whiteSpace: 'nowrap' }}
                      >
                        View Success
                      </Button>
                    </>
                  )}
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default SpecialRequestsTable;