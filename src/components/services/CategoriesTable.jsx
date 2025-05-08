// import React, { useState, useEffect } from 'react';
// import { 
//   Table, TableHead, TableBody, TableRow, TableCell, 
//   TableContainer, Paper, IconButton, Button 
// } from '@mui/material';
// import { Edit, Delete } from '@mui/icons-material';
// import axios from 'axios';
// import CategoryForm from './CategoryForm';
// import DeleteDialog from '../DeleteDialog';

// const CategoriesTable = ({ categories, setCategories, adminId }) => {
//   const [openForm, setOpenForm] = useState(false);
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
//   const [loading, setLoading] = useState(true);

//   // Add this function
//   const fetchCategories = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.get('http://localhost:5001/api/categories');
//       setCategories(response.data || []);
//     } catch (error) {
//       console.error("Error fetching categories:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Add this useEffect
//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   const handleDeleteCategory = async () => {
//     if (!selectedCategory) return;
//     try {
//       await axios.delete(`http://localhost:5001/api/categories/${selectedCategory.category_id}`);
//       await fetchCategories(); // Refresh the list
//     } catch (error) {
//       console.error("Error deleting category:", error);
//     } finally {
//       setOpenDeleteDialog(false);
//     }
//   };

//   if (loading) return <div>Loading...</div>;

//   return (
//     <>
//       <Button onClick={() => setOpenForm(true)}>
//         + Add Category
//       </Button>

//       <TableContainer component={Paper}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>Category ID</TableCell>
//               <TableCell>Category Name</TableCell>
//               <TableCell>Actions</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {categories.map((category) => (
//               <TableRow key={category.category_id}>
//                 <TableCell>{category.category_id}</TableCell>
//                 <TableCell>{category.category_name}</TableCell>
//                 <TableCell>
//                   <IconButton onClick={() => {
//                     setSelectedCategory(category);
//                     setOpenForm(true);
//                   }}>
//                     <Edit />
//                   </IconButton>
//                   <IconButton onClick={() => {
//                     setSelectedCategory(category);
//                     setOpenDeleteDialog(true);
//                   }}>
//                     <Delete />
//                   </IconButton>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       <CategoryForm 
//         open={openForm}
//         onClose={() => {
//           setOpenForm(false);
//           setSelectedCategory(null);
//         }}
//         category={selectedCategory}
//         adminId={adminId}
//         refreshData={fetchCategories} // Pass the function
//       />

//       <DeleteDialog 
//         open={openDeleteDialog}
//         onClose={() => setOpenDeleteDialog(false)}
//         onConfirm={handleDeleteCategory}
//         title="Confirm Category Delete"
//         message="Are you sure you want to delete this category?"
//       />
//     </>
//   );
// };

// export default CategoriesTable;

















import React, { useState, useEffect } from 'react';
import { 
  Table, TableHead, TableBody, TableRow, TableCell, 
  TableContainer, Paper, IconButton, Button, Box,
  Typography, CircularProgress
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import axios from 'axios';
import CategoryForm from './CategoryForm';
import DeleteDialog from '../DeleteDialog';

const CategoriesTable = ({ categories, setCategories, adminId }) => {
  const [openForm, setOpenForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [loading, setLoading] = useState(true);

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

  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3 
      }}>
        <Typography 
          variant="h5" 
          sx={{ 
            fontFamily: "'Poppins', 'Roboto', sans-serif",
            fontWeight: 600,
            color: "#453C33"
          }}
        >
          Categories Management
        </Typography>
        <Button
          onClick={() => setOpenForm(true)}
          variant="contained"
          startIcon={<Add />}
          sx={{ 
            backgroundColor: "#BEAF9B",
            color: "#fff",
            fontFamily: "'Poppins', 'Roboto', sans-serif",
            fontWeight: 500,
            borderRadius: "8px",
            padding: "8px 16px",
            boxShadow: "0 4px 10px rgba(190, 175, 155, 0.3)",
            transition: "all 0.3s ease",
            "&:hover": {
              backgroundColor: "#A89683",
              boxShadow: "0 6px 12px rgba(190, 175, 155, 0.4)",
            },
          }}
        >
          Add Category
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress sx={{ color: "#BEAF9B" }} />
        </Box>
      ) : (
        <TableContainer 
          component={Paper} 
          sx={{ 
            borderRadius: "10px",
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
            overflow: 'hidden'
          }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ 
                backgroundColor: "rgba(190, 175, 155, 0.05)",
                borderBottom: "1px solid rgba(190, 175, 155, 0.2)"
              }}>
                <TableCell sx={{ 
                  fontFamily: "'Poppins', 'Roboto', sans-serif",
                  fontWeight: 600,
                  color: "#453C33",
                  py: 2
                }}>Category ID</TableCell>
                <TableCell sx={{ 
                  fontFamily: "'Poppins', 'Roboto', sans-serif",
                  fontWeight: 600,
                  color: "#453C33",
                  py: 2
                }}>Category Name</TableCell>
                <TableCell sx={{ 
                  fontFamily: "'Poppins', 'Roboto', sans-serif",
                  fontWeight: 600,
                  color: "#453C33",
                  py: 2
                }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.length > 0 ? (
                categories.map((category) => (
                  <TableRow 
                    key={category.category_id}
                    sx={{ 
                      '&:hover': { 
                        backgroundColor: 'rgba(190, 175, 155, 0.05)' 
                      },
                      transition: 'background-color 0.2s'
                    }}
                  >
                    <TableCell sx={{ 
                      fontFamily: "'Poppins', 'Roboto', sans-serif",
                      color: '#666'
                    }}>{category.category_id}</TableCell>
                    <TableCell sx={{ 
                      fontFamily: "'Poppins', 'Roboto', sans-serif",
                      color: '#453C33'
                    }}>{category.category_name}</TableCell>
                    <TableCell>
                      <IconButton 
                        onClick={() => {
                          setSelectedCategory(category);
                          setOpenForm(true);
                        }}
                        sx={{ 
                          color: '#BEAF9B',
                          '&:hover': { color: '#A89683' }
                        }}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton 
                        onClick={() => {
                          setSelectedCategory(category);
                          setOpenDeleteDialog(true);
                        }}
                        sx={{ 
                          color: '#d32f2f',
                          '&:hover': { color: '#b71c1c' }
                        }}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} sx={{ textAlign: 'center', py: 3 }}>
                    <Typography variant="body1" sx={{ 
                      fontFamily: "'Poppins', 'Roboto', sans-serif",
                      color: '#888'
                    }}>
                      No categories found. Add a category to get started.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <CategoryForm 
        open={openForm}
        onClose={() => {
          setOpenForm(false);
          setSelectedCategory(null);
        }}
        category={selectedCategory}
        adminId={adminId}
        refreshData={fetchCategories}
      />

      <DeleteDialog 
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onConfirm={handleDeleteCategory}
        title="Confirm Category Delete"
        message="Are you sure you want to delete this category?"
      />
    </Box>
  );
};

export default CategoriesTable;