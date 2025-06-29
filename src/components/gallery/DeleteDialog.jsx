import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  CircularProgress
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const DeleteDialog = ({ 
  open, 
  onClose, 
  onConfirm, 
  loading,
  selectedImage
}) => {
  return (
    <Dialog 
      open={open} 
      onClose={() => !loading && onClose()}
      PaperProps={{
        sx: {
          borderRadius: "10px",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)"
        }
      }}
    >
      <DialogTitle sx={{ 
        bgcolor: "rgba(211, 47, 47, 0.05)", 
        fontFamily: "'Poppins', 'Roboto', sans-serif",
        fontWeight: 600,
        color: "#d32f2f",
        borderBottom: "1px solid rgba(211, 47, 47, 0.1)"
      }}>
        Confirm Deletion
      </DialogTitle>
      <DialogContent sx={{ p: 3, pt: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <DeleteIcon color="error" sx={{ mr: 1.5, fontSize: 30 }} />
          <Typography 
            variant="body1" 
            sx={{ 
              fontWeight: 500,
              fontFamily: "'Poppins', 'Roboto', sans-serif",
            }}
          >
            Are you sure you want to delete this image?
          </Typography>
        </Box>
        
        {selectedImage && (
          <Box sx={{ 
            display: "flex", 
            alignItems: "center", 
            p: 2, 
            borderRadius: "8px",
            backgroundColor: "rgba(0, 0, 0, 0.02)",
            border: "1px solid rgba(0, 0, 0, 0.05)"
          }}>
            <Box sx={{ width: 60, height: 60, mr: 2, overflow: "hidden", borderRadius: "4px" }}>
              <img 
                src={selectedImage.image_url} 
                alt={selectedImage.title} 
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                onError={(e) => {
                  e.target.onerror = null; 
                  e.target.src = "https://via.placeholder.com/60?text=Error";
                }}
              />
            </Box>
            <Box>
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  fontWeight: 500, 
                  color: "#453C33",
                  fontFamily: "'Poppins', 'Roboto', sans-serif", 
                }}
              >
                {selectedImage.title}
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: "#666",
                  fontFamily: "'Poppins', 'Roboto', sans-serif",
                  maxWidth: "300px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap"
                }}
              >
                {selectedImage.description || "No description"}
              </Typography>
            </Box>
          </Box>
        )}
        
        <Typography 
          variant="body2" 
          color="error" 
          sx={{ 
            mt: 3,
            fontFamily: "'Poppins', 'Roboto', sans-serif",
          }}
        >
          This action cannot be undone.
        </Typography>
      </DialogContent>
      <DialogActions sx={{ p: 2, px: 3, borderTop: "1px solid rgba(0, 0, 0, 0.05)" }}>
        <Button 
          onClick={() => onClose()} 
          disabled={loading}
          sx={{ 
            color: "#666",
            fontFamily: "'Poppins', 'Roboto', sans-serif",
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.04)"
            }
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="error"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
          sx={{ 
            fontFamily: "'Poppins', 'Roboto', sans-serif",
            boxShadow: "0 4px 10px rgba(211, 47, 47, 0.3)",
            "&:hover": {
              boxShadow: "0 6px 12px rgba(211, 47, 47, 0.4)",
            }
          }}
        >
          {loading ? "Deleting..." : "Delete Image"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteDialog;