import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField
} from '@mui/material';
import axios from 'axios';

const CategoryForm = ({ open, onClose, category, adminId, refreshData }) => {
  const [formData, setFormData] = useState({ category_name: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when opening/closing or when category prop changes
  useEffect(() => {
    if (open) {
      if (category) {
        // Edit mode
        setFormData({ category_name: category.category_name });
      } else {
        // Add mode
        setFormData({ category_name: '' });
      }
    }
  }, [open, category]);

  const handleChange = (e) => {
    setFormData({ category_name: e.target.value });
  };

  const handleSubmit = async () => {
    if (!formData.category_name.trim()) {
      alert('Category name is required');
      return;
    }

    setIsSubmitting(true);
    try {
      const categoryData = {
        category_name: formData.category_name,
        admin_id: adminId
      };

      if (category) {
        // Update existing category
        await axios.put(`http://localhost:5001/api/categories/${category.category_id}`, categoryData);
      } else {
        // Add new category
        await axios.post('http://localhost:5001/api/categories', categoryData);
      }

      refreshData();
      onClose();
    } catch (error) {
      console.error('Error saving category:', error);
      alert(`Error: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{category ? 'Edit Category' : 'Add New Category'}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Category Name"
          type="text"
          fullWidth
          variant="outlined"
          value={formData.category_name}
          onChange={handleChange}
          required
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

export default CategoryForm;