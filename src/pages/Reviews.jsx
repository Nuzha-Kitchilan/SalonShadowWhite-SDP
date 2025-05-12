import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Tabs,
  Tab,
  Box,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import PendingReviews from '../components/review/PendingReviews';
import ApprovedReviews from '../components/review/ApprovedReviews';

const ReviewManagement = () => {
  const [tabValue, setTabValue] = useState(0);
  const [pendingReviews, setPendingReviews] = useState([]);
  const [approvedReviews, setApprovedReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleCloseSnackbar = () => setSnackbarOpen(false);

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

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Review Management
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ my: 2 }}>
          {error}
        </Alert>
      ) : (
        <>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="review tabs" sx={{ mb: 2 }}>
            <Tab label={`Pending Reviews (${pendingReviews.length})`} />
            <Tab label={`Approved Reviews (${approvedReviews.length})`} />
          </Tabs>

          <Box>
            {tabValue === 0 && (
              <PendingReviews
                reviews={pendingReviews}
                onApprove={handleApprove}
                onDelete={handleDelete}
              />
            )}
            {tabValue === 1 && (
              <ApprovedReviews
                reviews={approvedReviews}
                onDelete={handleDelete}
              />
            )}
          </Box>
        </>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={error ? 'error' : 'success'}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ReviewManagement;
