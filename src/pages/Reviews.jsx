import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Snackbar,
  Paper,
  useMediaQuery,
  useTheme,
  Tab,
  Tabs,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import PendingReviews from '../components/review/PendingReviews';
import ApprovedReviews from '../components/review/ApprovedReviews';
import { jwtDecode } from 'jwt-decode';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TabPanel from '../components/services/TabPanel'; // Assuming this component exists

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

const ReviewManagement = () => {
  const [tabValue, setTabValue] = useState(0);
  const [pendingReviews, setPendingReviews] = useState([]);
  const [approvedReviews, setApprovedReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [adminName, setAdminName] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleCloseSnackbar = () => setSnackbarOpen(false);

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
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication required');

      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      };

      // Fetch pending and approved reviews separately
      const pendingRes = await fetch('http://localhost:5001/api/review/pending', { headers });
      const approvedRes = await fetch('http://localhost:5001/api/review/approved', { headers });

      // Check responses
      if (!pendingRes.ok || !approvedRes.ok) {
        throw new Error('Failed to fetch reviews');
      }

      const pendingData = await pendingRes.json();
      const approvedData = await approvedRes.json();

      setPendingReviews(pendingData);
      setApprovedReviews(approvedData);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message || 'Failed to fetch reviews');
      if (err.message?.includes('Authentication')) {
        window.location.href = '/login';
      }
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (reviewId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication required');

      const res = await fetch(`http://localhost:5001/api/review/approve/${reviewId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const type = res.headers.get('content-type');
      if (!type?.includes('application/json')) throw new Error('Server returned non-JSON response');

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to approve review');

      setSnackbarMessage('Review approved successfully');
      setSnackbarOpen(true);
      fetchReviews();
    } catch (err) {
      console.error('Approve error:', err);
      setError(err.message);
      setSnackbarMessage(err.message || 'Failed to approve review');
      setSnackbarOpen(true);
    }
  };

  const handleDelete = async (reviewId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Authentication required');

      const res = await fetch(`http://localhost:5001/api/review/${reviewId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const type = res.headers.get('content-type');
      if (!type?.includes('application/json')) throw new Error('Server returned non-JSON response');

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to delete review');

      setSnackbarMessage('Review deleted successfully');
      setSnackbarOpen(true);
      fetchReviews();
    } catch (err) {
      console.error('Delete error:', err);
      setError(err.message);
      setSnackbarMessage(err.message || 'Failed to delete review');
      setSnackbarOpen(true);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleTabChange = (_, newValue) => setTabValue(newValue);

  // Get current time to display greeting
  const getCurrentTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <Container maxWidth="xl" sx={{ mt: { xs: 2, md: 4 } }}>
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
            Review Management
          </Typography>
          
          <Typography 
            variant="body1" 
            sx={{ 
              fontFamily: "'Poppins', 'Roboto', sans-serif",
              color: '#666',
              mb: 1
            }}
          >
            {getCurrentTimeGreeting()}, {adminName}. Manage customer reviews and feedback here.
          </Typography>
        </Box>

        {loading ? (
          <Box display="flex" justifyContent="center" p={4}>
            <CircularProgress sx={{ color: '#BEAF9B' }} />
          </Box>
        ) : error ? (
          <Box p={3}>
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          </Box>
        ) : (
          <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'rgba(190, 175, 155, 0.2)', px: { xs: 2, md: 3 } }}>
              <StyledTabs 
                value={tabValue} 
                onChange={handleTabChange} 
                aria-label="review management tabs"
                variant={isMobile ? "fullWidth" : "standard"}
              >
                <StyledTab 
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <ThumbUpIcon fontSize="small" />
                      <span>Pending Reviews ({pendingReviews.length})</span>
                    </Box>
                  } 
                  id="review-tab-0"
                  aria-controls="review-tabpanel-0"
                />
                <StyledTab 
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CheckCircleIcon fontSize="small" />
                      <span>Approved Reviews ({approvedReviews.length})</span>
                    </Box>
                  } 
                  id="review-tab-1"
                  aria-controls="review-tabpanel-1"
                />
              </StyledTabs>
            </Box>
            
            <TabPanel value={tabValue} index={0}>
              <PendingReviews
                reviews={pendingReviews}
                onApprove={handleApprove}
                onDelete={handleDelete}
                tableSx={{ 
                  borderRadius: '8px',
                  overflow: 'hidden',
                }}
                buttonSx={{
                  approve: { color: '#BEAF9B' },
                  delete: { color: '#ff6b6b' }
                }}
              />
            </TabPanel>
            
            <TabPanel value={tabValue} index={1}>
              <ApprovedReviews
                reviews={approvedReviews}
                onDelete={handleDelete}
                tableSx={{ 
                  borderRadius: '8px',
                  overflow: 'hidden',
                }}
                buttonSx={{
                  delete: { color: '#ff6b6b' }
                }}
              />
            </TabPanel>
          </Box>
        )}
      </Paper>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={error ? 'error' : 'success'}
          sx={{ 
            fontFamily: "'Poppins', 'Roboto', sans-serif",
            '& .MuiAlert-icon': {
              color: error ? undefined : '#BEAF9B'
            }
          }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ReviewManagement;