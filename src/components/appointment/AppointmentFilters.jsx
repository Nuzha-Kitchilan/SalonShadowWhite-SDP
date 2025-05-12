import React from 'react';
import {
  Box, TextField, Button, Grid, InputAdornment,
  Typography, CircularProgress, Divider
} from "@mui/material";
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  FilterList as FilterListIcon
} from "@mui/icons-material";

export default function AppointmentFilters({
  searchParams,
  handleSearchInputChange,
  handleSearch,
  clearSearch,
  isSearching
}) {
  return (
    <Box 
      sx={{ 
        mb: 3, 
        p: 3, 
        borderRadius: "8px",
        overflow: "hidden",
        boxShadow: "0 2px 8px rgba(190, 175, 155, 0.2)",
        border: "1px solid rgba(190, 175, 155, 0.3)",
        background: "linear-gradient(to right, #f9f5f0, #ffffff)",
        transition: "box-shadow 0.3s ease",
        "&:hover": {
          boxShadow: "0 4px 12px rgba(190, 175, 155, 0.3)",
        },
      }}
    >
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: 2.5 
        }}
      >
        <FilterListIcon 
          sx={{ 
            mr: 1.5, 
            color: "#BEAF9B" 
          }} 
        />
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 500, 
            color: "#453C33",
            fontFamily: "'Poppins', 'Roboto', sans-serif",
          }}
        >
          Search Appointments
        </Typography>
        <Divider 
          orientation="vertical" 
          flexItem 
          sx={{ 
            mx: 2, 
            borderColor: "rgba(190, 175, 155, 0.3)" 
          }} 
        />
        <Typography 
          variant="body2" 
          sx={{ 
            color: "text.secondary",
            fontStyle: "italic"
          }}
        >
          Filter appointment records by ID, date, or customer name
        </Typography>
      </Box>
      
      <Grid container spacing={2.5} alignItems="center">
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            label="Appointment ID"
            name="appointmentId"
            value={searchParams.appointmentId}
            onChange={handleSearchInputChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon 
                    fontSize="small" 
                    sx={{ color: "#BEAF9B" }}
                  />
                </InputAdornment>
              ),
            }}
            size="small"
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'rgba(190, 175, 155, 0.3)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(190, 175, 155, 0.5)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#BEAF9B',
                },
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#BEAF9B',
              },
            }}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            label="Date"
            name="date"
            type="date"
            value={searchParams.date}
            onChange={handleSearchInputChange}
            InputLabelProps={{ 
              shrink: true,
            }}
            size="small"
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'rgba(190, 175, 155, 0.3)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(190, 175, 155, 0.5)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#BEAF9B',
                },
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#BEAF9B',
              },
            }}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            label="Customer Name"
            name="customerName"
            value={searchParams.customerName}
            onChange={handleSearchInputChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon 
                    fontSize="small" 
                    sx={{ color: "#BEAF9B" }}
                  />
                </InputAdornment>
              ),
            }}
            size="small"
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'rgba(190, 175, 155, 0.3)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(190, 175, 155, 0.5)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#BEAF9B',
                },
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: '#BEAF9B',
              },
            }}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="contained"
              onClick={handleSearch}
              disabled={isSearching}
              startIcon={isSearching ? <CircularProgress size={20} color="inherit" /> : <SearchIcon />}
              sx={{ 
                flexGrow: 1,
                backgroundColor: "#BEAF9B", 
                color: "white", 
                fontFamily: "'Poppins', 'Roboto', sans-serif",
                fontWeight: 500,
                boxShadow: "0 2px 6px rgba(190, 175, 155, 0.3)",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                '&:hover': { 
                  backgroundColor: "#A89583",
                  transform: "translateY(-2px)",
                  boxShadow: "0 4px 10px rgba(190, 175, 155, 0.4)"
                },
                '&.Mui-disabled': {
                  backgroundColor: "rgba(190, 175, 155, 0.4)",
                  color: "rgba(255, 255, 255, 0.8)"
                }
              }}
            >
              {isSearching ? 'Searching...' : 'Search'}
            </Button>
            <Button
              variant="outlined"
              onClick={clearSearch}
              startIcon={<ClearIcon />}
              sx={{ 
                borderColor: "rgba(190, 175, 155, 0.5)", 
                color: "#BEAF9B",
                fontFamily: "'Poppins', 'Roboto', sans-serif",
                fontWeight: 500,
                '&:hover': { 
                  backgroundColor: "rgba(190, 175, 155, 0.05)",
                  borderColor: "#BEAF9B"
                } 
              }}
            >
              Clear
            </Button>
          </Box>
        </Grid>
      </Grid>
      
      <Box 
        sx={{ 
          mt: 2, 
          pt: 1.5, 
          borderTop: "1px dashed rgba(190, 175, 155, 0.2)",
          display: "flex",
          justifyContent: "flex-end"
        }}
      >
        <Typography 
          variant="caption" 
          sx={{ 
            color: "text.secondary",
            fontStyle: "italic"
          }}
        >
          Fill any field and click Search to filter results
        </Typography>
      </Box>
    </Box>
  );
}

















// import React, { useState } from 'react';
// import {
//   Box, TextField, Button, Grid, InputAdornment,
//   Typography, CircularProgress, Divider
// } from "@mui/material";
// import {
//   Search as SearchIcon,
//   Clear as ClearIcon,
//   FilterList as FilterListIcon
// } from "@mui/icons-material";

// export default function AppointmentFilters() {
//   // Local state to track input values
//   const [searchParams, setSearchParams] = useState({
//     appointmentId: '',
//     date: '',
//     customerName: ''
//   });
//   const [isSearching, setIsSearching] = useState(false);
//   const [results, setResults] = useState(null);

//   // Handle input changes without triggering search
//   const handleSearchInputChange = (e) => {
//     const { name, value } = e.target;
//     setSearchParams(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   // Handle key press for Enter key
//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter') {
//       e.preventDefault(); // Prevent default behavior
//       handleSearch();
//     }
//   };

//   // Handle search only when button is clicked
//   const handleSearch = () => {
//     setIsSearching(true);
//     // Simulate API call
//     setTimeout(() => {
//       setResults(`Results found for: ${JSON.stringify(searchParams)}`);
//       setIsSearching(false);
//     }, 800);
//   };

//   // Clear search fields
//   const clearSearch = () => {
//     setSearchParams({
//       appointmentId: '',
//       date: '',
//       customerName: ''
//     });
//     setResults(null);
//   };

//   return (
//     <Box 
//       sx={{ 
//         mb: 3, 
//         p: 3, 
//         borderRadius: "8px",
//         overflow: "hidden",
//         boxShadow: "0 2px 8px rgba(190, 175, 155, 0.2)",
//         border: "1px solid rgba(190, 175, 155, 0.3)",
//         background: "linear-gradient(to right, #f9f5f0, #ffffff)",
//         transition: "box-shadow 0.3s ease",
//         "&:hover": {
//           boxShadow: "0 4px 12px rgba(190, 175, 155, 0.3)",
//         },
//       }}
//     >
//       <Box 
//         sx={{ 
//           display: 'flex', 
//           alignItems: 'center', 
//           mb: 2.5 
//         }}
//       >
//         <FilterListIcon 
//           sx={{ 
//             mr: 1.5, 
//             color: "#BEAF9B" 
//           }} 
//         />
//         <Typography 
//           variant="h6" 
//           sx={{ 
//             fontWeight: 500, 
//             color: "#453C33",
//             fontFamily: "'Poppins', 'Roboto', sans-serif",
//           }}
//         >
//           Search Appointments
//         </Typography>
//         <Divider 
//           orientation="vertical" 
//           flexItem 
//           sx={{ 
//             mx: 2, 
//             borderColor: "rgba(190, 175, 155, 0.3)" 
//           }} 
//         />
//         <Typography 
//           variant="body2" 
//           sx={{ 
//             color: "text.secondary",
//             fontStyle: "italic"
//           }}
//         >
//           Filter appointment records by ID, date, or customer name
//         </Typography>
//       </Box>
      
//       <Grid container spacing={2.5} alignItems="center">
//         <Grid item xs={12} sm={3}>
//           <TextField
//             fullWidth
//             label="Appointment ID"
//             name="appointmentId"
//             value={searchParams.appointmentId}
//             onChange={handleSearchInputChange}
//             onKeyPress={handleKeyPress}
//             InputProps={{
//               startAdornment: (
//                 <InputAdornment position="start">
//                   <SearchIcon 
//                     fontSize="small" 
//                     sx={{ color: "#BEAF9B" }}
//                   />
//                 </InputAdornment>
//               ),
//             }}
//             size="small"
//             sx={{
//               '& .MuiOutlinedInput-root': {
//                 '& fieldset': {
//                   borderColor: 'rgba(190, 175, 155, 0.3)',
//                 },
//                 '&:hover fieldset': {
//                   borderColor: 'rgba(190, 175, 155, 0.5)',
//                 },
//                 '&.Mui-focused fieldset': {
//                   borderColor: '#BEAF9B',
//                 },
//               },
//               '& .MuiInputLabel-root.Mui-focused': {
//                 color: '#BEAF9B',
//               },
//             }}
//           />
//         </Grid>
//         <Grid item xs={12} sm={3}>
//           <TextField
//             fullWidth
//             label="Date"
//             name="date"
//             type="date"
//             value={searchParams.date}
//             onChange={handleSearchInputChange}
//             onKeyPress={handleKeyPress}
//             InputLabelProps={{ 
//               shrink: true,
//             }}
//             size="small"
//             sx={{
//               '& .MuiOutlinedInput-root': {
//                 '& fieldset': {
//                   borderColor: 'rgba(190, 175, 155, 0.3)',
//                 },
//                 '&:hover fieldset': {
//                   borderColor: 'rgba(190, 175, 155, 0.5)',
//                 },
//                 '&.Mui-focused fieldset': {
//                   borderColor: '#BEAF9B',
//                 },
//               },
//               '& .MuiInputLabel-root.Mui-focused': {
//                 color: '#BEAF9B',
//               },
//             }}
//           />
//         </Grid>
//         <Grid item xs={12} sm={3}>
//           <TextField
//             fullWidth
//             label="Customer Name"
//             name="customerName"
//             value={searchParams.customerName}
//             onChange={handleSearchInputChange}
//             onKeyPress={handleKeyPress}
//             InputProps={{
//               startAdornment: (
//                 <InputAdornment position="start">
//                   <SearchIcon 
//                     fontSize="small" 
//                     sx={{ color: "#BEAF9B" }}
//                   />
//                 </InputAdornment>
//               ),
//             }}
//             size="small"
//             sx={{
//               '& .MuiOutlinedInput-root': {
//                 '& fieldset': {
//                   borderColor: 'rgba(190, 175, 155, 0.3)',
//                 },
//                 '&:hover fieldset': {
//                   borderColor: 'rgba(190, 175, 155, 0.5)',
//                 },
//                 '&.Mui-focused fieldset': {
//                   borderColor: '#BEAF9B',
//                 },
//               },
//               '& .MuiInputLabel-root.Mui-focused': {
//                 color: '#BEAF9B',
//               },
//             }}
//           />
//         </Grid>
//         <Grid item xs={12} sm={3}>
//           <Box sx={{ display: 'flex', gap: 1 }}>
//             <Button
//               variant="contained"
//               onClick={handleSearch}
//               disabled={isSearching}
//               startIcon={isSearching ? <CircularProgress size={20} color="inherit" /> : <SearchIcon />}
//               sx={{ 
//                 flexGrow: 1,
//                 backgroundColor: "#BEAF9B", 
//                 color: "white", 
//                 fontFamily: "'Poppins', 'Roboto', sans-serif",
//                 fontWeight: 500,
//                 boxShadow: "0 2px 6px rgba(190, 175, 155, 0.3)",
//                 transition: "transform 0.3s ease, box-shadow 0.3s ease",
//                 '&:hover': { 
//                   backgroundColor: "#A89583",
//                   transform: "translateY(-2px)",
//                   boxShadow: "0 4px 10px rgba(190, 175, 155, 0.4)"
//                 },
//                 '&.Mui-disabled': {
//                   backgroundColor: "rgba(190, 175, 155, 0.4)",
//                   color: "rgba(255, 255, 255, 0.8)"
//                 }
//               }}
//             >
//               {isSearching ? 'Searching...' : 'Search'}
//             </Button>
//             <Button
//               variant="outlined"
//               onClick={clearSearch}
//               startIcon={<ClearIcon />}
//               sx={{ 
//                 borderColor: "rgba(190, 175, 155, 0.5)", 
//                 color: "#BEAF9B",
//                 fontFamily: "'Poppins', 'Roboto', sans-serif",
//                 fontWeight: 500,
//                 '&:hover': { 
//                   backgroundColor: "rgba(190, 175, 155, 0.05)",
//                   borderColor: "#BEAF9B"
//                 } 
//               }}
//             >
//               Clear
//             </Button>
//           </Box>
//         </Grid>
//       </Grid>
      
//       <Box 
//         sx={{ 
//           mt: 2, 
//           pt: 1.5, 
//           borderTop: "1px dashed rgba(190, 175, 155, 0.2)",
//           display: "flex",
//           justifyContent: "flex-end"
//         }}
//       >
//         <Typography 
//           variant="caption" 
//           sx={{ 
//             color: "text.secondary",
//             fontStyle: "italic"
//           }}
//         >
//           Fill any field and press Enter or click Search to filter results
//         </Typography>
//       </Box>

//       {results && (
//         <Box
//           sx={{
//             mt: 3,
//             p: 2,
//             borderRadius: "6px",
//             backgroundColor: "rgba(190, 175, 155, 0.1)",
//             border: "1px solid rgba(190, 175, 155, 0.2)"
//           }}
//         >
//           <Typography 
//             variant="subtitle2"
//             sx={{ 
//               color: "#7D6E5D",
//               mb: 1,
//               fontWeight: 600
//             }}
//           >
//             Search Results
//           </Typography>
//           <Typography variant="body2">
//             {results}
//           </Typography>
//         </Box>
//       )}
//     </Box>
//   );
// }

