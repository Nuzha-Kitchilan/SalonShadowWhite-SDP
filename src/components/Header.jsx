// import React, { useState, useRef, useEffect } from "react";
// import { 
//   AppBar, 
//   Toolbar, 
//   Typography, 
//   Box, 
//   Avatar, 
//   Menu, 
//   MenuItem, 
//   IconButton,
//   ListItemIcon
// } from "@mui/material";
// import { Logout } from "@mui/icons-material";
// import logo from "../assets/logo.jpg";
// import { jwtDecode } from "jwt-decode";
// import { useNavigate } from "react-router-dom";

// const Header = () => {
//   const [anchorEl, setAnchorEl] = useState(null);
//   const [user, setUser] = useState(null);
//   const navigate = useNavigate();
//   const avatarRef = useRef(null);

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     try {
//       if (token) {
//         setUser(jwtDecode(token));
//       }
//     } catch (error) {
//       console.error("Error decoding token:", error);
//     }
//   }, []);

//   const handleMenuOpen = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//   };

//   const handleLogout = () => {
//     localStorage.removeItem('token');
//     setUser(null);
//     handleMenuClose();
//     navigate('/login');
//   };

//   return (
//     <AppBar
//       position="fixed"
//       sx={{
//         width: "100vw",
//         backgroundColor: "#000",
//         color: "#fff",
//         boxShadow: "none",
//         zIndex: 1000,
//       }}
//     >
//       <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
//         {/* Left Side - Logo */}
//         <Box sx={{ display: "flex", alignItems: "center" }}>
//           <Avatar src={logo} sx={{ width: 40, height: 40, marginRight: 1 }} />
//           <Typography variant="h6" sx={{ fontWeight: "bold", textShadow: "2px 2px 4px rgba(255,255,255,0.3)" }}>
//             Salon Shadow White
//           </Typography>
//         </Box>

//         {/* Right Side - Admin Profile */}
//         {user && (
//           <Box sx={{ display: "flex", alignItems: "center" }}>
//             <IconButton
//               onClick={handleMenuOpen}
//               ref={avatarRef}
//               sx={{ p: 0 }}
//             >
//               <Avatar 
//                 src={user.profile_url} 
//                 sx={{ 
//                   width: 40, 
//                   height: 40, 
//                   bgcolor: user.profile_url ? 'transparent' : 'primary.main'
//                 }}
//               >
//                 {!user.profile_url && user.name?.charAt(0).toUpperCase()}
//               </Avatar>
//             </IconButton>

//             <Menu
//               anchorEl={anchorEl}
//               open={Boolean(anchorEl)}
//               onClose={handleMenuClose}
//               anchorOrigin={{
//                 vertical: 'bottom',
//                 horizontal: 'right',
//               }}
//               transformOrigin={{
//                 vertical: 'top',
//                 horizontal: 'right',
//               }}
//             >
//               <MenuItem onClick={handleLogout}>
//                 <ListItemIcon>
//                   <Logout fontSize="small" />
//                 </ListItemIcon>
//                 Logout
//               </MenuItem>
//             </Menu>

//             <Box sx={{ ml: 1 }}>
//               <Typography variant="body1" sx={{ fontWeight: "bold" }}>
//                 {user.name || user.username}
//               </Typography>
//               <Typography variant="body2" sx={{ fontSize: "12px", color: "#aaa" }}>
//                 {user.role}
//               </Typography>
//             </Box>
//           </Box>
//         )}
//       </Toolbar>
//     </AppBar>
//   );
// };

// export default Header;













import React, { useState, useRef } from "react"; // Added useRef here
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Box, 
  Avatar, 
  Menu, 
  MenuItem, 
  IconButton,
  ListItemIcon
} from "@mui/material";
import { Logout } from "@mui/icons-material";
import logo from "../assets/logo.jpg";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const avatarRef = useRef(null); // Now properly defined

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        width: "100vw",
        backgroundColor: "#000",
        color: "#fff",
        boxShadow: "none",
        zIndex: 1000,
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Left Side - Logo */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Avatar src={logo} sx={{ width: 40, height: 40, marginRight: 1 }} />
          <Typography variant="h6" sx={{ fontWeight: "bold", textShadow: "2px 2px 4px rgba(255,255,255,0.3)" }}>
            Salon Shadow White
          </Typography>
        </Box>

        {/* Right Side - Admin Profile */}
        {user && (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              onClick={handleMenuOpen}
              ref={avatarRef}
              sx={{ p: 0 }}
            >
              <Avatar 
                src={user.profile_url} 
                sx={{ 
                  width: 40, 
                  height: 40, 
                  bgcolor: user.profile_url ? 'transparent' : 'primary.main'
                }}
              >
                {!user.profile_url && user.name?.charAt(0).toUpperCase()}
              </Avatar>
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <Logout fontSize="small" />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>

            <Box sx={{ ml: 1 }}>
              <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                {user.name || user.username}
              </Typography>
              <Typography variant="body2" sx={{ fontSize: "12px", color: "#aaa" }}>
                {user.role}
              </Typography>
            </Box>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;