// ViewForm.jsx
import React from "react";
import {
  Dialog,
  Box,
  IconButton,
  Typography,
  Button
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const ViewForm = ({ 
  open, 
  onClose, 
  selectedImage,
  onEditClick,
  onDeleteClick
}) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md"
      PaperProps={{
        sx: {
          borderRadius: "10px",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
          overflow: "hidden"
        }
      }}
    >
      <Box sx={{ position: "relative" }}>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: '#fff',
            backgroundColor: 'rgba(0,0,0,0.3)',
            zIndex: 1,
            '&:hover': {
              backgroundColor: 'rgba(0,0,0,0.5)',
            }
          }}
        >
          <CloseIcon />
        </IconButton>
        
        {selectedImage && (
          <>
            <Box sx={{ 
              width: '100%', 
              maxWidth: '800px', 
              maxHeight: '70vh',
              overflow: 'hidden',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: '#000'
            }}>
              <img 
                src={selectedImage.image_url} 
                alt={selectedImage.title} 
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: '70vh',
                  objectFit: 'contain'
                }} 
                onError={(e) => {
                  e.target.onerror = null; 
                  e.target.src = "https://via.placeholder.com/400x300?text=Image+Error";
                }}
              />
            </Box>
            
            <Box sx={{ p: 3, backgroundColor: '#fff' }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 600, 
                  color: "#453C33",
                  fontFamily: "'Poppins', 'Roboto', sans-serif",
                  mb: 1
                }}
              >
                {selectedImage.title || "Untitled"}
              </Typography>
              
              <Typography 
                variant="body1" 
                sx={{ 
                  color: "#666",
                  fontFamily: "'Poppins', 'Roboto', sans-serif",
                  mb: 2
                }}
              >
                {selectedImage.description || "No description provided for this image."}
              </Typography>
              
              <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                <Button
                  size="small"
                  startIcon={<EditIcon />}
                  onClick={() => {
                    onClose();
                    onEditClick(selectedImage);
                  }}
                  sx={{ 
                    color: "#BEAF9B",
                    borderColor: "#BEAF9B",
                    "&:hover": {
                      borderColor: "#A89683",
                      backgroundColor: "rgba(190, 175, 155, 0.05)"
                    }
                  }}
                  variant="outlined"
                >
                  Edit Details
                </Button>
                <Button
                  size="small"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={() => {
                    onClose();
                    onDeleteClick();
                  }}
                  variant="outlined"
                  sx={{ 
                    borderColor: "rgba(211, 47, 47, 0.5)",
                    "&:hover": {
                      backgroundColor: "rgba(211, 47, 47, 0.05)"
                    }
                  }}
                >
                  Delete
                </Button>
              </Box>
            </Box>
          </>
        )}
      </Box>
    </Dialog>
  );
};

export default ViewForm;