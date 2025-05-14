import React, { useState, useEffect } from 'react';
import { 
  Box,
  Typography,
  List,
  ListItem,
  Divider,
  Container,
  useTheme,
  Button
} from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import ServiceNavbar from '../components/ServiceNavbar';
import bridalHeaderImg from '../assets/BridalHeader.png';

const BridalServicesPage = () => {
  const [categories, setCategories] = useState([]);
  const [servicesByCategory, setServicesByCategory] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const theme = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/categories');
        const data = await response.json();

        let categoriesData = [];
        if (Array.isArray(data)) {
          categoriesData = data;
        } else if (data && Array.isArray(data.categories)) {
          categoriesData = data.categories;
        } else if (data && Array.isArray(data.items)) {
          categoriesData = data.items;
        }

        if (!categoriesData.length) {
          setError('No categories available');
          setLoading(false);
          return;
        }

        const bridalCategories = categoriesData.filter(cat => {
          if (!cat.category_name) return false;
          const name = cat.category_name.toLowerCase();
          return (
            name.includes('bridal') ||
            name.includes('wedding') ||
            name.includes('bride') ||
            name.includes('engagement') ||
            name.includes('matrimony') ||
            name.includes('ceremony')
          );
        });

        const filteredCategories = bridalCategories.length ? bridalCategories : categoriesData;
        if (!bridalCategories.length) {
          console.warn('No strict bridal categories found - showing all categories');
        }

        setCategories(filteredCategories);

        const servicesData = {};
        await Promise.all(
          filteredCategories.map(async (category) => {
            try {
              const res = await fetch(`http://localhost:5001/api/services/category/${category.category_id}`);
              const serviceData = await res.json();
              servicesData[category.category_id] = Array.isArray(serviceData) ? serviceData : [];
            } catch (err) {
              console.error(`Error fetching services for category ${category.category_id}:`, err);
              servicesData[category.category_id] = [];
            }
          })
        );

        setServicesByCategory(servicesData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message || 'Failed to load services');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <Typography variant="body1">Loading services...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  const renderCategorySection = (category) => (
    <Box key={category.category_id} sx={{ mb: 8 }}>
      <Typography
        variant="h6"
        component="h2"
        sx={{
          fontWeight: 'bold',
          textTransform: 'uppercase',
          mb: 2,
          pb: 1,
          borderBottom: '1px solid',
          borderColor: 'divider'
        }}
      >
        {category.category_name}
      </Typography>

      {category.description && (
        <Typography
          variant="body2"
          sx={{
            mb: 4,
            color: 'text.secondary',
            fontSize: '0.95rem',
            lineHeight: 1.5
          }}
        >
          {category.description}
        </Typography>
      )}

      <List disablePadding sx={{ mb: 4 }}>
        {servicesByCategory[category.category_id]?.length > 0 ? (
          servicesByCategory[category.category_id].map((service, index) => (
            <React.Fragment key={service.service_id || index}>
              <ListItem
                disableGutters
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  py: 2
                }}
              >
                <Box
                  sx={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                    mb: 0.5
                  }}
                >
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {service.service_name}
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {typeof service.price === 'number' ? `$${service.price.toFixed(2)}` : service.price}
                  </Typography>
                </Box>
                {service.description && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontSize: '0.85rem' }}
                  >
                    {service.description}
                  </Typography>
                )}
              </ListItem>
              {index < servicesByCategory[category.category_id].length - 1 && (
                <Divider sx={{ my: 0.5 }} />
              )}
            </React.Fragment>
          ))
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
            No services available in this category.
          </Typography>
        )}
      </List>
    </Box>
  );

  return (
    <Box sx={{ 
      width: '100%', 
      maxWidth: '100%', 
      minHeight: '100vh',
      overflowX: 'hidden',
      position: 'relative',
      bgcolor: '#faf8f5',
      display: 'flex',
      flexDirection: 'column',
      scrollbarWidth: 'none',
      msOverflowStyle: 'none',
      '&::-webkit-scrollbar': {
        display: 'none',
      },
    }}>
      {/* Header Banner */}
      <Box sx={{
        height: { xs: '200px', sm: '300px', md: '400px' },
        width: "100%",
        position: "relative",
        overflow: "hidden",
      }}>
        <Box
          component="img"
          src={bridalHeaderImg}
          alt="Bridal Services Banner"
          sx={{ 
            width: "100%", 
            height: "100%", 
            objectFit: "cover",
            display: "block" 
          }}
        />
      </Box>
      
      {/* Main content with container */}
      <Container maxWidth="lg" sx={{ py: 6, mt: -2 }}>

        {categories.length === 0 ? (
          <Typography align="center" sx={{ py: 4 }}>
            No bridal services available at this time.
          </Typography>
        ) : (
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 4 }}>
            <Box>
              {categories.slice(0, Math.ceil(categories.length / 2)).map(renderCategorySection)}
            </Box>
            <Box>
              {categories.slice(Math.ceil(categories.length / 2)).map(renderCategorySection)}
            </Box>
          </Box>
        )}
        
        {/* Contact Information Section */}
        <Box 
          sx={{ 
            p: 4, 
            mt: 6, 
            mb: 4, 
            textAlign: 'center',
            background: 'linear-gradient(135deg, #faf8f5 0%, #f0ece7 100%)',
            borderRadius: 2,
            boxShadow: '0 4px 15px rgba(190, 175, 155, 0.15)',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: '0 6px 20px rgba(190, 175, 155, 0.2)',
            }
          }}
        >
          <Typography 
            variant="h5" 
            sx={{ 
              mb: 2, 
              fontWeight: 600,
              fontSize: { xs: '1.4rem', md: '1.75rem' },
              color: '#282520',
              fontFamily: "'Poppins', 'Roboto', sans-serif",
            }}
          >
            Customize Your Bridal Experience
          </Typography>
          
          <Typography 
            variant="body1" 
            sx={{ 
              mb: 3,
              color: '#3a352e',
              lineHeight: 1.7,
              fontFamily: "'Poppins', 'Roboto', sans-serif",
              maxWidth: '800px',
              mx: 'auto'
            }}
          >
            For more details about our bridal packages, custom services, or to schedule a bridal consultation, 
            please send us an inquiry or contact us directly.
          </Typography>
          
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' }, 
            justifyContent: 'center', 
            alignItems: 'center',
            gap: 3 
          }}>
            <Button 
              variant="contained" 
              size="large"
              href="/contact"
              sx={{ 
                minWidth: 200,
                py: 1.5,
                px: 3,
                background: 'linear-gradient(135deg, #282520 0%, #3a352e 100%)',
                color: '#fff',
                borderRadius: '30px',
                fontWeight: 500,
                textTransform: 'none',
                fontFamily: "'Poppins', 'Roboto', sans-serif",
                boxShadow: '0 4px 10px rgba(58, 53, 46, 0.2)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'linear-gradient(135deg, #3a352e 0%, #282520 100%)',
                  boxShadow: '0 6px 15px rgba(58, 53, 46, 0.3)',
                }
              }}
            >
              Send Inquiry
            </Button>
            
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                justifyContent: { xs: 'center', sm: 'flex-start' },
                gap: 1
              }}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  background: 'linear-gradient(135deg, #faf8f5 0%, #f0ece7 100%)',
                  boxShadow: '0 4px 10px rgba(190, 175, 155, 0.15)',
                }}
              >
                <PhoneIcon sx={{ fontSize: 20, color: '#BEAF9B' }} />
              </Box>
              
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 500,
                  color: '#282520',
                  fontFamily: "'Poppins', 'Roboto', sans-serif",
                }}
              >
                Call: 0777445657
              </Typography>
            </Box>
          </Box>
        </Box>
      </Container>

      <Box 
        sx={{ 
          width: '100%', 
          backgroundColor: theme.palette.background.paper,
          borderTop: '1px solid',
          borderColor: 'divider',
          mb: 0
        }}
      >
        <ServiceNavbar />
      </Box>

      {/* Global Styles */}
      <style jsx global>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        html, body {
          overflow-x: hidden;
          width: 100%;
          max-width: 100%;
          margin: 0;
          padding: 0;
        }
        ::-webkit-scrollbar {
          display: none;
        }
        * {
          scrollbar-width: none;
        }
        .MuiBox-root, .MuiContainer-root {
          max-width: 100%;
        }
      `}</style>
    </Box>
  );
};

export default BridalServicesPage;