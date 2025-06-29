import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, Container, CircularProgress, Snackbar, Alert, useMediaQuery, useTheme,
  Tabs, Tab
} from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from '../utils/axiosWithAuth';
import { jwtDecode } from 'jwt-decode';
import CancelReqTable from '../components/cancelReq/CancelReqTable';
import CancelReqForm from '../components/cancelReq/CancelReqForm';
import AppointmentFilters from '../components/appointment/AppointmentFilters';

// Custom styled components 
const StyledPaper = styled(Paper)({
  borderRadius: '8px',
  overflow: 'hidden',
  border: '1px solid rgba(190, 175, 155, 0.2)',
  background: 'linear-gradient(to right, rgba(190, 175, 155, 0.1), rgba(255, 255, 255, 0.8))',
});

const StyledTab = styled(Tab)({
  fontFamily: "'Poppins', 'Roboto', sans-serif",
  fontWeight: 500,
  textTransform: 'none',
  minWidth: 100,
  '&.Mui-selected': {
    fontWeight: 600,
    color: '#453C33',
  },
});

const AdminCancellationRequests = () => {
  const [tabValue, setTabValue] = useState(0);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [approvedRequests, setApprovedRequests] = useState([]);
  const [rejectedRequests, setRejectedRequests] = useState([]);
  const [filteredPendingRequests, setFilteredPendingRequests] = useState([]);
  const [filteredApprovedRequests, setFilteredApprovedRequests] = useState([]);
  const [filteredRejectedRequests, setFilteredRejectedRequests] = useState([]);
  const [loading, setLoading] = useState({
    pending: true,
    approved: true,
    rejected: true
  });
  const [isSearching, setIsSearching] = useState(false);
  const [searchParams, setSearchParams] = useState({
    appointmentId: '',
    date: '',
    customerName: ''
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [adminName, setAdminName] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    // Get admin info from JWT token
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setAdminName(decodedToken.name || decodedToken.username || 'Admin');
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
    
    fetchRequests();
  }, []);

  useEffect(() => {
    filterRequests();
  }, [pendingRequests, approvedRequests, rejectedRequests, searchParams]);

  const fetchRequests = async () => {
    try {
      // Fetch pending cancellation requests
      const pendingRes = await axios.get('http://localhost:5001/api/appointment/cancellation-requests');
      setPendingRequests(pendingRes.data.data);
      setFilteredPendingRequests(pendingRes.data.data);
      setLoading(prev => ({ ...prev, pending: false }));
      
      // Fetch approved cancellation requests
      const approvedRes = await axios.get('http://localhost:5001/api/appointment/approved-cancellations');
      setApprovedRequests(approvedRes.data.data);
      setFilteredApprovedRequests(approvedRes.data.data);
      setLoading(prev => ({ ...prev, approved: false }));
      
      // Fetch rejected cancellation requests
      const rejectedRes = await axios.get('http://localhost:5001/api/appointment/rejected-cancellations');
      setRejectedRequests(rejectedRes.data.data);
      setFilteredRejectedRequests(rejectedRes.data.data);
      setLoading(prev => ({ ...prev, rejected: false }));
    } catch (err) {
      console.error('Error fetching cancellation requests:', err);
      setSnackbar({ open: true, message: 'Failed to fetch cancellation requests', severity: 'error' });
      setLoading({ pending: false, approved: false, rejected: false });
    }
  };

  const handleProcessRequest = async (action, refundReason, refundAmount) => {
    setProcessing(true);
    try {
      let refundResult = null;
      
      // Process refund only for Paid/Partially Paid statuses
      if (action === 'Approved' && 
          (selectedRequest.payment?.payment_status === 'Paid' || 
           selectedRequest.payment?.payment_status === 'Partially Paid')) {
        if (!selectedRequest.payment.stripe_payment_intent_id) {
          throw new Error('Missing payment reference for refund');
        }
        
        refundResult = await axios.post('http://localhost:5001/api/refund/process', {
          payment_intent_id: selectedRequest.payment.stripe_payment_intent_id,
          amount: refundAmount,
          reason: refundReason
        });
      }

      // Process cancellation
      const cancelResponse = await axios.post(
        `http://localhost:5001/api/appointment/process-cancellation/${selectedRequest.appointment_ID}`,
        { action }
      );

      // Update the pending requests list
      setPendingRequests(prevRequests => 
        prevRequests.filter(request => request.appointment_ID !== selectedRequest.appointment_ID)
      );
      
      // Add the processed request to the appropriate list
      const updatedRequest = {
        ...selectedRequest,
        cancellation_status: action,
        appointment_status: action === 'Approved' ? 'Cancelled' : selectedRequest.appointment_status,
        payment: selectedRequest.payment 
          ? { 
              ...selectedRequest.payment,
              payment_status: 
                action === 'Approved'
                  ? selectedRequest.payment.payment_status === 'Paid' || 
                    selectedRequest.payment.payment_status === 'Partially Paid'
                    ? 'Refunded'
                    : selectedRequest.payment.payment_status === 'Pending'
                      ? 'Cancelled'
                      : selectedRequest.payment.payment_status
                  : selectedRequest.payment.payment_status
            } 
          : null
      };
      
      if (action === 'Approved') {
        setApprovedRequests(prev => [updatedRequest, ...prev]);
        // Automatically switch to approved tab
        setTabValue(1);
      } else if (action === 'Rejected') {
        setRejectedRequests(prev => [updatedRequest, ...prev]);
        // Automatically switch to rejected tab
        setTabValue(2);
      }

      setSnackbar({ 
        open: true, 
        message: `Cancellation ${action.toLowerCase()} successfully` + 
          (refundResult ? ` and $${refundAmount} refunded` : ''),
        severity: 'success'
      });
      
      setDialogOpen(false);
    } catch (err) {
      console.error('Processing error:', err);
      setSnackbar({
        open: true,
        message: err.response?.data?.message || err.message || 'Failed to process request',
        severity: 'error'
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleSearchInputChange = (e) => {
    setSearchParams({
      ...searchParams,
      [e.target.name]: e.target.value
    });
  };

  const filterRequests = () => {
    // Filter function to apply search parameters
    const filterData = (data) => {
      return data.filter(request => {
        const idMatch = !searchParams.appointmentId || 
          request.appointment_ID.toString().toLowerCase().includes(searchParams.appointmentId.toLowerCase());
        
        // Check if date matches
        const dateMatch = !searchParams.date || 
          (request.appointment_date && request.appointment_date.includes(searchParams.date));
        
        // Check if customer name includes the search term (case insensitive)
        const nameMatch = !searchParams.customerName || 
          (request.customer && request.customer.name && 
           request.customer.name.toLowerCase().includes(searchParams.customerName.toLowerCase()));
        
        return idMatch && dateMatch && nameMatch;
      });
    };

    // Apply filters to all request types
    setFilteredPendingRequests(filterData(pendingRequests));
    setFilteredApprovedRequests(filterData(approvedRequests));
    setFilteredRejectedRequests(filterData(rejectedRequests));
  };

  const handleSearch = () => {
    setIsSearching(true);
    setTimeout(() => {
      filterRequests();
      setIsSearching(false);
    }, 500);
  };

  const clearSearch = () => {
    setSearchParams({
      appointmentId: '',
      date: '',
      customerName: ''
    });
    // Reset filtered data to original data
    setFilteredPendingRequests(pendingRequests);
    setFilteredApprovedRequests(approvedRequests);
    setFilteredRejectedRequests(rejectedRequests);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const getCurrentTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const renderTabContent = () => {
    if (tabValue === 0) {
      if (loading.pending) {
        return (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress sx={{ color: '#BEAF9B' }} />
          </Box>
        );
      }
      
      return filteredPendingRequests.length === 0 ? (
        <Typography 
          variant="body1" 
          sx={{ 
            fontFamily: "'Poppins', 'Roboto', sans-serif",
            color: '#666',
            textAlign: 'center',
            py: 4
          }}
        >
          No pending cancellation requests
        </Typography>
      ) : (
        <CancelReqTable 
          requests={filteredPendingRequests} 
          setSelectedRequest={setSelectedRequest} 
          setDialogOpen={setDialogOpen} 
          showActionButtons={true}
        />
      );
    }
    
    // Approved Requests Tab
    else if (tabValue === 1) {
      if (loading.approved) {
        return (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress sx={{ color: '#BEAF9B' }} />
          </Box>
        );
      }
      
      return filteredApprovedRequests.length === 0 ? (
        <Typography 
          variant="body1" 
          sx={{ 
            fontFamily: "'Poppins', 'Roboto', sans-serif",
            color: '#666',
            textAlign: 'center',
            py: 4
          }}
        >
          No approved cancellation requests
        </Typography>
      ) : (
        <CancelReqTable 
          requests={filteredApprovedRequests} 
          setSelectedRequest={setSelectedRequest} 
          setDialogOpen={setDialogOpen} 
          showActionButtons={false}
        />
      );
    }
    
    // Rejected Requests Tab
    else if (tabValue === 2) {
      if (loading.rejected) {
        return (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress sx={{ color: '#BEAF9B' }} />
          </Box>
        );
      }
      
      return filteredRejectedRequests.length === 0 ? (
        <Typography 
          variant="body1" 
          sx={{ 
            fontFamily: "'Poppins', 'Roboto', sans-serif",
            color: '#666',
            textAlign: 'center',
            py: 4
          }}
        >
          No rejected cancellation requests
        </Typography>
      ) : (
        <CancelReqTable 
          requests={filteredRejectedRequests} 
          setSelectedRequest={setSelectedRequest} 
          setDialogOpen={setDialogOpen} 
          showActionButtons={false}
        />
      );
    }
  };

  return (
    <Container maxWidth="xl" sx={{ mt: { xs: 2, md: 4 } }}>
      <StyledPaper elevation={0}>
        <Box sx={{ p: { xs: 2, md: 3 }, borderBottom: '1px solid rgba(190, 175, 155, 0.2)' }}>
          <Typography 
            variant={isMobile ? "h5" : "h4"} 
            component="h1" 
            sx={{ 
              fontFamily: "'Poppins', 'Roboto', sans-serif",
              fontWeight: 600,
              color: '#453C33',
              mb: 1
            }}
          >
            Cancellation Requests
          </Typography>
          
          <Typography 
            variant="body1" 
            sx={{ 
              fontFamily: "'Poppins', 'Roboto', sans-serif",
              color: '#666',
              mb: 1
            }}
          >
            {getCurrentTimeGreeting()}, {adminName}. Review and process appointment cancellation requests.
          </Typography>
          
          {/* Appointment Filters Component */}
          <AppointmentFilters
            searchParams={searchParams}
            handleSearchInputChange={handleSearchInputChange}
            handleSearch={handleSearch}
            clearSearch={clearSearch}
            isSearching={isSearching}
          />
          
          {/* Tab Navigation */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 2 }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              sx={{
                '& .MuiTabs-indicator': {
                  backgroundColor: '#BEAF9B',
                }
              }}
            >
              <StyledTab label={`Pending (${!loading.pending ? filteredPendingRequests.length : '...'})`} />
              <StyledTab label={`Approved (${!loading.approved ? filteredApprovedRequests.length : '...'})`} />
              <StyledTab label={`Rejected (${!loading.rejected ? filteredRejectedRequests.length : '...'})`} />
            </Tabs>
          </Box>
        </Box>
        
        <Box sx={{ p: { xs: 2, md: 3 } }}>
          {renderTabContent()}
        </Box>
      </StyledPaper>

      {/* Review Form Dialog - Only shown for pending requests */}
      {tabValue === 0 && (
        <CancelReqForm 
          dialogOpen={dialogOpen}
          setDialogOpen={setDialogOpen}
          selectedRequest={selectedRequest}
          processing={processing}
          handleProcessRequest={handleProcessRequest}
        />
      )}

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          severity={snackbar.severity}
          sx={{ 
            width: '100%',
            fontFamily: "'Poppins', 'Roboto', sans-serif",
          }}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AdminCancellationRequests;