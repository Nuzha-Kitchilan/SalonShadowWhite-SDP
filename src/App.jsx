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


import React from "react";
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



import AppRoutes from "./pages/Routes";

function App() {
  return <AppRoutes />;
}

export default App;




