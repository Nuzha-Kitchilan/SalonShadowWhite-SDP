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














// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { 
//   Box, 
//   Typography, 
//   Container, 
//   CircularProgress, 
//   Rating, 
//   Button,
//   Paper,
//   Avatar,
//   Divider,
//   Chip,
//   Grid
// } from '@mui/material';
// import { Link as RouterLink } from 'react-router-dom';
// import stylistImage from '../assets/stylist.png';
// import StylistCard from '../components/StylistCard';
// import StylistReviewsModal from '../components/StylistReviewsModal';
// import StarIcon from '@mui/icons-material/Star';
// import PersonIcon from '@mui/icons-material/Person';

// const Stylists = () => {
//   const [stylists, setStylists] = useState([]);
//   const [ratings, setRatings] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [selectedStylist, setSelectedStylist] = useState(null);
//   const [reviewsOpen, setReviewsOpen] = useState(false);
//   const [stylistReviews, setStylistReviews] = useState([]);
//   const [loadingReviews, setLoadingReviews] = useState(false);

//   useEffect(() => {
//     // Fetch all stylists
//     axios.get('http://localhost:5001/api/stylists')
//       .then((res) => {
//         setStylists(res.data);
        
//         // After fetching stylists, fetch their ratings
//         return axios.get('http://localhost:5001/api/review/average-ratings');
//       })
//       .then((ratingsRes) => {
//         // Convert the array to an object for easier lookup
//         const ratingsObj = {};
//         ratingsRes.data.forEach(rating => {
//           ratingsObj[rating.stylist_ID] = rating.averageRating;
//         });
//         setRatings(ratingsObj);
//         setLoading(false);
//       })
//       .catch((err) => {
//         console.error('Failed to fetch data:', err);
//         setLoading(false);
//       });
//   }, []);

//   const handleOpenReviews = (stylist) => {
//     setSelectedStylist(stylist);
//     setLoadingReviews(true);
    
//     // Fetch reviews for the selected stylist
//     axios.get(`http://localhost:5001/api/review/by-stylist/${stylist.stylist_ID}`)
//       .then((res) => {
//         setStylistReviews(res.data);
//         setLoadingReviews(false);
//         setReviewsOpen(true);
//       })
//       .catch((err) => {
//         console.error('Failed to fetch stylist reviews:', err);
//         setLoadingReviews(false);
//         // Still open the modal, it will just show "No reviews yet"
//         setReviewsOpen(true);
//       });
//   };

//   const handleCloseReviews = () => {
//     setReviewsOpen(false);
//     setSelectedStylist(null);
//     setStylistReviews([]);
//   };

//   return (
//     <Box sx={{ 
//       width: '100%', 
//       maxWidth: '100%', 
//       minHeight: '100vh',
//       overflowX: 'hidden',
//       position: 'relative',
//       bgcolor: '#faf8f5', // Match the modal background color
//       display: 'flex',
//       flexDirection: 'column',
//       scrollbarWidth: 'none',
//       msOverflowStyle: 'none',
//       '&::-webkit-scrollbar': {
//         display: 'none',
//       },
//     }}>
//       {/* Header Banner - unchanged */}
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
//       </Box>

//       {/* Page Title with Gradient Background - matching modal header */}
//       <Box 
//         sx={{
//           background: 'linear-gradient(135deg, #282520 0%, #3a352e 100%)',
//           color: 'white',
//           p: { xs: 3, md: 4 },
//           boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
//           position: 'relative',
//           zIndex: 2,
//         }}
//       >
//         <Container maxWidth="lg">
//           <Typography 
//             variant="h4" 
//             component="h1" 
//             sx={{ 
//               fontWeight: 500,
//               fontFamily: "'Poppins', 'Roboto', sans-serif",
//               textAlign: 'center',
//             }}
//           >
//             Meet Our Talented Team
//           </Typography>
//           <Typography 
//             variant="body1" 
//             sx={{ 
//               opacity: 0.8,
//               mt: 1,
//               fontFamily: "'Poppins', 'Roboto', sans-serif",
//               textAlign: 'center',
//             }}
//           >
//             Discover our experts who are passionate about bringing out your best look
//           </Typography>
//         </Container>
//       </Box>

//       {/* Main Content */}
//       <Box sx={{
//         flex: 1,
//         py: 5,
//         px: { xs: 2, md: 4 },
//         width: '100%',
//         overflowX: 'hidden',
//         mt: -2, // Slight overlap with the header for visual interest
//       }}>
//         <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
//           {loading ? (
//             <Box sx={{ 
//               display: 'flex', 
//               flexDirection: 'column',
//               justifyContent: 'center',
//               alignItems: 'center',
//               height: '300px',
//               my: 4
//             }}>
//               <CircularProgress 
//                 size={60} 
//                 sx={{ 
//                   color: '#BEAF9B', // Match with modal color scheme
//                   mb: 2
//                 }}
//               />
//               <Typography 
//                 variant="body1" 
//                 sx={{ 
//                   fontFamily: "'Poppins', 'Roboto', sans-serif",
//                   color: '#3a3529'
//                 }}
//               >
//                 Loading our amazing stylists...
//               </Typography>
//             </Box>
//           ) : (
//             <Grid container spacing={3}>
//               {stylists.map((stylist, index) => (
//                 <Grid item xs={12} md={6} key={stylist.stylist_ID}>
//                   <Paper
//                     elevation={0}
//                     sx={{
//                       p: 3,
//                       borderRadius: 2,
//                       backgroundColor: 'rgba(255, 255, 255, 0.7)',
//                       border: '1px solid rgba(190, 175, 155, 0.15)',
//                       transition: 'transform 0.2s ease, box-shadow 0.3s ease',
//                       '&:hover': {
//                         boxShadow: '0 8px 24px rgba(190, 175, 155, 0.25)',
//                         transform: 'translateY(-5px)'
//                       },
//                       display: 'flex',
//                       flexDirection: 'column',
//                       height: '100%'
//                     }}
//                   >
//                     <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'center', sm: 'flex-start' } }}>
//                       {/* Stylist Avatar/Image */}
//                       <Avatar
//                         sx={{ 
//                           width: { xs: 80, sm: 100 }, 
//                           height: { xs: 80, sm: 100 },
//                           bgcolor: '#BEAF9B',
//                           color: 'white',
//                           fontSize: '2rem',
//                           mb: { xs: 2, sm: 0 },
//                           mr: { xs: 0, sm: 3 },
//                           boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
//                         }}
//                       >
//                         <PersonIcon fontSize="large" />
//                       </Avatar>
                      
//                       {/* Stylist Info */}
//                       <Box sx={{ flex: 1 }}>
//                         <Typography 
//                           variant="h5" 
//                           sx={{ 
//                             fontWeight: 500,
//                             fontFamily: "'Poppins', 'Roboto', sans-serif",
//                             color: '#282520',
//                             textAlign: { xs: 'center', sm: 'left' },
//                             mb: 0.5
//                           }}
//                         >
//                           {stylist.firstname} {stylist.lastname}
//                         </Typography>
                        
//                         <Box sx={{ 
//                           display: 'flex', 
//                           alignItems: 'center',
//                           justifyContent: { xs: 'center', sm: 'flex-start' },
//                           mb: 1.5
//                         }}>
//                           <Rating 
//                             value={ratings[stylist.stylist_ID] || 0} 
//                             precision={0.5} 
//                             readOnly 
//                             sx={{ 
//                               color: '#BEAF9B',
//                               '& .MuiRating-iconFilled': {
//                                 color: '#BEAF9B',
//                               }
//                             }}
//                           />
//                           <Chip 
//                             label={ratings[stylist.stylist_ID] 
//                               ? `${parseFloat(ratings[stylist.stylist_ID]).toFixed(1)}` 
//                               : 'New'}
//                             size="small"
//                             sx={{ 
//                               ml: 1, 
//                               height: 22, 
//                               backgroundColor: '#BEAF9B', 
//                               color: 'white',
//                               fontWeight: 600,
//                               fontSize: '0.7rem'
//                             }}
//                           />
//                         </Box>
                        
//                         <Chip 
//                           label={stylist.specialization || "Hair Stylist"}
//                           size="small"
//                           sx={{ 
//                             mb: 2,
//                             backgroundColor: 'rgba(190, 175, 155, 0.1)', 
//                             color: '#8C7B6B',
//                             fontSize: '0.7rem',
//                             border: '1px solid rgba(190, 175, 155, 0.3)'
//                           }}
//                         />
                        
//                         <Typography 
//                           variant="body2" 
//                           sx={{ 
//                             color: '#3a3529',
//                             fontFamily: "'Poppins', 'Roboto', sans-serif",
//                             lineHeight: 1.6,
//                             mb: 2,
//                             textAlign: { xs: 'center', sm: 'left' }
//                           }}
//                         >
//                           {stylist.bio || `${stylist.firstname} is an experienced stylist passionate about creating looks that enhance natural beauty and make clients feel confident.`}
//                         </Typography>
//                       </Box>
//                     </Box>
                    
//                     <Divider sx={{ my: 2, borderColor: 'rgba(190, 175, 155, 0.2)' }} />
                    
//                     {/* Experience/Services */}
//                     <Box sx={{ mb: 2, flex: 1 }}>
//                       <Typography 
//                         variant="subtitle1" 
//                         sx={{ 
//                           fontWeight: 500,
//                           fontFamily: "'Poppins', 'Roboto', sans-serif",
//                           color: '#282520',
//                           mb: 1
//                         }}
//                       >
//                         Services & Expertise
//                       </Typography>
                      
//                       <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
//                         {['Haircut', 'Coloring', 'Styling', 'Treatments'].map((service) => (
//                           <Chip 
//                             key={service}
//                             label={service}
//                             size="small"
//                             sx={{ 
//                               backgroundColor: 'rgba(190, 175, 155, 0.05)', 
//                               color: '#8C7B6B',
//                               fontSize: '0.75rem',
//                               border: '1px solid rgba(190, 175, 155, 0.2)'
//                             }}
//                           />
//                         ))}
//                       </Box>
//                     </Box>
                    
//                     {/* Action Button */}
//                     <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
//                       <Button 
//                         variant="contained"
//                         component={RouterLink}
//                         to="/book"
//                         sx={{ 
//                           background: 'linear-gradient(135deg, #282520 0%, #3a352e 100%)',
//                           color: 'white',
//                           px: 3,
//                           textDecoration: 'none',
//                           '&:hover': {
//                             background: 'linear-gradient(135deg, #3a352e 0%, #4a453e 100%)',
//                             boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
//                           }
//                         }}
//                       >
//                         Book Appointment
//                       </Button>
                      
//                       <Button 
//                         variant="outlined" 
//                         onClick={() => handleOpenReviews(stylist)}
//                         sx={{
//                           borderColor: '#BEAF9B',
//                           color: '#8C7B6B',
//                           '&:hover': {
//                             borderColor: '#8C7B6B',
//                             backgroundColor: 'rgba(190, 175, 155, 0.05)',
//                           }
//                         }}
//                       >
//                         View Reviews
//                       </Button>
//                     </Box>
//                   </Paper>
//                 </Grid>
//               ))}
              
//               {stylists.length === 0 && !loading && (
//                 <Box 
//                   sx={{ 
//                     py: 6, 
//                     display: 'flex', 
//                     flexDirection: 'column', 
//                     alignItems: 'center',
//                     color: '#666',
//                     width: '100%'
//                   }}
//                 >
//                   <StarIcon sx={{ fontSize: 60, color: '#BEAF9B', opacity: 0.4, mb: 2 }} />
//                   <Typography variant="h6" sx={{ fontWeight: 500 }}>
//                     No Stylists Available
//                   </Typography>
//                   <Typography variant="body2" sx={{ mt: 1, textAlign: 'center', maxWidth: '80%' }}>
//                     We're currently updating our team. Please check back soon!
//                   </Typography>
//                 </Box>
//               )}
//             </Grid>
//           )}
//         </Container>
//       </Box>

//       {/* Reviews Modal */}
//       {selectedStylist && (
//         <StylistReviewsModal
//           open={reviewsOpen}
//           handleClose={handleCloseReviews}
//           reviews={loadingReviews ? [] : stylistReviews}
//           stylistName={selectedStylist ? `${selectedStylist.firstname} ${selectedStylist.lastname}` : ''}
//         />
//       )}

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
//           font-family: 'Poppins', 'Roboto', sans-serif;
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
import { 
  Box, 
  Typography, 
  Container, 
  CircularProgress, 
  Grid,
  Button
} from '@mui/material';
import stylistImage from '../assets/stylist.png';
import StylistCard from '../components/StylistCard';
import StylistReviewsModal from '../components/StylistReviewsModal';
import StarIcon from '@mui/icons-material/Star';

const Stylists = () => {
  const [stylists, setStylists] = useState([]);
  const [ratings, setRatings] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedStylist, setSelectedStylist] = useState(null);
  const [reviewsOpen, setReviewsOpen] = useState(false);
  const [stylistReviews, setStylistReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);

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

  const handleOpenReviews = (stylist) => {
    setSelectedStylist(stylist);
    setLoadingReviews(true);
    
    // Fetch reviews for the selected stylist
    axios.get(`http://localhost:5001/api/review/by-stylist/${stylist.stylist_ID}`)
      .then((res) => {
        setStylistReviews(res.data);
        setLoadingReviews(false);
        setReviewsOpen(true);
      })
      .catch((err) => {
        console.error('Failed to fetch stylist reviews:', err);
        setLoadingReviews(false);
        setReviewsOpen(true);
      });
  };

  const handleCloseReviews = () => {
    setReviewsOpen(false);
    setSelectedStylist(null);
    setStylistReviews([]);
  };

  return (
    <Box sx={{ 
      width: "100%", 
      maxWidth: "100%", 
      minHeight: "100vh",
      overflowX: "hidden",
      position: "relative",
      bgcolor: "#faf8f5",
      display: "flex",
      flexDirection: "column",
      scrollbarWidth: "none", /* Firefox */
      msOverflowStyle: "none",
      "&::-webkit-scrollbar": {
        display: "none", /* Chrome, Safari, Opera */
      },
    }}>
      {/* Header Banner */}
      <Box
        sx={{
          width: "100%",
          height: { xs: '200px', sm: '300px', md: '400px' },
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          component="img"
          src={stylistImage}
          alt="Stylists"
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block"
          }}
        />
      </Box>

      {/* Page Title */}
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
            Meet Our Talented Team
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
            Discover our experts who are passionate about bringing out your best look
          </Typography>
        </Container>
      </Box>

      {/* Main Content */}
      <Box sx={{
        flex: 1,
        py: 5,
        px: { xs: 2, md: 4 },
        width: "100%",
        overflowX: "hidden",
        mt: -2,
      }}>
        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
          {loading ? (
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              height: '300px',
              my: 4
            }}>
              <CircularProgress 
                size={60} 
                sx={{ 
                  color: '#BEAF9B',
                  mb: 2
                }}
              />
              <Typography 
                variant="body1" 
                sx={{ 
                  fontFamily: "'Poppins', 'Roboto', sans-serif",
                  color: '#3a3529'
                }}
              >
                Loading our amazing stylists...
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {stylists.map((stylist) => (
                <Grid item xs={12} md={6} key={stylist.stylist_ID}>
                  <StylistCard 
                    stylist={stylist}
                    rating={ratings[stylist.stylist_ID]}
                    onViewReviews={() => handleOpenReviews(stylist)}
                    loading={false}
                  />
                </Grid>
              ))}
              
              {stylists.length === 0 && !loading && (
                <Box 
                  sx={{ 
                    py: 6, 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    color: '#666',
                    width: '100%'
                  }}
                >
                  <StarIcon sx={{ fontSize: 60, color: '#BEAF9B', opacity: 0.4, mb: 2 }} />
                  <Typography variant="h6" sx={{ fontWeight: 500 }}>
                    No Stylists Available
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1, textAlign: 'center', maxWidth: '80%' }}>
                    We're currently updating our team. Please check back soon!
                  </Typography>
                </Box>
              )}
            </Grid>
          )}
        </Container>
      </Box>

      {/* Reviews Modal */}
      {selectedStylist && (
        <StylistReviewsModal
          open={reviewsOpen}
          handleClose={handleCloseReviews}
          reviews={loadingReviews ? [] : stylistReviews}
          stylistName={selectedStylist ? `${selectedStylist.firstname} ${selectedStylist.lastname}` : ''}
        />
      )}

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
        .MuiBox-root, .MuiContainer-root, .MuiDialog-paper {
            max-width: 100%;
        }
        .MuiDialog-container, .MuiDialog-root {
            overflow-x: hidden !important;
        }
      `}</style>
    </Box>
  );
};

export default Stylists;