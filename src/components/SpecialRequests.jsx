import React from 'react';
import {
  Box, Typography, Paper, Divider, Chip
} from '@mui/material';
import { motion } from "framer-motion";

const SpecialRequests = ({ specialRequests }) => {
  const renderSpecialRequestCard = (request) => (
    <motion.div
      key={request.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Paper 
        sx={{ 
          p: 3, 
          my: 2, 
          backgroundColor: "#fff", 
          borderRadius: 2,
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          overflow: "hidden"
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" sx={{ fontWeight: '500', color: "#72614e" }}>
            Request #{request.id}
          </Typography>
          <Chip 
            label={request.status || 'Pending'} 
            sx={{ 
              backgroundColor: 
                request.status === 'approved' ? "#6da58a" : 
                request.status === 'rejected' ? "#d47777" :
                request.status === 'completed' ? "#6a8fd5" : "#d9c17a",
              color: "white",
              fontWeight: 500
            }} 
          />
        </Box>
        <Typography variant="body2" sx={{ mt: 1, color: "#999" }}>
          Submitted on: {new Date(request.created_at).toLocaleString()}
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Typography sx={{ color: "#555" }}>{request.request_details}</Typography>
      </Paper>
    </motion.div>
  );

  return (
    <Box>
      <Typography 
        variant="h5" 
        sx={{ 
          mb: 3, 
          color: "#72614e", 
          fontWeight: 500,
          borderBottom: "2px solid #b8a99a",
          pb: 1,
          display: "inline-block"
        }}
      >
        My Special Requests
      </Typography>
      {specialRequests.length === 0 ? (
        <Paper 
          sx={{ 
            p: 4, 
            textAlign: 'center', 
            backgroundColor: "#fff",
            borderRadius: 2
          }}
        >
          <Typography sx={{ color: "#999", fontStyle: 'italic' }}>
            You haven't made any special requests yet.
          </Typography>
        </Paper>
      ) : (
        specialRequests.map(request => renderSpecialRequestCard(request))
      )}
    </Box>
  );
};

export default SpecialRequests;