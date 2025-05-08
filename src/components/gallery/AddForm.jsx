// AddForm.jsx
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
  Box,
  Typography,
  Chip
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { FileInput, UploadButton } from "./StyledComponents";

const AddForm = ({ 
  open, 
  onClose, 
  onSubmit, 
  loading,
  formData,
  setFormData,
  imageFile,
  previewUrl,
  handleFileChange
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
        Upload New Image
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
        
        <UploadButton htmlFor="image-upload">
          {previewUrl ? (
            <Box sx={{ width: '100%', textAlign: 'center' }}>
              <img 
                src={previewUrl} 
                alt="Preview" 
                style={{ 
                  maxHeight: '150px', 
                  maxWidth: '100%', 
                  borderRadius: '4px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)' 
                }} 
              />
              <Typography 
                variant="caption" 
                display="block"
                sx={{ 
                  mt: 1, 
                  color: "#666",
                  fontFamily: "'Poppins', 'Roboto', sans-serif" 
                }}
              >
                {imageFile?.name} ({Math.round(imageFile?.size / 1024)} KB)
              </Typography>
              <Chip 
                label="Change Image" 
                size="small" 
                sx={{ 
                  mt: 1, 
                  bgcolor: 'rgba(190, 175, 155, 0.1)', 
                  color: '#BEAF9B',
                  fontFamily: "'Poppins', 'Roboto', sans-serif"
                }} 
                onClick={(e) => e.stopPropagation()} 
              />
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center' }}>
              <CloudUploadIcon sx={{ fontSize: 40, color: '#BEAF9B', mb: 1 }} />
              <Typography 
                variant="body1" 
                sx={{ 
                  fontWeight: 500, 
                  color: "#453C33",
                  fontFamily: "'Poppins', 'Roboto', sans-serif"
                }}
              >
                Click to select an image
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: "#888",
                  fontFamily: "'Poppins', 'Roboto', sans-serif" 
                }}
              >
                PNG, JPG, JPEG or WebP
              </Typography>
            </Box>
          )}
          <FileInput
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
        </UploadButton>
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
          disabled={loading || !imageFile || !formData.title}
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
          {loading ? "Uploading..." : "Upload"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddForm;