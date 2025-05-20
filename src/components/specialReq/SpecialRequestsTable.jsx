


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
  Paper, 
  TableContainer, 
  Table, 
  TableHead, 
  TableBody,
  TableRow, 
  TableCell, 
  Button, 
  Chip, 
  Typography, 
  Tooltip,
  Stack,
  Box
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import MessageIcon from '@mui/icons-material/Message';

// Styled components to match the design aesthetic
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  borderRadius: '8px',
  border: '1px solid rgba(190, 175, 155, 0.2)',
  boxShadow: 'none',
  maxHeight: '70vh',
  overflow: 'auto',
}));

const StyledTable = styled(Table)(({ theme }) => ({
  backgroundColor: 'transparent',
}));

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  '& .MuiTableRow-root': {
    backgroundColor: 'rgba(190, 175, 155, 0.1)',
  },
  '& .MuiTableCell-root': {
    borderBottom: '1px solid rgba(190, 175, 155, 0.3)',
    color: '#453C33',
    fontFamily: "'Poppins', 'Roboto', sans-serif",
    fontWeight: 600,
    fontSize: '0.85rem',
    padding: '10px 16px',
  },
}));

const StyledTableBody = styled(TableBody)(({ theme }) => ({
  '& .MuiTableRow-root': {
    '&:hover': {
      backgroundColor: 'rgba(190, 175, 155, 0.05)',
    },
    '&:nth-of-type(even)': {
      backgroundColor: 'rgba(190, 175, 155, 0.03)',
    },
  },
  '& .MuiTableCell-root': {
    borderBottom: '1px solid rgba(190, 175, 155, 0.1)',
    color: '#666666',
    fontFamily: "'Poppins', 'Roboto', sans-serif",
    fontSize: '0.85rem',
    padding: '8px 16px',
  },
}));

const StyledChip = styled(Chip)(({ theme, color }) => ({
  fontFamily: "'Poppins', 'Roboto', sans-serif",
  fontSize: '0.75rem',
  fontWeight: 500,
  borderRadius: '12px',
  height: '24px',
  ...(color === 'primary' && {
    backgroundColor: 'rgba(190, 175, 155, 0.1)',
    color: '#453C33',
    border: '1px solid rgba(190, 175, 155, 0.3)',
  }),
  ...(color === 'warning' && {
    backgroundColor: 'rgba(255, 193, 7, 0.1)',
    color: '#f57c00',
    border: '1px solid rgba(255, 193, 7, 0.3)',
  }),
  ...(color === 'success' && {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    color: '#388e3c',
    border: '1px solid rgba(76, 175, 80, 0.3)',
  }),
  ...(color === 'error' && {
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    color: '#d32f2f',
    border: '1px solid rgba(244, 67, 54, 0.3)',
  }),
  ...(color === 'info' && {
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
    color: '#0288d1',
    border: '1px solid rgba(33, 150, 243, 0.3)',
  }),
}));

const StyledButton = styled(Button)(({ theme, color }) => ({
  fontFamily: "'Poppins', 'Roboto', sans-serif",
  fontWeight: 600,
  fontSize: '0.75rem',
  borderRadius: '20px',
  padding: '4px 12px',
  minWidth: '80px',
  textTransform: 'none',
  boxShadow: 'none',
  ...(color === 'primary' && {
    borderColor: '#BEAF9B',
    color: '#453C33',
    '&:hover': {
      backgroundColor: 'rgba(190, 175, 155, 0.1)',
      borderColor: '#BEAF9B',
    },
  }),
  ...(color === 'success' && {
    backgroundColor: '#BEAF9B',
    color: '#FFFFFF',
    border: 'none',
    '&:hover': {
      backgroundColor: '#a39383',
    },
  }),
}));

const SpecialRequestsTable = ({ requests = [], onReviewRequest, onViewSuccess }) => {
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
    if (Array.isArray(request.services)) {
      return request.services;
    }
    if (typeof request.services === 'string') {
      return request.services.split(',').map(s => s.trim());
    }
    if (request.service_name) {
      return [request.service_name];
    }
    if (request.service_ids) {
      if (Array.isArray(request.service_ids)) {
        return request.service_ids.map(id => `Service #${id}`);
      }
      if (typeof request.service_ids === 'string') {
        try {
          const parsedIds = JSON.parse(request.service_ids);
          if (Array.isArray(parsedIds)) {
            return parsedIds.map(id => `Service #${id}`);
          }
          return [`Service #${request.service_ids}`];
        } catch (e) {
          return [`Service #${request.service_ids}`];
        }
      }
    }
    return ['N/A'];
  };

  return (
    <StyledTableContainer component={Paper}>
      <StyledTable stickyHeader size="small">
        <StyledTableHead>
          <TableRow>
            <TableCell>Contact Info</TableCell>
            <TableCell>Services</TableCell>
            <TableCell>Preferred Date</TableCell>
            <TableCell>Preferred Time</TableCell>
            <TableCell>Request Details</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </StyledTableHead>
        <StyledTableBody>
          {requests.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                  <MessageIcon sx={{ fontSize: 40, color: 'rgba(190, 175, 155, 0.5)' }} />
                  <Typography variant="body1" sx={{ color: '#666', fontFamily: "'Poppins', 'Roboto', sans-serif" }}>
                    No special requests found
                  </Typography>
                </Box>
              </TableCell>
            </TableRow>
          ) : (
            requests.map((request) => (
              <TableRow key={request.id}>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 500, color: '#453C33' }}>
                    {`${request.firstName || ''} ${request.lastName || ''}`}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#666666', display: 'block' }}>
                    {request.email}
                  </Typography>
                  <Typography variant="caption" sx={{ color: '#666666' }}>
                    {request.phone_number}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={0.5} flexWrap="wrap" gap={0.5}>
                    {parseServices(request).map((service, idx) => (
                      <StyledChip 
                        key={idx}
                        label={service} 
                        size="small"
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
                  <Tooltip title={request.request_details} arrow placement="top-start">
                    <Typography
                      noWrap
                      sx={{
                        maxWidth: 150,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        fontSize: '0.85rem',
                        fontFamily: "'Poppins', 'Roboto', sans-serif",
                      }}
                    >
                      {request.request_details}
                    </Typography>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <StyledChip
                    label={request.status}
                    color={getStatusColor(request.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <StyledButton
                      variant="outlined"
                      color="primary"
                      size="small"
                      onClick={() => onReviewRequest(request)}
                    >
                      Review
                    </StyledButton>
                    {(request.has_appointment || request.appointment_id || request.status === 'completed') && (
                      <StyledButton
                        variant="contained"
                        color="success"
                        size="small"
                        startIcon={<CheckCircleIcon sx={{ fontSize: 16 }} />}
                        onClick={() => onViewSuccess({
                          ...request,
                          appointment_id: request.appointment_id || request.appointment_ID || request.appointmentId || request.newAppointmentId
                        })}
                      >
                        Success
                      </StyledButton>
                    )}
                  </Stack>
                </TableCell>
              </TableRow>
            ))
          )}
        </StyledTableBody>
      </StyledTable>
    </StyledTableContainer>
  );
};

export default SpecialRequestsTable;