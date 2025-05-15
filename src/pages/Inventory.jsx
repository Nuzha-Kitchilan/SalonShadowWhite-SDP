// import React, { useEffect, useState } from "react";
// import {
//   Table, TableHead, TableBody, TableRow, TableCell, TableContainer,
//   Paper, IconButton, TextField, Button, Dialog, DialogActions, DialogContent, DialogContentText, Select, MenuItem, Box
// } from "@mui/material";
// import axios from "axios";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";

// const Inventory = () => {
//   const [inventory, setInventory] = useState([]);
//   const [filteredInventory, setFilteredInventory] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [openModal, setOpenModal] = useState(false);
//   const [editItem, setEditItem] = useState({
//     inventory_id: "",
//     product_name: "",
//     quantity: "",
//     price: "",
//     manufacture_date: "",
//     expire_date: "",
//     brand: "" 
//   });

//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [selectedItem, setSelectedItem] = useState(null);
//   const [addItemModalOpen, setAddItemModalOpen] = useState(false);
//   const [newItem, setNewItem] = useState({
//     product_name: "",
//     quantity: "",
//     price: "",
//     manufacture_date: "",
//     expire_date: "",
//     brand: "" 
//   });
  
//   const [brandFilter, setBrandFilter] = useState("");  // Brand filter state
//   const [productSearch, setProductSearch] = useState("");  // Product name search
//   const [minQuantity, setMinQuantity] = useState(""); // Min quantity search
//   const [maxQuantity, setMaxQuantity] = useState(""); // Max quantity search
  
//   useEffect(() => {
//     fetchInventory();
//   }, []);
  
//   useEffect(() => {
//     // Apply filters whenever inventory, brandFilter, productSearch or quantity changes
//     let filtered = inventory;

//     if (brandFilter) {
//       filtered = filtered.filter(item => item.brand === brandFilter);
//     }

//     if (productSearch) {
//       filtered = filtered.filter(item => item.product_name.toLowerCase().includes(productSearch.toLowerCase()));
//     }

//     if (minQuantity) {
//       filtered = filtered.filter(item => item.quantity >= minQuantity);
//     }

//     if (maxQuantity) {
//       filtered = filtered.filter(item => item.quantity <= maxQuantity);
//     }

//     setFilteredInventory(filtered);

//   }, [inventory, brandFilter, productSearch, minQuantity, maxQuantity]);

//   const fetchInventory = async () => {
//     try {
//       const response = await axios.get("/inventory");
//       setInventory(response.data);
//     } catch (error) {
//       console.error("Error fetching inventory:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return "N/A";
//     return new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short", day: "2-digit" }).format(new Date(dateString));
//   };

//   const handleEdit = (item) => {
//     setEditItem({
//       ...item,
//       manufacture_date: formatDateToInput(item.manufacture_date),
//       expire_date: formatDateToInput(item.expire_date),
//     });
//     setOpenModal(true);
//   };

//   const formatDateToInput = (dateString) => {
//     if (!dateString) return "";
//     const date = new Date(dateString);
//     return date.toISOString().split('T')[0];  
//   };

//   const handleEditSubmit = async () => {
//     if (!editItem.product_name || !editItem.quantity || !editItem.price || !editItem.manufacture_date || !editItem.expire_date || !editItem.brand) {
//       alert("All fields are required.");
//       return;
//     }

//     try {
//       const response = await axios.put(`/inventory/${editItem.inventory_id}`, editItem);
//       fetchInventory();
//       setOpenModal(false);
//     } catch (error) {
//       console.error("Error updating item:", error);
//     }
//   };

//   const handleDeleteClick = (item) => {
//     setSelectedItem(item);
//     setDeleteDialogOpen(true);
//   };

//   const handleDeleteConfirm = async () => {
//     if (!selectedItem) return;
//     try {
//       await axios.delete(`/inventory/${selectedItem.inventory_id}`);
//       fetchInventory();
//       setDeleteDialogOpen(false);
//     } catch (error) {
//       console.error("Error deleting item:", error);
//     }
//   };

//   const handleAddItemSubmit = async (event) => {
//     event.preventDefault();
    
//     // Ensure that the newItem object has all necessary fields
//     if (!newItem.product_name || !newItem.quantity || !newItem.price || !newItem.manufacture_date || !newItem.expire_date || !newItem.brand) {
//       alert("All fields are required.");
//       return;
//     }

//     const newItemToSubmit = {
//       product_name: newItem.product_name,
//       quantity: newItem.quantity,
//       price: newItem.price,
//       manufacture_date: newItem.manufacture_date,
//       expire_date: newItem.expire_date,
//       brand: newItem.brand,
//       admin_id: 1, // Ensure this is being passed from a logged-in admin context
//     };

//     try {
//       const response = await axios.post('/inventory', newItemToSubmit);
//       fetchInventory();  // Refresh inventory list after adding
//       setAddItemModalOpen(false);  // Close the modal
//     } catch (error) {
//       console.error('Error adding item:', error);
//     }
//   };

//   if (loading) return <div>Loading...</div>;

//   return (
//     <div style={{ marginTop: "20px" }}>
//       {/* Container for the Add Inventory button and search fields */}
//       <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, marginBottom: "20px" }}>
//         <Button
//           variant="contained"
//           sx={{ backgroundColor: "#FE8DA1", color: "#fff", '&:hover': { backgroundColor: "#fe6a9f" } }}
//           onClick={() => setAddItemModalOpen(true)}
//         >
//           + Add Inventory
//         </Button>

//         {/* Product name search */}
//         <TextField
//           label="Search by Product Name"
//           value={productSearch}
//           onChange={(e) => setProductSearch(e.target.value)}
//           sx={{ width: 220 }}
//         />

//         {/* Quantity range */}
//         <Box sx={{ display: 'flex', gap: 2 }}>
//           <TextField
//             label="Min Quantity"
//             type="number"
//             value={minQuantity}
//             onChange={(e) => setMinQuantity(e.target.value)}
//             sx={{ width: 150 }}
//           />
//           <TextField
//             label="Max Quantity"
//             type="number"
//             value={maxQuantity}
//             onChange={(e) => setMaxQuantity(e.target.value)}
//             sx={{ width: 150 }}
//           />
//         </Box>
//       </Box>

//       {/* Brand filter */}
//       <TextField
//         select
//         label="Filter by Brand"
//         value={brandFilter}
//         onChange={(e) => setBrandFilter(e.target.value)}
//         fullWidth
//         margin="normal"
//         sx={{ marginBottom: "20px", marginLeft: "10px" }}
//       >
//         <MenuItem value="">All Brands</MenuItem>
//         {Array.from(new Set(inventory.map(item => item.brand))).map((brand) => (
//           <MenuItem key={brand} value={brand}>{brand}</MenuItem>
//         ))}
//       </TextField>

//       <TableContainer component={Paper}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>ID</TableCell>
//               <TableCell>Product Name</TableCell>
//               <TableCell>Brand</TableCell> 
//               <TableCell>Quantity</TableCell>
//               <TableCell>Price</TableCell>
//               <TableCell>Manufacture Date</TableCell>
//               <TableCell>Expiration Date</TableCell>
//               <TableCell>Actions</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {filteredInventory.map((item) => (
//               <TableRow key={item.inventory_id}>
//                 <TableCell>{item.inventory_id}</TableCell>
//                 <TableCell>{item.product_name}</TableCell>
//                 <TableCell>{item.brand}</TableCell>
//                 <TableCell>{item.quantity}</TableCell>
//                 <TableCell>{item.price}</TableCell>
//                 <TableCell>{formatDate(item.manufacture_date)}</TableCell>
//                 <TableCell>{formatDate(item.expire_date)}</TableCell>
//                 <TableCell>
//                   <IconButton onClick={() => handleEdit(item)} style={{ color: "green" }}>
//                     <EditIcon />
//                   </IconButton>
//                   <IconButton onClick={() => handleDeleteClick(item)} style={{ color: "red" }}>
//                     <DeleteIcon />
//                   </IconButton>
//                 </TableCell>
//               </TableRow>
//             ))}
//           </TableBody>
//         </Table>
//       </TableContainer>

//       {/* Add/Edit Inventory Modal */}
//       <Dialog open={openModal} onClose={() => setOpenModal(false)}>
//         <DialogContent>
//           <TextField
//             label="Product Name"
//             value={editItem.product_name}
//             onChange={(e) => setEditItem({ ...editItem, product_name: e.target.value })}
//             fullWidth
//             margin="normal"
//           />
//           <TextField
//             label="Brand"
//             value={editItem.brand} 
//             onChange={(e) => setEditItem({ ...editItem, brand: e.target.value })}
//             fullWidth
//             margin="normal"
//           />
//           <TextField
//             label="Quantity"
//             type="number"
//             value={editItem.quantity}
//             onChange={(e) => setEditItem({ ...editItem, quantity: e.target.value })}
//             fullWidth
//             margin="normal"
//           />
//           <TextField
//             label="Price"
//             type="number"
//             value={editItem.price}
//             onChange={(e) => setEditItem({ ...editItem, price: e.target.value })}
//             fullWidth
//             margin="normal"
//           />
//           <TextField
//             label="Manufacture Date"
//             type="date"
//             value={editItem.manufacture_date}
//             onChange={(e) => setEditItem({ ...editItem, manufacture_date: e.target.value })}
//             fullWidth
//             margin="normal"
//             InputLabelProps={{
//               shrink: true,
//             }}
//           />
//           <TextField
//             label="Expiration Date"
//             type="date"
//             value={editItem.expire_date}
//             onChange={(e) => setEditItem({ ...editItem, expire_date: e.target.value })}
//             fullWidth
//             margin="normal"
//             InputLabelProps={{
//               shrink: true,
//             }}
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setOpenModal(false)} color="primary">
//             Cancel
//           </Button>
//           <Button onClick={handleEditSubmit} color="primary">
//             Save
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Delete Item Confirmation Dialog */}
//       <Dialog
//         open={deleteDialogOpen}
//         onClose={() => setDeleteDialogOpen(false)}
//       >
//         <DialogContent>
//           <DialogContentText>
//             Are you sure you want to delete this item?
//           </DialogContentText>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
//             Cancel
//           </Button>
//           <Button onClick={handleDeleteConfirm} color="secondary">
//             Delete
//           </Button>
//         </DialogActions>
//       </Dialog>

//       {/* Add Item Modal */}
//       <Dialog open={addItemModalOpen} onClose={() => setAddItemModalOpen(false)}>
//         <DialogContent>
//           <TextField
//             label="Product Name"
//             value={newItem.product_name}
//             onChange={(e) => setNewItem({ ...newItem, product_name: e.target.value })}
//             fullWidth
//             margin="normal"
//           />
//           <TextField
//             label="Brand"
//             value={newItem.brand}
//             onChange={(e) => setNewItem({ ...newItem, brand: e.target.value })}
//             fullWidth
//             margin="normal"
//           />
//           <TextField
//             label="Quantity"
//             type="number"
//             value={newItem.quantity}
//             onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
//             fullWidth
//             margin="normal"
//           />
//           <TextField
//             label="Price"
//             type="number"
//             value={newItem.price}
//             onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
//             fullWidth
//             margin="normal"
//           />
//           <TextField
//             label="Manufacture Date"
//             type="date"
//             value={newItem.manufacture_date}
//             onChange={(e) => setNewItem({ ...newItem, manufacture_date: e.target.value })}
//             fullWidth
//             margin="normal"
//             InputLabelProps={{
//               shrink: true,
//             }}
//           />
//           <TextField
//             label="Expiration Date"
//             type="date"
//             value={newItem.expire_date}
//             onChange={(e) => setNewItem({ ...newItem, expire_date: e.target.value })}
//             fullWidth
//             margin="normal"
//             InputLabelProps={{
//               shrink: true,
//             }}
//           />
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={() => setAddItemModalOpen(false)} color="primary">
//             Cancel
//           </Button>
//           <Button onClick={handleAddItemSubmit} color="primary">
//             Add
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </div>
//   );
// };

// export default Inventory;
















// import React, { useEffect, useState } from "react";
// import { Box, Button } from "@mui/material";
// import axios from "axios";

// import InventoryTable from "../components/inventory/InventoryTable";
// import FilterControls from "../components/inventory/FilterControls";
// import AddInventoryModal from "../components/inventory/AddInventoryModal";
// import EditInventoryModal from "../components/inventory/EditInventoryModal";
// import DeleteConfirmationDialog from "../components/inventory/DeleteConfirmationDialog";

// const Inventory = () => {
//   const [inventory, setInventory] = useState([]);
//   const [filteredInventory, setFilteredInventory] = useState([]);
//   const [loading, setLoading] = useState(true);
  
//   // Modal states
//   const [openEditModal, setOpenEditModal] = useState(false);
//   const [openAddModal, setOpenAddModal] = useState(false);
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
//   // Item states
//   const [editItem, setEditItem] = useState({
//     inventory_id: "",
//     product_name: "",
//     quantity: "",
//     price: "",
//     manufacture_date: "",
//     expire_date: "",
//     brand: "" 
//   });
//   const [selectedItem, setSelectedItem] = useState(null);
  
//   // Filter states
//   const [brandFilter, setBrandFilter] = useState("");
//   const [productSearch, setProductSearch] = useState("");
//   const [minQuantity, setMinQuantity] = useState("");
//   const [maxQuantity, setMaxQuantity] = useState("");

//   useEffect(() => {
//     fetchInventory();
//   }, []);
  
//   useEffect(() => {
//     applyFilters();
//   }, [inventory, brandFilter, productSearch, minQuantity, maxQuantity]);

//   const fetchInventory = async () => {
//     try {
//       const response = await axios.get("/inventory");
//       setInventory(response.data);
//       setFilteredInventory(response.data);
//     } catch (error) {
//       console.error("Error fetching inventory:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const applyFilters = () => {
//     let filtered = inventory;

//     if (brandFilter) {
//       filtered = filtered.filter(item => item.brand === brandFilter);
//     }

//     if (productSearch) {
//       filtered = filtered.filter(item => 
//         item.product_name.toLowerCase().includes(productSearch.toLowerCase())
//       );
//     }

//     if (minQuantity) {
//       filtered = filtered.filter(item => item.quantity >= minQuantity);
//     }

//     if (maxQuantity) {
//       filtered = filtered.filter(item => item.quantity <= maxQuantity);
//     }

//     setFilteredInventory(filtered);
//   };

//   const handleEdit = (item) => {
//     setEditItem({
//       ...item,
//       manufacture_date: formatDateToInput(item.manufacture_date),
//       expire_date: formatDateToInput(item.expire_date),
//     });
//     setOpenEditModal(true);
//   };

//   const handleEditSubmit = async (editedItem) => {
//     try {
//       await axios.put(`/inventory/${editedItem.inventory_id}`, editedItem);
//       fetchInventory();
//       setOpenEditModal(false);
//     } catch (error) {
//       console.error("Error updating item:", error);
//     }
//   };

//   const handleDeleteClick = (item) => {
//     setSelectedItem(item);
//     setDeleteDialogOpen(true);
//   };

//   const handleDeleteConfirm = async () => {
//     if (!selectedItem) return;
//     try {
//       await axios.delete(`/inventory/${selectedItem.inventory_id}`);
//       fetchInventory();
//       setDeleteDialogOpen(false);
//     } catch (error) {
//       console.error("Error deleting item:", error);
//     }
//   };

//   const handleAddItemSubmit = async (newItem) => {
//     const newItemToSubmit = {
//       ...newItem,
//       admin_id: 1, // Ensure this is being passed from a logged-in admin context
//     };

//     try {
//       await axios.post('/inventory', newItemToSubmit);
//       fetchInventory();
//       setOpenAddModal(false);
//     } catch (error) {
//       console.error('Error adding item:', error);
//     }
//   };

//   const formatDateToInput = (dateString) => {
//     if (!dateString) return "";
//     const date = new Date(dateString);
//     return date.toISOString().split('T')[0];  
//   };

//   if (loading) return <div>Loading...</div>;

//   return (
//     <div style={{ marginTop: "20px" }}>
//       {/* Action buttons and filter controls */}
//       <Box sx={{ marginBottom: "20px" }}>
//         <Button
//           variant="contained"
//           sx={{ 
//             backgroundColor: "#FE8DA1", 
//             color: "#fff", 
//             '&:hover': { backgroundColor: "#fe6a9f" },
//             marginBottom: "16px"
//           }}
//           onClick={() => setOpenAddModal(true)}
//         >
//           + Add Inventory
//         </Button>

//         <FilterControls
//           productSearch={productSearch}
//           setProductSearch={setProductSearch}
//           minQuantity={minQuantity}
//           setMinQuantity={setMinQuantity}
//           maxQuantity={maxQuantity}
//           setMaxQuantity={setMaxQuantity}
//           brandFilter={brandFilter}
//           setBrandFilter={setBrandFilter}
//           availableBrands={Array.from(new Set(inventory.map(item => item.brand)))}
//         />
//       </Box>

//       {/* Inventory Table */}
//       <InventoryTable 
//         inventory={filteredInventory}
//         onEdit={handleEdit}
//         onDelete={handleDeleteClick}
//       />

//       {/* Modals */}
//       <EditInventoryModal
//         open={openEditModal}
//         onClose={() => setOpenEditModal(false)}
//         item={editItem}
//         onSubmit={handleEditSubmit}
//       />

//       <AddInventoryModal
//         open={openAddModal}
//         onClose={() => setOpenAddModal(false)}
//         onSubmit={handleAddItemSubmit}
//       />

//       <DeleteConfirmationDialog
//         open={deleteDialogOpen}
//         onClose={() => setDeleteDialogOpen(false)}
//         onConfirm={handleDeleteConfirm}
//       />
//     </div>
//   );
// };

// export default Inventory;













import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Paper,
  IconButton,
  Chip
} from "@mui/material";
import axios from "axios";
import AddIcon from "@mui/icons-material/Add";
import InventoryIcon from "@mui/icons-material/Inventory";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import EventIcon from "@mui/icons-material/Event";

import InventoryTable from "../components/inventory/InventoryTable";
import FilterControls from "../components/inventory/FilterControls";
import AddInventoryModal from "../components/inventory/AddInventoryModal";
import EditInventoryModal from "../components/inventory/EditInventoryModal";
import DeleteConfirmationDialog from "../components/inventory/DeleteConfirmationDialog";

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  // Item states
  const [editItem, setEditItem] = useState({
    inventory_id: "",
    product_name: "",
    quantity: "",
    price: "",
    manufacture_date: "",
    expire_date: "",
    brand: "" 
  });
  const [selectedItem, setSelectedItem] = useState(null);
  
  // Filter states
  const [brandFilter, setBrandFilter] = useState("");
  const [productSearch, setProductSearch] = useState("");
  const [minQuantity, setMinQuantity] = useState("");
  const [maxQuantity, setMaxQuantity] = useState("");

  useEffect(() => {
    fetchInventory();
  }, []);
  
  useEffect(() => {
    applyFilters();
  }, [inventory, brandFilter, productSearch, minQuantity, maxQuantity]);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/inventory");
      setInventory(response.data);
      setFilteredInventory(response.data);
    } catch (error) {
      console.error("Error fetching inventory:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = inventory;

    if (brandFilter) {
      filtered = filtered.filter(item => item.brand === brandFilter);
    }

    if (productSearch) {
      filtered = filtered.filter(item => 
        item.product_name.toLowerCase().includes(productSearch.toLowerCase())
      );
    }

    if (minQuantity) {
      filtered = filtered.filter(item => item.quantity >= minQuantity);
    }

    if (maxQuantity) {
      filtered = filtered.filter(item => item.quantity <= maxQuantity);
    }

    setFilteredInventory(filtered);
  };

  const handleEdit = (item) => {
    setEditItem({
      ...item,
      manufacture_date: formatDateToInput(item.manufacture_date),
      expire_date: formatDateToInput(item.expire_date),
    });
    setOpenEditModal(true);
  };

  const handleEditSubmit = async (editedItem) => {
    try {
      await axios.put(`/inventory/${editedItem.inventory_id}`, editedItem);
      fetchInventory();
      setOpenEditModal(false);
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  const handleDeleteClick = (item) => {
    setSelectedItem(item);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedItem) return;
    try {
      await axios.delete(`/inventory/${selectedItem.inventory_id}`);
      fetchInventory();
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const handleAddItemSubmit = async (newItem) => {
    const newItemToSubmit = {
      ...newItem,
      admin_id: 1, // Ensure this is being passed from a logged-in admin context
    };

    try {
      await axios.post('/inventory', newItemToSubmit);
      fetchInventory();
      setOpenAddModal(false);
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const formatDateToInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];  
  };

  return (
    <Box 
      sx={{ 
        width: "100%", 
        height: "100%", 
        bgcolor: "#f9f5f0",
        display: "flex",
        flexDirection: "column",
        minHeight: "calc(100vh - 64px)" 
      }}
    >
      {/* Header */}
      <Box sx={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        p: 2,
        borderBottom: "1px solid #e0e0e0",
        background: "linear-gradient(to right, #f9f5f0, #ffffff)",
        boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
      }}>
        <Box sx={{ 
          display: "flex", 
          alignItems: "center",
          gap: 1
        }}>
          <InventoryIcon sx={{ color: "#BEAF9B" }} />
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 500,
              color: "#453C33",
              letterSpacing: "0.3px",
              fontFamily: "'Poppins', 'Roboto', sans-serif"
            }}
          >
            INVENTORY MANAGEMENT
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenAddModal(true)}
          sx={{
            background: "linear-gradient(to right, #BEAF9B, #D9CFC2)",
            color: '#fff',
            py: 1,
            px: 2,
            borderRadius: "8px",
            fontWeight: 500,
            fontFamily: "'Poppins', 'Roboto', sans-serif",
            textTransform: "none",
            boxShadow: "0 4px 8px rgba(190, 175, 155, 0.3)",
            transition: "all 0.3s ease",
            '&:hover': { 
              background: "linear-gradient(to right, #b0a08d, #cec2b3)",
              boxShadow: "0 6px 12px rgba(190, 175, 155, 0.4)",
              transform: "translateY(-2px)"
            }
          }}
        >
          Add New Item
        </Button>
      </Box>
      
      {/* Inventory stats summary */}
      <Box sx={{ 
        display: "flex", 
        flexWrap: "wrap", 
        gap: 2, 
        p: 2,
        borderBottom: "1px dashed rgba(190, 175, 155, 0.3)",
        backgroundColor: "rgba(255, 255, 255, 0.7)" 
      }}>
        <Paper 
          elevation={0} 
          sx={{ 
            p: 1.5, 
            display: "flex", 
            alignItems: "center", 
            gap: 1,
            borderRadius: "8px",
            border: "1px solid rgba(190, 175, 155, 0.2)",
            backgroundColor: "#fff",
            minWidth: "150px",
            flex: 1
          }}
        >
          <Box sx={{ 
            bgcolor: "rgba(190, 175, 155, 0.1)", 
            borderRadius: "50%", 
            p: 1, 
            display: "flex"
          }}>
            <InventoryIcon sx={{ color: "#BEAF9B" }} />
          </Box>
          <Box>
            <Typography 
              variant="body2" 
              sx={{ 
                color: "#666", 
                fontFamily: "'Poppins', 'Roboto', sans-serif" 
              }}
            >
              Total Items
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 600, 
                color: "#453C33",
                fontFamily: "'Poppins', 'Roboto', sans-serif" 
              }}
            >
              {inventory.length}
            </Typography>
          </Box>
        </Paper>
        
        {/* <Paper 
          elevation={0} 
          sx={{ 
            p: 1.5, 
            display: "flex", 
            alignItems: "center", 
            gap: 1,
            borderRadius: "8px",
            border: "1px solid rgba(190, 175, 155, 0.2)",
            backgroundColor: "#fff",
            minWidth: "150px",
            flex: 1
          }}
        >
          {/* <Box sx={{ 
            bgcolor: "rgba(255, 107, 107, 0.1)", 
            borderRadius: "50%", 
            p: 1, 
            display: "flex"
          }}>
            <PriorityHighIcon sx={{ color: "#ff6b6b" }} />
          </Box> */}
          {/* <Box>
            <Typography 
              variant="body2" 
              sx={{ 
                color: "#666", 
                fontFamily: "'Poppins', 'Roboto', sans-serif" 
              }}
            >
              Low Stock
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 600, 
                color: "#ff6b6b",
                fontFamily: "'Poppins', 'Roboto', sans-serif" 
              }}
            >
              {inventory.filter(item => item.quantity <= 5).length}
            </Typography>
          </Box> 
        </Paper> */}
        
        <Paper 
          elevation={0} 
          sx={{ 
            p: 1.5, 
            display: "flex", 
            alignItems: "center", 
            gap: 1,
            borderRadius: "8px",
            border: "1px solid rgba(190, 175, 155, 0.2)",
            backgroundColor: "#fff",
            minWidth: "150px",
            flex: 1
          }}
        >
          <Box sx={{ 
            bgcolor: "rgba(255, 170, 90, 0.1)", 
            borderRadius: "50%", 
            p: 1, 
            display: "flex"
          }}>
            <EventIcon sx={{ color: "#ffaa5a" }} />
          </Box>
          <Box>
            <Typography 
              variant="body2" 
              sx={{ 
                color: "#666", 
                fontFamily: "'Poppins', 'Roboto', sans-serif" 
              }}
            >
              Expiring Soon
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 600, 
                color: "#ffaa5a",
                fontFamily: "'Poppins', 'Roboto', sans-serif" 
              }}
            >
              {inventory.filter(item => {
                if (!item.expire_date) return false;
                const expiry = new Date(item.expire_date);
                const today = new Date();
                const diffTime = expiry - today;
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                return diffDays <= 30 && diffDays > 0;
              }).length}
            </Typography>
          </Box>
        </Paper>
      </Box>

      {/* Filter Controls */}
      <Box sx={{ 
        p: 2, 
        backgroundColor: "rgba(190, 175, 155, 0.1)",
        borderBottom: "1px dashed rgba(190, 175, 155, 0.3)",
      }}>
        <FilterControls
          productSearch={productSearch}
          setProductSearch={setProductSearch}
          minQuantity={minQuantity}
          setMinQuantity={setMinQuantity}
          maxQuantity={maxQuantity}
          setMaxQuantity={setMaxQuantity}
          brandFilter={brandFilter}
          setBrandFilter={setBrandFilter}
          availableBrands={Array.from(new Set(inventory.map(item => item.brand)))}
          // Add styling props to match the TimeSelection aesthetic
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "rgba(190, 175, 155, 0.3)",
              },
              "&:hover fieldset": {
                borderColor: "rgba(190, 175, 155, 0.5)",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#BEAF9B",
              },
            },
          }}
        />
        
        {/* Filter chips - if any filters are applied */}
        {(brandFilter || productSearch || minQuantity || maxQuantity) && (
          <Box sx={{ 
            display: "flex", 
            flexWrap: "wrap", 
            gap: 1,
            mt: 2 
          }}>
            {brandFilter && (
              <Chip 
                label={`Brand: ${brandFilter}`} 
                onDelete={() => setBrandFilter("")}
                sx={{ 
                  bgcolor: "#BEAF9B", 
                  color: "white",
                  fontFamily: "'Poppins', 'Roboto', sans-serif" 
                }}
              />
            )}
            {productSearch && (
              <Chip 
                label={`Search: ${productSearch}`} 
                onDelete={() => setProductSearch("")}
                sx={{ 
                  bgcolor: "#BEAF9B", 
                  color: "white",
                  fontFamily: "'Poppins', 'Roboto', sans-serif" 
                }}
              />
            )}
            {minQuantity && (
              <Chip 
                label={`Min Qty: ${minQuantity}`} 
                onDelete={() => setMinQuantity("")}
                sx={{ 
                  bgcolor: "#BEAF9B", 
                  color: "white",
                  fontFamily: "'Poppins', 'Roboto', sans-serif" 
                }}
              />
            )}
            {maxQuantity && (
              <Chip 
                label={`Max Qty: ${maxQuantity}`} 
                onDelete={() => setMaxQuantity("")}
                sx={{ 
                  bgcolor: "#BEAF9B", 
                  color: "white",
                  fontFamily: "'Poppins', 'Roboto', sans-serif" 
                }}
              />
            )}
          </Box>
        )}
      </Box>

      {/* Inventory Table */}
      <Box sx={{ 
        flexGrow: 1, 
        p: 3,
        overflowY: "auto",
        "&::-webkit-scrollbar": { display: "none" },
        scrollbarWidth: "none",
        msOverflowStyle: "none"
      }}>
        {loading ? (
          <Box display="flex" justifyContent="center" mt={3}>
            <CircularProgress sx={{ color: "#BEAF9B" }} />
          </Box>
        ) : filteredInventory.length === 0 ? (
          <Paper
            elevation={0}
            sx={{ 
              p: 4, 
              textAlign: "center",
              bgcolor: "rgba(190, 175, 155, 0.05)",
              borderRadius: "8px",
              border: "1px dashed rgba(190, 175, 155, 0.3)"
            }}
          >
            <Typography 
              variant="body1" 
              sx={{ 
                color: "#666",
                fontFamily: "'Poppins', 'Roboto', sans-serif",
                mb: 2
              }}
            >
              No items found with the current filters.
            </Typography>
            <Button
              variant="outlined"
              onClick={() => {
                setBrandFilter("");
                setProductSearch("");
                setMinQuantity("");
                setMaxQuantity("");
              }}
              sx={{
                color: "#BEAF9B",
                borderColor: "#BEAF9B",
                '&:hover': {
                  borderColor: "#b0a08d",
                  backgroundColor: "rgba(190, 175, 155, 0.1)",
                },
                fontFamily: "'Poppins', 'Roboto', sans-serif",
                textTransform: "none"
              }}
            >
              Clear Filters
            </Button>
          </Paper>
        ) : (
          <InventoryTable 
            inventory={filteredInventory}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
            // Add styling props for the table to match the TimeSelection aesthetic
            tableSx={{
              "& .MuiTableCell-root": {
                fontFamily: "'Poppins', 'Roboto', sans-serif",
                color: "#453C33"
              },
              "& .MuiTableHead-root": {
                backgroundColor: "rgba(190, 175, 155, 0.1)",
              },
              "& .MuiTableRow-root:hover": {
                backgroundColor: "rgba(190, 175, 155, 0.05)",
              }
            }}
            buttonSx={{
              edit: {
                color: "#BEAF9B",
                '&:hover': {
                  backgroundColor: "rgba(190, 175, 155, 0.1)",
                }
              },
              delete: {
                color: "#ff6b6b",
                '&:hover': {
                  backgroundColor: "rgba(255, 107, 107, 0.1)",
                }
              }
            }}
          />
        )}
      </Box>

      {/* Modals */}
      <EditInventoryModal
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        item={editItem}
        onSubmit={handleEditSubmit}
        // Add styling props to match the TimeSelection modal
        sx={{
          "& .MuiDialogTitle-root": {
            background: "linear-gradient(to right, #f9f5f0, #ffffff)",
            fontFamily: "'Poppins', 'Roboto', sans-serif",
            color: "#453C33"
          },
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "rgba(190, 175, 155, 0.3)",
            },
            "&:hover fieldset": {
              borderColor: "rgba(190, 175, 155, 0.5)",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#BEAF9B",
            },
          },
          "& .MuiButton-contained": {
            background: "linear-gradient(to right, #BEAF9B, #D9CFC2)",
            color: '#fff',
            fontFamily: "'Poppins', 'Roboto', sans-serif",
            textTransform: "none",
          }
        }}
      />

      <AddInventoryModal
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        onSubmit={handleAddItemSubmit}
        // Add styling props to match the TimeSelection modal
        sx={{
          "& .MuiDialogTitle-root": {
            background: "linear-gradient(to right, #f9f5f0, #ffffff)",
            fontFamily: "'Poppins', 'Roboto', sans-serif",
            color: "#453C33"
          },
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "rgba(190, 175, 155, 0.3)",
            },
            "&:hover fieldset": {
              borderColor: "rgba(190, 175, 155, 0.5)",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#BEAF9B",
            },
          },
          "& .MuiButton-contained": {
            background: "linear-gradient(to right, #BEAF9B, #D9CFC2)",
            color: '#fff',
            fontFamily: "'Poppins', 'Roboto', sans-serif",
            textTransform: "none",
          }
        }}
      />

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        // Add styling props to match the TimeSelection modal
        sx={{
          "& .MuiPaper-root": {
            borderRadius: "8px",
            backgroundColor: "#f9f5f0",
          },
          "& .MuiTypography-root": {
            fontFamily: "'Poppins', 'Roboto', sans-serif",
            color: "#453C33"
          },
          "& .MuiButton-contained": {
            background: "#ff6b6b",
            color: '#fff',
            fontFamily: "'Poppins', 'Roboto', sans-serif",
            textTransform: "none",
          },
          "& .MuiButton-outlined": {
            color: "#BEAF9B",
            borderColor: "#BEAF9B",
            fontFamily: "'Poppins', 'Roboto', sans-serif",
            textTransform: "none",
          }
        }}
      />
    </Box>
  );
};

export default Inventory;