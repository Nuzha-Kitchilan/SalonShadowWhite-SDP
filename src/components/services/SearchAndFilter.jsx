import React, { memo } from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';

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
        placeholder={searchPlaceholder}
        value={searchTerm ?? ''}
        onChange={(e) => {
          e.stopPropagation(); // prevent event propagation just in case
          setSearchTerm(e.target.value);
        }}
        sx={{ flexGrow: 1, minWidth: 200 }}
      />
      <FormControl sx={{ minWidth: 200, width: { xs: '100%', sm: 'auto' } }}>
        <InputLabel>{filterLabel}</InputLabel>
        <Select
          value={categoryFilter ?? ''}
          onChange={(e) => setCategoryFilter(e.target.value)}
          label={filterLabel}
        >
          <MenuItem value="">All Categories</MenuItem>
          {categories.map((category) => (
            <MenuItem key={category.category_id} value={category.category_name}>
              {category.category_name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
});

export default SearchAndFilter;
