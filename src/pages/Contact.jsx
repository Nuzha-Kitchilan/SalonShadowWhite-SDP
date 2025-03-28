// import React, { useEffect, useState } from "react";
// import { TextField, Button, Typography, Box, Grid, Container } from "@mui/material";
// import contactPic from "../assets/contact-bg.jpeg";
// import "leaflet/dist/leaflet.css";
// import { motion } from "framer-motion";

// const ContactPage = () => {
//   const accentColor = "#a36a4f"; // Brown accent color
//   const [isLoaded, setIsLoaded] = useState(false);

//   useEffect(() => {
//     setIsLoaded(true);
//   }, []);

//   // Animation for the underline (draws in a straight line)
//   const strokeVariants = {
//     hidden: { pathLength: 0 },
//     visible: {
//       pathLength: 1,
//       transition: { duration: 2, ease: "easeInOut" },
//     },
//   };

//   return (
//     <Box sx={{ width: "100%", height: "100vh", overflow: "hidden" }}>
//       {/* Centered Content Container with Background Image */}
//       <Box
//         sx={{
//           position: "relative",
//           width: "100%",
//           height: "100vh", // Full height of the viewport
//           "&::before": {
//             content: '""',
//             position: "absolute",
//             top: 0,
//             left: 0,
//             width: "100%",
//             height: "100%",
//             backgroundImage: `url(${contactPic})`,
//             backgroundSize: "cover",
//             backgroundPosition: "center",
//             opacity: 1,  // Increased opacity to 0.6 for better visibility
//             zIndex: 0,
//           },
//         }}
//       >
//         <Container maxWidth="md" sx={{ textAlign: "center", py: 5, position: "relative", zIndex: 1 }}>
//           <Typography variant="h6" sx={{ letterSpacing: 2, color: accentColor }}>
//             CONTACT
//           </Typography>

//           {/* Title with Hand-Drawn Straight Line Underline */}
//           <Box sx={{ position: "relative", height: "60px", mb: 0 }}>
//             <Typography
//               variant="h3"
//               sx={{
//                 fontWeight: "bold",
//                 position: "absolute",
//                 width: "100%",
//                 textAlign: "center",
//                 zIndex: 1,
//               }}
//             >
//               Get In Touch
//             </Typography>

//             {/* Animated straight underline effect - repositioned directly under the text */}
//             <motion.svg
//               width="100%"
//               height="10px"
//               viewBox="0 0 500 10"
//               initial="hidden"
//               animate={isLoaded ? "visible" : "hidden"}
//               style={{
//                 position: "absolute",
//                 bottom: "0px", // Moved directly below the text
//                 left: "50%",
//                 transform: "translateX(-50%)",
//                 zIndex: 0,
//               }}
//             >
//               {/* Single Line */}
//               <motion.line
//                 x1="50"
//                 y1="5"
//                 x2="450"
//                 y2="5"
//                 stroke={accentColor}
//                 strokeWidth="5"
//                 strokeLinecap="round"
//                 variants={strokeVariants}
//               />
//             </motion.svg>
//           </Box>

//           {/* Added more margin-top to create space between heading and subtitle */}
//           <Typography
//             variant="subtitle1"
//             sx={{
//               mt: 3, // Increased from -1 to 3 to move it down
//               mb: 2,
//               color: "#666",
//               pt: 0,
//             }}
//           >
//             We'd love to hear from you
//           </Typography>

//           <Grid container spacing={3} sx={{ mt: 1 }}>
//             <Grid item xs={12} md={6}>
//               <TextField label="Name" fullWidth variant="standard" margin="normal" />
//               <TextField label="Email Address" fullWidth variant="standard" margin="normal" />
//               <TextField label="Message" fullWidth variant="standard" margin="normal" multiline rows={4} />

//               {/* Submit Button properly left-aligned */}
//               <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
//                 <Button
//                   variant="contained"
//                   sx={{
//                     mt: 2,
//                     backgroundColor: accentColor,
//                     "&:hover": { backgroundColor: "#8b5743" },
//                   }}
//                 >
//                   Submit
//                 </Button>
//               </Box>
//             </Grid>

//             <Grid item xs={12} md={6} textAlign="left">
//               <Typography variant="h6" sx={{ color: accentColor, fontWeight: "bold" }}>
//                 Phone
//               </Typography>
//               <Typography variant="body1" sx={{ mb: 2 }}>
//                 (255) 352-6258
//               </Typography>

//               <Typography variant="h6" sx={{ color: accentColor, fontWeight: "bold" }}>
//                 Address
//               </Typography>
//               <Typography variant="body1">1534 Dec St #9000, San Francisco, CA 94502</Typography>
//             </Grid>
//           </Grid>
//         </Container>
//       </Box>

//       {/* Full Width Map Section - Replacing the Leaflet Map with Google Maps iframe */}
//       <Box sx={{ position: "relative", height: "100vh", width: "100%", left: 0, right: 0 }}>
//         <iframe
//           src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.1313733323905!2d79.91970597475772!3d6.993804593007297!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae2f9833171c479%3A0x5684bf10940ceb6e!2sSalon%20Shadow%20White!5e0!3m2!1sen!2slk!4v1741943959196!5m2!1sen!2slk"
//           width="100%"
//           height="100%"
//           style={{ border: 0 }}
//           allowFullScreen=""
//           loading="lazy"
//           referrerPolicy="no-referrer-when-downgrade"
//         ></iframe>
//       </Box>
//     </Box>
//   );
// };

// export default ContactPage;


import React, { useEffect, useState } from "react";
import { TextField, Button, Typography, Box, Grid, Container } from "@mui/material";
import contactPic from "../assets/contact-bg.jpeg";
import "leaflet/dist/leaflet.css";
import { motion } from "framer-motion";

const ContactPage = () => {
  const accentColor = "#a36a4f"; // Brown accent color
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    
    // Add this to remove default margins from the body
    document.body.style.margin = "0";
    document.body.style.padding = "0";
    document.documentElement.style.margin = "0";
    document.documentElement.style.padding = "0";
    
    // Clean up function to restore default styles when component unmounts
    return () => {
      document.body.style.margin = "";
      document.body.style.padding = "";
      document.documentElement.style.margin = "";
      document.documentElement.style.padding = "";
    };
  }, []);

  // Animation for the underline (draws in a straight line)
  const strokeVariants = {
    hidden: { pathLength: 0 },
    visible: {
      pathLength: 1,
      transition: { duration: 2, ease: "easeInOut" },
    },
  };

  return (
    <Box sx={{ width: "100vw", height: "175vh", overflowX: "hidden" }}>
      {/* Centered Content Container with Background Image */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: "100vh", // Full height of the viewport
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundImage: `url(${contactPic})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 1,  // Increased opacity to 0.6 for better visibility
            zIndex: 0,
          },
        }}
      >
        <Container maxWidth="md" sx={{ textAlign: "center", py: 5, position: "relative", zIndex: 1 }}>
          <Typography variant="h6" sx={{ letterSpacing: 2, color: accentColor }}>
            CONTACT
          </Typography>

          {/* Title with Hand-Drawn Straight Line Underline */}
          <Box sx={{ position: "relative", height: "60px", mb: 0 }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: "bold",
                position: "absolute",
                width: "100%",
                textAlign: "center",
                zIndex: 1,
              }}
            >
              Get In Touch
            </Typography>

            {/* Animated straight underline effect - repositioned directly under the text */}
            <motion.svg
              width="100%"
              height="10px"
              viewBox="0 0 500 10"
              initial="hidden"
              animate={isLoaded ? "visible" : "hidden"}
              style={{
                position: "absolute",
                bottom: "0px", // Moved directly below the text
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 0,
              }}
            >
              {/* Single Line */}
              <motion.line
                x1="50"
                y1="5"
                x2="450"
                y2="5"
                stroke={accentColor}
                strokeWidth="5"
                strokeLinecap="round"
                variants={strokeVariants}
              />
            </motion.svg>
          </Box>

          
          <Typography
            variant="subtitle1"
            sx={{
              mt: 3, // Increased from -1 to 3 to move it down
              mb: 2,
              color: "#666",
              pt: 0,
            }}
          >
            We'd love to hear from you
          </Typography>

          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField label="Name" fullWidth variant="standard" margin="normal" />
              <TextField label="Email Address" fullWidth variant="standard" margin="normal" />
              <TextField label="Message" fullWidth variant="standard" margin="normal" multiline rows={4} />

              {/* Submit Button properly left-aligned */}
              <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
                <Button
                  variant="contained"
                  sx={{
                    mt: 2,
                    backgroundColor: accentColor,
                    "&:hover": { backgroundColor: "#8b5743" },
                  }}
                >
                  Submit
                </Button>
              </Box>
            </Grid>

            <Grid item xs={12} md={6} textAlign="left">
              <Typography variant="h6" sx={{ color: accentColor, fontWeight: "bold" }}>
                Phone
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                0768102223
              </Typography>

              <Typography variant="h6" sx={{ color: accentColor, fontWeight: "bold" }}>
                Address
              </Typography>
              <Typography variant="body1">218 Ranimadama, Wattala</Typography>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Full Width Map Section with reduced height */}
      <Box sx={{ position: "relative", height: "75vh", width: "100vw", left: 0, right: 0 }}>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.1313733323905!2d79.91970597475772!
          3d6.993804593007297!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae2f9833171c479%3A0x5684bf10940ceb6e!
          2sSalon%20Shadow%20White!5e0!3m2!1sen!2slk!4v1741943959196!5m2!1sen!2slk"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </Box>
    </Box>
  );
};

export default ContactPage;