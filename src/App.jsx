import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./components/MainLayout";
import Home from "./pages/Home";
import Services from "./pages/Services";
import Gallery from "./pages/Gallery";
import Stylists from "./pages/Stylists";
import Contact from "./pages/Contact";
import Join from "./pages/Join";
import Book from "./pages/Book";
import Login from "./pages/Login"; 
import Register from "./pages/Register"; 
import Profile from "./pages/Profile";



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
          <Route path="join" element={<Join />} />
          <Route path="book" element={<Book />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        <Route path="/login" element={<Login />} /> 
        <Route path="/register" element={<Register />} />

      </Routes>
    </Router>
  );
}

export default App;
