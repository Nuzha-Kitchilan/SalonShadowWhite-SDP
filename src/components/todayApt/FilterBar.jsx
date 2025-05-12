import { 
  Grid, 
  TextField, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Box, 
  Typography, 
  Divider,
  InputAdornment 
} from "@mui/material";
import { FilterList as FilterListIcon, Event as EventIcon } from "@mui/icons-material";

export default function FilterBar({ filters, handleFilterChange, stylists }) {
  return (
    <Box 
      sx={{ 
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
          Filter Appointments
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
          Select date and stylist to filter appointments
        </Typography>
      </Box>

      <Grid container spacing={2.5} alignItems="center">
        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Date"
            type="date"
            name="date"
            value={filters.date}
            onChange={handleFilterChange}
            InputLabelProps={{ shrink: true }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EventIcon 
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
        <Grid item xs={12} md={6}>
          <FormControl 
            fullWidth 
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
          >
            <InputLabel>Stylist</InputLabel>
            <Select
              name="stylistId"
              value={filters.stylistId}
              onChange={handleFilterChange}
              label="Stylist"
            >
              <MenuItem value="">All Stylists</MenuItem>
              {stylists.map(stylist => (
                <MenuItem key={stylist.stylist_ID} value={stylist.stylist_ID}>
                  {stylist.firstname} {stylist.lastname}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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
          Select options to filter today's appointments
        </Typography>
      </Box>
    </Box>
  );
}