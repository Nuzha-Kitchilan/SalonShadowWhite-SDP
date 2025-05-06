// import React, { useState, useEffect } from "react";
// import { AppBar, Toolbar, Typography, Button, IconButton, Avatar, Menu, MenuItem } from "@mui/material";
// import { Link, useNavigate } from "react-router-dom";
// import MenuIcon from "@mui/icons-material/Menu";
// import LoginIcon from "@mui/icons-material/Login";

// const Navbar = () => {
//   const navigate = useNavigate();
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [username, setUsername] = useState("");
//   const [anchorEl, setAnchorEl] = useState(null);
//   const open = Boolean(anchorEl);

//   // Profile menu handlers
//   const handleMenuOpen = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleMenuClose = () => {
//     setAnchorEl(null);
//   };

//   const handleLoginClick = () => {
//     navigate("/login");
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     setIsLoggedIn(false);
//     setUsername("");
//     handleMenuClose();
//     navigate("/");
//   };

//   const handleProfileClick = () => {
//     handleMenuClose();
//     navigate("/profile");
//   };

//   // Check login status when component mounts
//   useEffect(() => {
//     const checkLoginStatus = async () => {
//       const token = localStorage.getItem("token");
//       if (token) {
//         try {
//           const tokenData = parseJwt(token);
//           setIsLoggedIn(true);
//           setUsername(tokenData.username || "User");
//         } catch (error) {
//           localStorage.removeItem("token");
//           setIsLoggedIn(false);
//         }
//       }
//     };

//     checkLoginStatus();
//   }, []);

//   // Simple function to decode JWT without verification
//   const parseJwt = (token) => {
//     try {
//       return JSON.parse(atob(token.split('.')[1]));
//     } catch (e) {
//       return {};
//     }
//   };

//   // Get first letter of username for avatar
//   const getInitial = () => {
//     return username ? username.charAt(0).toUpperCase() : "U";
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
//         {["/services", "/gallery", "/stylists", "/contact", "/join"].map(
//           (path, index) => (
//             <Button
//               key={index}
//               color="inherit"
//               component={Link}
//               to={path}
//               sx={{
//                 transition: "0.3s",
//                 "&:hover": { color: "#a36a4f" },
//               }}
//             >
//               {path.replace("/", "").charAt(0).toUpperCase() + path.slice(2)}
//             </Button>
//           )
//         )}

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

//         {/* Conditional Rendering: Login Button or Avatar */}
//         {isLoggedIn ? (
//           <>
//             <IconButton
//               onClick={handleMenuOpen}
//               size="small"
//               aria-controls={open ? 'account-menu' : undefined}
//               aria-haspopup="true"
//               aria-expanded={open ? 'true' : undefined}
//               sx={{ ml: 1 }}
//             >
//               <Avatar sx={{ width: 40, height: 40, bgcolor: '#a36a4f' }}>
//                 {getInitial()}
//               </Avatar>
//             </IconButton>
//             <Menu
//               id="account-menu"
//               anchorEl={anchorEl}
//               open={open}
//               onClose={handleMenuClose}
//               MenuListProps={{
//                 'aria-labelledby': 'account-button',
//               }}
//               anchorOrigin={{
//                 vertical: 'bottom',
//                 horizontal: 'right',
//               }}
//               transformOrigin={{
//                 vertical: 'top',
//                 horizontal: 'right',
//               }}
//             >
//               <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
//               <MenuItem onClick={handleLogout}>Logout</MenuItem>
//             </Menu>
//           </>
//         ) : (
//           <Button
//             color="inherit"
//             onClick={handleLoginClick}
//             startIcon={<LoginIcon />}
//             sx={{
//               transition: "0.3s",
//               "&:hover": { color: "#a36a4f" },
//             }}
//           >
//             Login
//           </Button>
//         )}

//         {/* Mobile Menu Icon (optional) */}
//         <IconButton 
//           edge="end" 
//           color="inherit" 
//           sx={{ display: { md: "none" } }}
//         >
//           <MenuIcon />
//         </IconButton>
//       </Toolbar>
//     </AppBar>
//   );
// };

// export default Navbar;









import React, { useState, useEffect } from "react";
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton, 
  Avatar, 
  Menu, 
  MenuItem,
  Box,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemText
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import LoginIcon from "@mui/icons-material/Login";
import CloseIcon from "@mui/icons-material/Close";
import logo from "../assets/logo.png"; // Adjust path as needed

const Navbar = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isMobile = useMediaQuery('(max-width:960px)');
  const open = Boolean(anchorEl);

  // Navigation links
  const navLinks = [
    { path: "/services", label: "Services" },
    { path: "/gallery", label: "Gallery" },
    { path: "/stylists", label: "Stylists" },
    { path: "/contact", label: "Contact" },
    { path: "/careers", label: "Careers" }
  ];

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Profile menu handlers
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLoginClick = () => {
    navigate("/login");
    if (isMobile) setMobileMenuOpen(false);
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

  const handleNavClick = (path) => {
    navigate(path);
    if (isMobile) setMobileMenuOpen(false);
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

  // Mobile drawer content
  const mobileDrawerContent = (
    <Box
      sx={{
        width: 280,
        height: "100%", 
        bgcolor: "rgba(249, 245, 240, 0.95)",
        display: "flex",
        flexDirection: "column",
        backdropFilter: "blur(8px)"
      }}
      role="presentation"
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
          borderBottom: "1px solid rgba(190, 175, 155, 0.3)",
          background: "linear-gradient(to right, rgba(249, 245, 240, 0.8), rgba(255, 255, 255, 0.8))",
        }}
      >
        <Box
          component="img"
          src={logo}
          alt="Salon Logo"
          sx={{ height: 40,
            borderRadius: "60%",
            objectFit: "cover",
            aspectRatio: "1/1"
           }}
        />
        <IconButton 
          onClick={toggleMobileMenu}
          sx={{ color: "#BEAF9B" }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      
      <List sx={{ flexGrow: 1, py: 0 }}>
        {navLinks.map((link) => (
          <ListItem 
            key={link.path}
            onClick={() => handleNavClick(link.path)}
            sx={{
              borderBottom: "1px solid rgba(190, 175, 155, 0.2)",
              py: 1.5,
              "&:hover": {
                bgcolor: "rgba(190, 175, 155, 0.1)",
              }
            }}
          >
            <ListItemText 
              primary={link.label} 
              sx={{ 
                color: "#453C33",
                "& .MuiListItemText-primary": {
                  fontFamily: "'Poppins', 'Roboto', sans-serif",
                  fontWeight: 500
                }
              }}
            />
          </ListItem>
        ))}
      </List>
      
      <Box sx={{ p: 2, borderTop: "1px solid rgba(190, 175, 155, 0.3)" }}>
        {isLoggedIn ? (
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2, p: 1 }}>
              <Avatar sx={{ width: 40, height: 40, bgcolor: '#BEAF9B', mr: 2 }}>
                {getInitial()}
              </Avatar>
              <Typography sx={{ fontFamily: "'Poppins', 'Roboto', sans-serif", color: "#453C33" }}>
                {username}
              </Typography>
            </Box>
            <Button
              fullWidth
              onClick={handleProfileClick}
              sx={{
                mb: 1,
                color: "#453C33",
                border: "1px solid #BEAF9B",
                borderRadius: "8px",
                p: 1,
                textTransform: "none",
                fontFamily: "'Poppins', 'Roboto', sans-serif",
                "&:hover": { bgcolor: "rgba(190, 175, 155, 0.1)" }
              }}
            >
              Profile
            </Button>
            <Button
              fullWidth
              onClick={handleLogout}
              sx={{
                color: "#453C33",
                border: "1px solid #BEAF9B",
                borderRadius: "8px",
                p: 1,
                textTransform: "none",
                fontFamily: "'Poppins', 'Roboto', sans-serif",
                "&:hover": { bgcolor: "rgba(190, 175, 155, 0.1)" }
              }}
            >
              Logout
            </Button>
          </Box>
        ) : (
          <Button
            fullWidth
            onClick={handleLoginClick}
            startIcon={<LoginIcon />}
            sx={{
              background: "linear-gradient(to right, #BEAF9B, #D9CFC2)",
              color: "#fff",
              p: 1.2,
              borderRadius: "8px",
              textTransform: "none",
              fontFamily: "'Poppins', 'Roboto', sans-serif",
              fontWeight: 500,
              boxShadow: "0 2px 4px rgba(190, 175, 155, 0.3)",
              "&:hover": { 
                background: "linear-gradient(to right, #b0a08d, #cec2b3)",
                boxShadow: "0 4px 8px rgba(190, 175, 155, 0.4)"
              }
            }}
          >
            Login
          </Button>
        )}
        
        <Button
          fullWidth
          onClick={() => handleNavClick("/book")}
          sx={{
            mt: 2,
            background: "linear-gradient(to right, #BEAF9B, #D9CFC2)",
            color: "#fff",
            p: 1.2,
            borderRadius: "8px",
            textTransform: "none",
            fontFamily: "'Poppins', 'Roboto', sans-serif",
            fontWeight: 500,
            boxShadow: "0 2px 4px rgba(190, 175, 155, 0.3)",
            "&:hover": { 
              background: "linear-gradient(to right, #b0a08d, #cec2b3)",
              boxShadow: "0 4px 8px rgba(190, 175, 155, 0.4)"
            }
          }}
        >
          Book Now
        </Button>
      </Box>
    </Box>
  );

  return (
    <>
      <AppBar 
        position="fixed"
        elevation={0}
        sx={{ 
          bgcolor: scrolled ? "rgba(249, 245, 240, 0.7)" : "transparent",
          backdropFilter: scrolled ? "blur(8px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(190, 175, 155, 0.2)" : "none",
          boxShadow: scrolled ? "0 4px 12px rgba(0,0,0,0.05)" : "none",
          transition: "all 0.3s ease"
        }}
      >
        <Toolbar sx={{ 
          height: 80,
          px: { xs: 2, md: 4 },
          background: scrolled ? "linear-gradient(to right, rgba(249, 245, 240, 0.7), rgba(255, 255, 255, 0.7))" : "transparent",
          transition: "all 0.3s ease"
        }}>
          {/* Logo */}
          <Box
            component={Link}
            to="/"
            sx={{
              height: 50,
              display: "flex",
              alignItems: "center",
              textDecoration: "none"
            }}
          >
            <Box
              component="img"
              src={logo}
              alt="Salon Logo"
              sx={{ 
                height: "100%",
                transition: "0.2s",
                "&:hover": { transform: "scale(1.05)" },
                borderRadius: "60%",
                objectFit: "cover",
                aspectRatio: "1/1"
              }}
            />
          </Box>

          {/* Spacer */}
          <Box sx={{ flexGrow: 1 }} />

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {navLinks.map((link) => (
                <Button
                  key={link.path}
                  component={Link}
                  to={link.path}
                  sx={{
                    mx: 0.5,
                    px: 1.5,
                    color: scrolled ? "#453C33" : "#fff",
                    textTransform: "none",
                    fontFamily: "'Poppins', 'Roboto', sans-serif",
                    fontWeight: 500,
                    fontSize: "0.95rem",
                    textShadow: scrolled ? "none" : "0 1px 2px rgba(0,0,0,0.3)",
                    transition: "all 0.2s",
                    position: "relative",
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      bottom: 0,
                      left: "50%",
                      width: "0%",
                      height: "2px",
                      bgcolor: scrolled ? "#BEAF9B" : "#fff",
                      transition: "all 0.3s ease",
                      transform: "translateX(-50%)"
                    },
                    "&:hover": {
                      bgcolor: "transparent",
                      "&::after": {
                        width: "70%"
                      }
                    }
                  }}
                >
                  {link.label}
                </Button>
              ))}

              {/* Book Now Button */}
              <Button
                component={Link}
                to="/book"
                sx={{
                  ml: 2,
                  background: scrolled 
                    ? "linear-gradient(to right, #BEAF9B, #D9CFC2)"
                    : "rgba(255, 255, 255, 0.2)",
                  color: "#fff",
                  px: 3,
                  py: 1,
                  borderRadius: "8px",
                  textTransform: "none",
                  fontFamily: "'Poppins', 'Roboto', sans-serif",
                  fontWeight: 500,
                  backdropFilter: scrolled ? "none" : "blur(4px)",
                  border: scrolled ? "none" : "1px solid rgba(255, 255, 255, 0.4)",
                  boxShadow: scrolled 
                    ? "0 2px 4px rgba(190, 175, 155, 0.3)"
                    : "0 2px 8px rgba(0, 0, 0, 0.2)",
                  transition: "all 0.3s ease",
                  "&:hover": { 
                    background: scrolled 
                      ? "linear-gradient(to right, #b0a08d, #cec2b3)"
                      : "rgba(255, 255, 255, 0.3)",
                    boxShadow: scrolled
                      ? "0 4px 8px rgba(190, 175, 155, 0.4)"
                      : "0 4px 12px rgba(0, 0, 0, 0.25)",
                    transform: "translateY(-2px)"
                  }
                }}
              >
                Book Now
              </Button>

              {/* Login Button or Avatar */}
              {isLoggedIn ? (
                <>
                  <IconButton
                    onClick={handleMenuOpen}
                    size="small"
                    aria-controls={open ? 'account-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    sx={{ 
                      ml: 2,
                      bgcolor: scrolled ? "transparent" : "rgba(255, 255, 255, 0.2)",
                      backdropFilter: scrolled ? "none" : "blur(4px)",
                      "&:hover": {
                        bgcolor: scrolled ? "rgba(190, 175, 155, 0.1)" : "rgba(255, 255, 255, 0.3)"
                      }
                    }}
                  >
                    <Avatar sx={{ width: 40, height: 40, bgcolor: scrolled ? '#BEAF9B' : 'rgba(255, 255, 255, 0.8)', color: scrolled ? '#fff' : '#453C33' }}>
                      {getInitial()}
                    </Avatar>
                  </IconButton>
                  <Menu
                    id="account-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleMenuClose}
                    PaperProps={{
                      sx: {
                        mt: 1.5,
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        borderRadius: "8px",
                        minWidth: 180,
                        "& .MuiMenuItem-root": {
                          fontFamily: "'Poppins', 'Roboto', sans-serif",
                          color: "#453C33",
                          py: 1.5
                        }
                      }
                    }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  >
                    <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                  </Menu>
                </>
              ) : (
                <Button
                  onClick={handleLoginClick}
                  startIcon={<LoginIcon />}
                  sx={{
                    ml: 2,
                    color: scrolled ? "#453C33" : "#fff",
                    textTransform: "none",
                    fontFamily: "'Poppins', 'Roboto', sans-serif",
                    fontWeight: 500,
                    border: scrolled ? "1px solid #BEAF9B" : "1px solid rgba(255, 255, 255, 0.4)",
                    borderRadius: "8px",
                    px: 2,
                    py: 0.8,
                    backdropFilter: scrolled ? "none" : "blur(4px)",
                    textShadow: scrolled ? "none" : "0 1px 2px rgba(0,0,0,0.2)",
                    transition: "all 0.2s",
                    "&:hover": { 
                      bgcolor: scrolled ? "rgba(190, 175, 155, 0.1)" : "rgba(255, 255, 255, 0.2)",
                      borderColor: scrolled ? "#b0a08d" : "rgba(255, 255, 255, 0.6)"
                    }
                  }}
                >
                  Login
                </Button>
              )}
            </Box>
          )}

          {/* Mobile Menu Button */}
          {isMobile && (
            <IconButton 
              edge="end" 
              color="inherit" 
              onClick={toggleMobileMenu}
              sx={{ 
                color: scrolled ? "#BEAF9B" : "#fff",
                "&:hover": {
                  bgcolor: scrolled ? "rgba(190, 175, 155, 0.1)" : "rgba(255, 255, 255, 0.1)"
                }
              }}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={toggleMobileMenu}
        PaperProps={{
          sx: {
            width: 280,
            borderTopLeftRadius: 8,
            borderBottomLeftRadius: 8,
            boxShadow: "-4px 0 20px rgba(0,0,0,0.1)",
            backdropFilter: "blur(8px)",
            bgcolor: "rgba(249, 245, 240, 0.95)"
          }
        }}
      >
        {mobileDrawerContent}
      </Drawer>
    </>
  );
};

export default Navbar;