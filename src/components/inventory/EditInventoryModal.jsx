// import React, { useState, useEffect } from "react";
// import { Dialog, DialogContent, DialogActions, TextField, Button } from "@mui/material";

// const EditInventoryModal = ({ open, onClose, item, onSubmit }) => {
//   const [editItem, setEditItem] = useState({
//     inventory_id: "",
//     product_name: "",
//     quantity: "",
//     price: "",
//     manufacture_date: "",
//     expire_date: "",
//     brand: ""
//   });

//   useEffect(() => {
//     if (item) {
//       setEditItem(item);
//     }
//   }, [item]);

//   const handleSubmit = () => {
//     // Validation
//     if (!editItem.product_name || !editItem.quantity || !editItem.price || 
//         !editItem.manufacture_date || !editItem.expire_date || !editItem.brand) {
//       alert("All fields are required.");
//       return;
//     }
    
//     onSubmit(editItem);
//   };

//   return (
//     <Dialog open={open} onClose={onClose}>
//       <DialogContent>
//         <TextField
//           label="Product Name"
//           value={editItem.product_name}
//           onChange={(e) => setEditItem({ ...editItem, product_name: e.target.value })}
//           fullWidth
//           margin="normal"
//         />
//         <TextField
//           label="Brand"
//           value={editItem.brand}
//           onChange={(e) => setEditItem({ ...editItem, brand: e.target.value })}
//           fullWidth
//           margin="normal"
//         />
//         <TextField
//           label="Quantity"
//           type="number"
//           value={editItem.quantity}
//           onChange={(e) => setEditItem({ ...editItem, quantity: e.target.value })}
//           fullWidth
//           margin="normal"
//         />
//         <TextField
//           label="Price"
//           type="number"
//           value={editItem.price}
//           onChange={(e) => setEditItem({ ...editItem, price: e.target.value })}
//           fullWidth
//           margin="normal"
//         />
//         <TextField
//           label="Manufacture Date"
//           type="date"
//           value={editItem.manufacture_date}
//           onChange={(e) => setEditItem({ ...editItem, manufacture_date: e.target.value })}
//           fullWidth
//           margin="normal"
//           InputLabelProps={{
//             shrink: true,
//           }}
//         />
//         <TextField
//           label="Expiration Date"
//           type="date"
//           value={editItem.expire_date}
//           onChange={(e) => setEditItem({ ...editItem, expire_date: e.target.value })}
//           fullWidth
//           margin="normal"
//           InputLabelProps={{
//             shrink: true,
//           }}
//         />
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={onClose} color="primary">
//           Cancel
//         </Button>
//         <Button onClick={handleSubmit} color="primary">
//           Save
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default EditInventoryModal;

















import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  IconButton,
  Paper,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import InventoryIcon from "@mui/icons-material/Inventory";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PriceChangeIcon from "@mui/icons-material/PriceChange";
import BrandingWatermarkIcon from "@mui/icons-material/BrandingWatermark";
import ProductionQuantityLimitsIcon from "@mui/icons-material/ProductionQuantityLimits";

const EditInventoryModal = ({ open, onClose, item, onSubmit }) => {
  const [editItem, setEditItem] = useState({
    inventory_id: "",
    product_name: "",
    quantity: "",
    price: "",
    manufacture_date: "",
    expire_date: "",
    brand: ""
  });

  useEffect(() => {
    if (item) {
      setEditItem(item);
    }
  }, [item]);

  const handleSubmit = () => {
    // Validation
    if (!editItem.product_name || !editItem.quantity || !editItem.price || 
        !editItem.manufacture_date || !editItem.expire_date || !editItem.brand) {
      alert("All fields are required.");
      return;
    }
    
    onSubmit(editItem);
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: "12px",
          overflow: "hidden",
          bgcolor: "#f9f5f0",
        }
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
          <IconButton
            sx={{
              color: "#BEAF9B",
              "&:hover": {
                backgroundColor: "rgba(190, 175, 155, 0.1)",
                transform: "scale(1.05)",
                transition: "all 0.2s",
              },
            }}
            onClick={onClose}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 500,
              color: "#453C33",
              letterSpacing: "0.3px",
              fontFamily: "'Poppins', 'Roboto', sans-serif"
            }}
          >
            EDIT INVENTORY ITEM
          </Typography>
        </Box>
      </Box>

      {/* Message */}
      <Box 
        sx={{ 
          p: 2, 
          backgroundColor: "rgba(190, 175, 155, 0.1)",
          borderBottom: "1px dashed rgba(190, 175, 155, 0.3)",
        }}
      >
        <Typography 
          variant="body2" 
          sx={{ 
            color: "#666", 
            fontStyle: "italic",
            textAlign: "center",
            fontFamily: "'Poppins', 'Roboto', sans-serif"
          }}
        >
          Please modify the details of this inventory item
        </Typography>
      </Box>

      <DialogContent sx={{ p: 3, bgcolor: "#f9f5f0" }}>
        {/* Product Name */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ 
            display: "flex", 
            alignItems: "center", 
            mb: 1 
          }}>
            <InventoryIcon sx={{ color: "#BEAF9B", mr: 1 }} />
            <Typography 
              variant="subtitle1" 
              sx={{ 
                color: "#453C33",
                fontWeight: 500,
                fontFamily: "'Poppins', 'Roboto', sans-serif"
              }}
            >
              PRODUCT DETAILS
            </Typography>
          </Box>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: "8px",
              border: "1px solid rgba(190, 175, 155, 0.3)",
              bgcolor: "#fff",
            }}
          >
            <TextField
              label="Product Name"
              value={editItem.product_name}
              onChange={(e) => setEditItem({ ...editItem, product_name: e.target.value })}
              fullWidth
              margin="normal"
              variant="outlined"
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
                "& .MuiInputLabel-root": {
                  color: "#453C33",
                  fontFamily: "'Poppins', 'Roboto', sans-serif",
                },
                mb: 2,
              }}
            />
            
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <BrandingWatermarkIcon sx={{ color: "#BEAF9B", mr: 1, fontSize: "1rem" }} />
              <Typography 
                variant="body2" 
                sx={{ 
                  color: "#453C33",
                  fontFamily: "'Poppins', 'Roboto', sans-serif"
                }}
              >
                BRAND
              </Typography>
            </Box>
            
            <TextField
              value={editItem.brand}
              onChange={(e) => setEditItem({ ...editItem, brand: e.target.value })}
              fullWidth
              variant="outlined"
              size="small"
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
          </Paper>
        </Box>

        {/* Quantity and Price */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ 
            display: "flex", 
            alignItems: "center", 
            mb: 1 
          }}>
            <ProductionQuantityLimitsIcon sx={{ color: "#BEAF9B", mr: 1 }} />
            <Typography 
              variant="subtitle1" 
              sx={{ 
                color: "#453C33",
                fontWeight: 500,
                fontFamily: "'Poppins', 'Roboto', sans-serif"
              }}
            >
              QUANTITY & PRICE
            </Typography>
          </Box>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: "8px",
              border: "1px solid rgba(190, 175, 155, 0.3)",
              bgcolor: "#fff",
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
            }}
          >
            <TextField
              label="Quantity"
              type="number"
              value={editItem.quantity}
              onChange={(e) => setEditItem({ ...editItem, quantity: e.target.value })}
              fullWidth
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <Box sx={{ mr: 1, color: "#BEAF9B" }}>
                    <ProductionQuantityLimitsIcon fontSize="small" />
                  </Box>
                ),
              }}
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
                "& .MuiInputLabel-root": {
                  color: "#453C33",
                  fontFamily: "'Poppins', 'Roboto', sans-serif",
                },
              }}
            />
            
            <TextField
              label="Price"
              type="number"
              value={editItem.price}
              onChange={(e) => setEditItem({ ...editItem, price: e.target.value })}
              fullWidth
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <Box sx={{ mr: 1, color: "#BEAF9B" }}>
                    <PriceChangeIcon fontSize="small" />
                  </Box>
                ),
              }}
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
                "& .MuiInputLabel-root": {
                  color: "#453C33",
                  fontFamily: "'Poppins', 'Roboto', sans-serif",
                },
              }}
            />
          </Paper>
        </Box>

        {/* Dates */}
        <Box>
          <Box sx={{ 
            display: "flex", 
            alignItems: "center", 
            mb: 1 
          }}>
            <CalendarMonthIcon sx={{ color: "#BEAF9B", mr: 1 }} />
            <Typography 
              variant="subtitle1" 
              sx={{ 
                color: "#453C33",
                fontWeight: 500,
                fontFamily: "'Poppins', 'Roboto', sans-serif"
              }}
            >
              PRODUCT DATES
            </Typography>
          </Box>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: "8px",
              border: "1px solid rgba(190, 175, 155, 0.3)",
              bgcolor: "#fff",
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
            }}
          >
            <TextField
              label="Manufacture Date"
              type="date"
              value={editItem.manufacture_date}
              onChange={(e) => setEditItem({ ...editItem, manufacture_date: e.target.value })}
              fullWidth
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
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
                "& .MuiInputLabel-root": {
                  color: "#453C33",
                  fontFamily: "'Poppins', 'Roboto', sans-serif",
                },
                "& input[type=date]::-webkit-calendar-picker-indicator": {
                  filter: "invert(0.5) sepia(1) saturate(5) hue-rotate(300deg)",
                },
              }}
            />
            
            <TextField
              label="Expiration Date"
              type="date"
              value={editItem.expire_date}
              onChange={(e) => setEditItem({ ...editItem, expire_date: e.target.value })}
              fullWidth
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
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
                "& .MuiInputLabel-root": {
                  color: "#453C33",
                  fontFamily: "'Poppins', 'Roboto', sans-serif",
                },
                "& input[type=date]::-webkit-calendar-picker-indicator": {
                  filter: "invert(0.5) sepia(1) saturate(5) hue-rotate(300deg)",
                },
              }}
            />
          </Paper>
        </Box>
      </DialogContent>

      {/* Footer */}
      <Box
        sx={{
          p: 2, 
          bgcolor: "#fff",
          borderTop: "1px solid rgba(0, 0, 0, 0.08)",
          display: "flex",
          justifyContent: "center",
          gap: 2,
          boxShadow: "0 -2px 8px rgba(0,0,0,0.03)"
        }}
      >
        <Button
          onClick={onClose}
          sx={{
            color: "#BEAF9B",
            py: 1.5,
            px: 4,
            borderRadius: "8px",
            width: "100%",
            maxWidth: "200px",
            fontWeight: 500,
            letterSpacing: "0.5px",
            fontFamily: "'Poppins', 'Roboto', sans-serif",
            textTransform: "none",
            fontSize: "1rem",
            border: "1px solid #BEAF9B",
            transition: "all 0.3s ease",
            '&:hover': { 
              background: "rgba(190, 175, 155, 0.1)",
            },
          }}
        >
          Cancel
        </Button>
        
        <Button
          onClick={handleSubmit}
          sx={{
            background: "linear-gradient(to right, #BEAF9B, #D9CFC2)",
            color: '#fff',
            py: 1.5,
            px: 4,
            borderRadius: "8px",
            width: "100%",
            maxWidth: "200px",
            fontWeight: 500,
            letterSpacing: "0.5px",
            fontFamily: "'Poppins', 'Roboto', sans-serif",
            textTransform: "none",
            fontSize: "1rem",
            boxShadow: "0 4px 8px rgba(190, 175, 155, 0.3)",
            transition: "all 0.3s ease",
            '&:hover': { 
              background: "linear-gradient(to right, #b0a08d, #cec2b3)",
              boxShadow: "0 6px 12px rgba(190, 175, 155, 0.4)",
              transform: "translateY(-2px)"
            },
          }}
        >
          Save Changes
        </Button>
      </Box>
    </Dialog>
  );
};

export default EditInventoryModal;