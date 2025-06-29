import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography
} from '@mui/material';
import CategoryIcon from '@mui/icons-material/Category';
import axios from 'axios';

const CategoryForm = ({ open, onClose, category, adminId, refreshData }) => {
  const [formData, setFormData] = useState({ category_name: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      if (category) {
        setFormData({ category_name: category.category_name });
      } else {
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
        await axios.put(`http://localhost:5001/api/categories/${category.category_id}`, categoryData);
      } else {
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
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '12px',
          overflow: 'hidden',
          bgcolor: '#f9f5f0',
        }
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          p: 2,
          background: 'linear-gradient(to right, #f9f5f0, #ffffff)',
          borderBottom: '1px solid rgba(190, 175, 155, 0.3)',
          gap: 1,
        }}
      >
        <CategoryIcon sx={{ color: '#BEAF9B' }} />
        <Typography
          variant="h6"
          sx={{
            fontFamily: "'Poppins', 'Roboto', sans-serif",
            fontWeight: 500,
            color: '#453C33',
            letterSpacing: '0.3px'
          }}
        >
          {category ? 'Edit Category' : 'Add New Category'}
        </Typography>
      </Box>

      <DialogContent sx={{ p: 3 }}>
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
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'rgba(190, 175, 155, 0.3)',
              },
              '&:hover fieldset': {
                borderColor: 'rgba(190, 175, 155, 0.5)',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#BEAF9B',
              },
            },
            '& .MuiInputLabel-root': {
              color: '#453C33',
              fontFamily: "'Poppins', 'Roboto', sans-serif",
            },
          }}
        />
      </DialogContent>

      <DialogActions
        sx={{
          p: 2,
          bgcolor: '#fff',
          borderTop: '1px solid rgba(0, 0, 0, 0.08)',
          boxShadow: '0 -2px 8px rgba(0,0,0,0.03)',
          justifyContent: 'center',
          gap: 2,
        }}
      >
        <Button
          onClick={onClose}
          disabled={isSubmitting}
          sx={{
            color: '#BEAF9B',
            py: 1.2,
            px: 4,
            borderRadius: '8px',
            fontWeight: 500,
            letterSpacing: '0.5px',
            fontFamily: "'Poppins', 'Roboto', sans-serif",
            textTransform: 'none',
            fontSize: '1rem',
            border: '1px solid #BEAF9B',
            transition: 'all 0.3s ease',
            '&:hover': {
              background: 'rgba(190, 175, 155, 0.1)',
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          sx={{
            background: 'linear-gradient(to right, #BEAF9B, #D9CFC2)',
            color: '#fff',
            py: 1.2,
            px: 4,
            borderRadius: '8px',
            fontWeight: 500,
            letterSpacing: '0.5px',
            fontFamily: "'Poppins', 'Roboto', sans-serif",
            textTransform: 'none',
            fontSize: '1rem',
            boxShadow: '0 4px 8px rgba(190, 175, 155, 0.3)',
            transition: 'all 0.3s ease',
            '&:hover': {
              background: 'linear-gradient(to right, #b0a08d, #cec2b3)',
              boxShadow: '0 6px 12px rgba(190, 175, 155, 0.4)',
              transform: 'translateY(-2px)'
            },
          }}
        >
          {isSubmitting ? 'Saving...' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CategoryForm;
