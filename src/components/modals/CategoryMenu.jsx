import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
  IconButton,
} from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";  // Importing Back Arrow Icon
import ServiceModal from "./ServiceModal";

const CategoryMenu = ({ open, onClose, setCurrentView, onBack }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [services, setServices] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingServices, setLoadingServices] = useState(false);
  const [showServiceView, setShowServiceView] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:5001/api/categories");
        const data = await response.json();
        setCategories(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setCategories([ // Fallback categories for testing
          { category_id: 5, category_name: "Haircut" },
          { category_id: 6, category_name: "Hair Color" },
        ]);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = async (category) => {
    setSelectedCategory(category);
    setLoadingServices(true);
    setShowServiceView(true);

    try {
      const response = await fetch(
        `http://localhost:5001/api/services/category/${category.category_id}`
      );
      const data = await response.json();
      setServices(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setServices([]);
    } finally {
      setLoadingServices(false);
    }
  };

  const handleBackToCategories = () => {
    setShowServiceView(false);
    setSelectedCategory(null);
  };

  const handleAddToCart = (item) => {
    setCartItems((prev) => [...prev, item]);
  };

  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setShowServiceView(false);
        setSelectedCategory(null);
      }, 300);
    }
  }, [open]);

  // Navigate back to BookingModal when the back button is clicked
  const handleBackToBooking = () => {
    setCurrentView("BookingModal");
    onBack();
  };

  if (showServiceView) {
    return (
      <ServiceModal
        categoryName={selectedCategory?.category_name}
        loading={loadingServices}
        services={services}
        onBack={handleBackToCategories}
        onClose={onClose}
        onAddToCart={handleAddToCart}
        isInDrawer={true}
        setCurrentView={setCurrentView}
      />
    );
  }

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          p: 2,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold", color: "#000" }}>
          Service Category
        </Typography>
        <Typography
          variant="body2"
          sx={{ mt: 0.5, color: "#666", fontStyle: "italic" }}
        >
          Please select a category of your selected service.
        </Typography>

        {/* Back Button */}
        <IconButton
          sx={{
            marginTop: 2,
            alignSelf: "flex-start",
            color: "#BEAF9B",
            "&:hover": {
              backgroundColor: "transparent",
              boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
            },
          }}
          onClick={handleBackToBooking} // Use the handleBackToBooking function
        >
          <ArrowBackIcon />
        </IconButton>
      </Box>

      <Divider />

      {loadingCategories ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <List disablePadding>
          {categories.map((category, index) => (
            <React.Fragment key={category.category_id}>
              <ListItem
                component="div"
                sx={{
                  py: 2,
                  px: 2,
                  cursor: "pointer",
                  color: "#000",
                  borderRadius: "10px",
                  mx: 1,
                  my: 0.5,
                  transition: "all 0.2s ease-in-out",
                  "&:hover": {
                    backgroundColor: "#BEAF9B",
                    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
                    transform: "translateY(-1px)",
                  },
                }}
                onClick={() => handleCategoryClick(category)}
              >
                <ListItemText
                  primary={category.category_name}
                  primaryTypographyProps={{
                    fontWeight: "medium",
                    color: "#000",
                  }}
                />
                <ArrowForwardIosIcon sx={{ fontSize: "16px", color: "#BEAF9B" }} />
              </ListItem>
              {index < categories.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      )}
    </Box>
  );
};

export default CategoryMenu;












// import React, { useEffect, useState } from "react";
// import {
//   Box,
//   Typography,
//   List,
//   ListItem,
//   ListItemText,
//   Divider,
//   CircularProgress,
//   IconButton,
// } from "@mui/material";
// import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// import ServiceModal from "./ServiceModal";

// const CategoryMenu = ({ setCurrentView }) => {
//   const [categories, setCategories] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [services, setServices] = useState([]);
//   const [loadingCategories, setLoadingCategories] = useState(true);
//   const [loadingServices, setLoadingServices] = useState(false);
//   const [showServiceView, setShowServiceView] = useState(false);
//   const [cartItems, setCartItems] = useState([]);

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const response = await fetch("http://localhost:5001/api/categories");
//         const data = await response.json();
//         setCategories(Array.isArray(data) ? data : []);
//       } catch (err) {
//         console.error(err);
//         setCategories([ // Fallback categories for testing
//           { category_id: 5, category_name: "Haircut" },
//           { category_id: 6, category_name: "Hair Color" },
//         ]);
//       } finally {
//         setLoadingCategories(false);
//       }
//     };

//     fetchCategories();
//   }, []);

//   const handleCategoryClick = async (category) => {
//     setCurrentView("bookingFlow");
//     setSelectedCategory(category);
//     setLoadingServices(true);
//     setShowServiceView(true);

//     try {
//       const response = await fetch(
//         `http://localhost:5001/api/services/category/${category.category_id}`
//       );
//       const data = await response.json();
//       setServices(Array.isArray(data) ? data : []);
//     } catch (err) {
//       console.error(err);
//       setServices([]);
//     } finally {
//       setLoadingServices(false);
//     }
//   };

//   const handleBackToCategories = () => {
//     setShowServiceView(false);
//     setSelectedCategory(null);
//   };

//   const handleAddToCart = (item) => {
//     setCartItems((prev) => [...prev, item]);
//   };

//   // Navigate back to main view
//   const handleBackToMain = () => {
//     setCurrentView("main");
//   };

//   if (showServiceView) {
//     return (
//       <ServiceModal
//         categoryName={selectedCategory?.category_name}
//         loading={loadingServices}
//         services={services}
//         onBack={handleBackToCategories}
//         onAddToCart={handleAddToCart}
//         isInDrawer={true}
//         setCurrentView={setCurrentView}
//       />
//     );
//   }

//   // Header section
//   const renderHeader = () => (
//     <Box
//       sx={{
//         pt: 2,
//         px: 2,
//         position: "relative",
//       }}
//     >
//       {/* Back Button */}
//       <IconButton
//         sx={{
//           position: "absolute",
//           top: 2,
//           left: 0,
//           color: "#BEAF9B",
//           "&:hover": {
//             backgroundColor: "transparent",
//             boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
//           },
//         }}
//         onClick={handleBackToMain}
//       >
//         <ArrowBackIcon />
//       </IconButton>
      
//       <Box sx={{ ml: 4 }}>
//         <Typography variant="h6" sx={{ fontWeight: "bold", color: "#000" }}>
//           Service Category
//         </Typography>
//         <Typography
//           variant="body2"
//           sx={{ mt: 0.5, color: "#666", fontStyle: "italic" }}
//         >
//           Please select a category of your selected service.
//         </Typography>
//       </Box>
//     </Box>
//   );

//   return (
//     <>
//       {renderHeader()}
//       <Divider sx={{ mt: 1 }} />

//       {loadingCategories ? (
//         <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
//           <CircularProgress />
//         </Box>
//       ) : (
//         <List disablePadding>
//           {categories.map((category, index) => (
//             <React.Fragment key={category.category_id}>
//               <ListItem
//                 component="div"
//                 sx={{
//                   py: 2,
//                   px: 2,
//                   cursor: "pointer",
//                   color: "#000",
//                   borderRadius: "10px",
//                   mx: 1,
//                   my: 0.5,
//                   transition: "all 0.2s ease-in-out",
//                   "&:hover": {
//                     backgroundColor: "#BEAF9B",
//                     boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
//                     transform: "translateY(-1px)",
//                   },
//                 }}
//                 onClick={() => handleCategoryClick(category)}
//               >
//                 <ListItemText
//                   primary={category.category_name}
//                   primaryTypographyProps={{
//                     fontWeight: "medium",
//                     color: "#000",
//                   }}
//                 />
//                 <ArrowForwardIosIcon sx={{ fontSize: "16px", color: "#BEAF9B" }} />
//               </ListItem>
//               {index < categories.length - 1 && <Divider />}
//             </React.Fragment>
//           ))}
//         </List>
//       )}
//     </>
//   );
// };

// export default CategoryMenu;








