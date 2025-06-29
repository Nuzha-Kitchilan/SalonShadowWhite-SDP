// import React, { useState } from "react";
// import {
//   Box,
//   Typography,
//   Modal,
//   CircularProgress,
//   List,
//   ListItem,
//   ListItemText,
//   Divider,
//   IconButton,
// } from "@mui/material";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
// import ServiceDetailModal from "./ServiceDetail";

// const ServiceModal = ({
//   open,
//   onClose = () => {},
//   categoryName,
//   loading = false,
//   services = [],
//   onBack = () => {},
//   isInDrawer = false,
//   onAddToCart = () => {},
//   cartItems = [],
// }) => {
//   const [selectedService, setSelectedService] = useState(null);
//   const [showServiceDetail, setShowServiceDetail] = useState(false);

//   const handleServiceClick = (service) => {
//     setSelectedService(service);
//     setShowServiceDetail(true);
//   };

//   const handleBackToServices = () => {
//     setShowServiceDetail(false);
//     setSelectedService(null);
//   };

//   if (isInDrawer && showServiceDetail) {
//     return (
//       <ServiceDetailModal
//         service={selectedService}
//         onBack={handleBackToServices}
//         onClose={onClose}
//         onAddToCart={onAddToCart}
//         cartItems={cartItems}
//       />
//     );
//   }

//   const content = (
//     <Box
//       sx={{
//         width: "100%",
//         height: "100%",
//         bgcolor: "background.paper",
//         p: isInDrawer ? 0 : 3,
//         maxHeight: isInDrawer ? "100vh" : "80vh",
//         overflowY: "hidden",
//       }}
//     >
//       <Box sx={{ 
//         display: "flex", 
//         justifyContent: "space-between", 
//         alignItems: "center", 
//         p: 2,
//         borderBottom: "1px solid #e0e0e0",
//         background: "linear-gradient(to right, #f9f5f0, #ffffff)",
//         boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
//       }}>
//         {isInDrawer ? (
//           <Box sx={{ 
//             display: "flex", 
//             alignItems: "center",
//             gap: 1
//           }}>
//             <IconButton
//               sx={{
//                 color: "#BEAF9B",
//                 "&:hover": {
//                   backgroundColor: "rgba(190, 175, 155, 0.1)",
//                   transform: "scale(1.05)",
//                   transition: "all 0.2s",
//                 },
//               }}
//               onClick={onBack}
//             >
//               <ArrowBackIcon />
//             </IconButton>
//             <Typography 
//               variant="h6" 
//               sx={{ 
//                 fontWeight: 500,
//                 color: "#453C33",
//                 letterSpacing: "0.3px",
//                 fontFamily: "'Poppins', 'Roboto', sans-serif"
//               }}
//             >
//               {categoryName || "Services"}
//             </Typography>
//           </Box>
//         ) : (
//           <Typography 
//             variant="h6" 
//             sx={{ 
//               fontWeight: 500,
//               color: "#453C33",
//               letterSpacing: "0.3px",
//               fontFamily: "'Poppins', 'Roboto', sans-serif"
//             }}
//           >
//             {categoryName || "Services"}
//           </Typography>
//         )}
//       </Box>
//       {/* Removed divider as we now have a border-bottom in the header */}

//       {loading ? (
//         <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
//           <CircularProgress size={24} />
//         </Box>
//       ) : services.length === 0 ? (
//         <Box sx={{ 
//           display: "flex", 
//           flexDirection: "column", 
//           alignItems: "center", 
//           justifyContent: "center", 
//           p: 4, 
//           height: "50vh" 
//         }}>
//           <Box 
//             sx={{ 
//               bgcolor: "#f5f5f5", 
//               borderRadius: "50%", 
//               p: 2, 
//               mb: 2 
//             }}
//           >
//             <Typography 
//               variant="h5" 
//               sx={{ 
//                 color: "#BEAF9B", 
//                 width: "40px", 
//                 height: "40px", 
//                 display: "flex", 
//                 alignItems: "center", 
//                 justifyContent: "center" 
//               }}
//             >
//               !
//             </Typography>
//           </Box>
//           <Typography 
//             sx={{ 
//               p: 2, 
//               color: "#666", 
//               fontWeight: "medium", 
//               textAlign: "center" 
//             }}
//           >
//             No services available for this category.
//           </Typography>
//         </Box>
//       ) : (
//         <List 
//           disablePadding 
//           sx={{ 
//             maxHeight: "calc(100vh - 130px)", 
//             overflowY: "auto", 
//             scrollbarWidth: "none", 
//             "&::-webkit-scrollbar": { display: "none" }, 
//             msOverflowStyle: "none",
//             pt: 2,
//             pb: 4
//           }}>
//           {services.map((service, index) => (
//             <React.Fragment key={service.service_id}>
//               <ListItem
//                 component="div"
//                 sx={{
//                   py: 2,
//                   px: 2,
//                   cursor: "pointer",
//                   color: "#000",
//                   borderRadius: "10px",
//                   mx: 1,
//                   my: 0.5,
//                   transition: "all 0.2s ease-in-out",
//                   "&:hover": {
//                     background: "linear-gradient(to right, #BEAF9B, #D9CFC2)",
//                     boxShadow: "0 4px 8px rgba(0, 0, 0, 0.08)",
//                     transform: "translateY(-2px)",
//                   },
//                 }}
//                 onClick={() => handleServiceClick(service)}
//               >
//                 <ListItemText
//                   primary={service.service_name}
//                   secondary={`Duration: ${service.time_duration} mins | Price: ${service.price}`}
//                   primaryTypographyProps={{
//                     fontWeight: "600",
//                     fontSize: "1rem",
//                     color: "#453C33",
//                     fontFamily: "'Poppins', 'Roboto', sans-serif",
//                   }}
//                   secondaryTypographyProps={{
//                     color: "#666",
//                     fontSize: "0.85rem",
//                     fontWeight: "400",
//                     marginTop: "4px",
//                   }}
//                 />
//                 <Box sx={{ 
//                   display: "flex", 
//                   alignItems: "center", 
//                   gap: 1 
//                 }}>
//                   <Box 
//                     sx={{ 
//                       bgcolor: "#BEAF9B20", 
//                       borderRadius: "50%", 
//                       p: 0.8,
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       transition: "all 0.2s"
//                     }}
//                   >
//                     <ArrowForwardIosIcon sx={{ fontSize: "14px", color: "#BEAF9B" }} />
//                   </Box>
//                 </Box>
//               </ListItem>
//               {index < services.length - 1 && <Divider sx={{ opacity: 0.6, borderStyle: 'dashed', mx: 2 }} />}
//             </React.Fragment>
//           ))}
//         </List>
//       )}
//     </Box>
//   );

//   if (isInDrawer) return content;

//   return (
//     <Modal open={open} onClose={onClose}>
//       <Box
//         sx={{
//           position: "absolute",
//           top: "50%",
//           left: "50%",
//           transform: "translate(-50%, -50%)",
//           width: "90%",
//           maxWidth: 500,
//           bgcolor: "background.paper",
//           borderRadius: 2,
//           boxShadow: 24,
//         }}
//       >
//         {content}
//       </Box>
//     </Modal>
//   );
// };

// export default ServiceModal;







import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  IconButton,
  Button,
  Paper,
  Card,
  CardContent,
  Stack
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AddIcon from '@mui/icons-material/Add';
import PersonIcon from '@mui/icons-material/Person';
import StylistSelectModal from './StylistSelection';
import TimeSelectionModal from './TimeSelection';

// Remove console.log
// console.log("Received customerId:", customerId);

const SelectedServiceModal = ({ onClose, selectedServices, removeService, onAddMore, onProceed, onUpdateServices, customerId }) => {
  const [showStylistModal, setShowStylistModal] = useState(false);
  const [showTimeSelectionModal, setShowTimeSelectionModal] = useState(false);
  const [currentServiceIndex, setCurrentServiceIndex] = useState(null);

  const calculateTotal = () => {
    const totalPrice = selectedServices.reduce((sum, service) => {
      const price = typeof service.price === 'string' 
        ? parseInt(service.price, 10) 
        : service.price;
      return sum + (isNaN(price) ? 0 : price);
    }, 0);
    return totalPrice;
  };

  const formatPrice = (price) => {
    return `Rs.${price}`;
  };

  const handleSelectStaff = (index) => {
    setCurrentServiceIndex(index);
    setShowStylistModal(true);
  };

  const handleStylistSelection = (stylist) => {
    if (currentServiceIndex !== null) {
      // Create a new array to avoid mutating props directly
      const updatedServices = [...selectedServices];
      updatedServices[currentServiceIndex] = {
        ...updatedServices[currentServiceIndex],
        selectedStylist: stylist
      };
      
     
      if (typeof onUpdateServices === 'function') {
        onUpdateServices(updatedServices);
      } else {
        console.warn('onUpdateServices function not provided to SelectedServiceModal');
      }
    }
    setShowStylistModal(false);
  };

  const handleProceed = () => {
    setShowTimeSelectionModal(true);
    
    
    if (typeof onProceed === 'function') {
      onProceed();
    }
  };

  
  const timeSelectionModalRef = React.useRef(null);

  if (showTimeSelectionModal) {
    return (
      <TimeSelectionModal
        ref={timeSelectionModalRef}
        services={selectedServices} 
        customerId={customerId}
        selectedStylist={selectedServices.length === 1 ? selectedServices[0].selectedStylist : null}
        onBack={() => setShowTimeSelectionModal(false)}
        onClose={onClose}
      />
    );
  }

  if (showStylistModal) {
    return (
      <StylistSelectModal
        service={selectedServices[currentServiceIndex]}
        onBack={() => setShowStylistModal(false)}
        onClose={() => {
          setShowStylistModal(false);
          onClose();
        }}
        onStylistSelected={(stylist) => handleStylistSelection(stylist)}
      />
    );
  }

  return (
    <Box sx={{ width: '100%', maxHeight: '90vh', overflow: 'auto' }}>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 2,
          borderBottom: '1px solid #f0f0f0',
        }}
      >
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#000' }}>
            Selected Services
          </Typography>
          <Typography
            variant="body2"
            sx={{ mt: 0.5, color: '#666', fontStyle: 'italic' }}
          >
            Review your selected services
          </Typography>
        </Box>
        
        <IconButton
          sx={{
            color: '#BEAF9B',
            '&:hover': {
              backgroundColor: 'transparent',
              boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
            },
          }}
          onClick={onClose}
        >
          <ArrowBackIcon />
        </IconButton>
      </Box>

      {/* Services List */}
      <Box sx={{ p: 2 }}>
        {selectedServices.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <Typography variant="body1" color="text.secondary">
              No services selected yet
            </Typography>
            <Button 
              variant="contained" 
              startIcon={<AddIcon />}
              onClick={onAddMore}
              sx={{ 
                mt: 2, 
                backgroundColor: '#BEAF9B',
                '&:hover': { backgroundColor: '#A89985' }
              }}
            >
              Add Services
            </Button>
          </Box>
        ) : (
          <>
            <Grid container spacing={2} sx={{ mb: 2 }}>
              {selectedServices.map((service, index) => (
                <Grid item xs={12} sm={6} key={`${service.service_id}-${index}`}>
                  <Card 
                    elevation={1} 
                    sx={{ 
                      border: '1px solid #f0f0f0',
                      '&:hover': { boxShadow: '0 4px 8px rgba(0,0,0,0.1)' },
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Box sx={{ width: '100%' }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                            {service.service_name}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                            <AccessTimeIcon sx={{ fontSize: 16, mr: 0.5, color: '#666' }} />
                            <Typography variant="body2" color="text.secondary">
                              {service.duration}
                            </Typography>
                          </Box>
                          
                          {/* Stylist info section */}
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, justifyContent: 'space-between' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <PersonIcon sx={{ fontSize: 16, mr: 0.5, color: '#666' }} />
                              <Typography variant="body2" color="text.secondary">
                                {service.selectedStylist ? 
                                  `${service.selectedStylist.firstname} ${service.selectedStylist.lastname}` : 
                                  'With any available staff'}
                              </Typography>
                            </Box>
                            
                            <Button
                              variant="text"
                              size="small"
                              onClick={() => handleSelectStaff(index)}
                              sx={{
                                color: '#1976d2',
                                textTransform: 'none',
                                fontSize: '0.75rem',
                                p: 0,
                                minWidth: 'auto',
                                ml: 1
                              }}
                            >
                              Select Staff
                            </Button>
                          </Box>
                          
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1, alignItems: 'center' }}>
                            <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                              {formatPrice(service.price)}
                            </Typography>
                            <IconButton 
                              size="small" 
                              onClick={() => removeService(index)}
                              sx={{ color: '#ff5252' }}
                            >
                              <DeleteOutlineIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* Summary and Actions */}
            <Paper elevation={3} sx={{ p: 2, mb: 2, borderRadius: 2 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Summary
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body1">Total Services</Typography>
                <Typography variant="body1">{selectedServices.length}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Total Price</Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{formatPrice(calculateTotal())}</Typography>
              </Box>
            </Paper>

            <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
              <Button 
                variant="outlined" 
                fullWidth
                startIcon={<AddIcon />}
                onClick={onAddMore}
                sx={{ 
                  borderColor: '#BEAF9B', 
                  color: '#BEAF9B',
                  '&:hover': { 
                    borderColor: '#A89985',
                    backgroundColor: 'rgba(190, 175, 155, 0.04)'
                  } 
                }}
              >
                Add More
              </Button>
              <Button 
                variant="contained" 
                fullWidth
                onClick={handleProceed}
                sx={{ 
                  backgroundColor: '#BEAF9B',
                  '&:hover': { backgroundColor: '#A89985' }
                }}
              >
                Confirm
              </Button>
            </Stack>
          </>
        )}
      </Box>
    </Box>
  );
};

export default SelectedServiceModal;