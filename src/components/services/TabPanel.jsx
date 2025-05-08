import React from 'react';
import { Box, Fade } from '@mui/material';

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`service-tabpanel-${index}`}
      aria-labelledby={`service-tab-${index}`}
      {...other}
      style={{ width: '100%' }}
    >
      {value === index && (
        <Fade in={value === index} timeout={400}>
          <Box sx={{ 
            p: { xs: 2, sm: 3 },
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            borderRadius: '0 0 8px 8px',
            boxShadow: '0 1px 2px rgba(190, 175, 155, 0.1)',
            minHeight: '80vh',
            position: 'relative',
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(8px)',
          }}>
            {children}
          </Box>
        </Fade>
      )}
    </div>
  );
};

export default TabPanel;