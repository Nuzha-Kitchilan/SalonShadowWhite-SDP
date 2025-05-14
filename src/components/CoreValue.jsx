import React from 'react';
import { 
  Box, 
  Typography, 
  Grid,
  useMediaQuery,
  useTheme
} from '@mui/material';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';
import WeekendIcon from '@mui/icons-material/Weekend';

const CoreValuesSection = () => {
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  // Value cards data
  const values = [
    {
      title: "Innovation",
      icon: <AutoFixHighIcon sx={{ fontSize: 36 }} />,
      description: "We embrace cutting-edge techniques and products, constantly evolving our craft to bring you the latest trends and styles before they become mainstream."
    },
    {
      title: "Precision",
      icon: <PrecisionManufacturingIcon sx={{ fontSize: 36 }} />,
      description: "Every cut, color, and treatment is executed with meticulous attention to detail, ensuring results that perfectly complement your unique features and personality."
    },
    {
      title: "Comfort",
      icon: <WeekendIcon sx={{ fontSize: 36 }} />,
      description: "Your experience matters as much as your look. Our space is designed as a sanctuary where relaxation meets transformation, making every visit a rejuvenating retreat."
    }
  ];

  return (
    <Box sx={{ mb: 2 }}>
      <Typography 
        variant="h5" 
        sx={{ 
          fontWeight: 600,
          fontSize: { xs: '1.4rem', md: '1.75rem' },
          color: '#282520',
          mb: { xs: 3, md: 4 },
          textAlign: 'center',
          fontFamily: "'Poppins', 'Roboto', sans-serif",
        }}
      >
        Our Core Values
      </Typography>

      <Grid container spacing={isTablet ? 3 : 4}>
        {values.map((value, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                p: { xs: 2, md: 3 },
                height: '100%',
                position: 'relative',
                borderRadius: 2,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  '& .value-icon-container': {
                    background: 'linear-gradient(135deg, #282520 0%, #3a352e 100%)',
                    '& svg': {
                      color: '#fff'
                    }
                  }
                }
              }}
            >
              {/* Icon */}
              <Box 
                className="value-icon-container"
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  background: 'linear-gradient(135deg, #faf8f5 0%, #f0ece7 100%)',
                  mb: 2,
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 15px rgba(190, 175, 155, 0.15)',
                  '& svg': {
                    color: '#BEAF9B',
                    transition: 'all 0.3s ease'
                  }
                }}
              >
                {value.icon}
              </Box>

              {/* Title */}
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 600,
                  mb: 1.5,
                  color: '#282520',
                  fontFamily: "'Poppins', 'Roboto', sans-serif",
                }}
              >
                {value.title}
              </Typography>

              {/* Description */}
              <Typography 
                variant="body2" 
                sx={{ 
                  textAlign: 'center',
                  color: '#3a352e',
                  lineHeight: 1.7,
                  fontFamily: "'Poppins', 'Roboto', sans-serif",
                }}
              >
                {value.description}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default CoreValuesSection;