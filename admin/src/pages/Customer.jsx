import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Button,
  Alert,
  Snackbar,
  IconButton,
  Container,
  Paper,
  useMediaQuery,
  useTheme,
  Tabs,
  Tab,
  Breadcrumbs,
  Link
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import EventNoteIcon from '@mui/icons-material/EventNote';
import { styled } from '@mui/material/styles';
import { jwtDecode } from 'jwt-decode';

import CustomerList from '../components/customer/CustomerList';
import CustomerDetail from '../components/customer/CustomerDetail';
import CustomerForm from '../components/customer/CustomerForm';
import CustomerAppointments from '../components/customer/CustomerAppointments';

// Custom styled tabs
const StyledTabs = styled(Tabs)({
  borderBottom: '1px solid rgba(190, 175, 155, 0.3)',
  '& .MuiTabs-indicator': {
    backgroundColor: '#BEAF9B',
    height: 3,
  },
});

// Custom styled tab
const StyledTab = styled((props) => <Tab disableRipple {...props} />)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '0.9rem',
  fontFamily: "'Poppins', 'Roboto', sans-serif",
  color: '#666666',
  marginRight: theme.spacing(1),
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  transition: 'all 0.2s',
  '&.Mui-selected': {
    color: '#453C33',
    fontWeight: 700,
  },
  '&.Mui-focusVisible': {
    backgroundColor: 'rgba(190, 175, 155, 0.1)',
  },
  '&:hover': {
    color: '#453C33',
    backgroundColor: 'rgba(190, 175, 155, 0.1)',
  },
}));

// Custom styled button
const StyledButton = styled(Button)(({ theme, variant }) => ({
  fontFamily: "'Poppins', 'Roboto', sans-serif",
  fontWeight: 600,
  borderRadius: '6px',
  textTransform: 'none',
  boxShadow: 'none',
  padding: '8px 16px',
  transition: 'all 0.2s',
  ...(variant === 'contained' && {
    backgroundColor: '#BEAF9B',
    color: '#FFF',
    '&:hover': {
      backgroundColor: '#A89683',
      boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    },
  }),
  ...(variant === 'outlined' && {
    borderColor: '#BEAF9B',
    color: '#BEAF9B',
    '&:hover': {
      borderColor: '#A89683',
      color: '#A89683',
      backgroundColor: 'rgba(190, 175, 155, 0.05)',
    },
  }),
}));

const CustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [view, setView] = useState('list'); 
  const [adminName, setAdminName] = useState('');
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const fetchCustomers = async (page = 1) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(`/customers/admin-customer?page=${page}&limit=10`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCustomers(response.data.customers);
      setCurrentPage(response.data.pagination.page);
      setTotalPages(response.data.pagination.totalPages);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch customers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers(1);
    
    // Get admin info from JWT token
    const token = localStorage.getItem("adminToken");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setAdminName(decodedToken.name || decodedToken.username || 'Admin');
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  const handlePageChange = (page) => {
    fetchCustomers(page);
  };

  const handleSelectCustomer = (customer) => {
    setSelectedCustomer(customer);
    setView('detail');
  };

  const handleUpdateCustomer = async (formData) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('adminToken');
      await axios.put(`/customers/admin-customer/update/${selectedCustomer.customer_ID}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccess('Customer updated successfully');
      await fetchCustomers(currentPage);

      const response = await axios.get(`/customers/admin-customer/${selectedCustomer.customer_ID}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSelectedCustomer(response.data.customer);
      setView('detail');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update customer');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (newPassword) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('adminToken');
      await axios.put(
        `/customers/admin-customer/${selectedCustomer.customer_ID}/reset-password`,
        { newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccess('Password reset successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCustomer = async (customerId) => {
    if (!window.confirm('Are you sure you want to delete this customer?')) return;

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`/customers/admin-customer/delete/${customerId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSuccess('Customer deleted successfully');
      fetchCustomers(currentPage);
      setSelectedCustomer(null);
      setView('list');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete customer');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToList = () => {
    setSelectedCustomer(null);
    setView('list');
  };

  const handleEditCustomer = () => setView('edit');
  const handleViewAppointments = () => setView('appointments');

  // Get current time to display greeting
  const getCurrentTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <Container maxWidth="xl" sx={{ mt: { xs: 2, md: 4 } }}>
      {/* Alert Messages */}
      <Snackbar
        open={!!error || !!success}
        autoHideDuration={4000}
        onClose={() => {
          setError(null);
          setSuccess(null);
        }}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          severity={error ? 'error' : 'success'}
          sx={{ 
            width: '100%',
            fontFamily: "'Poppins', 'Roboto', sans-serif",
            bgcolor: error ? '#FFE8E8' : '#E6F4EA',
            color: error ? '#D32F2F' : '#2E7D32',
          }}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setError(null);
                setSuccess(null);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
        >
          {error || success}
        </Alert>
      </Snackbar>

      {/* Header Paper */}
      <Paper 
        elevation={0}
        sx={{ 
          borderRadius: '8px',
          overflow: 'hidden',
          border: '1px solid rgba(190, 175, 155, 0.2)',
          mb: 4,
          background: 'linear-gradient(to right, rgba(190, 175, 155, 0.1), rgba(255, 255, 255, 0.8))',
        }}
      >
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
            {view === 'list' ? 'Customer Management' : 
             view === 'detail' ? 'Customer Details' :
             view === 'edit' ? 'Edit Customer' : 'Customer Appointments'}
          </Typography>
          
          <Typography 
            variant="body1" 
            sx={{ 
              fontFamily: "'Poppins', 'Roboto', sans-serif",
              color: '#666',
              mb: 1
            }}
          >
            {getCurrentTimeGreeting()}, {adminName}. 
            {view === 'list' ? ' Manage your salon\'s customers here.' : ''}
          </Typography>

          {/* Breadcrumbs */}
          {view !== 'list' && (
            <Breadcrumbs 
              separator="›" 
              aria-label="breadcrumb"
              sx={{ 
                mt: 1, 
                fontFamily: "'Poppins', 'Roboto', sans-serif",
                '& .MuiBreadcrumbs-separator': {
                  mx: 1,
                  color: '#BEAF9B'
                }
              }}
            >
              <Link 
                color="inherit" 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  handleBackToList();
                }}
                sx={{ 
                  textDecoration: 'none',
                  color: '#BEAF9B',
                  '&:hover': {
                    textDecoration: 'underline',
                  }
                }}
              >
                Customers
              </Link>
              {selectedCustomer && (
                <Typography color="text.primary">
                  {selectedCustomer.firstname} {selectedCustomer.lastname}
                </Typography>
              )}
              {view === 'edit' && <Typography color="text.primary">Edit</Typography>}
              {view === 'appointments' && <Typography color="text.primary">Appointments</Typography>}
            </Breadcrumbs>
          )}
        </Box>
        
        {/* View: List */}
        {view === 'list' && (
          <CustomerList
            customers={customers}
            loading={loading}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            onSelectCustomer={handleSelectCustomer}
            onDeleteCustomer={handleDeleteCustomer}
            tableSx={{ 
              borderRadius: '8px',
              overflow: 'hidden',
            }}
            buttonSx={{
              edit: { color: '#BEAF9B' },
              delete: { color: '#ff6b6b' }
            }}
          />
        )}

        {/* View: Detail */}
        {view === 'detail' && selectedCustomer && (
          <Box sx={{ p: { xs: 2, md: 3 } }}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' }, 
              justifyContent: 'flex-end',
              gap: 2,
              mb: 3,
            }}>
              <StyledButton
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={handleEditCustomer}
              >
                Edit Customer
              </StyledButton>
              <StyledButton
                variant="outlined"
                startIcon={<EventNoteIcon />}
                onClick={handleViewAppointments}
              >
                View Appointments
              </StyledButton>
            </Box>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: '8px',
                border: '1px solid rgba(190, 175, 155, 0.2)',
              }}
            >
              <CustomerDetail
                customer={selectedCustomer}
                onResetPassword={handleResetPassword}
                onDeleteCustomer={handleDeleteCustomer}
                loading={loading}
              />
            </Paper>
          </Box>
        )}

        {/* View: Edit */}
        {view === 'edit' && selectedCustomer && (
          <Box sx={{ p: { xs: 2, md: 3 } }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: '8px',
                border: '1px solid rgba(190, 175, 155, 0.2)',
              }}
            >
              <CustomerForm 
                customer={selectedCustomer} 
                onSubmit={handleUpdateCustomer} 
                loading={loading} 
                buttonColor="#BEAF9B"
              />
            </Paper>
          </Box>
        )}

        {/* View: Appointments */}
        {view === 'appointments' && selectedCustomer && (
          <Box sx={{ p: { xs: 2, md: 3 } }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: '8px',
                border: '1px solid rgba(190, 175, 155, 0.2)',
              }}
            >
              <Typography 
                variant="h6" 
                sx={{ 
                  fontFamily: "'Poppins', 'Roboto', sans-serif",
                  fontWeight: 600,
                  color: '#453C33',
                  mb: 2
                }}
              >
                Appointments for {selectedCustomer.firstname} {selectedCustomer.lastname}
              </Typography>
              <CustomerAppointments 
                customerId={selectedCustomer.customer_ID} 
                tableSx={{ 
                  borderRadius: '8px',
                  overflow: 'hidden',
                }}
                buttonSx={{
                  edit: { color: '#BEAF9B' },
                  delete: { color: '#ff6b6b' }
                }}
              />
            </Paper>
          </Box>
        )}
        
      </Paper>
    </Container>
  );
};

export default CustomerManagement;