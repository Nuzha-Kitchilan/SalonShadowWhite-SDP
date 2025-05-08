import React, { memo } from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  InputAdornment
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';

const SearchAndFilter = memo(({
  searchTerm,
  setSearchTerm,
  categoryFilter,
  setCategoryFilter,
  categories,
  searchPlaceholder = "Search...",
  filterLabel = "Filter by Category"
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
          SEARCH & FILTER
        </Typography>
      </Box>

      {/* Search and Category filter */}
      <Box
        sx={{
          display: 'flex',
          gap: 2,
          marginBottom: 2,
          flexDirection: { xs: 'column', sm: 'row' }
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          label={searchPlaceholder}
          value={searchTerm ?? ''}
          onChange={(e) => {
            e.stopPropagation();
            setSearchTerm(e.target.value);
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "#BEAF9B" }} />
              </InputAdornment>
            ),
          }}
          sx={{ 
            flexGrow: 1, 
            minWidth: 200,
            '& .MuiOutlinedInput-root': {
              '&.Mui-focused fieldset': {
                borderColor: '#BEAF9B',
              },
            },
            '& .MuiInputLabel-root': {
              color: "#666",
              fontFamily: "'Poppins', 'Roboto', sans-serif"
            },
            '& .MuiInputLabel-root.Mui-focused': {
              color: '#BEAF9B',
            },
          }}
        />
        
        <FormControl 
          sx={{ 
            minWidth: 200, 
            width: { xs: '100%', sm: 'auto' },
            '& .MuiOutlinedInput-root': {
              '&.Mui-focused fieldset': {
                borderColor: '#BEAF9B',
              },
            },
            '& .MuiInputLabel-root': {
              color: "#666",
              fontFamily: "'Poppins', 'Roboto', sans-serif"
            },
            '& .MuiInputLabel-root.Mui-focused': {
              color: '#BEAF9B',
            },
          }}
        >
          <InputLabel>{filterLabel}</InputLabel>
          <Select
            value={categoryFilter ?? ''}
            onChange={(e) => setCategoryFilter(e.target.value)}
            label={filterLabel}
            sx={{
              fontFamily: "'Poppins', 'Roboto', sans-serif",
              "& .MuiMenuItem-root": {
                fontFamily: "'Poppins', 'Roboto', sans-serif"
              }
            }}
            startAdornment={
              <InputAdornment position="start">
                <FilterListIcon sx={{ color: "#BEAF9B" }} />
              </InputAdornment>
            }
          >
            <MenuItem value="" sx={{ fontFamily: "'Poppins', 'Roboto', sans-serif" }}>
              All Categories
            </MenuItem>
            {categories.map((category) => (
              <MenuItem 
                key={category.category_id} 
                value={category.category_name}
                sx={{ fontFamily: "'Poppins', 'Roboto', sans-serif" }}
              >
                {category.category_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
});

export default SearchAndFilter;