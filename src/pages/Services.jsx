{/*import React, { useEffect, useState } from "react";
import {
  Table, TableHead, TableBody, TableRow, TableCell, TableContainer,
  Paper, IconButton, TextField, Button, Modal, Box, Select, MenuItem, InputLabel,
  FormControl, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from "@mui/material";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const Services = () => {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [editService, setEditService] = useState({
    service_id: "",
    service_name: "",
    category_id: "",
    time_duration: "",
    price: ""
  });

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [addServiceModalOpen, setAddServiceModalOpen] = useState(false);
  const [newService, setNewService] = useState({
    service_name: "",
    category_id: "",
    time_duration: "",
    price: ""
  });

  const [categoryFilter, setCategoryFilter] = useState("");

  useEffect(() => {
    fetchServices(categoryFilter);
    fetchCategories();
  }, [categoryFilter]);

  const fetchServices = async (category = "") => {
    try {
      const url = category
        ? `http://localhost:5001/api/services?category=${category}`
        : "http://localhost:5001/api/services";
      const response = await axios.get(url);
      setServices(response.data);
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://localhost:5001/api/categories");
      setCategories(response.data);
      
      // Set default category if categories exist
      if (response.data.length > 0 && !newService.category_id) {
        setNewService(prev => ({
          ...prev,
          category_id: response.data[0].category_id
        }));
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  if (loading) return <div>Loading...</div>;

  // Handle edit click
  const handleEdit = (service) => {
    const matchingCategory = categories.find((cat) => cat.category_id === service.category_id);
    setEditService({
      ...service,
      category_id: matchingCategory ? matchingCategory.category_id : ""
    });
    setOpenModal(true);
  };

  // Handle edit form submission
  const handleEditSubmit = async () => {
    try {
      await axios.put(`http://localhost:5001/api/services/${editService.service_id}`, {
        ...editService,
        time_duration: parseInt(editService.time_duration, 10),
        price: parseFloat(editService.price)
      });
      fetchServices(categoryFilter);
      setOpenModal(false);
    } catch (error) {
      console.error("Error updating service:", error);
      alert(`Failed to update service: ${error.response ? error.response.data.message : error.message}`);
    }
  };

  // Handle delete
  const handleDeleteClick = (service) => {
    setSelectedService(service);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedService) return;
    try {
      await axios.delete(`http://localhost:5001/api/services/${selectedService.service_id}`);
      fetchServices(categoryFilter);
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting service:", error);
      alert(`Failed to delete service: ${error.response ? error.response.data.message : error.message}`);
    }
  };

  // Handle Add Service Form submission
  const handleAddServiceSubmit = async () => {
    if (!newService.service_name || !newService.category_id || !newService.time_duration || !newService.price) {
      alert("All fields are required.");
      return;
    }

    try {
      const serviceToAdd = {
        ...newService,
        time_duration: parseInt(newService.time_duration, 10),
        price: parseFloat(newService.price),
        admin_id: 1 // Replace with actual admin ID from authentication
      };

      await axios.post("http://localhost:5001/api/services", serviceToAdd);
      fetchServices(categoryFilter);
      setAddServiceModalOpen(false);
      
      // Reset the new service state
      setNewService({
        service_name: "",
        category_id: categories.length > 0 ? categories[0].category_id : "",
        time_duration: "",
        price: ""
      });
    } catch (error) {
      console.error("Error adding service:", error);
      alert(`Failed to add service: ${error.response ? error.response.data.message : error.message}`);
    }
  };

  // Reset new service modal when closed
  const handleAddServiceModalClose = () => {
    setAddServiceModalOpen(false);
    setNewService({
      service_name: "",
      category_id: categories.length > 0 ? categories[0].category_id : "",
      time_duration: "",
      price: ""
    });
  };

  // Filter services based on search term and category
  const filteredServices = services.filter((service) => 
    service.service_name.toLowerCase().includes(searchTerm.toLowerCase()) && 
    (categoryFilter === "" || service.category_name === categoryFilter)
  );

  return (
    <Box sx={{ marginTop: "20px" }}>
      <Button
        variant="contained"
        sx={{ backgroundColor: "#FE8DA1", marginBottom: "20px", color: "#fff", '&:hover': { backgroundColor: "#fe6a9f" } }}
        onClick={() => setAddServiceModalOpen(true)}
      >
        + Add Service
      </Button>

      //Search and Filter Container
      <Box sx={{ display: 'flex', gap: 2, marginBottom: 2 }}>
        //search Input
        <TextField
          fullWidth
          label="Search Services"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by service name"
        />

        // Category Filter 
        <FormControl fullWidth>
          <InputLabel>Filter by Category</InputLabel>
          <Select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <MenuItem value="">All Categories</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category.category_id} value={category.category_name}>
                {category.category_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Service ID</TableCell>
              <TableCell>Service Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredServices.map((service) => (
              <TableRow key={service.service_id}>
                <TableCell>{service.service_id}</TableCell>
                <TableCell>{service.service_name}</TableCell>
                <TableCell>{service.category_name}</TableCell>
                <TableCell>{service.time_duration}</TableCell>
                <TableCell>{service.price}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(service)} style={{ color: "green" }}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteClick(service)} style={{ color: "red" }}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      //Add Service Modal 
      <Modal open={addServiceModalOpen} onClose={handleAddServiceModalClose}>
        <Box sx={{
          position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
          width: 400, bgcolor: "background.paper", boxShadow: 24, p: 4, borderRadius: "10px"
        }}>
          <h2>Add Service</h2>
          <TextField
            required
            fullWidth margin="normal" label="Service Name" name="service_name"
            value={newService.service_name} onChange={(e) => setNewService({ ...newService, service_name: e.target.value })}
          />
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Category</InputLabel>
            <Select
              name="category_id"
              value={newService.category_id}
              onChange={(e) => setNewService({ ...newService, category_id: e.target.value })}
            >
              {categories.map((category) => (
                <MenuItem key={category.category_id} value={category.category_id}>
                  {category.category_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            required
            fullWidth margin="normal" label="Duration (mins)" name="time_duration"
            type="number"
            value={newService.time_duration} 
            onChange={(e) => setNewService({ ...newService, time_duration: e.target.value })}
          />
          <TextField
            required
            fullWidth margin="normal" label="Price" name="price"
            type="number"
            inputProps={{ step: "0.01" }}
            value={newService.price} 
            onChange={(e) => setNewService({ ...newService, price: e.target.value })}
          />
          <Button
            onClick={handleAddServiceSubmit}
            variant="contained" sx={{ mt: 2, backgroundColor: "#FE8DA1", color: "#fff" }}
          >
            Add Service
          </Button>
        </Box>
      </Modal>

      //Edit Service Modal 
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box sx={{
          position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
          width: 400, bgcolor: "background.paper", boxShadow: 24, p: 4, borderRadius: "10px"
        }}>
          <h2>Edit Service</h2>
          <TextField
            fullWidth margin="normal" label="Service Name" name="service_name"
            value={editService.service_name} onChange={(e) => setEditService({ ...editService, service_name: e.target.value })}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Category</InputLabel>
            <Select
              name="category_id"
              value={editService.category_id}
              onChange={(e) => setEditService({ ...editService, category_id: e.target.value })}
            >
              {categories.map((category) => (
                <MenuItem key={category.category_id} value={category.category_id}>
                  {category.category_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth margin="normal" label="Duration (mins)" name="time_duration"
            type="number"
            value={editService.time_duration} 
            onChange={(e) => setEditService({ ...editService, time_duration: e.target.value })}
          />
          <TextField
            fullWidth margin="normal" label="Price" name="price"
            type="number"
            inputProps={{ step: "0.01" }}
            value={editService.price} 
            onChange={(e) => setEditService({ ...editService, price: e.target.value })}
          />
          <Button
            onClick={handleEditSubmit}
            variant="contained" sx={{ mt: 2, backgroundColor: "#FE8DA1", color: "#fff" }}
          >
            Update Service
          </Button>
        </Box>
      </Modal>

      //Delete Confirmation Dialog 
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to permanently delete this item?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">No</Button>
          <Button onClick={handleDeleteConfirm} color="error">Yes</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Services; */}


// import React, { useEffect, useState } from "react";
// import {
//   Table, TableHead, TableBody, TableRow, TableCell, TableContainer,
//   Paper, IconButton, TextField, Button, Modal, Box, Select, MenuItem, InputLabel,
//   FormControl, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
// } from "@mui/material";
// import axios from "axios";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
// import { jwtDecode } from 'jwt-decode';  // Import jwt-decode to decode the token

// const Services = () => {
//   const [services, setServices] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [openModal, setOpenModal] = useState(false);
//   const [editService, setEditService] = useState({
//     service_id: "",
//     service_name: "",
//     category_id: "",
//     time_duration: "",
//     price: "",
//     description: ""
//   });

//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [selectedService, setSelectedService] = useState(null);
//   const [addServiceModalOpen, setAddServiceModalOpen] = useState(false);
//   const [newService, setNewService] = useState({
//     service_name: "",
//     category_id: "",
//     time_duration: "",
//     price: "",
//     description: ""
//   });

//   const [categoryFilter, setCategoryFilter] = useState("");
//   const [adminId, setAdminId] = useState(null);

//   useEffect(() => {
//     // Get admin ID from JWT token
//     const token = localStorage.getItem("token");
//     if (token) {
//       try {
//         const decodedToken = jwtDecode(token); // Fixed from jwt_decode to jwtDecode
//         setAdminId(decodedToken.id); // Assuming admin_id is stored in the token
//         console.log("Admin ID from token:", decodedToken.admin_id); // Add this for debugging
//       } catch (error) {
//         console.error("Error decoding token:", error);
//       }
//     }

//     fetchServices(categoryFilter);
//     fetchCategories();
//   }, [categoryFilter]);

//   const fetchServices = async (category = "") => {
//     try {
//       const url = category
//         ? `http://localhost:5001/api/services?category=${category}`
//         : "http://localhost:5001/api/services";
//       const response = await axios.get(url);
//       setServices(response.data);
//     } catch (error) {
//       console.error("Error fetching services:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchCategories = async () => {
//     try {
//       const response = await axios.get("http://localhost:5001/api/categories");
//       setCategories(response.data);
      
//       // Set default category if categories exist
//       if (response.data.length > 0 && !newService.category_id) {
//         setNewService(prev => ({
//           ...prev,
//           category_id: response.data[0].category_id
//         }));
//       }
//     } catch (error) {
//       console.error("Error fetching categories:", error);
//     }
//   };

//   if (loading) return <div>Loading...</div>;

//   // Handle edit click
//   const handleEdit = (service) => {
//     const matchingCategory = categories.find((cat) => cat.category_id === service.category_id);
//     setEditService({
//       ...service,
//       category_id: matchingCategory ? matchingCategory.category_id : ""
//     });
//     setOpenModal(true);
//   };

//   // Handle edit form submission
//   const handleEditSubmit = async () => {
//     console.log("Before submitting:", editService); // Debugging log
//     try {
//       await axios.put(`http://localhost:5001/api/services/${editService.service_id}`, {
//         ...editService,
//         time_duration: parseInt(editService.time_duration, 10),
//         price: parseFloat(editService.price),
//         description: editService.description || ""
//       });
//       fetchServices(categoryFilter);
//       setOpenModal(false);
//     } catch (error) {
//       console.error("Error updating service:", error);
//       alert(`Failed to update service: ${error.response ? error.response.data.message : error.message}`);
//     }
//   };

//   // Handle delete
//   const handleDeleteClick = (service) => {
//     setSelectedService(service);
//     setDeleteDialogOpen(true);
//   };

//   const handleDeleteConfirm = async () => {
//     if (!selectedService) return;
//     try {
//       await axios.delete(`http://localhost:5001/api/services/${selectedService.service_id}`);
//       fetchServices(categoryFilter);
//       setDeleteDialogOpen(false);
//     } catch (error) {
//       console.error("Error deleting service:", error);
//       alert(`Failed to delete service: ${error.response ? error.response.data.message : error.message}`);
//     }
//   };

//   // Handle Add Service Form submission
//   const handleAddServiceSubmit = async () => {
//     if (!newService.service_name || !newService.category_id || !newService.time_duration || !newService.price || !newService.description) {
//       alert("All fields are required.");
//       return;
//     }

//     if (!adminId) {
//       alert("Admin ID could not be retrieved from your token. Please log in again.");
//       return;
//     }

//     try {
//       const serviceToAdd = {
//         ...newService,
//         time_duration: parseInt(newService.time_duration, 10),
//         price: parseFloat(newService.price),
//         admin_id: adminId // Using the admin ID fetched from the token
//       };

//       console.log("Adding service with data:", serviceToAdd); // Debug log

//       const response = await axios.post("http://localhost:5001/api/services", serviceToAdd);
//       if (response.status === 200) {
//         fetchServices(categoryFilter);
//         setAddServiceModalOpen(false);
        
//         // Reset the new service state
//         setNewService({
//           service_name: "",
//           category_id: categories.length > 0 ? categories[0].category_id : "",
//           time_duration: "",
//           price: "",
//           description: ""
//         });
//       } else {
//         throw new Error("Failed to add service");
//       }
//     } catch (error) {
//       console.error("Error adding service:", error);
//       alert(`Failed to add service: ${error.response ? error.response.data.message : error.message}`);
//     }
//   };

//   // Reset new service modal when closed
//   const handleAddServiceModalClose = () => {
//     setAddServiceModalOpen(false);
//     setNewService({
//       service_name: "",
//       category_id: categories.length > 0 ? categories[0].category_id : "",
//       time_duration: "",
//       price: "",
//       description: ""
//     });
//   };

//   // Filter services based on search term and category
//   const filteredServices = services.filter((service) => 
//     service.service_name.toLowerCase().includes(searchTerm.toLowerCase()) && 
//     (categoryFilter === "" || service.category_name === categoryFilter)
//   );

//   const modalStyle = {
//     position: "absolute",
//     top: "50%",
//     left: "50%",
//     transform: "translate(-50%, -50%)",
//     backgroundColor: "white",
//     padding: "20px",
//     borderRadius: "8px",
//     boxShadow: 24,
//     width: 400,
//     maxHeight: "80vh",
//     overflowY: "auto"
//   };

//   return (
//     <Box sx={{ marginTop: "20px" }}>
//       <Button
//         variant="contained"
//         sx={{ backgroundColor: "#FE8DA1", marginBottom: "20px", color: "#fff", '&:hover': { backgroundColor: "#fe6a9f" } }}
//         onClick={() => setAddServiceModalOpen(true)}
//       >
//         + Add Service
//       </Button>

//       {/* Search and Filter Container */}
//       <Box sx={{ display: 'flex', gap: 2, marginBottom: 2 }}>
//         {/* Search Input */}
//         <TextField
//           fullWidth
//           label="Search Services"
//           variant="outlined"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           placeholder="Search by service name"
//         />

//         {/* Category Filter */}
//         <FormControl fullWidth>
//           <InputLabel>Filter by Category</InputLabel>
//           <Select
//             value={categoryFilter}
//             onChange={(e) => setCategoryFilter(e.target.value)}
//           >
//             <MenuItem value="">All Categories</MenuItem>
//             {categories.map((category) => (
//               <MenuItem key={category.category_id} value={category.category_name}>
//                 {category.category_name}
//               </MenuItem>
//             ))}
//           </Select>
//         </FormControl>
//       </Box>

//       <TableContainer component={Paper}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>Service ID</TableCell>
//               <TableCell>Service Name</TableCell>
//               <TableCell>Category</TableCell>
//               <TableCell>Duration</TableCell>
//               <TableCell>Price</TableCell>
//               <TableCell>Description</TableCell>
//               <TableCell>Actions</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {filteredServices.map((service) => (
//               <TableRow key={service.service_id}>
//                 <TableCell>{service.service_id}</TableCell>
//                 <TableCell>{service.service_name}</TableCell>
//                 <TableCell>{service.category_name}</TableCell>
//                 <TableCell>{service.time_duration}</TableCell>
//                 <TableCell>{service.price}</TableCell>
//                 <TableCell>{service.description}</TableCell>
//                 <TableCell>
//                   <IconButton onClick={() => handleEdit(service)} style={{ color: "green" }}>
//                     <EditIcon />
//                   </IconButton>
//                   <IconButton onClick={() => handleDeleteClick(service)} style={{ color: "red" }}>
//                     <DeleteIcon />
//                   </IconButton>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       {/* Edit Modal */}
//       <Modal open={openModal} onClose={() => setOpenModal(false)}>
//         <Box sx={modalStyle}>
//           <h2>Edit Service</h2>
//           <form onSubmit={(e) => {
//             e.preventDefault();
//             handleEditSubmit();
//           }}>
//             <TextField
//               label="Service Name"
//               fullWidth
//               value={editService.service_name}
//               onChange={(e) => setEditService({ ...editService, service_name: e.target.value })}
//               margin="normal"
//             />
//             <FormControl fullWidth margin="normal">
//               <InputLabel>Category</InputLabel>
//               <Select
//                 value={editService.category_id}
//                 onChange={(e) => setEditService({ ...editService, category_id: e.target.value })}
//               >
//                 {categories.map((category) => (
//                   <MenuItem key={category.category_id} value={category.category_id}>
//                     {category.category_name}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//             <TextField
//               label="Time Duration"
//               fullWidth
//               type="number"
//               value={editService.time_duration}
//               onChange={(e) => setEditService({ ...editService, time_duration: e.target.value })}
//               margin="normal"
//             />
//             <TextField
//               label="Price"
//               fullWidth
//               type="number"
//               value={editService.price}
//               onChange={(e) => setEditService({ ...editService, price: e.target.value })}
//               margin="normal"
//             />
//             <TextField
//               label="Description"
//               fullWidth
//               value={editService.description}
//               onChange={(e) => setEditService({ ...editService, description: e.target.value })}
//               margin="normal"
//             />
//             <Button variant="contained" color="primary" type="submit">
//               Save Changes
//             </Button>
//           </form>
//         </Box>
//       </Modal>

//       {/* Delete Confirmation Dialog */}
//       <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
//         <DialogTitle>Confirm Delete</DialogTitle>
//         <DialogContent>
//           <DialogContentText>
//             Are you sure you want to delete this service?
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setDeleteDialogOpen(false)} color="primary">Cancel</Button>
//           <Button onClick={handleDeleteConfirm} color="secondary">Delete</Button>
//         </DialogActions>
//       </Dialog>

//       {/* Add Service Modal */}
//       <Dialog open={addServiceModalOpen} onClose={handleAddServiceModalClose}>
//         <DialogTitle>Add New Service</DialogTitle>
//         <DialogContent>
//           <DialogContentText>
//             Fill in the details to add a new service.
//           </DialogContentText>
//           <TextField
//             label="Service Name"
//             fullWidth
//             value={newService.service_name}
//             onChange={(e) => setNewService({ ...newService, service_name: e.target.value })}
//             margin="normal"
//             required
//           />
//           <FormControl fullWidth margin="normal" required>
//             <InputLabel>Category</InputLabel>
//             <Select
//               value={newService.category_id}
//               onChange={(e) => setNewService({ ...newService, category_id: e.target.value })}
//             >
//               {categories.map((category) => (
//                 <MenuItem key={category.category_id} value={category.category_id}>
//                   {category.category_name}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>
//           <TextField
//             label="Time Duration"
//             fullWidth
//             type="number"
//             value={newService.time_duration}
//             onChange={(e) => setNewService({ ...newService, time_duration: e.target.value })}
//             margin="normal"
//             required
//           />
//           <TextField
//             label="Price"
//             fullWidth
//             type="number"
//             value={newService.price}
//             onChange={(e) => setNewService({ ...newService, price: e.target.value })}
//             margin="normal"
//             required
//           />
//           <TextField
//             label="Description"
//             fullWidth
//             value={newService.description}
//             onChange={(e) => setNewService({ ...newService, description: e.target.value })}
//             margin="normal"
//             required
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleAddServiceModalClose} color="primary">Cancel</Button>
//           <Button onClick={handleAddServiceSubmit} color="primary">Add Service</Button>
//         </DialogActions>
//       </Dialog>
//     </Box>
//   );
// };

// export default Services;













import React, { useState, useEffect } from 'react';
import { Box, Tab, Tabs } from '@mui/material';
import ServicesTable from '../components/services/ServicesTable';
import CategoriesTable from '../components/services/CategoriesTable';
import TabPanel from '../components/services/TabPanel';
import { jwtDecode } from 'jwt-decode';

const ServicesManagement = () => {
  const [tabValue, setTabValue] = useState(0);
  const [categories, setCategories] = useState([]);
  const [adminId, setAdminId] = useState(null);

  useEffect(() => {
    // Get admin ID from JWT token
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setAdminId(decodedToken.id);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ width: '100%', mt: 2 }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Services" />
          <Tab label="Categories" />
        </Tabs>
      </Box>
      
      <TabPanel value={tabValue} index={0}>
        <ServicesTable 
          categories={categories} 
          setCategories={setCategories}
          adminId={adminId}
        />
      </TabPanel>
      
      <TabPanel value={tabValue} index={1}>
        <CategoriesTable 
          categories={categories} 
          setCategories={setCategories}
          adminId={adminId}
        />
      </TabPanel>
    </Box>
  );
};

export default ServicesManagement;