{/*import React, { useEffect, useState } from "react";
import {
  Table, TableHead, TableBody, TableRow, TableCell, TableContainer,
  Paper, IconButton, TextField, Button, Dialog, DialogActions, DialogContent, DialogContentText, Select, MenuItem, Box
} from "@mui/material";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [editItem, setEditItem] = useState({
    inventory_id: "",
    product_name: "",
    quantity: "",
    price: "",
    manufacture_date: "",
    expire_date: "",
    brand: "" 
  });

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [addItemModalOpen, setAddItemModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    product_name: "",
    quantity: "",
    price: "",
    manufacture_date: "",
    expire_date: "",
    brand: "" 
  });
  
  const [brandFilter, setBrandFilter] = useState("");  // Brand filter state
  const [productSearch, setProductSearch] = useState("");  // Product name search
  const [minQuantity, setMinQuantity] = useState(""); // Min quantity search
  const [maxQuantity, setMaxQuantity] = useState(""); // Max quantity search
  
  useEffect(() => {
    fetchInventory();
  }, []);
  
  useEffect(() => {
    // Apply filters whenever inventory, brandFilter, productSearch or quantity changes
    let filtered = inventory;

    if (brandFilter) {
      filtered = filtered.filter(item => item.brand === brandFilter);
    }

    if (productSearch) {
      filtered = filtered.filter(item => item.product_name.toLowerCase().includes(productSearch.toLowerCase()));
    }

    if (minQuantity) {
      filtered = filtered.filter(item => item.quantity >= minQuantity);
    }

    if (maxQuantity) {
      filtered = filtered.filter(item => item.quantity <= maxQuantity);
    }

    setFilteredInventory(filtered);

  }, [inventory, brandFilter, productSearch, minQuantity, maxQuantity]);

  const fetchInventory = async () => {
    try {
      const response = await axios.get("http://localhost:5001/api/inventory");
      setInventory(response.data);
    } catch (error) {
      console.error("Error fetching inventory:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short", day: "2-digit" }).format(new Date(dateString));
  };

  const handleEdit = (item) => {
    setEditItem({
      ...item,
      manufacture_date: formatDateToInput(item.manufacture_date),
      expire_date: formatDateToInput(item.expire_date),
    });
    setOpenModal(true);
  };

  const formatDateToInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];  
  };

  const handleEditSubmit = async () => {
    if (!editItem.product_name || !editItem.quantity || !editItem.price || !editItem.manufacture_date || !editItem.expire_date || !editItem.brand) {
      alert("All fields are required.");
      return;
    }

    try {
      const response = await axios.put(`http://localhost:5001/api/inventory/${editItem.inventory_id}`, editItem);
      fetchInventory();
      setOpenModal(false);
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
      await axios.delete(`http://localhost:5001/api/inventory/${selectedItem.inventory_id}`);
      fetchInventory();
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const handleAddItemSubmit = async () => {
    if (!newItem.product_name || !newItem.quantity || !newItem.price || !newItem.manufacture_date || !newItem.expire_date || !newItem.brand) {
      alert("All fields are required.");
      return;
    }
    try {
      await axios.post("http://localhost:5001/api/inventory", newItem);
      fetchInventory();
      setAddItemModalOpen(false);
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ marginTop: "20px" }}>
      {/* Container for the Add Inventory button and search fields *
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, marginBottom: "20px" }}>
        <Button
          variant="contained"
          sx={{ backgroundColor: "#FE8DA1", color: "#fff", '&:hover': { backgroundColor: "#fe6a9f" } }}
          onClick={() => setAddItemModalOpen(true)}
        >
          + Add Inventory
        </Button>

        {/* Product name search 
        <TextField
          label="Search by Product Name"
          value={productSearch}
          onChange={(e) => setProductSearch(e.target.value)}
          sx={{ width: 220 }}
        />

        //Quantity range 
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            label="Min Quantity"
            type="number"
            value={minQuantity}
            onChange={(e) => setMinQuantity(e.target.value)}
            sx={{ width: 150 }}
          />
          <TextField
            label="Max Quantity"
            type="number"
            value={maxQuantity}
            onChange={(e) => setMaxQuantity(e.target.value)}
            sx={{ width: 150 }}
          />
        </Box>
      </Box>

      // Brand filter 
      <TextField
        select
        label="Filter by Brand"
        value={brandFilter}
        onChange={(e) => setBrandFilter(e.target.value)}
        fullWidth
        margin="normal"
        sx={{ marginBottom: "20px", marginLeft: "10px" }}
      >
        <MenuItem value="">All Brands</MenuItem>
        {Array.from(new Set(inventory.map(item => item.brand))).map((brand) => (
          <MenuItem key={brand} value={brand}>{brand}</MenuItem>
        ))}
      </TextField>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Product Name</TableCell>
              <TableCell>Brand</TableCell> 
              <TableCell>Quantity</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Manufacture Date</TableCell>
              <TableCell>Expiration Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredInventory.map((item) => (
              <TableRow key={item.inventory_id}>
                <TableCell>{item.inventory_id}</TableCell>
                <TableCell>{item.product_name}</TableCell>
                <TableCell>{item.brand}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{item.price}</TableCell>
                <TableCell>{formatDate(item.manufacture_date)}</TableCell>
                <TableCell>{formatDate(item.expire_date)}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(item)} style={{ color: "green" }}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteClick(item)} style={{ color: "red" }}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      //Add/Edit Inventory Modal 
      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogContent>
          <TextField
            label="Product Name"
            value={editItem.product_name}
            onChange={(e) => setEditItem({ ...editItem, product_name: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Brand"
            value={editItem.brand} 
            onChange={(e) => setEditItem({ ...editItem, brand: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Quantity"
            type="number"
            value={editItem.quantity}
            onChange={(e) => setEditItem({ ...editItem, quantity: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Price"
            type="number"
            value={editItem.price}
            onChange={(e) => setEditItem({ ...editItem, price: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Manufacture Date"
            type="date"
            value={editItem.manufacture_date}
            onChange={(e) => setEditItem({ ...editItem, manufacture_date: e.target.value })}
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label="Expiration Date"
            type="date"
            value={editItem.expire_date}
            onChange={(e) => setEditItem({ ...editItem, expire_date: e.target.value })}
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)} color="primary">Cancel</Button>
          <Button onClick={handleEditSubmit} color="primary">Save</Button>
        </DialogActions>
      </Dialog>

    //Add Item Modal 
      <Dialog open={addItemModalOpen} onClose={() => setAddItemModalOpen(false)}>
        <DialogContent>
          <TextField
            label="Product Name"
            value={newItem.product_name}
            onChange={(e) => setNewItem({ ...newItem, product_name: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Brand"
            value={newItem.brand} 
            onChange={(e) => setNewItem({ ...newItem, brand: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Quantity"
            type="number"
            value={newItem.quantity}
            onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Price"
            type="number"
            value={newItem.price}
            onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Manufacture Date"
            type="date"
            value={newItem.manufacture_date}
            onChange={(e) => setNewItem({ ...newItem, manufacture_date: e.target.value })}
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label="Expiration Date"
            type="date"
            value={newItem.expire_date}
            onChange={(e) => setNewItem({ ...newItem, expire_date: e.target.value })}
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddItemModalOpen(false)} color="primary">Cancel</Button>
          <Button onClick={handleAddItemSubmit} color="primary">Save</Button>
        </DialogActions>
      </Dialog>

      //Delete Item Dialog 
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this item?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">Cancel</Button>
          <Button onClick={handleDeleteConfirm} color="secondary">Delete</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Inventory; */}



import React, { useEffect, useState } from "react";
import {
  Table, TableHead, TableBody, TableRow, TableCell, TableContainer,
  Paper, IconButton, TextField, Button, Dialog, DialogActions, DialogContent, DialogContentText, Select, MenuItem, Box
} from "@mui/material";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [editItem, setEditItem] = useState({
    inventory_id: "",
    product_name: "",
    quantity: "",
    price: "",
    manufacture_date: "",
    expire_date: "",
    brand: "" 
  });

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [addItemModalOpen, setAddItemModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    product_name: "",
    quantity: "",
    price: "",
    manufacture_date: "",
    expire_date: "",
    brand: "" 
  });
  
  const [brandFilter, setBrandFilter] = useState("");  // Brand filter state
  const [productSearch, setProductSearch] = useState("");  // Product name search
  const [minQuantity, setMinQuantity] = useState(""); // Min quantity search
  const [maxQuantity, setMaxQuantity] = useState(""); // Max quantity search
  
  useEffect(() => {
    fetchInventory();
  }, []);
  
  useEffect(() => {
    // Apply filters whenever inventory, brandFilter, productSearch or quantity changes
    let filtered = inventory;

    if (brandFilter) {
      filtered = filtered.filter(item => item.brand === brandFilter);
    }

    if (productSearch) {
      filtered = filtered.filter(item => item.product_name.toLowerCase().includes(productSearch.toLowerCase()));
    }

    if (minQuantity) {
      filtered = filtered.filter(item => item.quantity >= minQuantity);
    }

    if (maxQuantity) {
      filtered = filtered.filter(item => item.quantity <= maxQuantity);
    }

    setFilteredInventory(filtered);

  }, [inventory, brandFilter, productSearch, minQuantity, maxQuantity]);

  const fetchInventory = async () => {
    try {
      const response = await axios.get("http://localhost:5001/api/inventory");
      setInventory(response.data);
    } catch (error) {
      console.error("Error fetching inventory:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short", day: "2-digit" }).format(new Date(dateString));
  };

  const handleEdit = (item) => {
    setEditItem({
      ...item,
      manufacture_date: formatDateToInput(item.manufacture_date),
      expire_date: formatDateToInput(item.expire_date),
    });
    setOpenModal(true);
  };

  const formatDateToInput = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];  
  };

  const handleEditSubmit = async () => {
    if (!editItem.product_name || !editItem.quantity || !editItem.price || !editItem.manufacture_date || !editItem.expire_date || !editItem.brand) {
      alert("All fields are required.");
      return;
    }

    try {
      const response = await axios.put(`http://localhost:5001/api/inventory/${editItem.inventory_id}`, editItem);
      fetchInventory();
      setOpenModal(false);
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
      await axios.delete(`http://localhost:5001/api/inventory/${selectedItem.inventory_id}`);
      fetchInventory();
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const handleAddItemSubmit = async (event) => {
    event.preventDefault();
    
    // Ensure that the newItem object has all necessary fields
    if (!newItem.product_name || !newItem.quantity || !newItem.price || !newItem.manufacture_date || !newItem.expire_date || !newItem.brand) {
      alert("All fields are required.");
      return;
    }

    const newItemToSubmit = {
      product_name: newItem.product_name,
      quantity: newItem.quantity,
      price: newItem.price,
      manufacture_date: newItem.manufacture_date,
      expire_date: newItem.expire_date,
      brand: newItem.brand,
      admin_id: 1, // Ensure this is being passed from a logged-in admin context
    };

    try {
      const response = await axios.post('http://localhost:5001/api/inventory', newItemToSubmit);
      fetchInventory();  // Refresh inventory list after adding
      setAddItemModalOpen(false);  // Close the modal
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ marginTop: "20px" }}>
      {/* Container for the Add Inventory button and search fields */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, marginBottom: "20px" }}>
        <Button
          variant="contained"
          sx={{ backgroundColor: "#FE8DA1", color: "#fff", '&:hover': { backgroundColor: "#fe6a9f" } }}
          onClick={() => setAddItemModalOpen(true)}
        >
          + Add Inventory
        </Button>

        {/* Product name search */}
        <TextField
          label="Search by Product Name"
          value={productSearch}
          onChange={(e) => setProductSearch(e.target.value)}
          sx={{ width: 220 }}
        />

        {/* Quantity range */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            label="Min Quantity"
            type="number"
            value={minQuantity}
            onChange={(e) => setMinQuantity(e.target.value)}
            sx={{ width: 150 }}
          />
          <TextField
            label="Max Quantity"
            type="number"
            value={maxQuantity}
            onChange={(e) => setMaxQuantity(e.target.value)}
            sx={{ width: 150 }}
          />
        </Box>
      </Box>

      {/* Brand filter */}
      <TextField
        select
        label="Filter by Brand"
        value={brandFilter}
        onChange={(e) => setBrandFilter(e.target.value)}
        fullWidth
        margin="normal"
        sx={{ marginBottom: "20px", marginLeft: "10px" }}
      >
        <MenuItem value="">All Brands</MenuItem>
        {Array.from(new Set(inventory.map(item => item.brand))).map((brand) => (
          <MenuItem key={brand} value={brand}>{brand}</MenuItem>
        ))}
      </TextField>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Product Name</TableCell>
              <TableCell>Brand</TableCell> 
              <TableCell>Quantity</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Manufacture Date</TableCell>
              <TableCell>Expiration Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredInventory.map((item) => (
              <TableRow key={item.inventory_id}>
                <TableCell>{item.inventory_id}</TableCell>
                <TableCell>{item.product_name}</TableCell>
                <TableCell>{item.brand}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{item.price}</TableCell>
                <TableCell>{formatDate(item.manufacture_date)}</TableCell>
                <TableCell>{formatDate(item.expire_date)}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(item)} style={{ color: "green" }}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteClick(item)} style={{ color: "red" }}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add/Edit Inventory Modal */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogContent>
          <TextField
            label="Product Name"
            value={editItem.product_name}
            onChange={(e) => setEditItem({ ...editItem, product_name: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Brand"
            value={editItem.brand} 
            onChange={(e) => setEditItem({ ...editItem, brand: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Quantity"
            type="number"
            value={editItem.quantity}
            onChange={(e) => setEditItem({ ...editItem, quantity: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Price"
            type="number"
            value={editItem.price}
            onChange={(e) => setEditItem({ ...editItem, price: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Manufacture Date"
            type="date"
            value={editItem.manufacture_date}
            onChange={(e) => setEditItem({ ...editItem, manufacture_date: e.target.value })}
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label="Expiration Date"
            type="date"
            value={editItem.expire_date}
            onChange={(e) => setEditItem({ ...editItem, expire_date: e.target.value })}
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleEditSubmit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Item Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this item?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Item Modal */}
      <Dialog open={addItemModalOpen} onClose={() => setAddItemModalOpen(false)}>
        <DialogContent>
          <TextField
            label="Product Name"
            value={newItem.product_name}
            onChange={(e) => setNewItem({ ...newItem, product_name: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Brand"
            value={newItem.brand}
            onChange={(e) => setNewItem({ ...newItem, brand: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Quantity"
            type="number"
            value={newItem.quantity}
            onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Price"
            type="number"
            value={newItem.price}
            onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Manufacture Date"
            type="date"
            value={newItem.manufacture_date}
            onChange={(e) => setNewItem({ ...newItem, manufacture_date: e.target.value })}
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label="Expiration Date"
            type="date"
            value={newItem.expire_date}
            onChange={(e) => setNewItem({ ...newItem, expire_date: e.target.value })}
            fullWidth
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddItemModalOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddItemSubmit} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Inventory;
