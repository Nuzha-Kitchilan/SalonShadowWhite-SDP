
















// // ProfileSection.js
// import React, { useState, useEffect } from 'react';
// import {
//   Typography,
//   Box,
//   Button,
//   Card,
//   CardContent,
//   Grid,
//   Snackbar,
//   Alert
// } from '@mui/material';
// import EditIcon from '@mui/icons-material/Edit';
// import CancelIcon from '@mui/icons-material/Cancel';

// import ProfileAvatar from '../profile/ProfileAvatar';
// import ProfileEditForm from '../profile/ProfileEditForm';
// import ProfileDetails from '../profile/ProfileDetails';

// const ProfileSection = ({ adminData, onUpdateProfile }) => {
//   const [editMode, setEditMode] = useState(false);
//   const [previewImage, setPreviewImage] = useState(null);
//   const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [formData, setFormData] = useState({ ...adminData });

//   // Update formData when adminData changes
//   useEffect(() => {
//     setFormData({ ...adminData });
//     if (!editMode) {
//       setPreviewImage(null);
//     }
//   }, [adminData, editMode]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleFileChange = (file) => {
//     if (!file) return;

//     // Validate file
//     if (!file.type.match('image.*')) {
//       setSnackbar({ open: true, message: 'Please select an image file', severity: 'error' });
//       return;
//     }

//     if (file.size > 5 * 1024 * 1024) {
//       setSnackbar({ open: true, message: 'File size should be less than 5MB', severity: 'error' });
//       return;
//     }

//     setFormData(prev => ({ 
//       ...prev, 
//       profileFile: file,
//       profile_url: '' 
//     }));

//     const reader = new FileReader();
//     reader.onload = () => setPreviewImage(reader.result);
//     reader.readAsDataURL(file);
//   };

//   const handleRemoveImage = () => {
//     setFormData(prev => ({ 
//       ...prev, 
//       profileFile: null,
//       profile_url: '' 
//     }));
//     setPreviewImage(null);
//   };
  
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);
    
//     const formDataObj = new FormData();
//     formDataObj.append('first_name', formData.first_name);
//     formDataObj.append('last_name', formData.last_name);
//     formDataObj.append('email', formData.email);
//     formDataObj.append('role', formData.role);
    
//     // Include existing profile_url if no new file is uploaded
//     if (!formData.profileFile && formData.profile_url) {
//       formDataObj.append('profile_url', formData.profile_url);
//     }
    
//     // Append file if it exists
//     if (formData.profileFile) {
//       formDataObj.append('profile_picture', formData.profileFile);
//     }
  
//     try {
//       const response = await fetch(`http://localhost:5001/api/auth/update/${adminData.id}`, {
//         method: 'PUT',
//         body: formDataObj,
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('token')}`
//         }
//       });
  
//       const data = await response.json();
      
//       if (response.ok) {
//         onUpdateProfile(data.admin);
//         setEditMode(false);
//         setPreviewImage(null);
//         setSnackbar({ open: true, message: 'Profile updated successfully!', severity: 'success' });
//       } else {
//         throw new Error(data.message || 'Failed to update profile');
//       }
//     } catch (error) {
//       setSnackbar({ open: true, message: error.message, severity: 'error' });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };
  
//   const handleCancel = () => {
//     setFormData({ ...adminData });
//     setEditMode(false);
//     setPreviewImage(null);
//   };

//   const firstName = formData.first_name || '';
//   const lastName = formData.last_name || '';
//   const role = formData.role || '';
//   const profileUrl = formData.profile_url || '';
//   const imageUrl = previewImage || profileUrl || '/default-profile.png';

//   return (
//     <Card>
//       <CardContent>
//         <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
//           <ProfileAvatar 
//             imageUrl={imageUrl}
//             firstName={firstName}
//             lastName={lastName}
//             editMode={editMode}
//             onFileChange={handleFileChange}
//             onRemoveImage={handleRemoveImage}
//             isSubmitting={isSubmitting}
//           />
          
//           <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
//             {firstName} {lastName}
//           </Typography>
//           <Typography color="text.secondary" sx={{ mb: 2 }}>{role}</Typography>
          
//           {!isSubmitting && (
//             <Button
//               variant={editMode ? "outlined" : "contained"}
//               startIcon={editMode ? <CancelIcon /> : <EditIcon />}
//               onClick={() => editMode ? handleCancel() : setEditMode(true)}
//               sx={{ mb: 2 }}
//               color={editMode ? "error" : "primary"}
//             >
//               {editMode ? 'Cancel' : 'Edit Profile'}
//             </Button>
//           )}
//         </Box>

//         {editMode ? (
//           <ProfileEditForm 
//             formData={formData}
//             handleInputChange={handleInputChange}
//             handleSubmit={handleSubmit}
//             handleCancel={handleCancel}
//             handleFileChange={handleFileChange}
//             isSubmitting={isSubmitting}
//           />
//         ) : (
//           <ProfileDetails email={formData.email} role={formData.role} />
//         )}

//         {/* Snackbar for notifications */}
//         <Snackbar
//           open={snackbar.open}
//           autoHideDuration={6000}
//           onClose={() => setSnackbar({ ...snackbar, open: false })}
//         >
//           <Alert 
//             onClose={() => setSnackbar({ ...snackbar, open: false })} 
//             severity={snackbar.severity}
//             sx={{ width: '100%' }}
//           >
//             {snackbar.message}
//           </Alert>
//         </Snackbar>
//       </CardContent>
//     </Card>
//   );
// };

// export default ProfileSection;









import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Snackbar,
  Alert,
  Paper,
  useMediaQuery,
  useTheme
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CancelIcon from "@mui/icons-material/Cancel";

import ProfileAvatar from "../profile/ProfileAvatar";
import ProfileEditForm from "../profile/ProfileEditForm";
import ProfileDetails from "../profile/ProfileDetails";

const ProfileSection = ({ adminData, onUpdateProfile }) => {
  const [editMode, setEditMode] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ ...adminData });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Update formData when adminData changes
  useEffect(() => {
    setFormData({ ...adminData });
    if (!editMode) {
      setPreviewImage(null);
    }
  }, [adminData, editMode]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (file) => {
    if (!file) return;

    // Validate file
    if (!file.type.match("image.*")) {
      setSnackbar({ open: true, message: "Please select an image file", severity: "error" });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setSnackbar({ open: true, message: "File size should be less than 5MB", severity: "error" });
      return;
    }

    setFormData((prev) => ({
      ...prev,
      profileFile: file,
      profile_url: "",
    }));

    const reader = new FileReader();
    reader.onload = () => setPreviewImage(reader.result);
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({
      ...prev,
      profileFile: null,
      profile_url: "",
    }));
    setPreviewImage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formDataObj = new FormData();
    formDataObj.append("first_name", formData.first_name);
    formDataObj.append("last_name", formData.last_name);
    formDataObj.append("email", formData.email);
    formDataObj.append("role", formData.role);

    // Include existing profile_url if no new file is uploaded
    if (!formData.profileFile && formData.profile_url) {
      formDataObj.append("profile_url", formData.profile_url);
    }

    // Append file if it exists
    if (formData.profileFile) {
      formDataObj.append("profile_picture", formData.profileFile);
    }

    try {
      const response = await fetch(`http://localhost:5001/api/auth/update/${adminData.id}`, {
        method: "PUT",
        body: formDataObj,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        onUpdateProfile(data.admin);
        setEditMode(false);
        setPreviewImage(null);
        setSnackbar({ open: true, message: "Profile updated successfully!", severity: "success" });
      } else {
        throw new Error(data.message || "Failed to update profile");
      }
    } catch (error) {
      setSnackbar({ open: true, message: error.message, severity: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({ ...adminData });
    setEditMode(false);
    setPreviewImage(null);
  };

  const firstName = formData.first_name || "";
  const lastName = formData.last_name || "";
  const role = formData.role || "";
  const profileUrl = formData.profile_url || "";
  const imageUrl = previewImage || profileUrl || "/default-profile.png";

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: "8px",
        overflow: "hidden",
        border: "1px solid rgba(190, 175, 155, 0.2)",
        mb: 4,
        background: "linear-gradient(to right, rgba(190, 175, 155, 0.1), rgba(255, 255, 255, 0.8))",
      }}
    >
      <CardContent sx={{ p: { xs: 2, md: 3 } }}>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 3 }}>
          <ProfileAvatar
            imageUrl={imageUrl}
            firstName={firstName}
            lastName={lastName}
            editMode={editMode}
            onFileChange={handleFileChange}
            onRemoveImage={handleRemoveImage}
            isSubmitting={isSubmitting}
          />

          <Typography
            variant={isMobile ? "h5" : "h4"}
            component="div"
            sx={{
              fontFamily: "'Poppins', 'Roboto', sans-serif",
              fontWeight: 600,
              color: "#453C33",
            }}
          >
            {firstName} {lastName}
          </Typography>
          <Typography
            color="text.secondary"
            sx={{
              mb: 2,
              fontFamily: "'Poppins', 'Roboto', sans-serif",
              color: "#666",
            }}
          >
            {role}
          </Typography>

          {!isSubmitting && (
            <Button
              variant={editMode ? "outlined" : "contained"}
              startIcon={editMode ? <CancelIcon /> : <EditIcon />}
              onClick={() => (editMode ? handleCancel() : setEditMode(true))}
              sx={{
                mb: 2,
                backgroundColor: editMode ? "transparent" : "#BEAF9B",
                color: editMode ? "#a49683" : "white",
                borderColor: editMode ? "rgba(190, 175, 155, 0.7)" : "transparent",
                padding: "8px 20px",
                borderRadius: "8px",
                fontFamily: "'Poppins', 'Roboto', sans-serif",
                textTransform: "none",
                fontWeight: 500,
                boxShadow: editMode ? "none" : "0 4px 8px rgba(190, 175, 155, 0.3)",
                transition: "all 0.3s ease",
                "&:hover": {
                  backgroundColor: editMode ? "rgba(190, 175, 155, 0.05)" : "#a49683",
                  boxShadow: editMode ? "none" : "0 6px 12px rgba(190, 175, 155, 0.4)",
                  transform: editMode ? "none" : "translateY(-2px)",
                  borderColor: editMode ? "#BEAF9B" : "transparent",
                },
              }}
            >
              {editMode ? "Cancel" : "Edit Profile"}
            </Button>
          )}
        </Box>

        {editMode ? (
          <ProfileEditForm
            formData={formData}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            handleCancel={handleCancel}
            isSubmitting={isSubmitting}
          />
        ) : (
          <ProfileDetails email={formData.email} role={formData.role} />
        )}

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{
              width: "100%",
              fontFamily: "'Poppins', 'Roboto', sans-serif",
              "& .MuiAlert-icon": {
                color: snackbar.severity === "success" ? "#7D6E5B" : undefined,
              },
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </CardContent>
    </Paper>
  );
};

export default ProfileSection;




// import React, { useState, useEffect } from 'react';
// import {
//   Typography,
//   Box,
//   Button,
//   Card,
//   CardContent,
//   Grid,
//   Snackbar,
//   Alert
// } from '@mui/material';
// import EditIcon from '@mui/icons-material/Edit';
// import CancelIcon from '@mui/icons-material/Cancel';
// import { useAuth } from '../../auth/AuthContext'; 
// import ProfileAvatar from './ProfileAvatar';
// import ProfileEditForm from './ProfileEditForm';
// import ProfileDetails from './ProfileDetails';

// const ProfileSection = ({ adminData }) => {
//   const { user, updateUser } = useAuth(); // Get user and updateUser from context
//   const [editMode, setEditMode] = useState(false);
//   const [previewImage, setPreviewImage] = useState(null);
//   const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [formData, setFormData] = useState({ ...adminData });

//   // Update formData when adminData changes
//   useEffect(() => {
//     setFormData({ ...adminData });
//     if (!editMode) {
//       setPreviewImage(null);
//     }
//   }, [adminData, editMode]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleFileChange = (file) => {
//     if (!file) return;

//     // Validate file
//     if (!file.type.match('image.*')) {
//       setSnackbar({ open: true, message: 'Please select an image file', severity: 'error' });
//       return;
//     }

//     if (file.size > 5 * 1024 * 1024) {
//       setSnackbar({ open: true, message: 'File size should be less than 5MB', severity: 'error' });
//       return;
//     }

//     setFormData(prev => ({ 
//       ...prev, 
//       profileFile: file,
//       profile_url: '' 
//     }));

//     const reader = new FileReader();
//     reader.onload = () => setPreviewImage(reader.result);
//     reader.readAsDataURL(file);
//   };

//   const handleRemoveImage = () => {
//     setFormData(prev => ({ 
//       ...prev, 
//       profileFile: null,
//       profile_url: '' 
//     }));
//     setPreviewImage(null);
//   };
  
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);
    
//     const formDataObj = new FormData();
//     formDataObj.append('first_name', formData.first_name);
//     formDataObj.append('last_name', formData.last_name);
//     formDataObj.append('email', formData.email);
//     formDataObj.append('role', formData.role);
    
//     // Include existing profile_url if no new file is uploaded
//     if (!formData.profileFile && formData.profile_url) {
//       formDataObj.append('profile_url', formData.profile_url);
//     }
    
//     // Append file if it exists
//     if (formData.profileFile) {
//       formDataObj.append('profile_picture', formData.profileFile);
//     }
  
//     try {
//       const response = await fetch(`http://localhost:5001/api/auth/update/${user.id}`, {
//         method: 'PUT',
//         body: formDataObj,
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('token')}`
//         }
//       });
  
//       const data = await response.json();
      
//       if (response.ok) {
//         // Update the auth context with the new user data
//         updateUser(data.admin);
        
//         setEditMode(false);
//         setPreviewImage(null);
//         setSnackbar({ open: true, message: 'Profile updated successfully!', severity: 'success' });
//       } else {
//         throw new Error(data.message || 'Failed to update profile');
//       }
//     } catch (error) {
//       setSnackbar({ open: true, message: error.message, severity: 'error' });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };
  
//   const handleCancel = () => {
//     setFormData({ ...adminData });
//     setEditMode(false);
//     setPreviewImage(null);
//   };

//   const firstName = formData.first_name || '';
//   const lastName = formData.last_name || '';
//   const role = formData.role || '';
//   const profileUrl = formData.profile_url || '';
//   const imageUrl = previewImage || profileUrl || '/default-profile.png';

//   return (
//     <Card>
//       <CardContent>
//         <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
//           <ProfileAvatar 
//             imageUrl={imageUrl}
//             firstName={firstName}
//             lastName={lastName}
//             editMode={editMode}
//             onFileChange={handleFileChange}
//             onRemoveImage={handleRemoveImage}
//             isSubmitting={isSubmitting}
//           />
          
//           <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
//             {firstName} {lastName}
//           </Typography>
//           <Typography color="text.secondary" sx={{ mb: 2 }}>{role}</Typography>
          
//           {!isSubmitting && (
//             <Button
//               variant={editMode ? "outlined" : "contained"}
//               startIcon={editMode ? <CancelIcon /> : <EditIcon />}
//               onClick={() => editMode ? handleCancel() : setEditMode(true)}
//               sx={{ mb: 2 }}
//               color={editMode ? "error" : "primary"}
//             >
//               {editMode ? 'Cancel' : 'Edit Profile'}
//             </Button>
//           )}
//         </Box>

//         {editMode ? (
//           <ProfileEditForm 
//             formData={formData}
//             handleInputChange={handleInputChange}
//             handleSubmit={handleSubmit}
//             handleCancel={handleCancel}
//             handleFileChange={handleFileChange}
//             isSubmitting={isSubmitting}
//           />
//         ) : (
//           <ProfileDetails email={formData.email} role={formData.role} />
//         )}

//         <Snackbar
//           open={snackbar.open}
//           autoHideDuration={6000}
//           onClose={() => setSnackbar({ ...snackbar, open: false })}
//         >
//           <Alert 
//             onClose={() => setSnackbar({ ...snackbar, open: false })} 
//             severity={snackbar.severity}
//             sx={{ width: '100%' }}
//           >
//             {snackbar.message}
//           </Alert>
//         </Snackbar>
//       </CardContent>
//     </Card>
//   );
// };

// export default ProfileSection;