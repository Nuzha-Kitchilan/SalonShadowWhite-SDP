import React from "react";
//import Header from "./components/Header"; // Make sure this path is correct
import Layout from "./components/Layout";
import Inventory from "./components/Inventory"; // Ensure this path is correct
//import Services from "./components/Services";
//import Login from "./components/Login";

const App = () => {
  
  return (
    <Layout>
      <Inventory/>
    </Layout> 
  );
};

export default App;