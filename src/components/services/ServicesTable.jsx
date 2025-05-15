import React, { useState, useEffect, useCallback } from 'react';
import {
  Table, TableHead, TableBody, TableRow, TableCell,
  TableContainer, Paper, IconButton, Button, Box, CircularProgress,
  Typography, TablePagination, Chip, Tooltip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PriceCheckIcon from '@mui/icons-material/PriceCheck';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import axios from 'axios';
import ServiceForm from './ServiceForm';
import DeleteDialog from '../DeleteDialog';
import SearchAndFilter from './SearchAndFilter';

const ServicesTable = ({ categories, setCategories, adminId, tableSx, buttonSx }) => {
  const [services, setServices] = useState([]);
  const [localCategories, setLocalCategories] = useState(categories || []);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5); // Match inventory table

  // Effect to sync categories from props
  useEffect(() => {
    if (categories && categories.length > 0) {
      setLocalCategories(categories);
    }
  }, [categories]);

  // Fetch categories if not available
  const fetchCategories = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/categories');
      const fetchedCategories = response.data;
      setLocalCategories(fetchedCategories);
      if (setCategories) {
        setCategories(fetchedCategories);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }, [setCategories]);

  // Ensure categories are loaded
  useEffect(() => {
    if (!localCategories || localCategories.length === 0) {
      fetchCategories();
    }
  }, [localCategories, fetchCategories]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 1000);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchServices = useCallback(async (search = '', category = '') => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5001/api/services', {
        params: { search, category }
      });
      setServices(response.data);
    } catch (error) {
      console.error("Error fetching services:", error);
      setError("Failed to load services");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices(debouncedSearchTerm, categoryFilter);
  }, [debouncedSearchTerm, categoryFilter, fetchServices]);

  const handleDeleteConfirm = async () => {
    if (!selectedService) return;
    try {
      await axios.delete(`http://localhost:5001/api/services/${selectedService.service_id}`);
      await fetchServices(debouncedSearchTerm, categoryFilter);
    } catch (err) {
      console.error("Error deleting service:", err);
    } finally {
      setOpenDeleteDialog(false);
    }
  };

  const filteredServices = Array.isArray(services)
    ? services.filter(service =>
      service.service_name?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) &&
      (categoryFilter === "" || service.category_name === categoryFilter)
    )
    : [];

  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // reset to first page
  };

  // Apply pagination
  const emptyRows = page > 0 
    ? Math.max(0, (1 + page) * rowsPerPage - filteredServices.length) 
    : 0;

  const visibleServices = filteredServices.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

 const formatCurrency = (price) => {
  if (price === undefined || price === null) return "Rs. 0.00";
  return `Rs. ${new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price)}`;
};


  const getDurationClass = (duration) => {
    if (!duration) return "medium";
    if (duration <= 30) return "short";
    if (duration >= 120) return "long";
    return "medium";
  };

  const getPriceClass = (price) => {
    if (!price) return "low";
    if (price < 50) return "low";
    if (price >= 150) return "high";
    return "medium";
  };

  const handleOpenForm = () => {
    // Ensure categories are loaded before opening form
    if (localCategories.length === 0) {
      fetchCategories().then(() => {
        setSelectedService(null);
        setOpenForm(true);
      });
    } else {
      setSelectedService(null);
      setOpenForm(true);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress sx={{ color: "#BEAF9B" }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" align="center" mt={4} 
        sx={{ fontFamily: "'Poppins', 'Roboto', sans-serif" }}>
        {error}
      </Typography>
    );
  }

  return (
    <>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button
          variant="contained"
          onClick={handleOpenForm}
          startIcon={<AddCircleOutlineIcon />}
          sx={{ 
            backgroundColor: "#BEAF9B", 
            color: "white",
            fontFamily: "'Poppins', 'Roboto', sans-serif",
            fontWeight: 500,
            boxShadow: "none",
            "&:hover": {
              backgroundColor: "#A89683",
              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)"
            },
            ...buttonSx
          }}
        >
          Add Service
        </Button>
      </Box>

      <SearchAndFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        categories={localCategories}
      />

      <Paper 
        elevation={0}
        sx={{ 
          border: "1px solid rgba(190, 175, 155, 0.2)",
          borderRadius: "8px",
          overflow: "hidden",
          mb: 4,
          ...tableSx
        }}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell 
                  sx={{ 
                    fontWeight: 600, 
                    color: "#453C33",
                    fontFamily: "'Poppins', 'Roboto', sans-serif",
                    borderBottom: "2px solid rgba(190, 175, 155, 0.3)"
                  }}
                >
                  ID
                </TableCell>
                <TableCell 
                  sx={{ 
                    fontWeight: 600, 
                    color: "#453C33",
                    fontFamily: "'Poppins', 'Roboto', sans-serif",
                    borderBottom: "2px solid rgba(190, 175, 155, 0.3)"
                  }}
                >
                  Service Name
                </TableCell>
                <TableCell 
                  sx={{ 
                    fontWeight: 600, 
                    color: "#453C33",
                    fontFamily: "'Poppins', 'Roboto', sans-serif",
                    borderBottom: "2px solid rgba(190, 175, 155, 0.3)"
                  }}
                >
                  Category
                </TableCell>
                <TableCell 
                  sx={{ 
                    fontWeight: 600, 
                    color: "#453C33",
                    fontFamily: "'Poppins', 'Roboto', sans-serif",
                    borderBottom: "2px solid rgba(190, 175, 155, 0.3)"
                  }}
                >
                  Duration
                </TableCell>
                <TableCell 
                  sx={{ 
                    fontWeight: 600, 
                    color: "#453C33",
                    fontFamily: "'Poppins', 'Roboto', sans-serif",
                    borderBottom: "2px solid rgba(190, 175, 155, 0.3)"
                  }}
                >
                  Price
                </TableCell>
                <TableCell 
                  sx={{ 
                    fontWeight: 600, 
                    color: "#453C33",
                    fontFamily: "'Poppins', 'Roboto', sans-serif",
                    borderBottom: "2px solid rgba(190, 175, 155, 0.3)"
                  }}
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {visibleServices.length > 0 ? (
                visibleServices.map((service) => {
                  const durationClass = getDurationClass(service.time_duration);
                  const priceClass = getPriceClass(service.price);
                  
                  return (
                    <TableRow 
                      key={service.service_id}
                      sx={{ 
                        '&:nth-of-type(odd)': { backgroundColor: "rgba(190, 175, 155, 0.03)" },
                        '&:hover': { backgroundColor: "rgba(190, 175, 155, 0.1)" },
                        transition: "background-color 0.2s"
                      }}
                    >
                      <TableCell
                        sx={{ 
                          fontFamily: "'Poppins', 'Roboto', sans-serif",
                          color: "#666"
                        }}
                      >
                        {service.service_id}
                      </TableCell>
                      <TableCell
                        sx={{ 
                          fontFamily: "'Poppins', 'Roboto', sans-serif",
                          fontWeight: 500,
                          color: "#453C33"
                        }}
                      >
                        {service.service_name || 'N/A'}
                      </TableCell>
                      <TableCell
                        sx={{ 
                          fontFamily: "'Poppins', 'Roboto', sans-serif"
                        }}
                      >
                        <Chip 
                          label={service.category_name || 'Uncategorized'} 
                          size="small"
                          sx={{ 
                            backgroundColor: "rgba(190, 175, 155, 0.2)",
                            color: "#453C33",
                            fontFamily: "'Poppins', 'Roboto', sans-serif",
                            fontWeight: 500
                          }}
                        />
                      </TableCell>
                      <TableCell
                        sx={{ 
                          fontFamily: "'Poppins', 'Roboto', sans-serif"
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <AccessTimeIcon 
                            fontSize="small" 
                            sx={{ 
                              color: durationClass === "short" ? "#66bb6a" : 
                                    durationClass === "long" ? "#ffaa5a" : "#BEAF9B"
                            }} 
                          />
                          <Typography
                            sx={{ 
                              fontWeight: 500,
                              color: "#453C33",
                              fontFamily: "'Poppins', 'Roboto', sans-serif"
                            }}
                          >
                            {service.time_duration || '0'} mins
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell
                        sx={{ 
                          fontFamily: "'Poppins', 'Roboto', sans-serif"
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <PriceCheckIcon 
                            fontSize="small" 
                            sx={{ 
                              color: priceClass === "low" ? "#66bb6a" : 
                                    priceClass === "high" ? "#ffaa5a" : "#BEAF9B"
                            }} 
                          />
                          <Typography
                            sx={{ 
                              fontWeight: 500,
                              color: "#453C33",
                              fontFamily: "'Poppins', 'Roboto', sans-serif"
                            }}
                          >
                            {formatCurrency(service.price)}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex' }}>
                          <Tooltip title="Edit Service">
                            <IconButton 
                              onClick={() => {
                                if (localCategories.length === 0) {
                                  fetchCategories().then(() => {
                                    setSelectedService(service);
                                    setOpenForm(true);
                                  });
                                } else {
                                  setSelectedService(service);
                                  setOpenForm(true);
                                }
                              }}
                              sx={buttonSx?.edit || { color: "#BEAF9B" }}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Service">
                            <IconButton 
                              onClick={() => {
                                setSelectedService(service);
                                setOpenDeleteDialog(true);
                              }}
                              sx={buttonSx?.delete || { color: "#ff6b6b" }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Typography 
                      sx={{ 
                        fontFamily: "'Poppins', 'Roboto', sans-serif",
                        color: "#666"
                      }}
                    >
                      No services found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredServices.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            borderTop: "1px solid rgba(190, 175, 155, 0.2)",
            '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
              fontFamily: "'Poppins', 'Roboto', sans-serif",
              color: "#666"
            },
            '.MuiTablePagination-select': {
              fontFamily: "'Poppins', 'Roboto', sans-serif",
            },
            '.MuiTablePagination-actions': {
              '& .MuiIconButton-root': {
                color: "#BEAF9B"
              }
            }
          }}
        />
      </Paper>

      <ServiceForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        service={selectedService}
        categories={localCategories}
        adminId={adminId}
        refreshData={() => fetchServices(debouncedSearchTerm, categoryFilter)}
      />

      <DeleteDialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        onConfirm={handleDeleteConfirm}
        title="Confirm Delete"
        message="Are you sure you want to delete this service?"
      />
    </>
  );
};

export default ServicesTable;