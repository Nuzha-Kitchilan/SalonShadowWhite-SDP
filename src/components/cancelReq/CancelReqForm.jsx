import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Divider, Grid, Button, CircularProgress,
  Chip, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SpaIcon from '@mui/icons-material/Spa';
import PaymentIcon from '@mui/icons-material/Payment';

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

const CancelReqForm = ({ 
  dialogOpen, 
  setDialogOpen, 
  selectedRequest, 
  processing, 
  handleProcessRequest 
}) => {
  const [refundAmount, setRefundAmount] = useState(0);
  const [refundReason, setRefundReason] = useState('cancellation');

  useEffect(() => {
    if (selectedRequest?.payment) {
      setRefundAmount(selectedRequest.payment.amount_paid);
    }
  }, [selectedRequest]);

  return (
    <Dialog 
      open={dialogOpen} 
      onClose={() => !processing && setDialogOpen(false)} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '8px',
          background: 'linear-gradient(to right, rgba(190, 175, 155, 0.9), rgba(255, 255, 255, 0.9))',
        }
      }}
    >
      <DialogTitle sx={{ 
        fontFamily: "'Poppins', 'Roboto', sans-serif",
        fontWeight: 600,
        color: '#453C33',
        borderBottom: '1px solid rgba(190, 175, 155, 0.2)'
      }}>
        Review Cancellation Request
      </DialogTitle>
      <DialogContent dividers>
        {selectedRequest && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <SpaIcon color="action" />
                <Typography variant="h6" sx={{ fontFamily: "'Poppins', 'Roboto', sans-serif" }}>Appointment Details</Typography>
              </Box>
              <Divider sx={{ my: 1, borderColor: 'rgba(190, 175, 155, 0.2)' }} />
              <Box sx={{ '& > *': { mb: 1 } }}>
                <Typography><strong>ID:</strong> {selectedRequest.appointment_ID}</Typography>
                <Typography><strong>Customer:</strong> {selectedRequest.firstname} {selectedRequest.lastname}</Typography>
                <Typography><strong>Date:</strong> {selectedRequest.appointment_date}</Typography>
                <Typography><strong>Time:</strong> {selectedRequest.appointment_time?.substring(0, 5)}</Typography>
                <Typography><strong>Requested At:</strong> {new Date(selectedRequest.cancel_request_time).toLocaleString()}</Typography>
                <Typography><strong>Services:</strong> {selectedRequest.services}</Typography>
                <Typography><strong>Stylists:</strong> {selectedRequest.stylists || 'None assigned'}</Typography>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <PaymentIcon color="action" />
                <Typography variant="h6" sx={{ fontFamily: "'Poppins', 'Roboto', sans-serif" }}>Payment Details</Typography>
              </Box>
              <Divider sx={{ my: 1, borderColor: 'rgba(190, 175, 155, 0.2)' }} />
              {selectedRequest.payment ? (
                <Box sx={{ '& > *': { mb: 1 } }}>
                  <Typography><strong>Amount:</strong> ${selectedRequest.payment.payment_amount}</Typography>
                  <Typography><strong>Paid:</strong> ${selectedRequest.payment.amount_paid || 0}</Typography>
                  <Typography><strong>Status:</strong> <Chip 
                    label={selectedRequest.payment.payment_status} 
                    size="small"
                    sx={{
                      backgroundColor: 
                        selectedRequest.payment.payment_status === 'Paid' ? 'rgba(56, 142, 60, 0.1)' :
                        selectedRequest.payment.payment_status === 'Partially Paid' ? 'rgba(255, 160, 0, 0.1)' : 
                        'rgba(158, 158, 158, 0.1)',
                      color: 
                        selectedRequest.payment.payment_status === 'Paid' ? '#388e3c' :
                        selectedRequest.payment.payment_status === 'Partially Paid' ? '#ffa000' : '#9e9e9e',
                    }}
                  /></Typography>
                  <Typography><strong>Payment Type:</strong> {selectedRequest.payment.payment_type}</Typography>
                  <Typography><strong>Payment ID:</strong> {selectedRequest.payment.stripe_payment_intent_id || 'N/A'}</Typography>
                  <Typography><strong>Date:</strong> {
                    selectedRequest.payment.payment_date ? 
                      new Date(selectedRequest.payment.payment_date).toLocaleString() : 'N/A'
                  }</Typography>

                  {selectedRequest.payment.payment_status === 'Paid' && (
                    <>
                      <Divider sx={{ my: 2, borderColor: 'rgba(190, 175, 155, 0.2)' }} />
                      <Typography variant="subtitle1" sx={{ fontFamily: "'Poppins', 'Roboto', sans-serif", fontWeight: 600 }}>Refund Details</Typography>
                      <TextField
                        label="Refund Amount"
                        type="number"
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        size="small"
                        value={refundAmount}
                        onChange={(e) => setRefundAmount(Math.min(Number(e.target.value), selectedRequest.payment.amount_paid))}
                        inputProps={{
                          min: 0,
                          max: selectedRequest.payment.amount_paid,
                          step: 0.01
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                              borderColor: 'rgba(190, 175, 155, 0.5)',
                            },
                            '&:hover fieldset': {
                              borderColor: '#BEAF9B',
                            },
                          }
                        }}
                      />
                      <TextField
                        select
                        label="Refund Reason"
                        fullWidth
                        margin="normal"
                        variant="outlined"
                        size="small"
                        value={refundReason}
                        onChange={(e) => setRefundReason(e.target.value)}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                              borderColor: 'rgba(190, 175, 155, 0.5)',
                            },
                            '&:hover fieldset': {
                              borderColor: '#BEAF9B',
                            },
                          }
                        }}
                      >
                        <MenuItem value="cancellation">Cancellation</MenuItem>
                        <MenuItem value="requested_by_customer">Requested by Customer</MenuItem>
                        <MenuItem value="duplicate">Duplicate</MenuItem>
                        <MenuItem value="fraudulent">Fraudulent</MenuItem>
                      </TextField>
                    </>
                  )}
                </Box>
              ) : (
                <Typography>No payment information available</Typography>
              )}
            </Grid>
          </Grid>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2, borderTop: '1px solid rgba(190, 175, 155, 0.2)' }}>
        <StyledButton
          onClick={() => setDialogOpen(false)}
          disabled={processing}
          sx={{
            color: '#666',
            '&:hover': {
              color: '#453C33',
            }
          }}
        >
          Cancel
        </StyledButton>
        <StyledButton
          onClick={() => handleProcessRequest('Rejected', refundReason, refundAmount)}
          sx={{
            color: '#ff6b6b',
            borderColor: 'rgba(255, 107, 107, 0.5)',
            '&:hover': {
              borderColor: '#ff6b6b',
              backgroundColor: 'rgba(255, 107, 107, 0.1)'
            }
          }}
          variant="outlined"
          disabled={processing}
          startIcon={processing ? <CircularProgress size={16} color="inherit" /> : null}
        >
          Reject
        </StyledButton>
        <StyledButton
          onClick={() => handleProcessRequest('Approved', refundReason, refundAmount)}
          sx={{
            backgroundColor: '#BEAF9B',
            color: '#fff',
            '&:hover': {
              backgroundColor: '#9e8e7a',
            },
            '&:disabled': {
              backgroundColor: 'rgba(190, 175, 155, 0.5)',
            }
          }}
          disabled={processing || (selectedRequest?.payment?.payment_status === 'Paid' && refundAmount <= 0)}
          startIcon={processing ? <CircularProgress size={16} color="inherit" /> : null}
        >
          {`Approve${selectedRequest?.payment?.payment_status === 'Paid' ? ' & Refund' : ''}`}
        </StyledButton>
      </DialogActions>
    </Dialog>
  );
};

export default CancelReqForm;
