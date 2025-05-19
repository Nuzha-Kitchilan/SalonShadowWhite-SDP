import React from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Chip, Button, useMediaQuery, useTheme
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SpaIcon from '@mui/icons-material/Spa';
import CancelIcon from '@mui/icons-material/Cancel';
import PaymentIcon from '@mui/icons-material/Payment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BlockIcon from '@mui/icons-material/Block';

const StyledTable = styled(Table)({
  '& .MuiTableCell-root': {
    fontFamily: "'Poppins', 'Roboto', sans-serif",
  },
  '& .MuiTableHead-root': {
    backgroundColor: 'rgba(190, 175, 155, 0.1)',
    '& .MuiTableCell-root': {
      fontWeight: 600,
      color: '#453C33',
    }
  }
});

const StyledButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: 600,
  fontFamily: "'Poppins', 'Roboto', sans-serif",
  padding: theme.spacing(1, 2),
  transition: 'all 0.2s',
  '&:hover': {
    backgroundColor: 'rgba(190, 175, 155, 0.1)',
  }
}));

const CancelReqTable = ({ requests, setSelectedRequest, setDialogOpen, showActionButtons = true }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const getStatusIndicator = (request) => {
    if (!showActionButtons) {
      if (request.cancellation_status === 'Approved') {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'success.main' }}>
            <CheckCircleIcon fontSize="small" />
            <Typography variant="body2" fontWeight={500}>Approved</Typography>
          </Box>
        );
      } else if (request.cancellation_status === 'Rejected') {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'error.main' }}>
            <BlockIcon fontSize="small" />
            <Typography variant="body2" fontWeight={500}>Rejected</Typography>
          </Box>
        );
      }
    }
    return null;
  };

  return (
    <TableContainer>
      <StyledTable>
        <TableHead>
          <TableRow>
            <TableCell>Appointment</TableCell>
            <TableCell>Customer</TableCell>
            {!isMobile && <TableCell>Date & Time</TableCell>}
            {!isMobile && <TableCell>Request Time</TableCell>}
            <TableCell>Services</TableCell>
            <TableCell>Payment</TableCell>
            <TableCell align="center">{showActionButtons ? 'Actions' : 'Status'}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {requests.map((request) => (
            <TableRow key={request.appointment_ID} hover sx={{ '&:hover': { backgroundColor: 'rgba(190, 175, 155, 0.05)' } }}>
              <TableCell>
                <Typography fontWeight={600}>#{request.appointment_ID}</Typography>
                {isMobile && (
                  <>
                    <Typography variant="body2">
                      {request.appointment_date} at {request.appointment_time?.substring(0, 5)}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Requested: {new Date(request.cancel_request_time).toLocaleDateString()}
                    </Typography>
                  </>
                )}
              </TableCell>
              <TableCell>
                <Typography fontWeight={600}>{request.firstname} {request.lastname}</Typography>
                <Typography variant="body2">{request.email}</Typography>
                <Typography variant="body2">{request.primary_phone}</Typography>
              </TableCell>
              {!isMobile && (
                <TableCell>
                  {request.appointment_date} at {request.appointment_time?.substring(0, 5)}
                </TableCell>
              )}
              {!isMobile && (
                <TableCell>
                  {new Date(request.cancel_request_time).toLocaleString()}
                </TableCell>
              )}
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <SpaIcon fontSize="small" color="action" />
                  <Typography>{request.services}</Typography>
                </Box>
              </TableCell>
              <TableCell>
                {request.payment ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PaymentIcon fontSize="small" color="action" />
                    <Box>
                      <Chip 
                        label={request.payment.payment_status} 
                        size="small"
                        sx={{
                          backgroundColor: 
                            request.payment.payment_status === 'Paid' ? 'rgba(56, 142, 60, 0.1)' :
                            request.payment.payment_status === 'Partially Paid' ? 'rgba(255, 160, 0, 0.1)' :
                            request.payment.payment_status === 'Refunded' ? 'rgba(103, 58, 183, 0.1)' : 
                            'rgba(158, 158, 158, 0.1)',
                          color: 
                            request.payment.payment_status === 'Paid' ? '#388e3c' :
                            request.payment.payment_status === 'Partially Paid' ? '#ffa000' :
                            request.payment.payment_status === 'Refunded' ? '#673ab7' : 
                            '#9e9e9e',
                        }}
                      />
                      <Typography variant="body2">
                        ${request.payment.amount_paid} of ${request.payment.payment_amount}
                      </Typography>
                    </Box>
                  </Box>
                ) : (
                  <Chip label="No payment" size="small" sx={{ backgroundColor: 'rgba(158, 158, 158, 0.1)', color: '#9e9e9e' }} />
                )}
              </TableCell>
              <TableCell align="center">
                {showActionButtons ? (
                  <StyledButton
                    variant="outlined"
                    sx={{
                      color: '#453C33',
                      borderColor: 'rgba(190, 175, 155, 0.5)',
                      '&:hover': {
                        borderColor: '#BEAF9B',
                      }
                    }}
                    startIcon={<CancelIcon fontSize="small" />}
                    onClick={() => {
                      setSelectedRequest(request);
                      setDialogOpen(true);
                    }}
                  >
                    Review
                  </StyledButton>
                ) : (
                  getStatusIndicator(request)
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </StyledTable>
    </TableContainer>
  );
};

export default CancelReqTable;