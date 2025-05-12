// import React from 'react';
// import {
//   Paper, TableContainer, Table, TableHead, TableBody,
//   TableRow, TableCell, Button, Chip, Typography, Tooltip
// } from '@mui/material';

// const SpecialRequestsTable = ({ requests, onReviewRequest }) => {
//   const getStatusColor = (status) => {
//     switch(status) {
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
//     // For TIME fields (preferred_time) which might come as "HH:MM:SS"
//     if (typeof timeString === 'string') {
//       const [hours, minutes] = timeString.split(':');
//       const time = new Date();
//       time.setHours(hours, minutes);
//       return time.toLocaleTimeString('en-US', { 
//         hour: '2-digit', 
//         minute: '2-digit' 
//       });
//     }
//     // For TIMESTAMP fields (created_at)
//     return new Date(timeString).toLocaleTimeString('en-US', { 
//       hour: '2-digit', 
//       minute: '2-digit' 
//     });
//   };

//   const formatDateTime = (dateString) => {
//     if (!dateString) return 'N/A';
//     const date = new Date(dateString);
//     return date.toLocaleString('en-US', {
//       month: 'short',
//       day: 'numeric',
//       year: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   return (
//     <TableContainer component={Paper} sx={{ maxHeight: '70vh' }}>
//       <Table stickyHeader size="small">
//         <TableHead>
//           <TableRow>
//             <TableCell>ID</TableCell>
//             <TableCell>Customer</TableCell>
//             <TableCell>Contact Info</TableCell>
//             <TableCell>Customer ID</TableCell>
//             <TableCell>Services</TableCell>
//             <TableCell>Preferred Date</TableCell>
//             <TableCell>Preferred Time</TableCell>
//             <TableCell>Request Details</TableCell>
//             <TableCell>Status</TableCell>
//             <TableCell>Created</TableCell>
//             <TableCell>Updated</TableCell>
//             <TableCell>Actions</TableCell>
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           {requests.map((request) => (
//             <TableRow key={request.id} hover>
//               <TableCell>{request.id}</TableCell>
//               <TableCell>
//                 <Typography fontWeight="medium">
//                   {request.first_name} {request.last_name}
//                 </Typography>
//               </TableCell>
//               <TableCell>
//                 <Typography variant="body2">{request.email}</Typography>
//                 <Typography variant="body2">{request.phone_number}</Typography>
//               </TableCell>
//               <TableCell>
//                 {request.customer_id || 'N/A'}
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
//                 <Tooltip title={formatDateTime(request.created_at)}>
//                   <Typography variant="caption">
//                     {formatDate(request.created_at)}
//                   </Typography>
//                 </Tooltip>
//               </TableCell>
//               <TableCell>
//                 <Tooltip title={formatDateTime(request.updated_at)}>
//                   <Typography variant="caption">
//                     {formatDate(request.updated_at)}
//                   </Typography>
//                 </Tooltip>
//               </TableCell>
//               <TableCell>
//                 <Button 
//                   variant="outlined" 
//                   color="primary"
//                   size="small"
//                   onClick={() => onReviewRequest(request)}
//                 >
//                   Review
//                 </Button>
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
  Stack
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
                {request.service_name || 'N/A'}
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