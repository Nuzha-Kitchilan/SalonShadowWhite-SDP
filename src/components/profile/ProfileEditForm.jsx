import React from "react";
import {
  Box,
  Grid,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";

const ProfileEditForm = ({
  formData,
  handleInputChange,
  handleSubmit,
  handleCancel,
  isSubmitting,
}) => {
  const handleFileInputClick = () => {
    document.getElementById("profile-file-input").click();
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, md: 3 },
        borderRadius: "8px",
        border: "1px solid rgba(190, 175, 155, 0.2)",
        background: "linear-gradient(to right, rgba(190, 175, 155, 0.1), rgba(255, 255, 255, 0.8))",
      }}
    >
      <Typography
        variant="h6"
        component="h2"
        sx={{
          fontFamily: "'Poppins', 'Roboto', sans-serif",
          fontWeight: 600,
          color: "#453C33",
          mb: 2,
        }}
      >
        Edit Profile
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="First Name"
              name="first_name"
              value={formData.first_name || ""}
              onChange={handleInputChange}
              required
              margin="normal"
              disabled={isSubmitting}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "rgba(190, 175, 155, 0.5)",
                  },
                  "&:hover fieldset": {
                    borderColor: "#BEAF9B",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#BEAF9B",
                  },
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#a49683",
                },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Last Name"
              name="last_name"
              value={formData.last_name || ""}
              onChange={handleInputChange}
              required
              margin="normal"
              disabled={isSubmitting}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "rgba(190, 175, 155, 0.5)",
                  },
                  "&:hover fieldset": {
                    borderColor: "#BEAF9B",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#BEAF9B",
                  },
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#a49683",
                },
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email || ""}
              onChange={handleInputChange}
              required
              margin="normal"
              disabled={isSubmitting}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "rgba(190, 175, 155, 0.5)",
                  },
                  "&:hover fieldset": {
                    borderColor: "#BEAF9B",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#BEAF9B",
                  },
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#a49683",
                },
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Profile Image URL"
              name="profile_url"
              value={formData.profile_url || ""}
              onChange={handleInputChange}
              placeholder="Enter image URL"
              margin="normal"
              disabled={isSubmitting || !!formData.profileFile}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleFileInputClick}
                      edge="end"
                      disabled={isSubmitting || !!formData.profileFile}
                      sx={{ color: "#BEAF9B" }}
                    >
                      <PhotoCameraIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              helperText={
                formData.profileFile
                  ? "Using uploaded file (clear to use URL instead)"
                  : "Enter a URL or click the camera icon to upload"
              }
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "rgba(190, 175, 155, 0.5)",
                  },
                  "&:hover fieldset": {
                    borderColor: "#BEAF9B",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#BEAF9B",
                  },
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "#a49683",
                },
                "& .MuiFormHelperText-root": {
                  fontFamily: "'Poppins', 'Roboto', sans-serif",
                  fontSize: "0.75rem",
                },
              }}
            />
            <input
              id="profile-file-input"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => {
                if (e.target.files[0]) {
                  const fileChangeEvent = {
                    target: {
                      name: "profileFile",
                      value: e.target.files[0],
                    },
                  };
                  handleInputChange(fileChangeEvent);
                }
              }}
            />
          </Grid>
        </Grid>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3, gap: 2 }}>
          <Button
            variant="outlined"
            onClick={handleCancel}
            startIcon={<CancelIcon />}
            disabled={isSubmitting}
            sx={{
              fontFamily: "'Poppins', 'Roboto', sans-serif",
              textTransform: "none",
              borderColor: "rgba(190, 175, 155, 0.7)",
              color: "#a49683",
              "&:hover": {
                borderColor: "#BEAF9B",
                backgroundColor: "rgba(190, 175, 155, 0.05)",
              },
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            startIcon={<SaveIcon />}
            disabled={isSubmitting}
            sx={{
              backgroundColor: "#BEAF9B",
              color: "white",
              fontFamily: "'Poppins', 'Roboto', sans-serif",
              textTransform: "none",
              boxShadow: "0 4px 8px rgba(190, 175, 155, 0.3)",
              transition: "all 0.3s ease",
              "&:hover": {
                backgroundColor: "#a49683",
                boxShadow: "0 6px 12px rgba(190, 175, 155, 0.4)",
                transform: "translateY(-2px)",
              },
            }}
          >
            Save Changes
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default ProfileEditForm;