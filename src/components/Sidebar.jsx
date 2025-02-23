import React, { useState } from "react";
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Collapse } from "@mui/material";
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

const Sidebar = () => {
  const [openAppointments, setOpenAppointments] = useState(false);

  const handleAppointmentsClick = () => {
    setOpenAppointments(!openAppointments);
  };

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon /> },
    {
      text: "Appointments",
      icon: <ScheduleIcon />,
      expandable: true,
      open: openAppointments,
      subItems: [
        { text: "Today's Appointments" },
        { text: "All Appointments" },
        { text: "Cancel Requests" },
      ],
    },
    { text: "Services", icon: <ContentCutIcon /> },
    { text: "Stylists", icon: <PeopleIcon /> },
    { text: "Reviews", icon: <ReviewsIcon /> },
    { text: "Gallery", icon: <PhotoLibraryIcon /> },
    { text: "Inventory", icon: <InventoryIcon /> },
    { text: "Applications", icon: <WorkIcon /> },
    { text: "Report", icon: <AssessmentIcon /> },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 150, // Reduced sidebar width
        flexShrink: 0,
        marginLeft: 0,
        padding: 0,
        "& .MuiDrawer-paper": {
          width: 220, // Reduced sidebar width
          boxSizing: "border-box",
          backgroundColor: "#000", // Black background
          color: "#fff", // White text
          marginTop: "64px", // Push it below the header
          height: "calc(100vh - 64px)", // Make it fit below header
          position: "relative",
          padding: 0,
          marginLeft: 0,
        },
      }}
    >
      <List sx={{ padding: 0 }}>
        {menuItems.map((item, index) => (
          <React.Fragment key={index}>
            <ListItem disablePadding sx={{ marginBottom: "10px", padding: 0 }}>
              <ListItemButton
                onClick={item.expandable ? handleAppointmentsClick : null}
                sx={{
                  padding: "10px",
                  borderRadius: "8px",
                  "&:hover": {
                    backgroundColor: "#FE8DA1", // Light gold on hover
                    color: "#000", // Change text color to black on hover
                  },
                }}
              >
                <ListItemIcon sx={{ color: "inherit" }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
                {item.expandable ? (item.open ? <ExpandLessIcon /> : <ExpandMoreIcon />) : null}
              </ListItemButton>
            </ListItem>

            {item.expandable && (
              <Collapse in={item.open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {item.subItems.map((subItem, subIndex) => (
                    <ListItemButton
                      key={subIndex}
                      sx={{
                        paddingLeft: 4,
                        marginBottom: "8px", // Margin between subitems
                        "&:hover": {
                          backgroundColor: "#FE8DA1",
                          color: "#000",
                        },
                      }}
                    >
                      <ListItemText primary={subItem.text} />
                    </ListItemButton>
                  ))}
                </List>
              </Collapse>
            )}
          </React.Fragment>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
// Compare this snippet from src/components/Sidebar.jsx:
// import React, { useState } from "react";
// import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Collapse } from "@mui/material";
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
//
// const Sidebar = () => {
//   const [openAppointments, setOpenAppointments] = useState(false);
//
//   const handleAppointmentsClick = () => {
//     setOpenAppointments(!openAppointments);
//   };
//
//   const menuItems = [
//     { text: "Dashboard", icon: <DashboardIcon /> },
//     {

