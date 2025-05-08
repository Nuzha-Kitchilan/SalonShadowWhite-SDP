
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
import { styled } from '@mui/material/styles';
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

// Custom styled components
const StyledListItemButton = styled(ListItemButton)(({ theme, selected, selectedcolor }) => ({
  padding: "12px 16px",
  borderRadius: "8px",
  margin: "4px 8px",
  fontFamily: "'Poppins', 'Roboto', sans-serif",
  fontWeight: selected ? 600 : 500,
  transition: 'all 0.2s',
  position: 'relative',
  '&.Mui-selected': {
    backgroundColor: selectedcolor,
    color: '#000',
    '&:hover': {
      backgroundColor: selectedcolor,
      opacity: 0.9,
    },
    '&::before': {
      content: '""',
      position: 'absolute',
      left: '-8px',
      top: '50%',
      transform: 'translateY(-50%)',
      height: '60%',
      width: '3px',
      backgroundColor: '#BEAF9B', 
      borderRadius: '0 4px 4px 0',
    }
  },
  '&:hover': {
    backgroundColor: 'rgba(190, 175, 155, 0.15)',
    color: '#fff',
  },
}));

const StyledListItemText = styled(ListItemText)({
  '& .MuiTypography-root': {
    fontFamily: "'Poppins', 'Roboto', sans-serif",
    fontSize: '0.9rem',
  },
});

const SubListItemButton = styled(ListItemButton)(({ theme, selected, selectedcolor }) => ({
  padding: "8px 16px 8px 48px",
  borderRadius: "8px",
  margin: "2px 8px",
  fontFamily: "'Poppins', 'Roboto', sans-serif",
  fontSize: '0.85rem',
  fontWeight: selected ? 600 : 400,
  transition: 'all 0.2s',
  position: 'relative',
  '&.Mui-selected': {
    backgroundColor: selectedcolor,
    color: '#000',
    '&:hover': {
      backgroundColor: selectedcolor,
      opacity: 0.9,
    },
    '&::before': {
      content: '""',
      position: 'absolute',
      left: '24px',
      top: '50%',
      transform: 'translateY(-50%)',
      height: '40%',
      width: '2px',
      backgroundColor: '#BEAF9B',
      borderRadius: '0 4px 4px 0',
    }
  },
  '&:hover': {
    backgroundColor: 'rgba(190, 175, 155, 0.15)',
    color: '#fff',
  },
}));

const Sidebar = () => {
  const [openAppointments, setOpenAppointments] = useState(false);
  const location = useLocation();
  const { isAdmin } = useAuth();

  const handleAppointmentsClick = () => {
    setOpenAppointments(!openAppointments);
  };

  // Primary color used throughout the site
  const primaryColor = "#BEAF9B";

  // Menu items for non-admin users (Dashboard, Today's Appointments, Report)
  const nonAdminMenuItems = [
    { 
      text: "Dashboard", 
      icon: <DashboardIcon />, 
      path: "/",
      selectedColor: primaryColor
    },
    { 
      text: "Today's Appointments", 
      icon: <ScheduleIcon />, 
      path: "/todayapt",
      selectedColor: primaryColor
    },
    { 
      text: "Report", 
      icon: <AssessmentIcon />, 
      path: "/reports",
      selectedColor: primaryColor
    }
  ];

  // Admin menu items
  const adminMenuItems = [
    { 
      text: "Dashboard", 
      icon: <DashboardIcon />, 
      path: "/",
      selectedColor: primaryColor
    },
    { 
      text: "Report", 
      icon: <AssessmentIcon />, 
      path: "/reports",
      selectedColor: primaryColor
    },
    {
      text: "Appointments",
      icon: <ScheduleIcon />,
      expandable: true,
      open: openAppointments,
      selectedColor: primaryColor,
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
      selectedColor: primaryColor
    },
    { 
      text: "Stylists", 
      icon: <PeopleIcon />, 
      path: "/stylists",
      selectedColor: primaryColor
    },
    { 
      text: "Reviews", 
      icon: <ReviewsIcon />, 
      path: "/reviews",
      selectedColor: primaryColor
    },
    { 
      text: "Gallery", 
      icon: <PhotoLibraryIcon />, 
      path: "/gallery",
      selectedColor: primaryColor
    },
    { 
      text: "Inventory", 
      icon: <InventoryIcon />, 
      path: "/inventory",
      selectedColor: primaryColor
    },
    { 
      text: "Applications", 
      icon: <WorkIcon />, 
      path: "/applications",
      selectedColor: primaryColor
    },
    { 
      text: "Profile", 
      icon: <PeopleIcon />, 
      path: "/profile",
      selectedColor: primaryColor
    },
  ];

  const menuItems = isAdmin ? adminMenuItems : nonAdminMenuItems;

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 220,  // Increased width here
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 240,  // Increased width here
          boxSizing: "border-box",
          backgroundColor: "#000",
          color: "#fff",
          marginTop: "64px",
          height: "calc(100vh - 64px)",
          position: "relative",
          borderRight: `1px solid rgba(190, 175, 155, 0.2)`,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          overflowY: 'auto',  // Enable vertical scrolling
          '::-webkit-scrollbar': {
            width: 0, // Hides the scrollbar
            height: 0,
          },
          '::-webkit-scrollbar-thumb': {
            background: 'transparent', // Keeps the scrollbar thumb hidden
          },
        },
      }}
    >
      {/* Navigation list */}
      <List sx={{ p: 1 }}>
        {menuItems.map((item, index) => (
          <React.Fragment key={index}>
            {item.expandable ? (
              <>
                <ListItem disablePadding>
                  <StyledListItemButton
                    onClick={handleAppointmentsClick}
                    selected={openAppointments}
                    selectedcolor={item.selectedColor}
                  >
                    <ListItemIcon 
                      sx={{ 
                        color: openAppointments ? '#000' : 'rgba(255, 255, 255, 0.7)',
                        minWidth: '40px',
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <StyledListItemText primary={item.text} />
                    {item.open ? 
                      <ExpandLessIcon fontSize="small" /> : 
                      <ExpandMoreIcon fontSize="small" />
                    }
                  </StyledListItemButton>
                </ListItem>
                
                <Collapse in={openAppointments} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {item.subItems.map((subItem, subIndex) => (
                      <SubListItemButton
                        key={subIndex}
                        component={Link}
                        to={subItem.path}
                        selected={location.pathname === subItem.path}
                        selectedcolor={item.selectedColor}
                      >
                        <StyledListItemText 
                          primary={subItem.text} 
                          sx={{ 
                            '& .MuiTypography-root': { 
                              fontSize: '0.85rem',
                            }
                          }}
                        />
                      </SubListItemButton>
                    ))}
                  </List>
                </Collapse>
              </>
            ) : (
              <ListItem disablePadding>
                <StyledListItemButton
                  component={Link}
                  to={item.path}
                  selected={location.pathname === item.path}
                  selectedcolor={item.selectedColor}
                >
                  <ListItemIcon 
                    sx={{ 
                      color: location.pathname === item.path ? '#000' : 'rgba(255, 255, 255, 0.7)',
                      minWidth: '40px',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <StyledListItemText primary={item.text} />
                </StyledListItemButton>
              </ListItem>
            )}
          </React.Fragment>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
