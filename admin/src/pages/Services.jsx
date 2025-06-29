import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Tab, 
  Tabs, 
  Typography, 
  Container, 
  Paper, 
  useMediaQuery, 
  useTheme 
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ServicesTable from '../components/services/ServicesTable';
import CategoriesTable from '../components/services/CategoriesTable';
import TabPanel from '../components/services/TabPanel';
import { jwtDecode } from 'jwt-decode';
import SpaIcon from '@mui/icons-material/Spa';
import CategoryIcon from '@mui/icons-material/Category';

// Custom styled tabs
const StyledTabs = styled(Tabs)({
  borderBottom: '1px solid rgba(190, 175, 155, 0.3)',
  '& .MuiTabs-indicator': {
    backgroundColor: '#BEAF9B',
    height: 3,
  },
});

// Custom styled tab
const StyledTab = styled((props) => <Tab disableRipple {...props} />)(({ theme }) => ({
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '0.9rem',
  fontFamily: "'Poppins', 'Roboto', sans-serif",
  color: '#666666',
  marginRight: theme.spacing(1),
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
  transition: 'all 0.2s',
  '&.Mui-selected': {
    color: '#453C33',
    fontWeight: 700,
  },
  '&.Mui-focusVisible': {
    backgroundColor: 'rgba(190, 175, 155, 0.1)',
  },
  '&:hover': {
    color: '#453C33',
    backgroundColor: 'rgba(190, 175, 155, 0.1)',
  },
}));

const ServicesManagement = () => {
  const [tabValue, setTabValue] = useState(0);
  const [categories, setCategories] = useState([]);
  const [adminId, setAdminId] = useState(null);
  const [adminName, setAdminName] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    // Get admin info from JWT token
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setAdminId(decodedToken.id);
        setAdminName(decodedToken.name || decodedToken.username || 'Admin');
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Get current time to display greeting
  const getCurrentTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <Container maxWidth="xl" sx={{ mt: { xs: 2, md: 4 } }}>
      <Paper 
        elevation={0}
        sx={{ 
          borderRadius: '8px',
          overflow: 'hidden',
          border: '1px solid rgba(190, 175, 155, 0.2)',
          mb: 4,
          background: 'linear-gradient(to right, rgba(190, 175, 155, 0.1), rgba(255, 255, 255, 0.8))',
        }}
      >
        <Box sx={{ p: { xs: 2, md: 3 }, borderBottom: '1px solid rgba(190, 175, 155, 0.2)' }}>
          <Typography 
            variant={isMobile ? "h5" : "h4"} 
            component="h1" 
            sx={{ 
              fontFamily: "'Poppins', 'Roboto', sans-serif",
              fontWeight: 600,
              color: '#453C33',
              mb: 1
            }}
          >
            Service Management
          </Typography>
          
          <Typography 
            variant="body1" 
            sx={{ 
              fontFamily: "'Poppins', 'Roboto', sans-serif",
              color: '#666',
              mb: 1
            }}
          >
            {getCurrentTimeGreeting()}, {adminName}. Manage your salon's services and categories here.
          </Typography>
        </Box>
        
        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'rgba(190, 175, 155, 0.2)', px: { xs: 2, md: 3 } }}>
            <StyledTabs 
              value={tabValue} 
              onChange={handleTabChange}
              aria-label="service management tabs"
              variant={isMobile ? "fullWidth" : "standard"}
            >
              <StyledTab 
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <SpaIcon fontSize="small" />
                    <span>Services</span>
                  </Box>
                } 
                id="service-tab-0"
                aria-controls="service-tabpanel-0"
              />
              <StyledTab 
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CategoryIcon fontSize="small" />
                    <span>Categories</span>
                  </Box>
                } 
                id="service-tab-1"
                aria-controls="service-tabpanel-1"
              />
            </StyledTabs>
          </Box>
          
          <TabPanel value={tabValue} index={0}>
            <ServicesTable 
              categories={categories} 
              setCategories={setCategories}
              adminId={adminId}
              tableSx={{ 
                borderRadius: '8px',
                overflow: 'hidden',
              }}
              buttonSx={{
                edit: { color: '#BEAF9B' },
                delete: { color: '#ff6b6b' }
              }}
            />
          </TabPanel>
          
          <TabPanel value={tabValue} index={1}>
            <CategoriesTable 
              categories={categories} 
              setCategories={setCategories}
              adminId={adminId}
              tableSx={{ 
                borderRadius: '8px',
                overflow: 'hidden',
              }}
              buttonSx={{
                edit: { color: '#BEAF9B' },
                delete: { color: '#ff6b6b' }
              }}
            />
          </TabPanel>
        </Box>
      </Paper>
    </Container>
  );
};

export default ServicesManagement;