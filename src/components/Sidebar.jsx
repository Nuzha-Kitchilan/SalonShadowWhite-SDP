import React, { useState } from "react";
import { Link } from "react-router-dom";
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

const Sidebar = () => {
  const [openAppointments, setOpenAppointments] = useState(false);

  const handleAppointmentsClick = () => {
    setOpenAppointments(!openAppointments);
  };

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
    {
      text: "Appointments",
      icon: <ScheduleIcon />,
      expandable: true,
      open: openAppointments,
      subItems: [
        { text: "Today's Appointments", path: "/today-appointments" },
        { text: "All Appointments", path: "/appointments" },
        { text: "Cancel Requests", path: "/cancel-requests" },
      ],
    },
    { text: "Services", icon: <ContentCutIcon />, path: "/services" },
    { text: "Stylists", icon: <PeopleIcon />, path: "/stylists" },
    { text: "Reviews", icon: <ReviewsIcon />, path: "/reviews" },
    { text: "Gallery", icon: <PhotoLibraryIcon />, path: "/gallery" },
    { text: "Inventory", icon: <InventoryIcon />, path: "/inventory" },
    { text: "Applications", icon: <WorkIcon />, path: "/applications" },
    { text: "Report", icon: <AssessmentIcon />, path: "/report" },
  ];

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
            <ListItem disablePadding>
              <ListItemButton
                onClick={item.expandable ? handleAppointmentsClick : null}
                component={item.path ? Link : "div"} // Use Link only if path exists
                to={item.path || "#"}
                sx={{
                  padding: "10px",
                  borderRadius: "8px",
                  "&:hover": {
                    backgroundColor: "#FE8DA1",
                    color: "#000",
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
                      component={Link}
                      to={subItem.path}
                      sx={{
                        paddingLeft: 4,
                        marginBottom: "8px",
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
