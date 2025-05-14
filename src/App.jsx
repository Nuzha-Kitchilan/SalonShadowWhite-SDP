import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./components/MainLayout";
import Home from "./pages/Home";
import Services from "./pages/Services";
import Gallery from "./pages/Gallery";
import Stylists from "./pages/Stylists";
import Contact from "./pages/Contact";
import Careers from "./pages/Careers";
import Book from "./pages/Book";
import Login from "./pages/Login"; 
import Register from "./pages/Register"; 
import Profile from "./pages/Profile";
import ForgotPassword from "./pages/ForgotPassword";
import HairServices from "./pages/HairServices";
import NailServices from "./pages/NailServices";
import FacialServicesPage from "./pages/FaceService";
import BodyService from "./pages/BodyService";
import MakeupService from "./pages/MakeUpService";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="services" element={<Services />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="stylists" element={<Stylists />} />
          <Route path="contact" element={<Contact />} />
          <Route path="careers" element={<Careers />} />
          <Route path="book" element={<Book />} />
          <Route path="profile" element={<Profile />} />
          <Route path="services/hair" element={<HairServices />} />
          <Route path="services/nails" element={<NailServices />} />
          <Route path="services/face" element={<FacialServicesPage />} />
          <Route path="services/body" element={<BodyService />} />
          <Route path="services/makeup" element={<MakeupService />} />
        </Route>
        <Route path="/login" element={<Login />} /> 
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

      </Routes>
    </Router>
  );
}

export default App;
