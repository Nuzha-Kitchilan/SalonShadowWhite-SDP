// import React from "react";
// import { Box, TextField, MenuItem } from "@mui/material";

// const FilterControls = ({
//   productSearch,
//   setProductSearch,
//   minQuantity,
//   setMinQuantity,
//   maxQuantity,
//   setMaxQuantity,
//   brandFilter,
//   setBrandFilter,
//   availableBrands
// }) => {
//   return (
//     <>
//       {/* Search and Quantity filters */}
//       <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, marginBottom: "16px" }}>
//         <TextField
//           label="Search by Product Name"
//           value={productSearch}
//           onChange={(e) => setProductSearch(e.target.value)}
//           sx={{ width: 220 }}
//         />

//         <Box sx={{ display: 'flex', gap: 2 }}>
//           <TextField
//             label="Min Quantity"
//             type="number"
//             value={minQuantity}
//             onChange={(e) => setMinQuantity(e.target.value)}
//             sx={{ width: 150 }}
//           />
//           <TextField
//             label="Max Quantity"
//             type="number"
//             value={maxQuantity}
//             onChange={(e) => setMaxQuantity(e.target.value)}
//             sx={{ width: 150 }}
//           />
//         </Box>
//       </Box>

//       {/* Brand filter */}
//       <TextField
//         select
//         label="Filter by Brand"
//         value={brandFilter}
//         onChange={(e) => setBrandFilter(e.target.value)}
//         fullWidth
//         margin="normal"
//         sx={{ marginBottom: "16px" }}
//       >
//         <MenuItem value="">All Brands</MenuItem>
//         {availableBrands.map((brand) => (
//           <MenuItem key={brand} value={brand}>{brand}</MenuItem>
//         ))}
//       </TextField>
//     </>
//   );
// };

// export default FilterControls;

















import React from "react";
import { Box, TextField, MenuItem, InputAdornment, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import StorefrontIcon from "@mui/icons-material/Storefront";

const FilterControls = ({
  productSearch,
  setProductSearch,
  minQuantity,
  setMinQuantity,
  maxQuantity,
  setMaxQuantity,
  brandFilter,
  setBrandFilter,
  availableBrands,
  sx
}) => {
  return (
    <Box sx={{ width: "100%" }}>
      {/* Title */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <FilterListIcon sx={{ color: "#BEAF9B", mr: 1 }} />
        <Typography 
          variant="subtitle1" 
          sx={{ 
            color: "#453C33",
            fontWeight: 500,
            fontFamily: "'Poppins', 'Roboto', sans-serif"
          }}
        >
          FILTER INVENTORY
        </Typography>
      </Box>

      {/* Search and Quantity filters */}
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
          gap: 2, 
          mb: 2,
          alignItems: { xs: 'stretch', md: 'center' }
        }}
      >
        <TextField
          label="Search by Product Name"
          value={productSearch}
          onChange={(e) => setProductSearch(e.target.value)}
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "#BEAF9B" }} />
              </InputAdornment>
            ),
          }}
          sx={{ 
            ...sx,
            flex: 2,
            "& .MuiInputLabel-root": {
              color: "#666",
              fontFamily: "'Poppins', 'Roboto', sans-serif"
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: "#BEAF9B",
            }
          }}
        />

        <Box 
          sx={{ 
            display: 'flex', 
            gap: 2, 
            flex: 1,
            flexDirection: { xs: 'column', sm: 'row' }
          }}
        >
          <TextField
            label="Min Quantity"
            type="number"
            value={minQuantity}
            onChange={(e) => setMinQuantity(e.target.value)}
            fullWidth
            sx={{ 
              ...sx,
              "& .MuiInputLabel-root": {
                color: "#666",
                fontFamily: "'Poppins', 'Roboto', sans-serif"
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "#BEAF9B",
              }
            }}
          />
          <TextField
            label="Max Quantity"
            type="number"
            value={maxQuantity}
            onChange={(e) => setMaxQuantity(e.target.value)}
            fullWidth
            sx={{ 
              ...sx,
              "& .MuiInputLabel-root": {
                color: "#666",
                fontFamily: "'Poppins', 'Roboto', sans-serif"
              },
              "& .MuiInputLabel-root.Mui-focused": {
                color: "#BEAF9B",
              }
            }}
          />
        </Box>
      </Box>

      {/* Brand filter */}
      <TextField
        select
        label="Filter by Brand"
        value={brandFilter}
        onChange={(e) => setBrandFilter(e.target.value)}
        fullWidth
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <StorefrontIcon sx={{ color: "#BEAF9B" }} />
            </InputAdornment>
          ),
        }}
        sx={{ 
          ...sx,
          "& .MuiInputLabel-root": {
            color: "#666",
            fontFamily: "'Poppins', 'Roboto', sans-serif"
          },
          "& .MuiInputLabel-root.Mui-focused": {
            color: "#BEAF9B",
          },
          "& .MuiMenuItem-root": {
            fontFamily: "'Poppins', 'Roboto', sans-serif"
          }
        }}
      >
        <MenuItem value="" sx={{ fontFamily: "'Poppins', 'Roboto', sans-serif" }}>
          All Brands
        </MenuItem>
        {availableBrands.map((brand) => (
          <MenuItem 
            key={brand} 
            value={brand}
            sx={{ fontFamily: "'Poppins', 'Roboto', sans-serif" }}
          >
            {brand}
          </MenuItem>
        ))}
      </TextField>
    </Box>
  );
};

export default FilterControls;