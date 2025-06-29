import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
  IconButton,
  Tabs,
  Tab,
  InputBase,
  Paper,
  Badge,
  Fab,
  Snackbar,
  Alert
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SearchIcon from "@mui/icons-material/Search";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SelectedServiceModal from "./ServiceModal";

const CategoryMenu = ({ open, onClose, setCurrentView, onBack, customerId }) => {
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState({});
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingServices, setLoadingServices] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredServices, setFilteredServices] = useState({});
  const [selectedServices, setSelectedServices] = useState([]);
  const [showSelectedServiceModal, setShowSelectedServiceModal] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // Fetch all categories on initial load
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/categories");
        const data = await response.json();
        const categoriesData = Array.isArray(data) ? data : [];
        setCategories(categoriesData);
        
        // Initialize services object with empty arrays for each category
        const servicesObj = {};
        categoriesData.forEach(cat => {
          servicesObj[cat.category_id] = [];
        });
        setServices(servicesObj);
        
        // Fetch services for first category immediately
        if (categoriesData.length > 0) {
          fetchServicesForCategory(categoriesData[0].category_id);
        }
      } catch (err) {
        console.error(err);
        setCategories([]);
        setServices({});
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // Fetch services for a specific category
  const fetchServicesForCategory = async (categoryId) => {
    setLoadingServices(true);
    try {
      const response = await fetch(
        `http://localhost:5001/api/services/category/${categoryId}`
      );
      const data = await response.json();
      const servicesData = Array.isArray(data) ? data : [];
      
      setServices(prev => ({
        ...prev,
        [categoryId]: servicesData
      }));
      
      setFilteredServices(prev => ({
        ...prev,
        [categoryId]: servicesData
      }));
    } catch (err) {
      console.error(err);
      setServices(prev => ({
        ...prev,
        [categoryId]: []
      }));
      setFilteredServices(prev => ({
        ...prev,
        [categoryId]: []
      }));
    } finally {
      setLoadingServices(false);
    }
  };

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    const categoryId = categories[newValue].category_id;
    
    // If services for this category haven't been loaded yet, fetch them
    if (services[categoryId].length === 0) {
      fetchServicesForCategory(categoryId);
    }
  };

  // Handle search
  const handleSearch = (event) => {
    const searchText = event.target.value.toLowerCase();
    setSearchTerm(searchText);
    
    // Filter services for all categories
    const filtered = {};
    Object.keys(services).forEach(categoryId => {
      filtered[categoryId] = services[categoryId].filter(service => 
        service.service_name.toLowerCase().includes(searchText)
      );
    });
    
    setFilteredServices(filtered);
  };

  // Add service to cart
  const handleAddToCart = (service) => {
    // Check if service already exists in selectedServices
    const serviceExists = selectedServices.some(
      selectedService => selectedService.service_id === service.service_id
    );
    
    // Only add if it doesn't exist already
    if (!serviceExists) {
      setSelectedServices(prev => [...prev, service]);
      // Show a brief confirmation
      setTimeout(() => {
        setShowSelectedServiceModal(true);
      }, 300);
    } else {
      // Show snackbar notification that service is already selected
      setSnackbarMessage(`${service.service_name} is already selected`);
      setSnackbarOpen(true);
    }
  };

  // Remove service from cart
  const handleRemoveService = (index) => {
    setSelectedServices(prev => {
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });
  };

  // Handle back button click
  const handleBackToBooking = () => {
    setCurrentView("BookingModal");
    onBack();
  };

  // Handle snackbar close
  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  // Toggle view between CategoryMenu and SelectedServiceModal
  const toggleSelectedServiceModal = () => {
    setShowSelectedServiceModal(!showSelectedServiceModal);
  };

  // Update services with stylist selection
  const handleUpdateServices = (updatedServices) => {
    setSelectedServices(updatedServices);
  };

  return (
    <Box sx={{ width: "100%", position: "relative" }}>
      {showSelectedServiceModal ? (
        <SelectedServiceModal 
          onClose={toggleSelectedServiceModal} 
          selectedServices={selectedServices} 
          removeService={handleRemoveService}
          onAddMore={toggleSelectedServiceModal}
          onUpdateServices={handleUpdateServices}
          customerId={customerId}
        />
      ) : (
        <>
          {/* Header with title and back button */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p: 2,
            }}
          >
            <Box>
              <Typography variant="h6" sx={{ fontWeight: "bold", color: "#000" }}>
                Salon Shadow White Services
              </Typography>
              <Typography
                variant="body2"
                sx={{ mt: 0.5, color: "#666", fontStyle: "italic" }}
              >
                Select a service for you & your friends!
              </Typography>
            </Box>
            
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <IconButton
                sx={{
                  color: "#BEAF9B",
                  "&:hover": {
                    backgroundColor: "transparent",
                    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
                  },
                  mr: 1,
                }}
                onClick={toggleSelectedServiceModal}
              >
                <Badge badgeContent={selectedServices.length} color="primary">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
              
              <IconButton
                sx={{
                  color: "#BEAF9B",
                  "&:hover": {
                    backgroundColor: "transparent",
                    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
                  },
                }}
                onClick={handleBackToBooking}
              >
                <ArrowBackIcon />
              </IconButton>
            </Box>
          </Box>
          
          {/* Search Box */}
          <Box sx={{ p: 2, pb: 1 }}>
            <Paper
              component="form"
              sx={{
                p: "2px 4px",
                display: "flex",
                alignItems: "center",
                border: "1px solid #e0e0e0",
                borderRadius: "24px",
              }}
            >
              <IconButton sx={{ p: "10px" }} aria-label="search">
                <SearchIcon />
              </IconButton>
              <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="Search"
                value={searchTerm}
                onChange={handleSearch}
              />
            </Paper>
          </Box>
          
          {loadingCategories ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              {/* Category Tabs */}
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                  value={activeTab}
                  onChange={handleTabChange}
                  variant="scrollable"
                  scrollButtons="auto"
                  textColor="primary"
                  indicatorColor="primary"
                  sx={{
                    "& .MuiTab-root": {
                      textTransform: "none",
                      minWidth: 80,
                      fontWeight: "medium",
                    },
                    "& .Mui-selected": {
                      color: "#BEAF9B !important",
                    },
                    "& .MuiTabs-indicator": {
                      backgroundColor: "#BEAF9B",
                    },
                  }}
                >
                  {categories.map((category) => (
                    <Tab 
                      key={category.category_id} 
                      label={category.category_name}
                    />
                  ))}
                </Tabs>
              </Box>
              
              {/* Services List - 2 services per row */}
              {categories.length > 0 && (
                <Box sx={{ p: 2 }}>
                  {loadingServices ? (
                    <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                      <CircularProgress />
                    </Box>
                  ) : (
                    <Box>
                      {activeTab < categories.length && (
                        <Box
                          sx={{
                            display: "grid",
                            gridTemplateColumns: "repeat(2, 1fr)",
                            gap: 2,
                          }}
                        >
                          {filteredServices[categories[activeTab].category_id]?.map((service) => (
                            <Box
                              key={service.service_id}
                              sx={{
                                p: 2,
                                border: "1px solid #f0f0f0",
                                borderRadius: "8px",
                                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                                "&:hover": {
                                  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                                },
                                display: "flex",
                                flexDirection: "column",
                              }}
                            >
                              <Typography variant="subtitle1" sx={{ fontWeight: "medium", mb: 1 }}>
                                {service.service_name}
                              </Typography>
                              
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                {service.price ? `${service.price} Rs` : ""}
                              </Typography>
                              
                              <Box sx={{ 
                                display: "flex", 
                                justifyContent: "space-between", 
                                alignItems: "center",
                                mt: "auto" 
                              }}>
                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                  <AccessTimeIcon sx={{ fontSize: 16, mr: 0.5, color: "#666" }} />
                                  <Typography variant="body2" color="text.secondary">
                                    {service.duration}
                                  </Typography>
                                </Box>
                                
                                {selectedServices.some(s => s.service_id === service.service_id) ? (
                                  <Typography
                                    variant="button"
                                    sx={{
                                      color: "#fff",
                                      backgroundColor: "#BEAF9B",
                                      px: 2,
                                      py: 0.5,
                                      borderRadius: "16px",
                                      pointerEvents: "none",
                                    }}
                                  >
                                    Selected
                                  </Typography>
                                ) : (
                                  <Typography
                                    variant="button"
                                    sx={{
                                      color: "primary.main",
                                      backgroundColor: "#f0f7ff",
                                      px: 2,
                                      py: 0.5,
                                      borderRadius: "16px",
                                      cursor: "pointer",
                                      "&:hover": {
                                        backgroundColor: "#e1f0ff",
                                      },
                                    }}
                                    onClick={() => handleAddToCart(service)}
                                  >
                                    Book
                                  </Typography>
                                )}
                              </Box>
                            </Box>
                          ))}
                        </Box>
                      )}
                      
                      {activeTab < categories.length && 
                        filteredServices[categories[activeTab].category_id]?.length === 0 && (
                        <Box sx={{ py: 4, textAlign: "center" }}>
                          <Typography variant="body2" color="text.secondary">
                            {searchTerm 
                              ? "No services match your search" 
                              : "No services available in this category"}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  )}
                </Box>
              )}
            </>
          )}
          
          {/* Floating cart button (visible only when services are selected) */}
          {selectedServices.length > 0 && (
            <Fab
              color="primary"
              aria-label="View Selected Services"
              sx={{
                position: "fixed",
                bottom: 16,
                right: 16,
                backgroundColor: "#BEAF9B",
                "&:hover": {
                  backgroundColor: "#A89985",
                }
              }}
              onClick={toggleSelectedServiceModal}
            >
              <Badge badgeContent={selectedServices.length} color="error">
                <ShoppingCartIcon />
              </Badge>
            </Fab>
          )}
          
          {/* Snackbar for notifications */}
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={3000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <Alert 
              onClose={handleCloseSnackbar} 
              severity="info" 
              variant="filled"
              sx={{ width: '100%' }}
            >
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </>
      )}
    </Box>
  );
};

export default CategoryMenu;