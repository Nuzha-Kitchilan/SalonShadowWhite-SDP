import React from 'react';
import { Card, CardContent, Typography, Avatar, IconButton } from '@mui/material';
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
        textAlign: "center",
        height: 460,
        boxShadow: `0 6px 12px rgba(254, 141, 161, 0.8)`,
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: "scale(1.05)",
          boxShadow: `0 12px 24px rgba(254, 141, 161, 1)`,
        },
      }}
    >
      <Avatar
        sx={{
          width: 120,
          height: 120,
          margin: "20px auto 10px",
          fontSize: "3rem",
          backgroundColor: "lightgray",
        }}
        src={stylist.profile_url || ""}
      >
        {stylist.firstname ? stylist.firstname[0] : "S"}
      </Avatar>
      <CardContent>
        <Typography variant="h6">
          {stylist.firstname} {stylist.lastname}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Role: {stylist.role}
        </Typography>
        <Typography variant="body2">Email: {stylist.email}</Typography>
        <Typography variant="body2">
          Username: {stylist.username}
        </Typography>
        <Typography variant="body2" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          Password: {passwordVisibility[stylist.stylist_ID] ? stylist.password : '••••••••'} 
          <IconButton 
            onClick={() => togglePasswordVisibility(stylist.stylist_ID)} 
            size="small" 
            style={{ marginLeft: '5px' }}
          >
            {passwordVisibility[stylist.stylist_ID] ? 
              <VisibilityOff fontSize="small" /> : 
              <Visibility fontSize="small" />
            }
          </IconButton>
        </Typography>
        <Typography variant="body2">
          Address: {stylist.house_no}, {stylist.street}, {stylist.city}
        </Typography>
        <Typography variant="body2">
          Phone:{" "}
          {stylist.phone_numbers && Array.isArray(stylist.phone_numbers)
            ? stylist.phone_numbers.join(", ")
            : "N/A"}
        </Typography>
        <Typography 
          variant="body2" 
          sx={{
            mt: 1,
            maxHeight: '60px',
            overflow: 'auto',
            textAlign: 'left',
            padding: '0 10px'
          }}
        >
          <strong>Bio:</strong> {stylist.bio || "No bio available"}
        </Typography>

        <div style={{ marginTop: "10px" }}>
          <IconButton color="success" onClick={() => handleEdit(stylist)}>
            <Edit />
          </IconButton>
          <IconButton color="error" onClick={() => handleDelete(stylist)}>
            <Delete />
          </IconButton>
        </div>
      </CardContent>
    </Card>
  );
};

export default StylistCard;