// import React, {
//   useEffect,
//   useState,
//   forwardRef,
//   useImperativeHandle,
// } from "react";
// import {
//   Box,
//   Typography,
//   Divider,
//   IconButton,
//   Button,
//   List,
//   ListItem,
//   ListItemButton,
//   CircularProgress,
//   TextField,
// } from "@mui/material";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import CloseIcon from "@mui/icons-material/Close";
// import CartModal from "./CartModal";
// import axios from "axios";

// const TimeSelectionModal = forwardRef(
//   ({ service, customerId, selectedStylist, onBack, onClose }, ref) => {
//     const [selectedDate, setSelectedDate] = useState("");
//     const [selectedTime, setSelectedTime] = useState("");
//     const [showCart, setShowCart] = useState(false);
//     const [timeSlots, setTimeSlots] = useState([]);
//     const [loading, setLoading] = useState(false);

//     // Optional: Expose some internal methods via ref
//     useImperativeHandle(ref, () => ({
//       reset: () => {
//         setSelectedDate("");
//         setSelectedTime("");
//         setShowCart(false);
//         setTimeSlots([]);
//       },
//     }));

//     // Fetch available time slots based on date and stylist selection
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

//           setTimeSlots(response.data.availableSlots);
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

//       const cartData = {
//         customer_id: customerId,
//         service_id: service.service_id,
//         stylist_id: selectedStylist?.stylist_ID || null,
//         selected_date: selectedDate,
//         selected_time: selectedTime,
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
//       <Box
//         sx={{
//           width: "100%",
//           height: "100%",
//           display: "flex",
//           flexDirection: "column",
//         }}
//       >
//         {/* Header */}
//         <Box
//           sx={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             p: 2,
//           }}
//         >
//           <Box sx={{ display: "flex", alignItems: "center" }}>
//             <IconButton onClick={onBack} sx={{ mr: 1 }}>
//               <ArrowBackIcon />
//             </IconButton>
//             <Typography variant="h6">SELECT DATE AND TIME SLOT</Typography>
//           </Box>
//           <IconButton onClick={onClose}>
//             <CloseIcon />
//           </IconButton>
//         </Box>
//         <Divider />

//         {/* Date Picker */}
//         <Box sx={{ p: 2 }}>
//           <TextField
//             label="Select Date"
//             type="date"
//             value={selectedDate}
//             onChange={(e) => setSelectedDate(e.target.value)}
//             fullWidth
//             InputLabelProps={{
//               shrink: true,
//             }}
//           />
//         </Box>

//         {/* Time slot list */}
//         <Box sx={{ overflowY: "auto", flexGrow: 1, px: 2 }}>
//           {loading ? (
//             <Box display="flex" justifyContent="center" mt={3}>
//               <CircularProgress />
//             </Box>
//           ) : timeSlots.length === 0 ? (
//             <Typography variant="body1" mt={3} textAlign="center">
//               No available time slots for this date.
//             </Typography>
//           ) : (
//             <List>
//               {timeSlots.map((time, index) => (
//                 <ListItem key={index} disablePadding>
//                   <ListItemButton
//                     onClick={() => setSelectedTime(time)}
//                     selected={selectedTime === time}
//                   >
//                     <Typography>{time}</Typography>
//                   </ListItemButton>
//                 </ListItem>
//               ))}
//             </List>
//           )}
//         </Box>

//         {/* Footer */}
//         <Box
//           sx={{
//             p: 2,
//             bgcolor: "#fff",
//             borderTop: "1px solid rgba(0,0,0,0.12)",
//           }}
//         >
//           <Button
//             variant="contained"
//             fullWidth
//             disabled={!selectedTime || !selectedDate}
//             sx={{
//               bgcolor: "#333",
//               "&:hover": { bgcolor: "#444" },
//               color: "#fff",
//               py: 1.5,
//               borderRadius: 1,
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









// TimeSelectionModal.js - Modified Version

import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  Box,
  Typography,
  Divider,
  IconButton,
  Button,
  List,
  ListItem,
  ListItemButton,
  CircularProgress,
  TextField,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
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

    // Format time to HH:MM (24-hour format)
    const formatTimeToHHMM = (timeString) => {
      // If already in HH:MM format, return as-is
      if (/^\d{2}:\d{2}$/.test(timeString)) {
        return timeString;
      }
      
      // Convert from "9:00 AM" to "09:00"
      const time = new Date(`2000-01-01 ${timeString}`);
      if (isNaN(time.getTime())) {
        console.error("Invalid time format:", timeString);
        return "00:00"; // fallback
      }
      return time.toTimeString().substring(0, 5);
    };

    // Optional: Expose some internal methods via ref
    useImperativeHandle(ref, () => ({
      reset: () => {
        setSelectedDate("");
        setSelectedTime("");
        setShowCart(false);
        setTimeSlots([]);
      },
    }));

    // Fetch available time slots based on date and stylist selection
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

          // Ensure all time slots are in HH:MM format
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
    
      // Ensure time is in HH:MM format (remove seconds if present)
      const formattedTime = selectedTime.split(':').slice(0, 2).join(':');
      
      // Explicitly format the date to avoid timezone issues
      const formattedDate = selectedDate; // We'll handle timezone conversion in the backend
    
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
      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton onClick={onBack} sx={{ mr: 1 }}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h6">SELECT DATE AND TIME SLOT</Typography>
          </Box>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider />

        {/* Date Picker */}
        <Box sx={{ p: 2 }}>
          <TextField
            label="Select Date"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              min: getTodayDateString()
            }}
          />
        </Box>

        {/* Time slot list */}
        <Box sx={{ overflowY: "auto", flexGrow: 1, px: 2 }}>
          {loading ? (
            <Box display="flex" justifyContent="center" mt={3}>
              <CircularProgress />
            </Box>
          ) : timeSlots.length === 0 ? (
            <Typography variant="body1" mt={3} textAlign="center">
              No available time slots for this date.
            </Typography>
          ) : (
            <List>
              {timeSlots.map((time, index) => (
                <ListItem key={index} disablePadding>
                  <ListItemButton
                    onClick={() => setSelectedTime(time)}
                    selected={selectedTime === time}
                  >
                    <Typography>{time}</Typography>
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          )}
        </Box>

        {/* Footer */}
        <Box
          sx={{
            p: 2,
            bgcolor: "#fff",
            borderTop: "1px solid rgba(0,0,0,0.12)",
          }}
        >
          <Button
            variant="contained"
            fullWidth
            disabled={!selectedTime || !selectedDate}
            sx={{
              bgcolor: "#333",
              "&:hover": { bgcolor: "#444" },
              color: "#fff",
              py: 1.5,
              borderRadius: 1,
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