// import React from 'react';
// import { Box, Typography, Grid, Card, CardActionArea, CardMedia, Container } from '@mui/material';
// import { useNavigate } from 'react-router-dom';
// import servicesImage from '../assets/services.png';
// import hairImg from '../assets/Hair.png';
// import faceImg from '../assets/face.jpg';
// import nailsImg from '../assets/Nails.png';
// import bodyImg from '../assets/Body.png';
// import makeupImg from '../assets/Makeup.png';
// import bridalImg from '../assets/Bridal.png';

// const categories = [
//   { id: 1, name: 'Hair', path: '/services/hair', image: hairImg },
//   { id: 2, name: 'Face', path: '/services/face', image: faceImg },
//   { id: 3, name: 'Nails', path: '/services/nails', image: nailsImg },
//   { id: 4, name: 'Body', path: '/services/body', image: bodyImg },
//   { id: 5, name: 'Makeup', path: '/services/makeup', image: makeupImg },
//   { id: 6, name: 'Bridal', path: '/services/bridal', image: bridalImg },
// ];

// const Services = () => {
//   const navigate = useNavigate();

//   return (
//     <Box sx={{ 
//       width: '100%', 
//       maxWidth: '100%', 
//       minHeight: '100vh',
//       overflowX: 'hidden',
//       position: 'relative',
//       bgcolor: '#f5f5f7',
//       display: 'flex',
//       flexDirection: 'column',
//       scrollbarWidth: 'none', /* Firefox */
//       msOverflowStyle: 'none',
//       '&::-webkit-scrollbar': {
//         display: 'none', /* Chrome, Safari, Opera */
//       },
//     }}>
//       {/* Header Banner */}
//       <Box
//         sx={{
//           width: '100%',
//           height: { xs: '200px', sm: '300px', md: '400px' },
//           position: 'relative',
//           overflow: 'hidden',
//         }}
//       >
//         <Box
//           component="img"
//           src={servicesImage}
//           alt="Services"
//           sx={{
//             width: '100%',
//             height: '100%',
//             objectFit: 'cover',
//             display: 'block'
//           }}
//         />
//       </Box>

//       {/* Main Content */}
//       <Box sx={{
//         flex: 1,
//         py: 4,
//         px: { xs: 2, md: 4 },
//         width: '100%',
//         overflowX: 'hidden',
//       }}>
//         <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
//           <Typography
//             variant="h4"
//             gutterBottom
//             sx={{ 
//               fontFamily: 'Dream Avenue', 
//               fontWeight: 'bold', 
//               textAlign: 'center',
//               mb: 4
//             }}
//           >
//             Our Service Categories
//           </Typography>

//           <Typography
//             variant="body1"
//             sx={{ 
//               fontFamily: 'Dream Avenue', 
//               fontWeight: 'bold', 
//               textAlign: 'center',
//               mb: 6,
//               maxWidth: '800px',
//               mx: 'auto'
//             }}
//           >
//             Discover a range of personalized beauty services tailored to enhance your natural glow.
//             Whether you're preparing for a big event or just indulging in a self-care day, 
//             our categories offer something special for everyone.
//           </Typography>

//           <Grid container spacing={3}>
//             {categories.map((category) => (
//               <Grid item xs={12} sm={6} md={4} key={category.id}>
//                 <Card
//                   sx={{
//                     borderRadius: 3,
//                     boxShadow: 3,
//                     overflow: 'hidden',
//                     transition: '0.3s',
//                     '&:hover': { 
//                       transform: 'scale(1.03)',
//                       boxShadow: 6
//                     },
//                   }}
//                 >
//                   <CardActionArea 
//                     onClick={() => navigate(category.path)}
//                     sx={{
//                       height: '100%',
//                       display: 'flex',
//                       flexDirection: 'column'
//                     }}
//                   >
//                     <CardMedia
//                       component="img"
//                       image={category.image}
//                       alt={category.name}
//                       sx={{
//                         width: '100%',
//                         height: '250px',
//                         objectFit: 'cover',
//                       }}
//                     />
//                     <Box sx={{ p: 2, textAlign: 'center' }}>
//                       <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
//                         {category.name}
//                       </Typography>
//                     </Box>
//                   </CardActionArea>
//                 </Card>
//               </Grid>
//             ))}
//           </Grid>
//         </Container>
//       </Box>

//       {/* Global Styles */}
//       <style jsx global>{`
//         * {
//           box-sizing: border-box;
//           margin: 0;
//           padding: 0;
//         }
//         html, body {
//           overflow-x: hidden;
//           width: 100%;
//           max-width: 100%;
//           margin: 0;
//           padding: 0;
//         }
//         ::-webkit-scrollbar {
//           display: none;
//         }
//         * {
//           scrollbar-width: none;
//         }
//         .MuiBox-root, .MuiContainer-root {
//           max-width: 100%;
//         }
//       `}</style>
//     </Box>
//   );
// };

// export default Services;

















import React from 'react';
import { Box, Typography, Grid, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import servicesImage from '../assets/services.png';
import hairImg from '../assets/Hair.png';
import faceImg from '../assets/face.jpg';
import nailsImg from '../assets/Nails.png';
import bodyImg from '../assets/Body.png';
import makeupImg from '../assets/Makeup.png';
import bridalImg from '../assets/Bridal.png';

const categories = [
  { id: 1, name: 'Hair', path: '/services/hair', image: hairImg },
  { id: 2, name: 'Face', path: '/services/face', image: faceImg },
  { id: 3, name: 'Nails', path: '/services/nails', image: nailsImg },
  { id: 4, name: 'Body', path: '/services/body', image: bodyImg },
  { id: 5, name: 'Makeup', path: '/services/makeup', image: makeupImg },
  { id: 6, name: 'Bridal', path: '/services/bridal', image: bridalImg },
];

const Services = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ 
      width: '100%', 
      maxWidth: '100%', 
      minHeight: '100vh',
      overflowX: 'hidden',
      position: 'relative',
      bgcolor: '#faf8f5', // Match Stylists component background
      display: 'flex',
      flexDirection: 'column',
      scrollbarWidth: 'none',
      msOverflowStyle: 'none',
      '&::-webkit-scrollbar': {
        display: 'none',
      },
    }}>
      {/* Header Banner */}
      <Box
        sx={{
          width: '100%',
          height: { xs: '200px', sm: '250px', md: '300px' },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box
          component="img"
          src={servicesImage}
          alt="Services"
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block'
          }}
        />
      </Box>

      {/* Page Title - Styled like Stylists component */}
      <Box 
        sx={{
          background: 'linear-gradient(135deg, #282520 0%, #3a352e 100%)',
          color: 'white',
          p: { xs: 3, md: 4 },
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <Container maxWidth="lg">
          <Typography 
            variant="h4" 
            component="h1" 
            sx={{ 
              fontWeight: 500,
              fontFamily: "'Poppins', 'Roboto', sans-serif",
              textAlign: 'center',
            }}
          >
            Our Service Categories
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              opacity: 0.8,
              mt: 1,
              fontFamily: "'Poppins', 'Roboto', sans-serif",
              textAlign: 'center',
            }}
          >
            Discover a range of personalized beauty services tailored to enhance your natural glow
          </Typography>
        </Container>
      </Box>

      {/* Main Content */}
      <Box sx={{
        flex: 1,
        py: 4,
        px: { xs: 2, md: 3 },
        width: '100%',
        overflowX: 'hidden',
        mt: -2,
      }}>
        <Container maxWidth="lg" sx={{ px: { xs: 1, sm: 2 } }}>
          <Grid container spacing={3} justifyContent="center">
            {categories.map((category) => (
              <Grid item xs={12} sm={6} md={4} key={category.id} sx={{ 
                display: 'flex', 
                justifyContent: 'center',
                mb: { xs: 1, sm: 2 } 
              }}>
                <Box
                  sx={{
                    width: '300px',
                    height: '375px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.08)',
                    '&:hover': { 
                      transform: 'translateY(-5px) scale(1.02)',
                      boxShadow: '0 10px 20px rgba(0,0,0,0.12)',
                    },
                  }}
                  onClick={() => navigate(category.path)}
                >
                  <Box
                    component="img"
                    src={category.image}
                    alt={category.name}
                    sx={{
                      width: '300px',
                      height: '375px',
                      display: 'block',
                    }}
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
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

export default Services;