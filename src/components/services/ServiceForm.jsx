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
  MenuItem
} from '@mui/material';

const ServiceForm = ({ open, onClose, service, categories, adminId, refreshData }) => {
  const [formData, setFormData] = useState({
    service_name: '',
    category_id: categories.length > 0 ? categories[0].category_id : '',
    time_duration: '',
    price: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        // Add mode
        setFormData({
          service_name: '',
          category_id: categories.length > 0 ? categories[0].category_id : '',
          time_duration: '',
          price: '',
          description: ''
        });
      }
    }
  }, [open, service, categories]);

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
          >
            {categories.map(category => (
              <MenuItem key={category.category_id} value={category.category_id}>
                {category.category_name}
              </MenuItem>
            ))}
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
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          color="primary" 
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ServiceForm;