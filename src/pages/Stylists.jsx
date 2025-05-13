// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { Box, Typography, Container, CircularProgress } from '@mui/material';
// import stylistImage from '../assets/stylist.png';
// import StylistCard from '../components/StylistCard';

// const Stylists = () => {
//   const [stylists, setStylists] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     axios.get('http://localhost:5001/api/stylists')
//       .then((res) => {
//         setStylists(res.data);
//         setLoading(false);
//       })
//       .catch((err) => {
//         console.error('Failed to fetch stylists:', err);
//         setLoading(false);
//       });
//   }, []);

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
//           src={stylistImage}
//           alt="Stylists"
//           sx={{
//             width: '100%',
//             height: '100%',
//             objectFit: 'cover',
//             display: 'block'
//           }}
//         />
//         <Box
//           sx={{
//             position: 'absolute',
//             top: 0,
//             left: 0,
//             width: '100%',
//             height: '100%',
//             display: 'flex',
//             justifyContent: 'center',
//             alignItems: 'center',
//           }}
//         >
//         </Box>
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
//           {loading ? (
//             <Box sx={{ 
//               display: 'flex', 
//               justifyContent: 'center',
//               alignItems: 'center',
//               height: '300px'
//             }}>
//               <CircularProgress size={60} />
//             </Box>
//           ) : (
//             <>
//               <Typography variant="h4" component="h2" sx={{ 
//                 mb: 4,
//                 textAlign: 'center',
//                 fontWeight: 'bold'
//               }}>
//                 Meet Our Talented Team
//               </Typography>
              
//               {stylists.map((stylist, index) => (
//                 <StylistCard 
//                   key={stylist.stylist_ID} 
//                   stylist={stylist} 
//                   index={index} 
//                 />
//               ))}
//             </>
//           )}
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

// export default Stylists;

















import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Typography, Container, CircularProgress, Rating } from '@mui/material';
import stylistImage from '../assets/stylist.png';
import StylistCard from '../components/StylistCard';

const Stylists = () => {
  const [stylists, setStylists] = useState([]);
  const [ratings, setRatings] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch all stylists
    axios.get('http://localhost:5001/api/stylists')
      .then((res) => {
        setStylists(res.data);
        
        // After fetching stylists, fetch their ratings
        return axios.get('http://localhost:5001/api/review/average-ratings');
      })
      .then((ratingsRes) => {
        // Convert the array to an object for easier lookup
        const ratingsObj = {};
        ratingsRes.data.forEach(rating => {
          ratingsObj[rating.stylist_ID] = rating.averageRating;
        });
        setRatings(ratingsObj);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch data:', err);
        setLoading(false);
      });
  }, []);

  return (
    <Box sx={{ 
      width: '100%', 
      maxWidth: '100%', 
      minHeight: '100vh',
      overflowX: 'hidden',
      position: 'relative',
      bgcolor: '#f5f5f7',
      display: 'flex',
      flexDirection: 'column',
      scrollbarWidth: 'none',
      msOverflowStyle: 'none',
      '&::-webkit-scrollbar': {
        display: 'none',
      },
    }}>
      {/* Header Banner - unchanged */}
      <Box
        sx={{
          width: '100%',
          height: { xs: '200px', sm: '300px', md: '400px' },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box
          component="img"
          src={stylistImage}
          alt="Stylists"
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block'
          }}
        />
      </Box>

      {/* Main Content */}
      <Box sx={{
        flex: 1,
        py: 4,
        px: { xs: 2, md: 4 },
        width: '100%',
        overflowX: 'hidden',
      }}>
        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
          {loading ? (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center',
              alignItems: 'center',
              height: '300px'
            }}>
              <CircularProgress size={60} />
            </Box>
          ) : (
            <>
              <Typography variant="h4" component="h2" sx={{ 
                mb: 4,
                textAlign: 'center',
                fontWeight: 'bold'
              }}>
                Meet Our Talented Team
              </Typography>
              
              {stylists.map((stylist, index) => (
                <Box key={stylist.stylist_ID} sx={{ mb: 4 }}>
                  <StylistCard 
                    stylist={stylist} 
                    index={index} 
                  />
                  <Box sx={{ mt: 1, display: 'flex', alignItems: 'center' }}>
                    <Rating 
                      value={ratings[stylist.stylist_ID] || 0} 
                      precision={0.5} 
                      readOnly 
                    />
                    <Typography variant="body2" sx={{ ml: 1 }}>
                      {ratings[stylist.stylist_ID] 
                        ? `(${parseFloat(ratings[stylist.stylist_ID]).toFixed(1)})` 
                        : '(No reviews yet)'}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </>
          )}
        </Container>
      </Box>

      {/* Global Styles - unchanged */}
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

export default Stylists;