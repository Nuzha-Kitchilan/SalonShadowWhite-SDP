{/*import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppRoutes from "./pages/Routes";
import Login from "./auth/Login";
import ProtectedRoute from "./auth/ProtectedRoute"; // Add this import

const App = () => {
  return (
    <Router>
      <Routes>
        
        <Route path="/login" element={<Login />} />
        
        
        <Route 
          path="/*" 
          element={
            <ProtectedRoute>
              <AppRoutes />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
};

export default App; */}


//import React from "react";
//import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
//import Layout from "./components/Layout";
//import {AllApt, Applications,CancelReq, Dashboard, Reviews, Services, Stylists, Gallery, Reports, Inventory}  from './pages/Container';

//import Header from "./components/Header"; // Make sure this path is correct
//import Layout from "./components/Layout";
//import Inventory from "./components/Inventory";
 //import Stylists from "./pages/Stylists";
//import Services from "./components/Services";
//import Login from "./components/Login";

//const App = () => {
  
  //return (
    //<Layout>
      //<Stylists/>
    //</Layout> 
  //);
//};

//export default App;



//import AppRoutes from "./pages/Routes";

//function App() {
  //return <AppRoutes />;
//}

//export default App;


// import { BrowserRouter } from "react-router-dom";
// import AppRoutes from "./pages/Routes"



// function App() {
//   return (
//     <BrowserRouter>
//       <AppRoutes />
//     </BrowserRouter>
//   );
// }

// export default App;






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
