// src/utils/axiosWithAuth.js
import axios from 'axios';

// Create an Axios instance with default configuration
const axiosWithAuth = axios.create({
  baseURL: 'http://localhost:5001/api', // Your backend API base URL
  timeout: 10000, // Request timeout in milliseconds
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add a request interceptor to include the auth token
axiosWithAuth.interceptors.request.use(
  (config) => {
    // Get the token from wherever you store it (localStorage, sessionStorage, etc.)
    const token = localStorage.getItem('token'); // or sessionStorage
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
axiosWithAuth.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle specific error statuses
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // Token expired or invalid - redirect to login
          window.location.href = '/login';
          break;
        case 403:
          // Forbidden - insufficient permissions
          console.error('Forbidden: ', error.response.data.message);
          break;
        case 404:
          // Not found
          console.error('Not found: ', error.response.config.url);
          break;
        case 500:
          // Server error
          console.error('Server error: ', error.response.data.message);
          break;
        default:
          console.error('Error: ', error.response.data.message);
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received: ', error.request);
    } else {
      // Something happened in setting up the request
      console.error('Request error: ', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default axiosWithAuth;