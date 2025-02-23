import React, { useEffect, useState } from "react";
import {
  Table, TableHead, TableBody, TableRow, TableCell, TableContainer,
  Paper, IconButton, TextField, Button, Dialog, DialogActions, DialogContent, DialogContentText
} from "@mui/material";
import axios from "axios";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [editItem, setEditItem] = useState({
    inventory_id: "",
    product_name: "",
    quantity: "",
    price: "",
    manufacture_date: "",
    expire_date: ""
  });

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [addItemModalOpen, setAddItemModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    product_name: "",
    quantity: "",
    price: "",
    manufacture_date: "",
    expire_date: ""
  });

  useEffect(() => {
    fetchInventory();
  }, []);

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
    return date.toISOString().split('T')[0];  // Converts to yyyy-mm-dd format
  };

  const handleEditSubmit = async () => {
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
    if (!newItem.product_name || !newItem.quantity || !newItem.price || !newItem.manufacture_date || !newItem.expire_date) {
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
      <Button
        variant="contained"
        sx={{ backgroundColor: "#FE8DA1", marginBottom: "20px", color: "#fff", '&:hover': { backgroundColor: "#fe6a9f" } }}
        onClick={() => setAddItemModalOpen(true)}
      >
        + Add Inventory
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Product Name</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Manufacture Date</TableCell>
              <TableCell>Expiration Date</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {inventory.map((item) => (
              <TableRow key={item.inventory_id}>
                <TableCell>{item.inventory_id}</TableCell>
                <TableCell>{item.product_name}</TableCell>
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
          <Button onClick={handleAddItemSubmit} color="primary">Add</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} disableEnforceFocus>
        <DialogContent>
          <DialogContentText>Are you sure you want to permanently delete this item?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">No</Button>
          <Button onClick={handleDeleteConfirm} color="error">Yes</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Inventory;
