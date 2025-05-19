import React, { useState, useEffect } from "react";
import {
  Button,
  Drawer,
  Box,
  Typography,
  IconButton,
  Badge,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SpecialRequest from "../SpecialRequestForm";
import CategoryMenu from "./CategoryMenu";
import CartModal from "./CartModal";
import bookingHeaderImg from "../../assets/booking-header.png";
import jwt_decode from "jwt-decode";

const BookingButton = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [currentView, setCurrentView] = useState("main");
  const [cartItemCount, setCartItemCount] = useState(0);
  const [customerId, setCustomerId] = useState(null);

  // Get customerId from JWT token when component mounts
  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (token) {
      try {
        const decodedToken = jwt_decode(token);
        console.log("Decoded token:", decodedToken);
        
        const userId = decodedToken.customer_ID || decodedToken.id || decodedToken.sub;
        setCustomerId(userId);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  // Fetch cart items count when component mounts or customerId changes
  useEffect(() => {
    if (customerId) {
      fetchCartItemsCount();
      
      
      const intervalId = setInterval(fetchCartItemsCount, 30000);
      
      
      return () => clearInterval(intervalId);
    }
  }, [customerId]);
  
  // Refresh cart count when drawer opens or closes
  useEffect(() => {
    if (customerId) {
      fetchCartItemsCount();
    }
  }, [openDrawer]);

  const fetchCartItemsCount = async () => {
    if (!customerId) {
      console.log("Skipping cart fetch: No customer ID available");
      return;
    }
    
    try {
      console.log(`Fetching cart items for customer ID: ${customerId}`);
      const response = await fetch(`http://localhost:5001/api/cart/${customerId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch cart items: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("Cart items fetched:", data);
      
      
      if (Array.isArray(data)) {
        setCartItemCount(data.length);
      }
    } catch (err) {
      console.error("Error fetching cart items count:", err);
    }
  };

  const toggleDrawer = () => {
    setOpenDrawer(!openDrawer);
    if (!openDrawer) {
      setCurrentView("main");
    }
  };

  const handleShowSpecialRequest = () => setCurrentView("specialRequest");
  const handleShowCategories = () => setCurrentView("categories");
  const handleShowCart = () => setCurrentView("cart");
  const handleBackToMain = () => setCurrentView("main");

  const handleAddMore = () => {
    setCurrentView("categories");
    fetchCartItemsCount(); // Refresh cart count when adding more items
  };

  const renderHeader = () => (
    <Box sx={{  
      width: "100%", 
      position: "relative",
      height: { xs: '180px', sm: '200px', md: '240px' },
      overflow: "hidden"  
    }}>
      <img
        src={bookingHeaderImg}
        alt="Booking Header"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
      <Box sx={{ 
        position: "absolute", 
        top: 10, 
        right: 10, 
        display: 'flex', 
        gap: 1 
      }}>
        {/* Cart icon in header */}
        <IconButton
          onClick={handleShowCart}
          aria-label={`${cartItemCount} items in your cart`}
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            "&:hover": {
              backgroundColor: "#fff",
            },
          }}
        >
          <Badge 
            badgeContent={cartItemCount} 
            color="error"
            max={99}
            overlap="circular"
            sx={{
              '& .MuiBadge-badge': {
                backgroundColor: '#FF5252',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '0.7rem',
              }
            }}
          >
            <ShoppingCartIcon />
          </Badge>
        </IconButton>
        
        {/* Close button */}
        <IconButton
          onClick={toggleDrawer}
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            "&:hover": {
              backgroundColor: "#fff",
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
    </Box>
  );

  const renderMainView = () => (
    <Box sx={{ px: 2, pt: 0 }}>
      <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 0 }}>
        APPOINTMENT PREFERENCE
      </Typography>

      {/* Individual Appointment */}
      <Box
        onClick={handleShowCategories}
        sx={{
          py: 2,
          borderBottom: "1px solid #ddd",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "pointer",
        }}
      >
        <Box>
          <Typography
            variant="body1"
            sx={{ color: "#8C7B6B", fontWeight: "bold" }}
          >
            Individual Appointment
          </Typography>
          <Typography variant="body2" sx={{ color: "#666" }}>
            Schedule services for yourself
          </Typography>
        </Box>
        <ArrowForwardIosIcon sx={{ fontSize: "16px", color: "#888" }} />
      </Box>

      {/* Special Request */}
      <Box
        onClick={handleShowSpecialRequest}
        sx={{
          py: 2,
          borderBottom: "1px solid #ddd",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "pointer",
        }}
      >
        <Box>
          <Typography
            variant="body1"
            sx={{ color: "#8C7B6B", fontWeight: "bold" }}
          >
            Special Request
          </Typography>
          <Typography variant="body2" sx={{ color: "#666" }}>
            Make a custom service request
          </Typography>
        </Box>
        <ArrowForwardIosIcon sx={{ fontSize: "16px", color: "#888" }} />
      </Box>
      
    </Box>
  );

  const renderContent = () => {
    switch (currentView) {
      case "specialRequest":
        return <SpecialRequest setCurrentView={setCurrentView} />;
      case "categories":
        return <CategoryMenu 
        setCurrentView={setCurrentView} 
        customerId={customerId} />;
      case "cart":
        return (
          <CartModal
            onBack={handleBackToMain}
            onClose={toggleDrawer}
            customerId={customerId}
            onAddMore={handleAddMore}
          />
        );
      default:
        return renderMainView();
    }
  };

  // Direct cart access button click handler
  const handleCartButtonClick = () => {
    if (!customerId) {
      // Handle case where user is not logged in
      alert("Please log in to view your cart");
      return;
    }
    setCurrentView("cart");
    setOpenDrawer(true);
  };

  return (
    <Box sx={{ 
      display: "flex", 
      gap: 2, 
      alignItems: "center",
      justifyContent: { xs: "center", sm: "center" },
      width: "100%",
      maxWidth: "1200px",
      mx: "auto",
      px: { xs: 2, sm: 3, md: 4 }
    }}>
      
      <Button
        variant="contained"
        size="large"
        onClick={toggleDrawer}
        sx={{
          backgroundColor: "#d3d3d3",
          color: "#333",
          px: { xs: 3, sm: 4 },
          py: { xs: 0, sm: 1.5 },
          fontWeight: "bold",
          fontSize: "1rem",
          borderRadius: "30px",
          marginTop: { xs: "200px", sm: "250px" },
          position: { xs: "relative", sm: "static" },
          top: { xs: "-80px", sm: "auto" },
          left: { xs: "50%", sm: "auto" },
          transform: { xs: "translateX(-50%)", sm: "none" },
          "&:hover": {
            backgroundColor: "#c0c0c0",
          },
        }}

      >
        Book Now
      </Button>
      
      
      <Drawer
        anchor="right"
        open={openDrawer}
        onClose={toggleDrawer}
        PaperProps={{
          sx: {
            width: { xs: "100%", sm: "75%", md: "60%", lg: "50%" },
            maxWidth: "800px",
            backgroundColor: "#fff",
          },
        }}
      >
        <>
          
          {renderHeader()}
          
          {currentView === "cart" ? (
            <Box sx={{ height: "calc(100% - 240px)", overflowY: "auto" }}>
              <CartModal
                onBack={handleBackToMain}
                onClose={() => {
                  toggleDrawer();
                  fetchCartItemsCount();
                }}
                customerId={customerId}
                onAddMore={() => {
                  handleAddMore();
                  fetchCartItemsCount();
                }}
              />
            </Box>
          ) : (
            <>
              {currentView === "main" && renderMainView()}
              {currentView !== "main" && (
                <Box
                  sx={{
                    px: currentView === "categories" ? 0 : 2,
                    py: 2,
                    overflowY: "auto",
                    height: "calc(100% - 240px)",
                    "& ::-webkit-scrollbar": {
                      display: "none",
                    },
                  }}
                >
                  {renderContent()}
                </Box>
              )}
            </>
          )}
        </>
      </Drawer>
    </Box>
  );
};

export default BookingButton;