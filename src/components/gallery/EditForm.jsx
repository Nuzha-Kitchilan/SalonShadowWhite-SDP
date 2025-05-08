// EditForm.jsx
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  CircularProgress,
  Box
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const EditForm = ({ 
  open, 
  onClose, 
  onSubmit, 
  loading,
  formData,
  setFormData,
  selectedImage
}) => {
  return (
    <Dialog 
      open={open} 
      onClose={() => !loading && onClose()} 
      fullWidth 
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: "10px",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)"
        }
      }}
    >
      <DialogTitle sx={{ 
        bgcolor: "rgba(190, 175, 155, 0.05)", 
        fontFamily: "'Poppins', 'Roboto', sans-serif",
        fontWeight: 600,
        color: "#453C33",
        borderBottom: "1px solid rgba(190, 175, 155, 0.2)"
      }}>
        Edit Image Details
        <IconButton
          aria-label="close"
          onClick={() => !loading && onClose()}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: '#888',
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 3, mt: 2 }}>
        {selectedImage && (
          <Box sx={{ mb: 3, textAlign: 'center' }}>
            <img 
              src={selectedImage.image_url} 
              alt={selectedImage.title} 
              style={{ 
                maxHeight: '150px', 
                maxWidth: '100%', 
                borderRadius: '4px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)' 
              }} 
              onError={(e) => {
                e.target.onerror = null; 
                e.target.src = "https://via.placeholder.com/200?text=Image+Error";
              }}
            />
          </Box>
        )}
        <TextField
          label="Title"
          fullWidth
          required
          margin="normal"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          sx={{
            '& .MuiOutlinedInput-root': {
              '&.Mui-focused fieldset': {
                borderColor: '#BEAF9B',
              },
            },
            '& .MuiInputLabel-root.Mui-focused': {
              color: '#BEAF9B',
            },
          }}
        />
        <TextField
          label="Description"
          fullWidth
          margin="normal"
          multiline
          rows={3}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          sx={{
            '& .MuiOutlinedInput-root': {
              '&.Mui-focused fieldset': {
                borderColor: '#BEAF9B',
              },
            },
            '& .MuiInputLabel-root.Mui-focused': {
              color: '#BEAF9B',
            },
          }}
        />
      </DialogContent>
      <DialogActions sx={{ p: 2, px: 3, borderTop: "1px solid rgba(190, 175, 155, 0.2)" }}>
        <Button 
          onClick={() => onClose()} 
          disabled={loading}
          sx={{ 
            color: "#888",
            fontFamily: "'Poppins', 'Roboto', sans-serif",
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.04)"
            }
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={onSubmit}
          disabled={loading || !formData.title}
          variant="contained"
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
          sx={{ 
            backgroundColor: "#BEAF9B",
            color: "#fff",
            fontFamily: "'Poppins', 'Roboto', sans-serif",
            fontWeight: 500,
            borderRadius: "8px",
            padding: "10px 24px",
            boxShadow: "0 4px 10px rgba(190, 175, 155, 0.3)",
            transition: "all 0.3s ease",
            "&:hover": {
              backgroundColor: "#A89683",
              boxShadow: "0 6px 12px rgba(190, 175, 155, 0.4)",
            },
          }}
        >
          {loading ? "Updating..." : "Update"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditForm;