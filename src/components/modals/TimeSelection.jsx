// import React, {
//   useEffect,
//   useState,
//   forwardRef,
//   useImperativeHandle,
// } from "react";
// import {
//   Box,
//   Typography,
//   IconButton,
//   Button,
//   CircularProgress,
//   TextField,
//   Grid,
//   Paper,
//   Chip,
// } from "@mui/material";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
// import AccessTimeIcon from "@mui/icons-material/AccessTime";
// import CartModal from "./CartModal";
// import axios from "axios";

// const TimeSelectionModal = forwardRef(
//   ({ service, customerId, selectedStylist, onBack, onClose }, ref) => {
//     const [selectedDate, setSelectedDate] = useState("");
//     const [selectedTime, setSelectedTime] = useState("");
//     const [showCart, setShowCart] = useState(false);
//     const [timeSlots, setTimeSlots] = useState([]);
//     const [loading, setLoading] = useState(false);

//     const getTodayDateString = () => {
//       const today = new Date();
//       const year = today.getFullYear();
//       const month = String(today.getMonth() + 1).padStart(2, '0');
//       const day = String(today.getDate()).padStart(2, '0');
//       return `${year}-${month}-${day}`;
//     };

//     const formatTimeToHHMM = (timeString) => {
//       if (/^\d{2}:\d{2}$/.test(timeString)) {
//         return timeString;
//       }
      
//       const time = new Date(`2000-01-01 ${timeString}`);
//       if (isNaN(time.getTime())) {
//         console.error("Invalid time format:", timeString);
//         return "00:00";
//       }
//       return time.toTimeString().substring(0, 5);
//     };

//     const formatTimeForDisplay = (timeString) => {
//       try {
//         const [hours, minutes] = timeString.split(':');
//         const hour = parseInt(hours, 10);
//         const ampm = hour >= 12 ? 'PM' : 'AM';
//         const displayHour = hour % 12 || 12;
//         return `${displayHour}:${minutes} ${ampm}`;
//       } catch (err) {
//         console.error("Error formatting time:", err);
//         return timeString;
//       }
//     };

//     useImperativeHandle(ref, () => ({
//       reset: () => {
//         setSelectedDate("");
//         setSelectedTime("");
//         setShowCart(false);
//         setTimeSlots([]);
//       },
//     }));

//     useEffect(() => {
//       const fetchTimeSlots = async () => {
//         if (!selectedDate) return;

//         setLoading(true);
//         try {
//           const response = await axios.post(
//             "http://localhost:5001/api/booking/available-timeslots",
//             {
//               date: selectedDate,
//               stylistId: selectedStylist?.stylist_ID || null,
//               serviceDuration: service.time_duration,
//             }
//           );

//           const formattedSlots = response.data.availableSlots?.map(slot => 
//             formatTimeToHHMM(slot)
//           );
//           setTimeSlots(formattedSlots || []);
//         } catch (err) {
//           console.error("Error fetching time slots:", err);
//           setTimeSlots([]);
//         } finally {
//           setLoading(false);
//         }
//       };

//       fetchTimeSlots();
//     }, [selectedDate, service.time_duration, selectedStylist]);

//     const handleContinue = async () => {
//       if (!selectedTime || !selectedDate) {
//         console.error("Please select both date and time.");
//         return;
//       }
    
//       const formattedTime = selectedTime.split(':').slice(0, 2).join(':');
//       const formattedDate = selectedDate;
    
//       const cartData = {
//         customer_id: customerId,
//         service_id: service.service_id,
//         stylist_id: selectedStylist?.stylist_ID || null,
//         selected_date: formattedDate,
//         selected_time: formattedTime,
//         price: service.price,
//       };
    
//       try {
//         const response = await axios.post(
//           "http://localhost:5001/api/cart/add",
//           cartData
//         );
//         console.log("Item added to cart:", response.data);
//         setShowCart(true);
//       } catch (error) {
//         console.error("Error adding to cart:", error);
//         if (error.response) {
//           console.error("Server response:", error.response.data);
//         }
//       }
//     };

//     if (showCart) {
//       return (
//         <CartModal
//           service={service}
//           customerId={customerId}
//           selectedStylist={selectedStylist}
//           selectedTime={selectedTime}
//           selectedDate={selectedDate}
//           onBack={() => setShowCart(false)}
//           onClose={onClose}
//         />
//       );
//     }

//     return (
//       <Box sx={{ 
//         width: "100%", 
//         height: "100%", 
//         display: "flex", 
//         flexDirection: "column",
//         bgcolor: "#f9f5f0",
//       }}>
//         {/* Header */}
//         <Box sx={{ 
//           display: "flex", 
//           justifyContent: "space-between", 
//           alignItems: "center", 
//           p: 2,
//           borderBottom: "1px solid #e0e0e0",
//           background: "linear-gradient(to right, #f9f5f0, #ffffff)",
//           boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
//         }}>
//           <Box sx={{ 
//             display: "flex", 
//             alignItems: "center",
//             gap: 1
//           }}>
//             <IconButton
//               sx={{
//                 color: "#BEAF9B",
//                 "&:hover": {
//                   backgroundColor: "rgba(190, 175, 155, 0.1)",
//                   transform: "scale(1.05)",
//                   transition: "all 0.2s",
//                 },
//               }}
//               onClick={onBack}
//             >
//               <ArrowBackIcon />
//             </IconButton>
//             <Typography 
//               variant="h6" 
//               sx={{ 
//                 fontWeight: 500,
//                 color: "#453C33",
//                 letterSpacing: "0.3px",
//                 fontFamily: "'Poppins', 'Roboto', sans-serif"
//               }}
//             >
//               SELECT DATE & TIME
//             </Typography>
//           </Box>
//         </Box>

//         {/* Message */}
//         <Box 
//           sx={{ 
//             p: 2, 
//             backgroundColor: "rgba(190, 175, 155, 0.1)",
//             borderBottom: "1px dashed rgba(190, 175, 155, 0.3)",
//           }}
//         >
//           <Typography 
//             variant="body2" 
//             sx={{ 
//               color: "#666", 
//               fontStyle: "italic",
//               textAlign: "center",
//               fontFamily: "'Poppins', 'Roboto', sans-serif"
//             }}
//           >
//             Please select your preferred date and time for this appointment
//           </Typography>
//         </Box>

//         {/* Date Picker */}
//         <Box 
//           sx={{ 
//             p: 3,
//             borderBottom: "1px dashed rgba(190, 175, 155, 0.3)",
//           }}
//         >
//           <Box sx={{ 
//             display: "flex", 
//             alignItems: "center", 
//             mb: 2 
//           }}>
//             <CalendarMonthIcon sx={{ color: "#BEAF9B", mr: 1 }} />
//             <Typography 
//               variant="subtitle1" 
//               sx={{ 
//                 color: "#453C33",
//                 fontWeight: 500,
//                 fontFamily: "'Poppins', 'Roboto', sans-serif"
//               }}
//             >
//               SELECT DATE
//             </Typography>
//           </Box>
//           <TextField
//             type="date"
//             value={selectedDate}
//             onChange={(e) => setSelectedDate(e.target.value)}
//             fullWidth
//             InputLabelProps={{
//               shrink: true,
//             }}
//             inputProps={{
//               min: getTodayDateString(),
//               style: { 
//                 padding: "12px",
//                 borderColor: "#BEAF9B"
//               }
//             }}
//             sx={{
//               "& .MuiOutlinedInput-root": {
//                 "& fieldset": {
//                   borderColor: "rgba(190, 175, 155, 0.3)",
//                 },
//                 "&:hover fieldset": {
//                   borderColor: "rgba(190, 175, 155, 0.5)",
//                 },
//                 "&.Mui-focused fieldset": {
//                   borderColor: "#BEAF9B",
//                 },
//               },
//               "& .MuiInputBase-input.Mui-disabled": {
//                 backgroundColor: "rgba(190, 175, 155, 0.1)",
//               },
//               "& input[type=date]::-webkit-calendar-picker-indicator": {
//                 filter: "invert(0.5) sepia(1) saturate(5) hue-rotate(300deg)",
//               }
//             }}
//           />
//         </Box>

//         {/* Time slot list */}
//         <Box 
//           sx={{ 
//             overflowY: "auto", 
//             flexGrow: 1, 
//             p: 3,
//             "&::-webkit-scrollbar": { display: "none" },
//             scrollbarWidth: "none",
//             msOverflowStyle: "none"
//           }}
//         >
//           <Box sx={{ 
//             display: "flex", 
//             alignItems: "center", 
//             mb: 2 
//           }}>
//             <AccessTimeIcon sx={{ color: "#BEAF9B", mr: 1 }} />
//             <Typography 
//               variant="subtitle1" 
//               sx={{ 
//                 color: "#453C33",
//                 fontWeight: 500,
//                 fontFamily: "'Poppins', 'Roboto', sans-serif"
//               }}
//             >
//               SELECT TIME
//             </Typography>
//           </Box>
          
//           {loading ? (
//             <Box display="flex" justifyContent="center" mt={3}>
//               <CircularProgress sx={{ color: "#BEAF9B" }} />
//             </Box>
//           ) : timeSlots.length === 0 ? (
//             <Box 
//               sx={{ 
//                 mt: 3, 
//                 textAlign: "center",
//                 p: 3,
//                 bgcolor: "rgba(190, 175, 155, 0.05)",
//                 borderRadius: "8px",
//                 border: "1px dashed rgba(190, 175, 155, 0.3)"
//               }}
//             >
//               <Typography 
//                 variant="body1" 
//                 sx={{ 
//                   color: "#666",
//                   fontFamily: "'Poppins', 'Roboto', sans-serif" 
//                 }}
//               >
//                 No available time slots for this date.
//                 {!selectedDate && " Please select a date first."}
//               </Typography>
//             </Box>
//           ) : (
//             <Grid container spacing={2}>
//               {timeSlots.map((time, index) => (
//                 <Grid item xs={4} key={index} sx={{ minWidth: '110px' }}>
//                   <Paper
//                     elevation={0}
//                     onClick={() => setSelectedTime(time)}
//                     sx={{
//                       p: 2,
//                       textAlign: "center",
//                       cursor: "pointer",
//                       borderRadius: "8px",
//                       height: '100%',
//                       display: 'flex',
//                       alignItems: 'center',
//                       justifyContent: 'center',
//                       border: selectedTime === time ? 
//                         "2px solid #BEAF9B" : 
//                         "1px solid rgba(190, 175, 155, 0.3)",
//                       bgcolor: selectedTime === time ? 
//                         "rgba(190, 175, 155, 0.1)" : 
//                         "#fff",
//                       transition: "all 0.2s ease",
//                       "&:hover": {
//                         bgcolor: "rgba(190, 175, 155, 0.1)",
//                         transform: "translateY(-2px)",
//                         boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
//                       },
//                     }}
//                   >
//                     <Typography 
//                       variant="body1" 
//                       sx={{ 
//                         fontWeight: selectedTime === time ? 600 : 400,
//                         color: "#453C33",
//                         fontFamily: "'Poppins', 'Roboto', sans-serif"
//                       }}
//                     >
//                       {formatTimeForDisplay(time)}
//                     </Typography>
//                   </Paper>
//                 </Grid>
//               ))}
//             </Grid>
//           )}
//         </Box>

//         {/* Selected options summary */}
//         {(selectedDate || selectedTime) && (
//           <Box 
//             sx={{ 
//               p: 2, 
//               bgcolor: "rgba(190, 175, 155, 0.05)",
//               borderTop: "1px dashed rgba(190, 175, 155, 0.3)",
//               display: "flex",
//               flexWrap: "wrap",
//               gap: 1
//             }}
//           >
//             {selectedDate && (
//               <Chip 
//                 label={`Date: ${new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}`} 
//                 sx={{ 
//                   bgcolor: "#BEAF9B", 
//                   color: "white",
//                   fontFamily: "'Poppins', 'Roboto', sans-serif" 
//                 }} 
//               />
//             )}
//             {selectedTime && (
//               <Chip 
//                 label={`Time: ${formatTimeForDisplay(selectedTime)}`} 
//                 sx={{ 
//                   bgcolor: "#BEAF9B", 
//                   color: "white",
//                   fontFamily: "'Poppins', 'Roboto', sans-serif" 
//                 }} 
//               />
//             )}
//           </Box>
//         )}

//         {/* Footer */}
//         <Box
//           sx={{
//             p: 2, 
//             bgcolor: "#fff",
//             borderTop: "1px solid rgba(0, 0, 0, 0.08)",
//             display: "flex",
//             justifyContent: "center",
//             boxShadow: "0 -2px 8px rgba(0,0,0,0.03)"
//           }}
//         >
//           <Button
//             variant="contained"
//             disabled={!selectedTime || !selectedDate}
//             sx={{
//               background: "linear-gradient(to right, #BEAF9B, #D9CFC2)",
//               color: '#fff',
//               py: 1.5,
//               px: 4,
//               borderRadius: "8px",
//               width: "100%",
//               maxWidth: "500px",
//               fontWeight: 500,
//               letterSpacing: "0.5px",
//               fontFamily: "'Poppins', 'Roboto', sans-serif",
//               textTransform: "none",
//               fontSize: "1rem",
//               boxShadow: "0 4px 8px rgba(190, 175, 155, 0.3)",
//               transition: "all 0.3s ease",
//               '&:hover': { 
//                 background: "linear-gradient(to right, #b0a08d, #cec2b3)",
//                 boxShadow: "0 6px 12px rgba(190, 175, 155, 0.4)",
//                 transform: "translateY(-2px)"
//               },
//               '&.Mui-disabled': {
//                 background: "#e0e0e0",
//                 color: "#a0a0a0"
//               }
//             }}
//             onClick={handleContinue}
//           >
//             Continue
//           </Button>
//         </Box>
//       </Box>
//     );
//   }
// );

// export default TimeSelectionModal;


















import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  Box,
  Typography,
  IconButton,
  Button,
  CircularProgress,
  TextField,
  Grid,
  Paper,
  Chip,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CartModal from "./CartModal";
import axios from "axios";

const TimeSelectionModal = forwardRef(
  ({ service, customerId, selectedStylist, onBack, onClose }, ref) => {
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedTime, setSelectedTime] = useState("");
    const [showCart, setShowCart] = useState(false);
    const [timeSlots, setTimeSlots] = useState([]);
    const [loading, setLoading] = useState(false);

    const getTodayDateString = () => {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const formatTimeToHHMM = (timeString) => {
      if (/^\d{2}:\d{2}$/.test(timeString)) {
        return timeString;
      }
      
      const time = new Date(`2000-01-01 ${timeString}`);
      if (isNaN(time.getTime())) {
        console.error("Invalid time format:", timeString);
        return "00:00";
      }
      return time.toTimeString().substring(0, 5);
    };

    const formatTimeForDisplay = (timeString) => {
      try {
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours, 10);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
      } catch (err) {
        console.error("Error formatting time:", err);
        return timeString;
      }
    };

    useImperativeHandle(ref, () => ({
      reset: () => {
        setSelectedDate("");
        setSelectedTime("");
        setShowCart(false);
        setTimeSlots([]);
      },
    }));

    useEffect(() => {
      const fetchTimeSlots = async () => {
        if (!selectedDate) return;

        setLoading(true);
        try {
          const response = await axios.post(
            "http://localhost:5001/api/booking/available-timeslots",
            {
              date: selectedDate,
              stylistId: selectedStylist?.stylist_ID || null,
              serviceDuration: service.time_duration,
            }
          );

          const formattedSlots = response.data.availableSlots?.map(slot => 
            formatTimeToHHMM(slot)
          );
          setTimeSlots(formattedSlots || []);
        } catch (err) {
          console.error("Error fetching time slots:", err);
          setTimeSlots([]);
        } finally {
          setLoading(false);
        }
      };

      fetchTimeSlots();
    }, [selectedDate, service.time_duration, selectedStylist]);

    const handleContinue = async () => {
      if (!selectedTime || !selectedDate) {
        console.error("Please select both date and time.");
        return;
      }
    
      const formattedTime = selectedTime.split(':').slice(0, 2).join(':');
      const formattedDate = selectedDate;
    
      const cartData = {
        customer_id: customerId,
        service_id: service.service_id,
        stylist_id: selectedStylist?.stylist_ID || null,
        selected_date: formattedDate,
        selected_time: formattedTime,
        price: service.price,
      };
    
      try {
        const response = await axios.post(
          "http://localhost:5001/api/cart/add",
          cartData
        );
        console.log("Item added to cart:", response.data);
        setShowCart(true);
      } catch (error) {
        console.error("Error adding to cart:", error);
        if (error.response) {
          console.error("Server response:", error.response.data);
        }
      }
    };

    if (showCart) {
      return (
        <CartModal
          service={service}
          customerId={customerId}
          selectedStylist={selectedStylist}
          selectedTime={selectedTime}
          selectedDate={selectedDate}
          onBack={() => setShowCart(false)}
          onClose={onClose}
        />
      );
    }

    return (
      <Box sx={{ 
        width: "100%", 
        height: "100vh",
        display: "flex", 
        flexDirection: "column",
        bgcolor: "#f9f5f0",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Header */}
        <Box sx={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center", 
          p: 2,
          borderBottom: "1px solid #e0e0e0",
          background: "linear-gradient(to right, #f9f5f0, #ffffff)",
          boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
          flexShrink: 0,
        }}>
          <Box sx={{ 
            display: "flex", 
            alignItems: "center",
            gap: 1
          }}>
            <IconButton
              sx={{
                color: "#BEAF9B",
                "&:hover": {
                  backgroundColor: "rgba(190, 175, 155, 0.1)",
                  transform: "scale(1.05)",
                  transition: "all 0.2s",
                },
              }}
              onClick={onBack}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 500,
                color: "#453C33",
                letterSpacing: "0.3px",
                fontFamily: "'Poppins', 'Roboto', sans-serif"
              }}
            >
              SELECT DATE & TIME
            </Typography>
          </Box>
        </Box>

        {/* Message */}
        <Box 
          sx={{ 
            p: 2, 
            backgroundColor: "rgba(190, 175, 155, 0.1)",
            borderBottom: "1px dashed rgba(190, 175, 155, 0.3)",
            flexShrink: 0,
          }}
        >
          <Typography 
            variant="body2" 
            sx={{ 
              color: "#666", 
              fontStyle: "italic",
              textAlign: "center",
              fontFamily: "'Poppins', 'Roboto', sans-serif"
            }}
          >
            Please select your preferred date and time for this appointment
          </Typography>
        </Box>

        {/* Date Picker */}
        <Box 
          sx={{ 
            p: 3,
            borderBottom: "1px dashed rgba(190, 175, 155, 0.3)",
            flexShrink: 0,
          }}
        >
          <Box sx={{ 
            display: "flex", 
            alignItems: "center", 
            mb: 2 
          }}>
            <CalendarMonthIcon sx={{ color: "#BEAF9B", mr: 1 }} />
            <Typography 
              variant="subtitle1" 
              sx={{ 
                color: "#453C33",
                fontWeight: 500,
                fontFamily: "'Poppins', 'Roboto', sans-serif"
              }}
            >
              SELECT DATE
            </Typography>
          </Box>
          <TextField
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              min: getTodayDateString(),
              style: { 
                padding: "12px",
                borderColor: "#BEAF9B"
              }
            }}
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "rgba(190, 175, 155, 0.3)",
                },
                "&:hover fieldset": {
                  borderColor: "rgba(190, 175, 155, 0.5)",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#BEAF9B",
                },
              },
              "& .MuiInputBase-input.Mui-disabled": {
                backgroundColor: "rgba(190, 175, 155, 0.1)",
              },
              "& input[type=date]::-webkit-calendar-picker-indicator": {
                filter: "invert(0.5) sepia(1) saturate(5) hue-rotate(300deg)",
              }
            }}
          />
        </Box>

        {/* Time slot list */}
        <Box 
          sx={{ 
            flexGrow: 1,
            overflowY: "auto",
            px: 3,
            pb: 10, // Extra padding to account for sticky summary and button
          }}
        >
          <Box sx={{ 
            display: "flex", 
            alignItems: "center", 
            mb: 2,
            pt: 2,
          }}>
            <AccessTimeIcon sx={{ color: "#BEAF9B", mr: 1 }} />
            <Typography 
              variant="subtitle1" 
              sx={{ 
                color: "#453C33",
                fontWeight: 500,
                fontFamily: "'Poppins', 'Roboto', sans-serif"
              }}
            >
              SELECT TIME
            </Typography>
          </Box>
          
          {loading ? (
            <Box display="flex" justifyContent="center" mt={3}>
              <CircularProgress sx={{ color: "#BEAF9B" }} />
            </Box>
          ) : timeSlots.length === 0 ? (
            <Box 
              sx={{ 
                mt: 3, 
                textAlign: "center",
                p: 3,
                bgcolor: "rgba(190, 175, 155, 0.05)",
                borderRadius: "8px",
                border: "1px dashed rgba(190, 175, 155, 0.3)"
              }}
            >
              <Typography 
                variant="body1" 
                sx={{ 
                  color: "#666",
                  fontFamily: "'Poppins', 'Roboto', sans-serif" 
                }}
              >
                No available time slots for this date.
                {!selectedDate && " Please select a date first."}
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={2} sx={{ pb: 2 }}>
              {timeSlots.map((time, index) => (
                <Grid item xs={4} key={index} sx={{ minWidth: '110px' }}>
                  <Paper
                    elevation={0}
                    onClick={() => setSelectedTime(time)}
                    sx={{
                      p: 2,
                      textAlign: "center",
                      cursor: "pointer",
                      borderRadius: "8px",
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: selectedTime === time ? 
                        "2px solid #BEAF9B" : 
                        "1px solid rgba(190, 175, 155, 0.3)",
                      bgcolor: selectedTime === time ? 
                        "rgba(190, 175, 155, 0.1)" : 
                        "#fff",
                      transition: "all 0.2s ease",
                      "&:hover": {
                        bgcolor: "rgba(190, 175, 155, 0.1)",
                        transform: "translateY(-2px)",
                        boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
                      },
                    }}
                  >
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        fontWeight: selectedTime === time ? 600 : 400,
                        color: "#453C33",
                        fontFamily: "'Poppins', 'Roboto', sans-serif"
                      }}
                    >
                      {formatTimeForDisplay(time)}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>

        {/* Sticky Selected options summary */}
        {(selectedDate || selectedTime) && (
          <Box 
            sx={{ 
              p: 2, 
              bgcolor: "rgba(190, 175, 155, 0.05)",
              borderTop: "1px dashed rgba(190, 175, 155, 0.3)",
              borderBottom: "1px dashed rgba(190, 175, 155, 0.3)",
              display: "flex",
              flexWrap: "wrap",
              gap: 1,
              position: "sticky",
              bottom: 64, // Position above the button
              left: 0,
              right: 0,
              zIndex: 2,
              backdropFilter: "blur(5px)",
            }}
          >
            {selectedDate && (
              <Chip 
                label={`Date: ${new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}`} 
                sx={{ 
                  bgcolor: "#BEAF9B", 
                  color: "white",
                  fontFamily: "'Poppins', 'Roboto', sans-serif" 
                }} 
              />
            )}
            {selectedTime && (
              <Chip 
                label={`Time: ${formatTimeForDisplay(selectedTime)}`} 
                sx={{ 
                  bgcolor: "#BEAF9B", 
                  color: "white",
                  fontFamily: "'Poppins', 'Roboto', sans-serif" 
                }} 
              />
            )}
          </Box>
        )}

        {/* Sticky Footer Button */}
        <Box
          sx={{
            p: 2, 
            bgcolor: "#fff",
            borderTop: "1px solid rgba(0, 0, 0, 0.08)",
            position: "sticky",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 10,
            boxShadow: "0 -2px 8px rgba(0,0,0,0.08)"
          }}
        >
          <Button
            variant="contained"
            disabled={!selectedTime || !selectedDate}
            sx={{
              background: "linear-gradient(to right, #BEAF9B, #D9CFC2)",
              color: '#fff',
              py: 1.5,
              px: 4,
              borderRadius: "8px",
              width: "100%",
              maxWidth: "500px",
              fontWeight: 500,
              letterSpacing: "0.5px",
              fontFamily: "'Poppins', 'Roboto', sans-serif",
              textTransform: "none",
              fontSize: "1rem",
              boxShadow: "0 4px 8px rgba(190, 175, 155, 0.3)",
              transition: "all 0.3s ease",
              '&:hover': { 
                background: "linear-gradient(to right, #b0a08d, #cec2b3)",
                boxShadow: "0 6px 12px rgba(190, 175, 155, 0.4)",
                transform: "translateY(-2px)"
              },
              '&.Mui-disabled': {
                background: "#e0e0e0",
                color: "#a0a0a0"
              }
            }}
            onClick={handleContinue}
          >
            Continue
          </Button>
        </Box>
      </Box>
    );
  }
);

export default TimeSelectionModal;