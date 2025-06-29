import React from "react";
import {
  Dialog,
  DialogContent,
  DialogContentText,
  Button,
  Box,
  Typography,
  IconButton
} from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

const DeleteConfirmationDialog = ({ open, onClose, onConfirm, itemName = "this item" }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: "12px",
          overflow: "hidden",
          bgcolor: "#f9f5f0",
          maxWidth: "450px",
          width: "100%"
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
            CONFIRM DELETION
          </Typography>
        </Box>
      </Box>

      <DialogContent sx={{ p: 4, bgcolor: "#f9f5f0" }}>
        <Box 
          sx={{ 
            display: "flex", 
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            py: 2
          }}
        >
          <WarningAmberIcon 
            sx={{ 
              fontSize: 60, 
              color: "#E57373", 
              mb: 2,
              filter: "drop-shadow(0 2px 3px rgba(0, 0, 0, 0.2))"
            }} 
          />
          
          <Typography 
            variant="h6" 
            sx={{ 
              color: "#453C33",
              fontWeight: 600,
              mb: 2,
              fontFamily: "'Poppins', 'Roboto', sans-serif"
            }}
          >
            Are you sure?
          </Typography>
          
          <DialogContentText
            sx={{
              color: "#666",
              fontFamily: "'Poppins', 'Roboto', sans-serif",
              fontSize: "1rem",
              maxWidth: "300px",
              lineHeight: 1.6
            }}
          >
            You are about to delete {itemName} from inventory. This action cannot be undone.
          </DialogContentText>
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
            maxWidth: "180px",
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
          onClick={onConfirm}
          startIcon={<DeleteOutlineIcon />}
          sx={{
            background: "linear-gradient(to right, #e57373, #ef9a9a)",
            color: '#fff',
            py: 1.5,
            px: 4,
            borderRadius: "8px",
            width: "100%",
            maxWidth: "180px",
            fontWeight: 500,
            letterSpacing: "0.5px",
            fontFamily: "'Poppins', 'Roboto', sans-serif",
            textTransform: "none",
            fontSize: "1rem",
            boxShadow: "0 4px 8px rgba(229, 115, 115, 0.3)",
            transition: "all 0.3s ease",
            '&:hover': { 
              background: "linear-gradient(to right, #d32f2f, #e57373)",
              boxShadow: "0 6px 12px rgba(229, 115, 115, 0.4)",
              transform: "translateY(-2px)"
            },
          }}
        >
          Delete
        </Button>
      </Box>
    </Dialog>
  );
};

export default DeleteConfirmationDialog;