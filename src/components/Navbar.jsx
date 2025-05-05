// import React, { useState } from "react";
// import { AppBar, Toolbar, Typography, Button, IconButton, Avatar, Menu, MenuItem } from "@mui/material";
// import { Link } from "react-router-dom";
// import MenuIcon from "@mui/icons-material/Menu";

// const Navbar = () => {
//   const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login state
//   const [anchorEl, setAnchorEl] = useState(null); // For profile menu
//   const user = { // Dummy user data for logged-in state
//     name: 'John Doe',
//     profilePic: 'https://example.com/profile.jpg', // User's profile picture
//   };

//   const handleLogin = () => {
//     // Simulate login
//     setIsLoggedIn(true);
//   };

//   const handleLogout = () => {
//     // Simulate logout
//     setIsLoggedIn(false);
//     setAnchorEl(null);
//   };

//   const handleProfileMenuOpen = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleClose = () => {
//     setAnchorEl(null);
//   };

//   return (
//     <AppBar position="static" sx={{ backgroundColor: "#000" }}>
//       <Toolbar>
//         {/* Logo as Home Button */}
//         <Typography
//           variant="h6"
//           component={Link}
//           to="/"
//           sx={{
//             flexGrow: 1,
//             textDecoration: "none",
//             color: "white",
//             fontWeight: "bold",
//             transition: "0.3s",
//             "&:hover": { color: "#a36a4f" },
//           }}
//         >
//           Salon Logo
//         </Typography>

//         {/* Navigation Links */}
//         {["/services", "/gallery", "/stylists", "/contact", "/join"].map((path, index) => (
//           <Button
//             key={index}
//             color="inherit"
//             component={Link}
//             to={path}
//             sx={{
//               transition: "0.3s",
//               "&:hover": { color: "#a36a4f" },
//             }}
//           >
//             {path.replace("/", "").charAt(0).toUpperCase() + path.slice(2)}
//           </Button>
//         ))}

//         {/* Book Now Button */}
//         <Button
//           component={Link}
//           to="/book"
//           sx={{
//             color: "#fff",
//             border: "2px solid #a36a4f",
//             borderRadius: "5px",
//             ml: 1,
//             transition: "0.3s",
//             "&:hover": { backgroundColor: "#a36a4f", color: "#fff" },
//           }}
//         >
//           Book Now
//         </Button>

//         {/* Login or Profile Menu */}
//         {!isLoggedIn ? (
//           <Button
//             color="inherit"
//             onClick={handleLogin} // Handle login click
//             sx={{
//               transition: "0.3s",
//               "&:hover": { color: "#a36a4f" },
//             }}
//           >
//             Login
//           </Button>
//         ) : (
//           <div>
//             <IconButton
//               edge="end"
//               aria-label="account of current user"
//               aria-controls="menu-appbar"
//               aria-haspopup="true"
//               onClick={handleProfileMenuOpen}
//               color="inherit"
//             >
//               <Avatar alt="User Profile" src={user.profilePic} />
//             </IconButton>
//             <Menu
//               id="menu-appbar"
//               anchorEl={anchorEl}
//               anchorOrigin={{
//                 vertical: "top",
//                 horizontal: "right",
//               }}
//               keepMounted
//               transformOrigin={{
//                 vertical: "top",
//                 horizontal: "right",
//               }}
//               open={Boolean(anchorEl)}
//               onClose={handleClose}
//             >
//               <MenuItem onClick={handleClose}>Profile</MenuItem>
//               <MenuItem onClick={handleLogout}>Logout</MenuItem>
//             </Menu>
//           </div>
//         )}

//         {/* Mobile Menu Icon */}
//         <IconButton edge="end" color="inherit" sx={{ display: { md: "none" } }}>
//           <MenuIcon />
//         </IconButton>
//       </Toolbar>
//     </AppBar>
//   );
// };

// export default Navbar;





import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, Typography, Button, IconButton, Avatar, Menu, MenuItem } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import LoginIcon from "@mui/icons-material/Login";

const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  // Profile menu handlers
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setUsername("");
    handleMenuClose();
    navigate("/");
  };

  const handleProfileClick = () => {
    handleMenuClose();
    navigate("/profile");
  };

  // Check login status when component mounts
  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const tokenData = parseJwt(token);
          setIsLoggedIn(true);
          setUsername(tokenData.username || "User");
        } catch (error) {
          localStorage.removeItem("token");
          setIsLoggedIn(false);
        }
      }
    };

    checkLoginStatus();
  }, []);

  // Simple function to decode JWT without verification
  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return {};
    }
  };

  // Get first letter of username for avatar
  const getInitial = () => {
    return username ? username.charAt(0).toUpperCase() : "U";
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "#000" }}>
      <Toolbar>
        {/* Logo as Home Button */}
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            flexGrow: 1,
            textDecoration: "none",
            color: "white",
            fontWeight: "bold",
            transition: "0.3s",
            "&:hover": { color: "#a36a4f" },
          }}
        >
          Salon Logo
        </Typography>

        {/* Navigation Links */}
        {["/services", "/gallery", "/stylists", "/contact", "/join"].map(
          (path, index) => (
            <Button
              key={index}
              color="inherit"
              component={Link}
              to={path}
              sx={{
                transition: "0.3s",
                "&:hover": { color: "#a36a4f" },
              }}
            >
              {path.replace("/", "").charAt(0).toUpperCase() + path.slice(2)}
            </Button>
          )
        )}

        {/* Book Now Button */}
        <Button
          component={Link}
          to="/book"
          sx={{
            color: "#fff",
            border: "2px solid #a36a4f",
            borderRadius: "5px",
            ml: 1,
            transition: "0.3s",
            "&:hover": { backgroundColor: "#a36a4f", color: "#fff" },
          }}
        >
          Book Now
        </Button>

        {/* Conditional Rendering: Login Button or Avatar */}
        {isLoggedIn ? (
          <>
            <IconButton
              onClick={handleMenuOpen}
              size="small"
              aria-controls={open ? 'account-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              sx={{ ml: 1 }}
            >
              <Avatar sx={{ width: 40, height: 40, bgcolor: '#a36a4f' }}>
                {getInitial()}
              </Avatar>
            </IconButton>
            <Menu
              id="account-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleMenuClose}
              MenuListProps={{
                'aria-labelledby': 'account-button',
              }}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </>
        ) : (
          <Button
            color="inherit"
            onClick={handleLoginClick}
            startIcon={<LoginIcon />}
            sx={{
              transition: "0.3s",
              "&:hover": { color: "#a36a4f" },
            }}
          >
            Login
          </Button>
        )}

        {/* Mobile Menu Icon (optional) */}
        <IconButton 
          edge="end" 
          color="inherit" 
          sx={{ display: { md: "none" } }}
        >
          <MenuIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;