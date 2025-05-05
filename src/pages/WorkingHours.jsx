import React, { useEffect, useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Select, MenuItem, InputLabel, FormControl
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";

const WorkingHours = () => {
  const [workingHours, setWorkingHours] = useState([]);
  const [filteredHours, setFilteredHours] = useState([]);
  const [searchDate, setSearchDate] = useState("");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [editForm, setEditForm] = useState({
    date: "",
    open_time: "",
    close_time: "",
    is_closed: false,
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    handleSearch(searchDate);
  }, [searchDate, workingHours]);

  const fetchData = () => {
    axios
      .get("http://localhost:5001/api/workinghours")
      .then((response) => {
        setWorkingHours(response.data.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the working hours:", error);
      });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const handleSearch = (date) => {
    if (!date) {
      setFilteredHours(workingHours);
    } else {
      const filtered = workingHours.filter((item) => {
        const itemDateOnly = new Date(item.date).toLocaleDateString('en-CA'); // 'YYYY-MM-DD' format
        return itemDateOnly === date;
      });
      setFilteredHours(filtered);
    }
  };
  
  

  const handleEditClick = (item) => {
    setSelectedItem(item);
    setEditForm({
      date: item.date ? item.date.split("T")[0] : "",
      open_time: item.open_time || "",
      close_time: item.close_time || "",
      is_closed: item.is_closed || false,
    });
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (item) => {
    setSelectedItem(item);
    setDeleteDialogOpen(true);
  };

  const handleEditSave = () => {
    axios
      .put(`http://localhost:5001/api/workinghours/${selectedItem.id}`, editForm)
      .then(() => {
        setEditDialogOpen(false);
        fetchData();
      })
      .catch((error) => {
        console.error("Edit failed:", error);
      });
  };

  const handleDeleteConfirm = () => {
    axios
      .delete(`http://localhost:5001/api/workinghours/${selectedItem.id}`)
      .then(() => {
        setDeleteDialogOpen(false);
        fetchData();
      })
      .catch((error) => {
        console.error("Delete failed:", error);
      });
  };

  const handleAddClick = () => {
    setEditForm({
      date: "",
      open_time: "",
      close_time: "",
      is_closed: false,
    });
    setAddDialogOpen(true);
  };

  const handleAddSave = () => {
    axios
      .post("http://localhost:5001/api/workinghours", editForm)
      .then(() => {
        setAddDialogOpen(false);
        fetchData();
      })
      .catch((error) => {
        console.error("Add failed:", error);
      });
  };

  return (
    <div>
      <h2>Working Hours</h2>

      {/* Search and Add */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: 16, gap: 16 }}>
        <TextField
          label="Search by Date"
          type="date"
          value={searchDate}
          onChange={(e) => {
            const date = e.target.value;
            setSearchDate(date);
            handleSearch(date);
          }}
          InputLabelProps={{ shrink: true }}
        />
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAddClick}
        >
          Add Working Hour
        </Button>
      </div>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Open Time</TableCell>
              <TableCell>Close Time</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredHours.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{formatDate(item.date)}</TableCell>
                <TableCell>{item.is_closed ? "Closed" : item.open_time || "N/A"}</TableCell>
                <TableCell>{item.is_closed ? "Closed" : item.close_time || "N/A"}</TableCell>
                <TableCell>{item.is_closed ? "Closed" : "Open"}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEditClick(item)} sx={{ color: "green" }}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteClick(item)} sx={{ color: "red" }}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {filteredHours.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No entries found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Shared Edit/Add Dialog */}
      <Dialog open={editDialogOpen || addDialogOpen} onClose={() => {
        setEditDialogOpen(false);
        setAddDialogOpen(false);
      }}>
        <DialogTitle>{editDialogOpen ? "Edit Working Hours" : "Add Working Hour"}</DialogTitle>
        <DialogContent>
          <TextField
            label="Date"
            type="date"
            fullWidth
            margin="dense"
            value={editForm.date}
            onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Open Time"
            type="time"
            fullWidth
            margin="dense"
            value={editForm.open_time}
            onChange={(e) => setEditForm({ ...editForm, open_time: e.target.value })}
            InputLabelProps={{ shrink: true }}
            disabled={editForm.is_closed}
          />
          <TextField
            label="Close Time"
            type="time"
            fullWidth
            margin="dense"
            value={editForm.close_time}
            onChange={(e) => setEditForm({ ...editForm, close_time: e.target.value })}
            InputLabelProps={{ shrink: true }}
            disabled={editForm.is_closed}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Status</InputLabel>
            <Select
              value={editForm.is_closed ? "Closed" : "Open"}
              label="Status"
              onChange={(e) =>
                setEditForm({ ...editForm, is_closed: e.target.value === "Closed" })
              }
            >
              <MenuItem value="Open">Open</MenuItem>
              <MenuItem value="Closed">Closed</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setEditDialogOpen(false);
            setAddDialogOpen(false);
          }}>
            Cancel
          </Button>
          <Button
            onClick={editDialogOpen ? handleEditSave : handleAddSave}
            variant="contained"
            color="primary"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>Are you sure you want to delete this working hour entry?</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteConfirm} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default WorkingHours;
