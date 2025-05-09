import React, { useState } from "react";
import {
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
} from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";

const ProfileAvatar = ({
  imageUrl,
  firstName,
  lastName,
  editMode,
  onFileChange,
  onRemoveImage,
  isSubmitting,
}) => {
  const [openImageDialog, setOpenImageDialog] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onFileChange(file);
      setOpenImageDialog(false);
    }
  };

  const getInitials = () => {
    const firstInitial = firstName ? firstName.charAt(0) : '';
    const lastInitial = lastName ? lastName.charAt(0) : '';
    return `${firstInitial}${lastInitial}`;
  };

  return (
    <Box sx={{ position: "relative" }}>
      <Avatar
        src={imageUrl}
        alt={`${firstName} ${lastName}`}
        sx={{
          width: 150,
          height: 150,
          mb: 2,
          border: "3px solid",
          borderColor: "#BEAF9B",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
          fontSize: "3rem",
          fontFamily: "'Poppins', 'Roboto', sans-serif",
          fontWeight: 500,
          bgcolor: !imageUrl || imageUrl === "/default-profile.png" ? "#D8CFC0" : undefined,
          color: "#453C33",
        }}
      >
        {!imageUrl || imageUrl === "/default-profile.png" ? getInitials() : null}
      </Avatar>
      {editMode && (
        <IconButton
          sx={{
            position: "absolute",
            bottom: 10,
            right: 10,
            backgroundColor: "#BEAF9B",
            color: "white",
            "&:hover": { 
              backgroundColor: "#a49683",
              transform: "scale(1.1)"
            },
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
            transition: "all 0.3s ease",
          }}
          onClick={() => setOpenImageDialog(true)}
        >
          <PhotoCameraIcon />
        </IconButton>
      )}

      {/* Image Upload Dialog */}
      <Dialog 
        open={openImageDialog} 
        onClose={() => setOpenImageDialog(false)}
        PaperProps={{
          sx: {
            borderRadius: "8px",
            width: "100%",
            maxWidth: "400px",
            background: "linear-gradient(to right, #BEAF9B, #FFFFFF)",
          }
        }}
      >
        <DialogTitle sx={{ 
          fontFamily: "'Poppins', 'Roboto', sans-serif",
          color: "#453C33",
          fontWeight: 600,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #D8CFC0"
        }}>
          Update Profile Picture
          <IconButton 
            onClick={() => setOpenImageDialog(false)}
            sx={{ color: "#a49683" }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", p: 2 }}>
            <Avatar
              src={imageUrl}
              sx={{ 
                width: 120, 
                height: 120, 
                mb: 3,
                border: "2px solid #BEAF9B",
                fontSize: "2.5rem",
                fontFamily: "'Poppins', 'Roboto', sans-serif",
                fontWeight: 500,
                bgcolor: !imageUrl || imageUrl === "/default-profile.png" ? "#D8CFC0" : undefined,
                color: "#453C33",
              }}
            >
              {!imageUrl || imageUrl === "/default-profile.png" ? getInitials() : null}
            </Avatar>
            <Button
              variant="contained"
              component="label"
              startIcon={<PhotoCameraIcon />}
              sx={{
                mb: 2,
                width: "100%",
                backgroundColor: "#BEAF9B",
                color: "white",
                padding: "10px 16px",
                borderRadius: "8px",
                fontFamily: "'Poppins', 'Roboto', sans-serif",
                textTransform: "none",
                fontWeight: 500,
                boxShadow: "0 4px 8px rgba(190, 175, 155, 0.3)",
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: "#a49683",
                  boxShadow: "0 6px 12px rgba(190, 175, 155, 0.4)",
                  transform: "translateY(-2px)",
                },
              }}
              disabled={isSubmitting}
            >
              Upload New Photo
              <input type="file" hidden accept="image/*" onChange={handleFileChange} />
            </Button>
            {imageUrl && imageUrl !== "/default-profile.png" && (
              <Button
                variant="outlined"
                startIcon={<DeleteIcon />}
                onClick={onRemoveImage}
                sx={{
                  width: "100%",
                  borderColor: "#BEAF9B",
                  color: "#a49683",
                  fontFamily: "'Poppins', 'Roboto', sans-serif",
                  textTransform: "none",
                  "&:hover": {
                    borderColor: "#BEAF9B",
                    backgroundColor: "#F5F2ED",
                  },
                }}
                disabled={isSubmitting}
              >
                Remove Photo
              </Button>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: "1px solid #D8CFC0" }}>
          <Button 
            onClick={() => setOpenImageDialog(false)}
            sx={{
              color: "#a49683",
              fontFamily: "'Poppins', 'Roboto', sans-serif",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#F5F2ED",
              },
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProfileAvatar;
