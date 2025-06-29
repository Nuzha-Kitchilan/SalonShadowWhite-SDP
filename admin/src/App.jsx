import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./pages/Routes";
import { AuthProvider } from "./auth/AuthContext";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import axios from 'axios';

// Set the base URL for all requests
axios.defaults.baseURL = 'http://localhost:5001/api';

// Attach the JWT token to every request automatically
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <AppRoutes />
        </LocalizationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
