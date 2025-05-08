import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Box
} from '@mui/material';
import axios from 'axios';

const ServiceForm = ({ open, onClose, service, categories, adminId, refreshData }) => {
  const [formData, setFormData] = useState({
    service_name: '',
    category_id: '',
    time_duration: '',
    price: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localCategories, setLocalCategories] = useState(categories || []);
  const [loading, setLoading] = useState(false);

  // Fetch categories if needed
  useEffect(() => {
    async function fetchCategories() {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:5001/api/categories');
        setLocalCategories(response.data);
        // Update form with first category if we're adding a new service
        if (!service && response.data.length > 0) {
          setFormData(prev => ({
            ...prev,
            category_id: response.data[0].category_id
          }));
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    }

    if (open && (!categories || categories.length === 0)) {
      fetchCategories();
    } else if (open) {
      setLocalCategories(categories);
    }
  }, [open, categories, service]);

  // Reset form when opening/closing or when service prop changes
  useEffect(() => {
    if (open) {
      if (service) {
        // Edit mode
        setFormData({
          service_name: service.service_name,
          category_id: service.category_id,
          time_duration: service.time_duration,
          price: service.price,
          description: service.description || ''
        });
      } else {
        // Add mode - initialize with first category if available
        setFormData({
          service_name: '',
          category_id: localCategories.length > 0 ? localCategories[0].category_id : '',
          time_duration: '',
          price: '',
          description: ''
        });
      }
    }
  }, [open, service, localCategories]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.service_name || !formData.category_id || 
        !formData.time_duration || !formData.price) {
      alert('Please fill all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const serviceData = {
        ...formData,
        time_duration: parseInt(formData.time_duration, 10),
        price: parseFloat(formData.price),
        admin_id: adminId
      };

      if (service) {
        // Update existing service
        await axios.put(`http://localhost:5001/api/services/${service.service_id}`, serviceData);
      } else {
        // Add new service
        await axios.post('http://localhost:5001/api/services', serviceData);
      }

      refreshData();
      onClose();
    } catch (error) {
      console.error('Error saving service:', error);
      alert(`Error: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{service ? 'Edit Service' : 'Add New Service'}</DialogTitle>
      <DialogContent>
        {loading ? (
          <Box display="flex" justifyContent="center" my={3}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <TextField
              name="service_name"
              label="Service Name"
              fullWidth
              margin="normal"
              value={formData.service_name}
              onChange={handleChange}
              required
            />

            <FormControl fullWidth margin="normal" required>
              <InputLabel>Category</InputLabel>
              <Select
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                label="Category"
                disabled={localCategories.length === 0}
              >
                {localCategories.length === 0 ? (
                  <MenuItem value="">No categories available</MenuItem>
                ) : (
                  localCategories.map(category => (
                    <MenuItem key={category.category_id} value={category.category_id}>
                      {category.category_name}
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>

            <TextField
              name="time_duration"
              label="Duration (minutes)"
              type="number"
              fullWidth
              margin="normal"
              value={formData.time_duration}
              onChange={handleChange}
              required
            />

            <TextField
              name="price"
              label="Price"
              type="number"
              fullWidth
              margin="normal"
              value={formData.price}
              onChange={handleChange}
              required
              inputProps={{ step: "0.01" }}
            />

            <TextField
              name="description"
              label="Description"
              fullWidth
              margin="normal"
              multiline
              rows={3}
              value={formData.description}
              onChange={handleChange}
            />
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isSubmitting || loading}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          color="primary" 
          disabled={isSubmitting || loading || localCategories.length === 0}
        >
          {isSubmitting ? 'Saving...' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ServiceForm;