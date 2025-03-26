// import { Routes, Route } from "react-router-dom";
// import Dashboard from "./Dashboard";
// import Services from "./Services";
// import Gallery from "./Gallery";
// import Reviews from "./Reviews";
// import Inventory from "./Inventory";
// import Reports from "./Reports";
// import Stylists from "./Stylists";
// import Applications from "./Applications";
// import CancelReq from "./CancelReq";
// import AllApt from "./AllApt";
// import TodayApt from "./TodayApt";
// import Layout from "../components/Layout";
// import Login from "../auth/Login";
// import Register from "../auth/Register";

// const AppRoutes = () => {
//   return (
//     <Routes>
//       <Route path="/" element={<Login />}></Route>
//       <Route path="/register" element={<Register />} />

//       <Route element={<Layout />}>
//         <Route path="dashboard" element={<Dashboard />} />
//         <Route path="services" element={<Services />} />
//         <Route path="gallery" element={<Gallery />} />
//         <Route path="reviews" element={<Reviews />} />
//         <Route path="inventory" element={<Inventory />} />
//         <Route path="report" element={<Reports />} />
//         <Route path="stylists" element={<Stylists />} />
//         <Route path="applications" element={<Applications />} />
//         <Route path="cancel-requests" element={<CancelReq />} />
//         <Route path="appointments" element={<AllApt />} />
//         <Route path="today-appointments" element={<TodayApt />} />
//       </Route>
//       {/* </Route><Route path="/login" element={<Login />} /> */}
//     </Routes>
//   );
// };

// export default AppRoutes;


import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./Dashboard";
import Services from "./Services";
import Gallery from "./Gallery";
import Reviews from "./Reviews";
import Inventory from "./Inventory";
import Reports from "./Reports";
import Stylists from "./Stylists";
import Applications from "./Applications";
import CancelReq from "./CancelReq";
import AllApt from "./AllApt";
import TodayApt from "./TodayApt";
import Layout from "../components/Layout";
import Login from "../auth/Login";
import Register from "../auth/Register";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      {/* Register route with redirect */}
      <Route path="/register" element={
        <Register />
      } />
      
      {/* Add a redirect route that sends users back to login after registration */}
      <Route path="/register/success" element={<Navigate to="/login" />} />
      
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="services" element={<Services />} />
        <Route path="gallery" element={<Gallery />} />
        <Route path="reviews" element={<Reviews />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="reports" element={<Reports />} />
        <Route path="stylists" element={<Stylists />} />
        <Route path="applications" element={<Applications />} />
        <Route path="cancelreq" element={<CancelReq />} />
        <Route path="allapt" element={<AllApt />} />
        <Route path="todayapt" element={<TodayApt />} />
      </Route>
      
      {/* Default route - redirect to login */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};

export default AppRoutes;