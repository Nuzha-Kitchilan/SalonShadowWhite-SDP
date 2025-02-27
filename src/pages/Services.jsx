import React, { useEffect, useState } from "react";
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
    category_id: categories.length > 0 ? categories[0].category_id : "",
    time_duration: "",
    price: ""
  });

  const [categoryFilter, setCategoryFilter] = useState(""); // New state for category filter

  useEffect(() => {
    fetchServices(categoryFilter); // Fetch services with the filter applied
    fetchCategories();
  }, [categoryFilter]); // Fetch again whenever the category filter changes

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
      await axios.put(`http://localhost:5001/api/services/${editService.service_id}`, editService);
      fetchServices(categoryFilter);
      setOpenModal(false);
    } catch (error) {
      console.error("Error updating service:", error);
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
    }
  };

  // Handle Add Service Form submission
  const handleAddServiceSubmit = async () => {
    if (!newService.service_name || !newService.category_id || !newService.time_duration || !newService.price) {
      alert("All fields are required.");
      return;
    }

    try {
      await axios.post("http://localhost:5001/api/services", newService);
      fetchServices(categoryFilter);
      setAddServiceModalOpen(false);
    } catch (error) {
      console.error("Error adding service:", error);
    }
  };

  return (
    <Box sx={{ marginTop: "20px" }}>
      <Button
        variant="contained"
        sx={{ backgroundColor: "#FE8DA1", marginBottom: "20px", color: "#fff", '&:hover': { backgroundColor: "#fe6a9f" } }}
        onClick={() => setAddServiceModalOpen(true)}
      >
        + Add Service
      </Button>

      {/* Filter Category */}
      <FormControl fullWidth margin="normal">
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
            {services.map((service) => (
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
      {/* Add Service Modal */}
      <Modal open={addServiceModalOpen} onClose={() => {
        setAddServiceModalOpen(false);
        setNewService({
          service_name: "",
          category_id: "",
          time_duration: "",
          price: ""
        });
      }}>
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
            value={newService.time_duration} onChange={(e) => setNewService({ ...newService, time_duration: e.target.value })}
          />
          <TextField
            required
            fullWidth margin="normal" label="Price" name="price"
            value={newService.price} onChange={(e) => setNewService({ ...newService, price: e.target.value })}
          />
          <Button
            onClick={handleAddServiceSubmit}
            variant="contained" sx={{ mt: 2, backgroundColor: "#FE8DA1", color: "#fff" }}
          >
            Add Service
          </Button>
        </Box>
      </Modal>
      {/* Add Service Modal */}
      <Modal open={addServiceModalOpen} onClose={() => setAddServiceModalOpen(false)}>
        <Box sx={{
          position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
          width: 400, bgcolor: "background.paper", boxShadow: 24, p: 4, borderRadius: "10px"
        }}>
          <h2>Add Service</h2>
          <TextField
            fullWidth margin="normal" label="Service Name" name="service_name"
            value={newService.service_name} onChange={(e) => setNewService({ ...newService, service_name: e.target.value })}
          />
          <FormControl fullWidth margin="normal">
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
            fullWidth margin="normal" label="Duration (mins)" name="time_duration"
            value={newService.time_duration} onChange={(e) => setNewService({ ...newService, time_duration: e.target.value })}
          />
          <TextField
            fullWidth margin="normal" label="Price" name="price"
            value={newService.price} onChange={(e) => setNewService({ ...newService, price: e.target.value })}
          />
          <Button
            onClick={handleAddServiceSubmit}
            variant="contained" sx={{ mt: 2, backgroundColor: "#FE8DA1", color: "#fff" }}
          >
            Add Service
          </Button>
        </Box>
      </Modal>

      {/* Edit Service Modal */}
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
            value={editService.time_duration} onChange={(e) => setEditService({ ...editService, time_duration: e.target.value })}
          />
          <TextField
            fullWidth margin="normal" label="Price" name="price"
            value={editService.price} onChange={(e) => setEditService({ ...editService, price: e.target.value })}
          />
          <Button
            onClick={handleEditSubmit}
            variant="contained" sx={{ mt: 2, backgroundColor: "#FE8DA1", color: "#fff" }}
          >
            Update Service
          </Button>
        </Box>
      </Modal>

      {/* Delete Confirmation Dialog */}
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

export default Services;
