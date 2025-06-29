import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Avatar, 
  IconButton, 
  Box, 
  Divider, 
  Chip 
} from '@mui/material';
import { Edit, Delete, Visibility, VisibilityOff } from '@mui/icons-material';

const StylistCard = ({
  stylist,
  passwordVisibility,
  togglePasswordVisibility,
  handleEdit,
  handleDelete
}) => {
  return (
    <Card
      sx={{
        display: "flex",
        width: "100%",
        borderRadius: "8px",
        overflow: "hidden",
        boxShadow: "0 2px 8px rgba(190, 175, 155, 0.2)",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        border: "1px solid rgba(190, 175, 155, 0.3)",
        mb: 2.5,
        background: "linear-gradient(to right, #f9f5f0, #ffffff)",
        "&:hover": {
          transform: "translateY(-3px)",
          boxShadow: "0 6px 16px rgba(190, 175, 155, 0.3)",
        },
      }}
    >
      {/* Left side - Avatar and name */}
      <Box 
        sx={{ 
          width: "180px", 
          display: "flex", 
          flexDirection: "column", 
          alignItems: "center", 
          justifyContent: "center",
          p: 2,
          background: "linear-gradient(to bottom, rgba(190, 175, 155, 0.1), rgba(190, 175, 155, 0.05))",
          borderRight: "1px dashed rgba(190, 175, 155, 0.3)"
        }}
      >
        <Avatar
          sx={{
            width: 80,
            height: 80,
            mb: 1,
            fontSize: "2rem",
            fontWeight: 500,
            backgroundColor: "#BEAF9B",
            color: "#fff",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            border: "2px solid #fff"
          }}
          src={stylist.profile_url || ""}
        >
          {stylist.firstname ? stylist.firstname[0] : "S"}
        </Avatar>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 500, 
            color: "#453C33",
            fontFamily: "'Poppins', 'Roboto', sans-serif",
            textAlign: "center",
            lineHeight: 1.2
          }}
        >
          {stylist.firstname} {stylist.lastname}
        </Typography>
        <Chip 
          label={stylist.role || "Stylist"} 
          size="small"
          sx={{ 
            mt: 0.5, 
            backgroundColor: "#BEAF9B", 
            color: "white",
            fontFamily: "'Poppins', 'Roboto', sans-serif",
            fontSize: "0.75rem"
          }} 
        />
      </Box>

      {/* Middle - Stylist info */}
      <Box sx={{ flexGrow: 1, overflow: "hidden" }}>
        <CardContent sx={{ p: 2.5 }}>
          <Box sx={{ display: "flex", flexDirection: "column" }}>
            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 2, mb: 2 }}>
              <Box>
                <Typography variant="body2" color="textSecondary" sx={{ fontSize: "0.75rem", mb: 0.5 }}>
                  Email
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500, color: "#453C33" }}>
                  {stylist.email}
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="body2" color="textSecondary" sx={{ fontSize: "0.75rem", mb: 0.5 }}>
                  Username
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500, color: "#453C33" }}>
                  {stylist.username}
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="body2" color="textSecondary" sx={{ fontSize: "0.75rem", mb: 0.5 }}>
                  Password
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body1" sx={{ fontWeight: 500, color: "#453C33" }}>
                    {passwordVisibility[stylist.stylist_ID] ? stylist.password : '••••••••'}
                  </Typography>
                  <IconButton
                    onClick={() => togglePasswordVisibility(stylist.stylist_ID)}
                    size="small"
                    sx={{ ml: 0.5, p: 0.5 }}
                  >
                    {passwordVisibility[stylist.stylist_ID] ? 
                      <VisibilityOff fontSize="small" /> : 
                      <Visibility fontSize="small" />
                    }
                  </IconButton>
                </Box>
              </Box>
            </Box>
            
            <Divider sx={{ my: 1.5, borderColor: "rgba(190, 175, 155, 0.2)" }} />
            
            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 2, mb: 2 }}>
              <Box>
                <Typography variant="body2" color="textSecondary" sx={{ fontSize: "0.75rem", mb: 0.5 }}>
                  Address
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500, color: "#453C33" }}>
                  {stylist.house_no}, {stylist.street}, {stylist.city}
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="body2" color="textSecondary" sx={{ fontSize: "0.75rem", mb: 0.5 }}>
                  Phone Numbers
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500, color: "#453C33" }}>
                  {stylist.phone_numbers && Array.isArray(stylist.phone_numbers)
                    ? stylist.phone_numbers.join(", ")
                    : "N/A"}
                </Typography>
              </Box>
            </Box>
            
            <Divider sx={{ my: 1.5, borderColor: "rgba(190, 175, 155, 0.2)" }} />
            
            <Box>
              <Typography variant="body2" color="textSecondary" sx={{ fontSize: "0.75rem", mb: 0.5 }}>
                Bio
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontSize: "0.9rem",
                  color: "#666",
                  fontStyle: "italic",
                  padding: "8px 12px",
                  backgroundColor: "rgba(190, 175, 155, 0.05)",
                  borderRadius: "4px",
                  border: "1px solid rgba(190, 175, 155, 0.1)",
                  maxHeight: "80px",
                  overflowY: "auto"
                }}
              >
                {stylist.bio || "No bio available"}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Box>

      {/* Right side - Action buttons */}
      <Box 
        sx={{ 
          width: "100px", 
          display: "flex", 
          flexDirection: "column", 
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
          p: 2,
          borderLeft: "1px dashed rgba(190, 175, 155, 0.3)",
          background: "linear-gradient(to bottom, rgba(190, 175, 155, 0.05), rgba(190, 175, 155, 0.1))"
        }}
      >
        <IconButton 
          sx={{
            backgroundColor: "rgba(190, 175, 155, 0.1)",
            color: "#BEAF9B",
            width: "45px",
            height: "45px",
            "&:hover": {
              backgroundColor: "rgba(190, 175, 155, 0.2)",
              transform: "scale(1.1)",
            }
          }} 
          onClick={() => handleEdit(stylist)}
        >
          <Edit />
        </IconButton>
        
        <IconButton 
          sx={{
            backgroundColor: "rgba(211, 47, 47, 0.05)",
            color: "#d32f2f",
            width: "45px",
            height: "45px",
            "&:hover": {
              backgroundColor: "rgba(211, 47, 47, 0.1)",
              transform: "scale(1.1)",
            }
          }} 
          onClick={() => handleDelete(stylist)}
        >
          <Delete />
        </IconButton>
      </Box>
    </Card>
  );
};

export default StylistCard;