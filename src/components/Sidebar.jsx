
// import React, { useState } from "react";
// import { Link, useLocation } from "react-router-dom";
// import {
//   Drawer,
//   List,
//   ListItem,
//   ListItemButton,
//   ListItemIcon,
//   ListItemText,
//   Collapse,
// } from "@mui/material";
// import DashboardIcon from "@mui/icons-material/Dashboard";
// import ScheduleIcon from "@mui/icons-material/EventNote";
// import ExpandLessIcon from "@mui/icons-material/ExpandLess";
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// import ContentCutIcon from "@mui/icons-material/ContentCut";
// import PeopleIcon from "@mui/icons-material/People";
// import ReviewsIcon from "@mui/icons-material/RateReview";
// import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
// import InventoryIcon from "@mui/icons-material/Inventory";
// import WorkIcon from "@mui/icons-material/Work";
// import AssessmentIcon from "@mui/icons-material/Assessment";
// //import PeopleIcon from "@mui/icons-material/People";

// const Sidebar = () => {
//   const [openAppointments, setOpenAppointments] = useState(false);
//   const location = useLocation();

//   const handleAppointmentsClick = () => {
//     setOpenAppointments(!openAppointments);
//   };

//   const menuItems = [
//     { text: "Dashboard", icon: <DashboardIcon />, path: "/" },
//     {
//       text: "Appointments",
//       icon: <ScheduleIcon />,
//       expandable: true,
//       open: openAppointments,
//       subItems: [
//         { text: "Today's Appointments", path: "/todayapt" },
//         { text: "All Appointments", path: "/allapt" },
//         { text: "Cancel Requests", path: "/cancelreq" },
//         { text: "Working Hours", path: "/workinghours" },
//         { text: "Special Requests", path: "/specialreq" },
//       ],
//     },
//     { text: "Services", icon: <ContentCutIcon />, path: "/services" },
//     { text: "Stylists", icon: <PeopleIcon />, path: "/stylists" },
//     { text: "Reviews", icon: <ReviewsIcon />, path: "/reviews" },
//     { text: "Gallery", icon: <PhotoLibraryIcon />, path: "/gallery" },
//     { text: "Inventory", icon: <InventoryIcon />, path: "/inventory" },
//     { text: "Applications", icon: <WorkIcon />, path: "/applications" },
//     { text: "Report", icon: <AssessmentIcon />, path: "/reports" },
//     {text: "Profile", icon: <PeopleIcon />, path: "/profile"},
//   ];

//   return (
//     <Drawer
//       variant="permanent"
//       sx={{
//         width: 220,
//         flexShrink: 0,
//         "& .MuiDrawer-paper": {
//           width: 220,
//           boxSizing: "border-box",
//           backgroundColor: "#000",
//           color: "#fff",
//           marginTop: "64px",
//           height: "calc(100vh - 64px)",
//           position: "relative",
//         },
//       }}
//     >
//       <List>
//         {menuItems.map((item, index) => (
//           <React.Fragment key={index}>
//             <ListItem disablePadding>
//               <ListItemButton
//                 onClick={item.expandable ? handleAppointmentsClick : null}
//                 component={!item.expandable ? Link : "div"}
//                 to={!item.expandable ? item.path : undefined}
//                 selected={!item.expandable && location.pathname === item.path}
//                 sx={{
//                   padding: "10px",
//                   borderRadius: "8px",
//                   "&:hover": {
//                     backgroundColor: "#FE8DA1",
//                     color: "#000",
//                   },
//                   "&.Mui-selected": {
//                     backgroundColor: "#FE8DA1",
//                     color: "#000",
//                   },
//                   "&.Mui-selected:hover": {
//                     backgroundColor: "#FE8DA1",
//                   },
//                 }}
//               >
//                 <ListItemIcon sx={{ color: "inherit" }}>{item.icon}</ListItemIcon>
//                 <ListItemText primary={item.text} />
//                 {item.expandable ? (item.open ? <ExpandLessIcon /> : <ExpandMoreIcon />) : null}
//               </ListItemButton>
//             </ListItem>

//             {item.expandable && (
//               <Collapse in={item.open} timeout="auto" unmountOnExit>
//                 <List component="div" disablePadding>
//                   {item.subItems.map((subItem, subIndex) => (
//                     <ListItemButton
//                       key={subIndex}
//                       component={Link}
//                       to={subItem.path}
//                       selected={location.pathname === subItem.path}
//                       sx={{
//                         paddingLeft: 4,
//                         marginBottom: "8px",
//                         "&:hover": {
//                           backgroundColor: "#FE8DA1",
//                           color: "#000",
//                         },
//                         "&.Mui-selected": {
//                           backgroundColor: "#FE8DA1",
//                           color: "#000",
//                         },
//                         "&.Mui-selected:hover": {
//                           backgroundColor: "#FE8DA1",
//                         },
//                       }}
//                     >
//                       <ListItemText primary={subItem.text} />
//                     </ListItemButton>
//                   ))}
//                 </List>
//               </Collapse>
//             )}
//           </React.Fragment>
//         ))}
//       </List>
//     </Drawer>
//   );
// };

// export default Sidebar;























import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ScheduleIcon from "@mui/icons-material/EventNote";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ContentCutIcon from "@mui/icons-material/ContentCut";
import PeopleIcon from "@mui/icons-material/People";
import ReviewsIcon from "@mui/icons-material/RateReview";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import InventoryIcon from "@mui/icons-material/Inventory";
import WorkIcon from "@mui/icons-material/Work";
import AssessmentIcon from "@mui/icons-material/Assessment";
import { useAuth } from '../auth/AuthContext';

const Sidebar = () => {
  const [openAppointments, setOpenAppointments] = useState(false);
  const location = useLocation();
  const { isAdmin } = useAuth();

  const handleAppointmentsClick = () => {
    setOpenAppointments(!openAppointments);
  };

  // Menu items for non-admin users (Dashboard, Today's Appointments, Report)
  const nonAdminMenuItems = [
    { 
      text: "Dashboard", 
      icon: <DashboardIcon />, 
      path: "/",
      selectedColor: "#FE8DA1"
    },
    { 
      text: "Today's Appointments", 
      icon: <ScheduleIcon />, 
      path: "/todayapt",
      selectedColor: "#FE8DA1"
    },
    { 
      text: "Report", 
      icon: <AssessmentIcon />, 
      path: "/reports",
      selectedColor: "#FE8DA1"
    }
  ];

  // Admin menu items
  const adminMenuItems = [
    { 
      text: "Dashboard", 
      icon: <DashboardIcon />, 
      path: "/",
      selectedColor: "#FE8DA1"
    },
    { 
      text: "Report", 
      icon: <AssessmentIcon />, 
      path: "/reports",
      selectedColor: "#FE8DA1"
    },
    {
      text: "Appointments",
      icon: <ScheduleIcon />,
      expandable: true,
      open: openAppointments,
      selectedColor: "#FE8DA1",
      subItems: [
        { text: "Today's Appointments", path: "/todayapt" },
        { text: "All Appointments", path: "/allapt" },
        { text: "Cancel Requests", path: "/cancelreq" },
        { text: "Working Hours", path: "/workinghours" },
        { text: "Special Requests", path: "/specialreq" },
      ],
    },
    { 
      text: "Services", 
      icon: <ContentCutIcon />, 
      path: "/services",
      selectedColor: "#FE8DA1"
    },
    { 
      text: "Stylists", 
      icon: <PeopleIcon />, 
      path: "/stylists",
      selectedColor: "#FE8DA1"
    },
    { 
      text: "Reviews", 
      icon: <ReviewsIcon />, 
      path: "/reviews",
      selectedColor: "#FE8DA1"
    },
    { 
      text: "Gallery", 
      icon: <PhotoLibraryIcon />, 
      path: "/gallery",
      selectedColor: "#FE8DA1"
    },
    { 
      text: "Inventory", 
      icon: <InventoryIcon />, 
      path: "/inventory",
      selectedColor: "#FE8DA1"
    },
    { 
      text: "Applications", 
      icon: <WorkIcon />, 
      path: "/applications",
      selectedColor: "#FE8DA1"
    },
    { 
      text: "Profile", 
      icon: <PeopleIcon />, 
      path: "/profile",
      selectedColor: "#FE8DA1"
    },
  ];

  const menuItems = isAdmin ? adminMenuItems : nonAdminMenuItems;

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 220,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 220,
          boxSizing: "border-box",
          backgroundColor: "#000",
          color: "#fff",
          marginTop: "64px",
          height: "calc(100vh - 64px)",
          position: "relative",
        },
      }}
    >
      <List>
        {menuItems.map((item, index) => (
          <React.Fragment key={index}>
            {item.expandable ? (
              <>
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={handleAppointmentsClick}
                    sx={{
                      padding: "10px",
                      borderRadius: "8px",
                      "&:hover": {
                        backgroundColor: item.selectedColor,
                        color: "#000",
                      },
                    }}
                  >
                    <ListItemIcon sx={{ color: "inherit" }}>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.text} />
                    {item.open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </ListItemButton>
                </ListItem>
                <Collapse in={openAppointments} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.subItems.map((subItem, subIndex) => (
                      <ListItemButton
                        key={subIndex}
                        component={Link}
                        to={subItem.path}
                        selected={location.pathname === subItem.path}
                        sx={{
                          paddingLeft: 4,
                          marginBottom: "8px",
                          "&.Mui-selected": {
                            backgroundColor: item.selectedColor,
                            color: "#000",
                            "&:hover": {
                              backgroundColor: item.selectedColor,
                              opacity: 0.8,
                            },
                          },
                          "&:hover": {
                            backgroundColor: item.selectedColor,
                            color: "#000",
                          },
                        }}
                      >
                        <ListItemText primary={subItem.text} />
                      </ListItemButton>
                    ))}
                  </List>
                </Collapse>
              </>
            ) : (
              <ListItem disablePadding>
                <ListItemButton
                  component={Link}
                  to={item.path}
                  selected={location.pathname === item.path}
                  sx={{
                    padding: "10px",
                    borderRadius: "8px",
                    "&.Mui-selected": {
                      backgroundColor: item.selectedColor,
                      color: "#000",
                      "&:hover": {
                        backgroundColor: item.selectedColor,
                        opacity: 0.8,
                      },
                    },
                    "&:hover": {
                      backgroundColor: item.selectedColor,
                      color: "#000",
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: "inherit" }}>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            )}
          </React.Fragment>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;