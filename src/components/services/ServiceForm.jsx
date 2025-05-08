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
  Box,
  IconButton,
  Typography
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SpaIcon from '@mui/icons-material/Spa';
import CategoryIcon from '@mui/icons-material/Category';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import DescriptionIcon from '@mui/icons-material/Description';
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
    <Dialog 
      open={open} 
      onClose={() => !isSubmitting && onClose()} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "10px",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)"
        }
      }}
    >
      <DialogTitle 
        sx={{ 
          bgcolor: "rgba(190, 175, 155, 0.05)", 
          fontFamily: "'Poppins', 'Roboto', sans-serif",
          fontWeight: 600,
          color: "#453C33",
          borderBottom: "1px solid rgba(190, 175, 155, 0.2)",
          position: 'relative',
          pb: 2
        }}
      >
        {service ? 'Edit Service' : 'Add New Service'}
        <IconButton
          aria-label="close"
          onClick={() => !isSubmitting && onClose()}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: '#888',
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 3, mt: 1 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" my={3}>
            <CircularProgress sx={{ color: "#BEAF9B" }} />
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
              InputProps={{
                startAdornment: (
                  <SpaIcon sx={{ color: "#BEAF9B", mr: 1 }} />
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: '#BEAF9B',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: "#666",
                  fontFamily: "'Poppins', 'Roboto', sans-serif"
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#BEAF9B',
                },
              }}
            />

            <FormControl 
              fullWidth 
              margin="normal" 
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: '#BEAF9B',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: "#666",
                  fontFamily: "'Poppins', 'Roboto', sans-serif"
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#BEAF9B',
                },
              }}
            >
              <InputLabel>Category</InputLabel>
              <Select
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                label="Category"
                disabled={localCategories.length === 0}
                startAdornment={<CategoryIcon sx={{ color: "#BEAF9B", mr: 1 }} />}
                sx={{
                  fontFamily: "'Poppins', 'Roboto', sans-serif",
                  "& .MuiMenuItem-root": {
                    fontFamily: "'Poppins', 'Roboto', sans-serif"
                  }
                }}
              >
                {localCategories.length === 0 ? (
                  <MenuItem value="" sx={{ fontFamily: "'Poppins', 'Roboto', sans-serif" }}>
                    No categories available
                  </MenuItem>
                ) : (
                  localCategories.map(category => (
                    <MenuItem 
                      key={category.category_id} 
                      value={category.category_id}
                      sx={{ fontFamily: "'Poppins', 'Roboto', sans-serif" }}
                    >
                      {category.category_name}
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>

            <Box 
              sx={{ 
                display: 'flex', 
                gap: 2, 
                flexDirection: { xs: 'column', sm: 'row' }
              }}
            >
              <TextField
                name="time_duration"
                label="Duration (minutes)"
                type="number"
                fullWidth
                margin="normal"
                value={formData.time_duration}
                onChange={handleChange}
                required
                InputProps={{
                  startAdornment: (
                    <AccessTimeIcon sx={{ color: "#BEAF9B", mr: 1 }} />
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: '#BEAF9B',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: "#666",
                    fontFamily: "'Poppins', 'Roboto', sans-serif"
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#BEAF9B',
                  },
                }}
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
                InputProps={{
                  startAdornment: (
                    <AttachMoneyIcon sx={{ color: "#BEAF9B", mr: 1 }} />
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: '#BEAF9B',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: "#666",
                    fontFamily: "'Poppins', 'Roboto', sans-serif"
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#BEAF9B',
                  },
                }}
              />
            </Box>

            <TextField
              name="description"
              label="Description"
              fullWidth
              margin="normal"
              multiline
              rows={3}
              value={formData.description}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <DescriptionIcon sx={{ color: "#BEAF9B", mr: 1, alignSelf: 'flex-start', mt: 1 }} />
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: '#BEAF9B',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: "#666",
                  fontFamily: "'Poppins', 'Roboto', sans-serif"
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: '#BEAF9B',
                },
              }}
            />
          </>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2, px: 3, borderTop: "1px solid rgba(190, 175, 155, 0.2)" }}>
        <Button 
          onClick={onClose} 
          disabled={isSubmitting || loading}
          sx={{ 
            color: "#888",
            fontFamily: "'Poppins', 'Roboto', sans-serif",
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.04)"
            }
          }}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          disabled={isSubmitting || loading || localCategories.length === 0}
          variant="contained"
          startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
          sx={{ 
            backgroundColor: "#BEAF9B",
            color: "#fff",
            fontFamily: "'Poppins', 'Roboto', sans-serif",
            fontWeight: 500,
            borderRadius: "8px",
            padding: "10px 24px",
            boxShadow: "0 4px 10px rgba(190, 175, 155, 0.3)",
            transition: "all 0.3s ease",
            "&:hover": {
              backgroundColor: "#A89683",
              boxShadow: "0 6px 12px rgba(190, 175, 155, 0.4)",
            },
            "&:disabled": {
              backgroundColor: "rgba(190, 175, 155, 0.5)",
            }
          }}
        >
          {isSubmitting ? 'Saving...' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ServiceForm;