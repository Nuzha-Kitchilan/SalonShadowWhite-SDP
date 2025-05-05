import React, { useState, useEffect } from 'react';
import { 
  Table, TableHead, TableBody, TableRow, TableCell, 
  TableContainer, Paper, IconButton, Button 
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import axios from 'axios';
import CategoryForm from './CategoryForm';
import DeleteDialog from '../DeleteDialog';

const CategoriesTable = ({ categories, setCategories, adminId }) => {
  const [openForm, setOpenForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [loading, setLoading] = useState(true);

  // Add this function
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5001/api/categories');
      setCategories(response.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  // Add this useEffect
  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDeleteCategory = async () => {
    if (!selectedCategory) return;
    try {
      await axios.delete(`http://localhost:5001/api/categories/${selectedCategory.category_id}`);
      await fetchCategories(); // Refresh the list
    } catch (error) {
      console.error("Error deleting category:", error);
    } finally {
      setOpenDeleteDialog(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <Button onClick={() => setOpenForm(true)}>
        + Add Category
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Category ID</TableCell>
              <TableCell>Category Name</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.category_id}>
                <TableCell>{category.category_id}</TableCell>
                <TableCell>{category.category_name}</TableCell>
                <TableCell>
                  <IconButton onClick={() => {
                    setSelectedCategory(category);
                    setOpenForm(true);
                  }}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => {
                    setSelectedCategory(category);
                    setOpenDeleteDialog(true);
                  }}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <CategoryForm 
        open={openForm}
        onClose={() => {
          setOpenForm(false);
          setSelectedCategory(null);
        }}
        category={selectedCategory}
        adminId={adminId}
        refreshData={fetchCategories} // Pass the function
      />

      <DeleteDialog 
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onConfirm={handleDeleteCategory}
        title="Confirm Category Delete"
        message="Are you sure you want to delete this category?"
      />
    </>
  );
};

export default CategoriesTable;