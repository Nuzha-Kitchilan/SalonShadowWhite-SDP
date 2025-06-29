import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import {
  Container,
  Grid,
  CardMedia,
  CardContent,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
  Box,
  Divider,
  Paper,
  IconButton
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

// Import Components
import AddForm from "../components/gallery/AddForm";
import EditForm from "../components/gallery/EditForm";
import ViewForm from "../components/gallery/ViewForm";
import DeleteDialog from "../components/gallery/DeleteDialog";
import { StyledButton, StyledCard } from "../components/gallery/StyledComponents";

const API_URL = "http://localhost:5001/api/gallery";

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [openUpload, setOpenUpload] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openPreview, setOpenPreview] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [formData, setFormData] = useState({ title: "", description: "" });
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });
  const [previewUrl, setPreviewUrl] = useState(null);

  // Helper function to show notifications
  const showNotification = (message, severity = "info") => {
    setSnackbar({ open: true, message, severity });
  };

  // Fetch all images
  const fetchImages = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      const formattedImages = (res.data.data || []).map(img => ({
        ...img,
        image_id: img.image_id || `temp-${Math.random().toString(36).substr(2, 9)}`
      }));
      setImages(formattedImages);
    } catch (error) {
      console.error("Error fetching images:", error);
      showNotification("Failed to load images. Please check your server.", "error");
      setImages([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  // Handle file selection and preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result);
      };
      fileReader.readAsDataURL(file);
    }
  };

  // Handle Image Upload
  const handleUpload = async () => {
    if (!imageFile || !formData.title) {
      showNotification("Please provide an image and title", "warning");
      return;
    }

    const form = new FormData();
    form.append("image", imageFile);
    form.append("title", formData.title);
    form.append("description", formData.description || "");

    setLoading(true);
    try {
      const response = await axios.post(API_URL, form, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.success) {
        const newImage = {
          ...response.data.data,
          image_id: response.data.data.image_id || `new-${Date.now()}`
        };
        setImages(prev => [...prev, newImage]);
        setOpenUpload(false);
        setFormData({ title: "", description: "" });
        setImageFile(null);
        setPreviewUrl(null);
        showNotification("Image uploaded successfully!", "success");
      } else {
        throw new Error(response.data.error || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      showNotification(error.response?.data?.error || error.message || "Upload failed", "error");
    } finally {
      setLoading(false);
    }
  };

  // Handle Image Deletion
  const handleDelete = async () => {
    if (!selectedImage) return;
    setLoading(true);
    try {
      const response = await axios.delete(`${API_URL}/${selectedImage.image_id}`);
      
      if (response.data && response.data.success) {
        setImages(prevImages => prevImages.filter(img => img.image_id !== selectedImage.image_id));
        setOpenDelete(false);
        setSelectedImage(null);
        showNotification("Image deleted successfully!", "success");
      } else {
        throw new Error(response.data?.error || "Delete failed");
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      showNotification("Failed to delete image: " + (error.response?.data?.error || error.message), "error");
    } finally {
      setLoading(false);
    }
  };

  // Handle Edit Click
  const handleEditClick = (image) => {
    setSelectedImage(image);
    setFormData({ title: image.title, description: image.description });
    setOpenEdit(true);
  };

  // Handle Image Preview
  const handlePreviewClick = (image) => {
    setSelectedImage(image);
    setOpenPreview(true);
  };

  // Handle Image Update
  const handleUpdate = async () => {
    if (!selectedImage || !formData.title) {
      showNotification("Title is required", "warning");
      return;
    }
    
    setLoading(true);
    try {
      const updateData = {
        title: formData.title,
        description: formData.description || ""
      };
  
      const response = await axios.put(
        `${API_URL}/${selectedImage.image_id}`,
        updateData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data.success) {
        setImages(prevImages => 
          prevImages.map(img => 
            img.image_id === selectedImage.image_id ? { 
              ...img, 
              title: formData.title,
              description: formData.description
            } : img
          )
        );
        setOpenEdit(false);
        setSelectedImage(null);
        showNotification("Image details updated successfully!", "success");
      } else {
        throw new Error(response.data.error || "Update failed");
      }
    } catch (error) {
      console.error("Update error details:", error);
      showNotification(
        error.response?.data?.error || error.message || "Update failed", 
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header Section */}
      <Box sx={{ 
        mb: 4, 
        display: "flex", 
        flexDirection: { xs: "column", sm: "row" }, 
        justifyContent: "space-between",
        alignItems: { xs: "stretch", sm: "center" },
        gap: 2
      }}>
        <Box>
          <Typography 
            variant="h4" 
            sx={{ 
              color: "#453C33", 
              fontWeight: 600,
              fontFamily: "'Poppins', 'Roboto', sans-serif",
              mb: 1
            }}
          >
            Image Gallery
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              color: "#666", 
              mb: 2,
              fontFamily: "'Poppins', 'Roboto', sans-serif",
            }}
          >
            Manage your gallery images with ease
          </Typography>
        </Box>
        
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          <StyledButton
            variant="contained"
            startIcon={<CloudUploadIcon />}
            onClick={() => {
              setFormData({ title: "", description: "" });
              setImageFile(null);
              setPreviewUrl(null);
              setOpenUpload(true);
            }}
            disabled={loading}
          >
            Upload Image
          </StyledButton>
        </Box>
      </Box>

      {/* Loading State */}
      {loading && !openUpload && !openEdit && !openDelete && (
        <Box sx={{ 
          display: "flex", 
          justifyContent: "center", 
          alignItems: "center", 
          py: 10 
        }}>
          <CircularProgress sx={{ color: "#BEAF9B" }} />
          <Typography 
            variant="body1" 
            sx={{ 
              ml: 2, 
              color: "#666",
              fontFamily: "'Poppins', 'Roboto', sans-serif",
            }}
          >
            Loading gallery...
          </Typography>
        </Box>
      )}

      {/* Gallery Grid */}
      <Grid container spacing={3}>
        {images.length === 0 && !loading ? (
          <Grid item xs={12}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 5, 
                textAlign: "center", 
                backgroundColor: "rgba(190, 175, 155, 0.05)",
                border: "1px dashed rgba(190, 175, 155, 0.3)",
                borderRadius: "8px"
              }}
            >
              <Typography 
                variant="h6" 
                sx={{ 
                  color: "#666",
                  fontFamily: "'Poppins', 'Roboto', sans-serif",
                }}
              >
                Your gallery is empty
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: "#888", 
                  mt: 1,
                  mb: 3,
                  fontFamily: "'Poppins', 'Roboto', sans-serif",
                }}
              >
                Upload some images to get started
              </Typography>
              <StyledButton
                variant="outlined"
                startIcon={<CloudUploadIcon />}
                onClick={() => {
                  setFormData({ title: "", description: "" });
                  setImageFile(null);
                  setPreviewUrl(null);
                  setOpenUpload(true);
                }}
                sx={{ 
                  borderColor: "#BEAF9B", 
                  color: "#BEAF9B",
                  "&:hover": {
                    borderColor: "#A89683",
                    backgroundColor: "rgba(190, 175, 155, 0.05)"
                  }
                }}
              >
                Upload First Image
              </StyledButton>
            </Paper>
          </Grid>
        ) : (
          images.map((image) => (
            <Grid item key={image.image_id} xs={12} sm={6} md={4} lg={3}>
              <StyledCard>
                <Box 
                  sx={{ 
                    height: 220, 
                    position: "relative",
                    backgroundColor: "rgba(190, 175, 155, 0.05)",
                    overflow: "hidden"
                  }}
                >
                  <CardMedia 
                    component="img" 
                    sx={{
                      height: "100%",
                      objectFit: "cover",
                      transition: "transform 0.5s ease",
                      "&:hover": {
                        transform: "scale(1.05)"
                      }
                    }}
                    image={image.image_url} 
                    alt={image.title || "Gallery image"} 
                    onError={(e) => {
                      e.target.onerror = null; 
                      e.target.src = "https://via.placeholder.com/200?text=Image+Error";
                    }}
                  />
                  <Box 
                    sx={{ 
                      position: "absolute", 
                      top: 10, 
                      right: 10,
                      bgcolor: "rgba(255, 255, 255, 0.7)",
                      borderRadius: "50%",
                      width: 36,
                      height: 36,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      "&:hover": {
                        bgcolor: "rgba(255, 255, 255, 0.9)",
                      }
                    }}
                    onClick={() => handlePreviewClick(image)}
                  >
                    <VisibilityIcon sx={{ color: "#BEAF9B", fontSize: 20 }} />
                  </Box>
                </Box>
                <CardContent sx={{ p: 2.5 }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      fontWeight: 500, 
                      color: "#453C33",
                      fontFamily: "'Poppins', 'Roboto', sans-serif",
                      mb: 1,
                      lineHeight: 1.2
                    }}
                  >
                    {image.title || "Untitled"}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: "#666",
                      fontFamily: "'Poppins', 'Roboto', sans-serif",
                      mb: 2,
                      height: 40,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical"
                    }}
                  >
                    {image.description || "No description"}
                  </Typography>
                  <Divider sx={{ borderColor: "rgba(190, 175, 155, 0.2)", mb: 2 }} />
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <IconButton 
                      size="small"
                      onClick={() => handleEditClick(image)} 
                      sx={{ 
                        color: "#BEAF9B",
                        backgroundColor: "rgba(190, 175, 155, 0.1)",
                        "&:hover": {
                          backgroundColor: "rgba(190, 175, 155, 0.2)",
                        }
                      }}
                      disabled={loading}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => {
                        setSelectedImage(image);
                        setOpenDelete(true);
                      }}
                      sx={{ 
                        color: "#d32f2f",
                        backgroundColor: "rgba(211, 47, 47, 0.05)",
                        "&:hover": {
                          backgroundColor: "rgba(211, 47, 47, 0.1)",
                        }
                      }}
                      disabled={loading}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </CardContent>
              </StyledCard>
            </Grid>
          ))
        )}
      </Grid>

      {/* Add Form Component */}
      <AddForm
        open={openUpload}
        onClose={() => setOpenUpload(false)}
        onSubmit={handleUpload}
        loading={loading}
        formData={formData}
        setFormData={setFormData}
        imageFile={imageFile}
        previewUrl={previewUrl}
        handleFileChange={handleFileChange}
      />

      {/* Edit Form Component */}
      <EditForm
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        onSubmit={handleUpdate}
        loading={loading}
        formData={formData}
        setFormData={setFormData}
        selectedImage={selectedImage}
      />

      {/* View Form Component */}
      <ViewForm
        open={openPreview}
        onClose={() => setOpenPreview(false)}
        selectedImage={selectedImage}
        onEditClick={handleEditClick}
        onDeleteClick={() => setOpenDelete(true)}
      />

      {/* Delete Dialog Component */}
      <DeleteDialog
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        onConfirm={handleDelete}
        loading={loading}
        selectedImage={selectedImage}
      />

      {/* Snackbar for notifications */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ 
            width: '100%',
            fontFamily: "'Poppins', 'Roboto', sans-serif",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            borderRadius: "8px",
            '& .MuiAlert-icon': {
              fontSize: '20px'
            }
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Gallery;