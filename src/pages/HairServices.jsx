import React, { useState, useEffect } from 'react';
import { 
  Box,
  Typography,
  List,
  ListItem,
  Divider,
  Container,
  useTheme
} from '@mui/material';
import ServiceNavbar from '../components/ServiceNavbar';
import hairHeaderImg from '../assets/HairHeader.png';

const HairServicesPage = () => {
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

        const hairCategories = categoriesData.filter(cat => {
          if (!cat.category_name) return false;
          const name = cat.category_name.toLowerCase();
          return (
            name.includes('hair') ||
            name.includes('cut') ||
            name.includes('color') ||
            name.includes('style') ||
            name.includes('treatment') ||
            name.includes('textur')
          );
        });

        const filteredCategories = hairCategories.length ? hairCategories : categoriesData;
        if (!hairCategories.length) {
          console.warn('No strict hair categories found - showing all categories');
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
                          src={hairHeaderImg}
                          alt="Gallery Banner"
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
            No hair services available at this time.
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

export default HairServicesPage;