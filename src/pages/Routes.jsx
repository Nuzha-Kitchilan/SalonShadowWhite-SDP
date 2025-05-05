














// import { Routes, Route, Navigate } from "react-router-dom";
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
// import WorkingHours from "./WorkingHours";
// import Layout from "../components/Layout";
// import Login from "../auth/Login";
// import ForgotPassword from "../auth/ForgotPassword";
// import Register from "../auth/Register";
// import ProtectedRoute from "../auth/ProtectedRoute";
// import SpecialReq from "./SpecialReq";
// import Profile from "./Profile";
// import Unauthorized from "../auth/Unauthorized";

// const AppRoutes = () => {
//   return (
//     <Routes>
//       {/* Public routes */}
//       <Route path="/login" element={<Login />} />
//       <Route path="/forgot-password" element={<ForgotPassword />} />
//       <Route path="/register" element={<Register />} />
//       <Route path="/unauthorized" element={<Unauthorized />} />

//       {/* Common protected routes (all authenticated users) */}
//       <Route element={<ProtectedRoute />}>
//         <Route element={<Layout />}>
//           <Route index element={<Dashboard />} />
//           <Route path="/reports" element={<Reports />} />
//           <Route path="/todayapt" element={<TodayApt />} />
//         </Route>
//       </Route>

//       {/* Admin-only protected routes */}
//       <Route element={<ProtectedRoute adminOnly />}>
//         <Route element={<Layout />}>
//           <Route path="/services" element={<Services />} />
//           <Route path="/gallery" element={<Gallery />} />
//           <Route path="/reviews" element={<Reviews />} />
//           <Route path="/inventory" element={<Inventory />} />
//           <Route path="/stylists" element={<Stylists />} />
//           <Route path="/applications" element={<Applications />} />
//           <Route path="/allapt" element={<AllApt />} />
//           <Route path="/cancelreq" element={<CancelReq />} />
//           <Route path="/workinghours" element={<WorkingHours />} />
//           <Route path="/specialreq" element={<SpecialReq />} />
//           <Route path="/profile" element={<Profile />} />
//         </Route>
//       </Route>

//       {/* Fallback routes */}
//       <Route path="/" element={<Navigate to="/dashboard" />} />
//       <Route path="*" element={<Navigate to="/login" />} />
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
import WorkingHours from "./WorkingHours";
import Layout from "../components/Layout";
import Login from "../auth/Login";
import ForgotPassword from "../auth/ForgotPassword";
import Register from "../auth/Register";
import ProtectedRoute from "../auth/ProtectedRoute";
import SpecialReq from "./SpecialReq";
import Profile from "./Profile";
import Unauthorized from "../auth/Unauthorized";



const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/register" element={<Register />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Common protected routes (all authenticated users) */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="/todayapt" element={<TodayApt />} />
          <Route path="/reports" element={<Reports />} />
        </Route>
      </Route>

      {/* Admin-only protected routes */}
      <Route element={<ProtectedRoute adminOnly />}>
        <Route element={<Layout />}>
          <Route path="/services" element={<Services />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/stylists" element={<Stylists />} />
          <Route path="/applications" element={<Applications />} />
          <Route path="/allapt" element={<AllApt />} />
          <Route path="/cancelreq" element={<CancelReq />} />
          <Route path="/workinghours" element={<WorkingHours />} />
          <Route path="/specialreq" element={<SpecialReq />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>

      {/* Fallback routes */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;
