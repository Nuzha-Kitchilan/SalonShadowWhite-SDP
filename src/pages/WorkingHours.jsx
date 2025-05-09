import React, { useEffect, useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  IconButton, Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Select, MenuItem, InputLabel, FormControl,
  Box, Typography, Chip, Container, Divider, CircularProgress, 
  useMediaQuery, useTheme, TablePagination
} from "@mui/material";
import { styled } from '@mui/material/styles';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import EventIcon from '@mui/icons-material/Event';
import ScheduleIcon from '@mui/icons-material/Schedule';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import axios from "axios";
import { jwtDecode } from 'jwt-decode';
import dayjs from 'dayjs';

// Custom styled components
const StyledPaper = styled(Paper)({
  borderRadius: '8px',
  overflow: 'hidden',
  border: '1px solid rgba(190, 175, 155, 0.2)',
  background: 'linear-gradient(to right, rgba(190, 175, 155, 0.1), rgba(255, 255, 255, 0.8))',
});

const StyledTable = styled(Table)({
  '& .MuiTableCell-root': {
    fontFamily: "'Poppins', 'Roboto', sans-serif",
  },
  '& .MuiTableHead-root': {
    backgroundColor: 'rgba(190, 175, 155, 0.1)',
    '& .MuiTableCell-root': {
      fontWeight: 600,
      color: '#453C33',
    }
  }
});

const StyledButton = styled(Button)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: 600,
  fontFamily: "'Poppins', 'Roboto', sans-serif",
  padding: theme.spacing(1, 2),
  transition: 'all 0.2s',
  '&:hover': {
    backgroundColor: 'rgba(190, 175, 155, 0.1)',
  }
}));

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
  const [loading, setLoading] = useState(true);
  const [adminName, setAdminName] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    // Get admin info from JWT token
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setAdminName(decodedToken.name || decodedToken.username || 'Admin');
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
    
    fetchData();
  }, []);

  useEffect(() => {
    handleSearch(searchDate);
  }, [searchDate, workingHours]);

  const fetchData = () => {
    setLoading(true);
    axios
      .get("http://localhost:5001/api/workinghours")
      .then((response) => {
        setWorkingHours(response.data.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the working hours:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const formatDate = (dateString) => {
    return dayjs(dateString).format('MMM D, YYYY');
  };

  const handleSearch = (date) => {
    if (!date) {
      setFilteredHours(workingHours);
    } else {
      const filtered = workingHours.filter((item) => {
        const itemDateOnly = dayjs(item.date).format('YYYY-MM-DD');
        return itemDateOnly === date;
      });
      setFilteredHours(filtered);
    }
    setPage(0); // Reset to first page when searching
  };

  const handleEditClick = (item) => {
    setSelectedItem(item);
    setEditForm({
      date: item.date ? dayjs(item.date).format('YYYY-MM-DD') : "",
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
      date: dayjs().format('YYYY-MM-DD'), // Default to today's date
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

  const getCurrentTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  // Handle pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Calculate min date (today)
  const getMinDate = () => {
    return dayjs().format('YYYY-MM-DD');
  };

  // Check if a date is in the past
  const isPastDate = (dateString) => {
    return dayjs(dateString).isBefore(dayjs(), 'day');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress sx={{ color: '#BEAF9B' }} />
      </Box>
    );
  }

  // Get current page data
  const paginatedData = searchDate ? 
    filteredHours : 
    filteredHours.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Container maxWidth="xl" sx={{ mt: { xs: 2, md: 4 } }}>
      <StyledPaper elevation={0}>
        <Box sx={{ p: { xs: 2, md: 3 }, borderBottom: '1px solid rgba(190, 175, 155, 0.2)' }}>
          <Typography 
            variant={isMobile ? "h5" : "h4"} 
            component="h1" 
            sx={{ 
              fontFamily: "'Poppins', 'Roboto', sans-serif",
              fontWeight: 600,
              color: '#453C33',
              mb: 1
            }}
          >
            Working Hours Management
          </Typography>
          
          <Typography 
            variant="body1" 
            sx={{ 
              fontFamily: "'Poppins', 'Roboto', sans-serif",
              color: '#666',
              mb: 1
            }}
          >
            {getCurrentTimeGreeting()}, {adminName}. Manage your salon's working hours here.
          </Typography>
        </Box>
        
        <Box sx={{ p: { xs: 2, md: 3 } }}>
          {/* Search and Add */}
          <Box sx={{ 
            display: 'flex', 
            flexDirection: isMobile ? 'column' : 'row',
            alignItems: isMobile ? 'stretch' : 'center',
            gap: 2,
            mb: 3
          }}>
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
              fullWidth={isMobile}
              inputProps={{
                min: getMinDate()
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'rgba(190, 175, 155, 0.5)',
                  },
                  '&:hover fieldset': {
                    borderColor: '#BEAF9B',
                  },
                }
              }}
            />
            <StyledButton
              variant="contained"
              sx={{
                backgroundColor: '#BEAF9B',
                color: '#fff',
                '&:hover': {
                  backgroundColor: '#9e8e7a',
                },
                minWidth: isMobile ? '100%' : 'auto'
              }}
              startIcon={<AddIcon />}
              onClick={handleAddClick}
            >
              Add Working Hours
            </StyledButton>
          </Box>

          {/* Table */}
          <TableContainer>
            <StyledTable>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <EventIcon fontSize="small" />
                      <span>Date</span>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <ScheduleIcon fontSize="small" />
                      <span>Open Time</span>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <ScheduleIcon fontSize="small" />
                      <span>Close Time</span>
                    </Box>
                  </TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedData.map((item) => (
                  <TableRow key={item.id} hover sx={{ '&:hover': { backgroundColor: 'rgba(190, 175, 155, 0.05)' } }}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {isPastDate(item.date) && (
                          <Chip 
                            label="Past" 
                            size="small" 
                            sx={{ 
                              backgroundColor: 'rgba(158, 158, 158, 0.1)', 
                              color: '#9e9e9e',
                              fontSize: '0.7rem'
                            }} 
                          />
                        )}
                        {formatDate(item.date)}
                      </Box>
                    </TableCell>
                    <TableCell>
                      {item.is_closed ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#666' }}>
                          <LockIcon fontSize="small" />
                          <span>Closed</span>
                        </Box>
                      ) : (
                        item.open_time || "N/A"
                      )}
                    </TableCell>
                    <TableCell>
                      {item.is_closed ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#666' }}>
                          <LockIcon fontSize="small" />
                          <span>Closed</span>
                        </Box>
                      ) : (
                        item.close_time || "N/A"
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={item.is_closed ? "Closed" : "Open"}
                        size="small"
                        sx={{
                          backgroundColor: item.is_closed ? 'rgba(158, 158, 158, 0.1)' : 'rgba(56, 142, 60, 0.1)',
                          color: item.is_closed ? '#9e9e9e' : '#388e3c',
                        }}
                        icon={item.is_closed ? <LockIcon fontSize="small" /> : <LockOpenIcon fontSize="small" />}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton 
                        onClick={() => handleEditClick(item)}
                        sx={{ 
                          color: '#BEAF9B',
                          '&:hover': {
                            backgroundColor: 'rgba(190, 175, 155, 0.1)',
                          }
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton 
                        onClick={() => handleDeleteClick(item)}
                        sx={{ 
                          color: '#ff6b6b',
                          '&:hover': {
                            backgroundColor: 'rgba(255, 107, 107, 0.1)',
                          }
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredHours.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                      <Typography 
                        variant="body1" 
                        sx={{ 
                          fontFamily: "'Poppins', 'Roboto', sans-serif",
                          color: '#666'
                        }}
                      >
                        No working hours entries found
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </StyledTable>
          </TableContainer>

          {/* Pagination */}
          {!searchDate && (
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredHours.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              sx={{
                '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                  fontFamily: "'Poppins', 'Roboto', sans-serif",
                }
              }}
            />
          )}
        </Box>
      </StyledPaper>

      {/* Shared Edit/Add Dialog */}
      <Dialog 
        open={editDialogOpen || addDialogOpen} 
        onClose={() => {
          setEditDialogOpen(false);
          setAddDialogOpen(false);
        }}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '8px',
            background: 'linear-gradient(to right, rgba(190, 175, 155, 0.9), rgba(255, 255, 255, 0.9))',
          }
        }}
      >
        <DialogTitle sx={{ 
          fontFamily: "'Poppins', 'Roboto', sans-serif",
          fontWeight: 600,
          color: '#453C33',
          borderBottom: '1px solid rgba(190, 175, 155, 0.2)'
        }}>
          {editDialogOpen ? "Edit Working Hours" : "Add Working Hours"}
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <TextField
            label="Date"
            type="date"
            fullWidth
            margin="normal"
            value={editForm.date}
            onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
            InputLabelProps={{ shrink: true }}
            inputProps={{
              min: getMinDate()
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'rgba(190, 175, 155, 0.5)',
                },
                '&:hover fieldset': {
                  borderColor: '#BEAF9B',
                },
              }
            }}
          />
          <TextField
            label="Open Time"
            type="time"
            fullWidth
            margin="normal"
            value={editForm.open_time}
            onChange={(e) => setEditForm({ ...editForm, open_time: e.target.value })}
            InputLabelProps={{ shrink: true }}
            disabled={editForm.is_closed}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'rgba(190, 175, 155, 0.5)',
                },
                '&:hover fieldset': {
                  borderColor: '#BEAF9B',
                },
              }
            }}
          />
          <TextField
            label="Close Time"
            type="time"
            fullWidth
            margin="normal"
            value={editForm.close_time}
            onChange={(e) => setEditForm({ ...editForm, close_time: e.target.value })}
            InputLabelProps={{ shrink: true }}
            disabled={editForm.is_closed}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'rgba(190, 175, 155, 0.5)',
                },
                '&:hover fieldset': {
                  borderColor: '#BEAF9B',
                },
              }
            }}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel sx={{
              '&.Mui-focused': {
                color: '#453C33',
              }
            }}>Status</InputLabel>
            <Select
              value={editForm.is_closed ? "Closed" : "Open"}
              label="Status"
              onChange={(e) =>
                setEditForm({ ...editForm, is_closed: e.target.value === "Closed" })
              }
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'rgba(190, 175, 155, 0.5)',
                  },
                  '&:hover fieldset': {
                    borderColor: '#BEAF9B',
                  },
                }
              }}
            >
              <MenuItem value="Open">Open</MenuItem>
              <MenuItem value="Closed">Closed</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid rgba(190, 175, 155, 0.2)' }}>
          <StyledButton
            onClick={() => {
              setEditDialogOpen(false);
              setAddDialogOpen(false);
            }}
            sx={{
              color: '#666',
              '&:hover': {
                color: '#453C33',
              }
            }}
          >
            Cancel
          </StyledButton>
          <StyledButton
            onClick={editDialogOpen ? handleEditSave : handleAddSave}
            sx={{
              backgroundColor: '#BEAF9B',
              color: '#fff',
              '&:hover': {
                backgroundColor: '#9e8e7a',
              },
              '&:disabled': {
                backgroundColor: 'rgba(190, 175, 155, 0.5)',
              }
            }}
            disabled={isPastDate(editForm.date)}
          >
            Save
          </StyledButton>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog 
        open={deleteDialogOpen} 
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: '8px',
            background: 'linear-gradient(to right, rgba(190, 175, 155, 0.9), rgba(255, 255, 255, 0.9))',
          }
        }}
      >
        <DialogTitle sx={{ 
          fontFamily: "'Poppins', 'Roboto', sans-serif",
          fontWeight: 600,
          color: '#453C33',
          borderBottom: '1px solid rgba(190, 175, 155, 0.2)'
        }}>
          Confirm Deletion
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Typography sx={{ fontFamily: "'Poppins', 'Roboto', sans-serif" }}>
            Are you sure you want to delete this working hour entry?
          </Typography>
          {selectedItem && (
            <Box sx={{ mt: 2, p: 2, backgroundColor: 'rgba(190, 175, 155, 0.1)', borderRadius: '4px' }}>
              <Typography sx={{ fontFamily: "'Poppins', 'Roboto', sans-serif" }}>
                <strong>Date:</strong> {formatDate(selectedItem.date)}
              </Typography>
              <Typography sx={{ fontFamily: "'Poppins', 'Roboto', sans-serif" }}>
                <strong>Status:</strong> {selectedItem.is_closed ? 'Closed' : 'Open'}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid rgba(190, 175, 155, 0.2)' }}>
          <StyledButton
            onClick={() => setDeleteDialogOpen(false)}
            sx={{
              color: '#666',
              '&:hover': {
                color: '#453C33',
              }
            }}
          >
            Cancel
          </StyledButton>
          <StyledButton
            onClick={handleDeleteConfirm}
            sx={{
              backgroundColor: '#ff6b6b',
              color: '#fff',
              '&:hover': {
                backgroundColor: '#e05555',
              }
            }}
          >
            Delete
          </StyledButton>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default WorkingHours;