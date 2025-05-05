import React, { useState, useEffect, useCallback } from 'react';
import {
  Table, TableHead, TableBody, TableRow, TableCell,
  TableContainer, Paper, IconButton, Button, Box, CircularProgress,
  Typography, TablePagination
} from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import axios from 'axios';
import ServiceForm from './ServiceForm';
import DeleteDialog from '../DeleteDialog';
import SearchAndFilter from './SearchAndFilter';

const ServicesTable = ({ categories, setCategories, adminId }) => {
  const [services, setServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(0); // Pagination
  const [rowsPerPage, setRowsPerPage] = useState(10); // Show 10 rows per page

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

  const paginatedServices = filteredServices.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" align="center" mt={4}>
        {error}
      </Typography>
    );
  }

  return (
    <>
      <Button
        variant="contained"
        onClick={() => {
          setSelectedService(null);
          setOpenForm(true);
        }}
        sx={{ mb: 2 }}
      >
        + Add Service
      </Button>

      <SearchAndFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        categories={categories}
      />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedServices.length > 0 ? (
              paginatedServices.map((service) => (
                <TableRow key={service.service_id}>
                  <TableCell>{service.service_id}</TableCell>
                  <TableCell>{service.service_name || 'N/A'}</TableCell>
                  <TableCell>{service.category_name || 'N/A'}</TableCell>
                  <TableCell>{service.time_duration || '0'} mins</TableCell>
                  <TableCell>
                    {service.price !== undefined && service.price !== null
                      ? `$${Number(service.price).toFixed(2)}`
                      : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => {
                      setSelectedService(service);
                      setOpenForm(true);
                    }}>
                      <Edit color="primary" />
                    </IconButton>
                    <IconButton onClick={() => {
                      setSelectedService(service);
                      setOpenDeleteDialog(true);
                    }}>
                      <Delete color="error" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No services found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <TablePagination
          component="div"
          count={filteredServices.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </TableContainer>

      <ServiceForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        service={selectedService}
        categories={categories}
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
