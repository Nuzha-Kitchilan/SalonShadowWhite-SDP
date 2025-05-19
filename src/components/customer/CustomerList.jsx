import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Button, 
  CircularProgress, 
  Typography, 
  Pagination, 
  Box,
  Stack,
  Tooltip,
  alpha
} from '@mui/material';
import { 
  Visibility as VisibilityIcon, 
  Delete as DeleteIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  AccountCircle as AccountCircleIcon,
  DirectionsWalk as DirectionsWalkIcon,
  Tag as TagIcon,
  PeopleOutline as PeopleOutlineIcon
} from '@mui/icons-material';

const CustomerList = ({ 
  customers = [],          // Default to empty array
  loading = false,         // Default to false
  currentPage = 1,         // Default to page 1
  totalPages = 1,          // Default to 1 page
  onPageChange = () => {}, // Default no-op functions
  onSelectCustomer = () => {},
  onDeleteCustomer = () => {}
}) => {
  // Format date to YYYY-MM-DD
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date) ? '' : date.toISOString().split('T')[0];
  };
  
  return (
    <Box sx={{ mb: 4 }}>
      <Box 
        sx={{ 
          mb: 3, 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1.5 
        }}
      >
        <PeopleOutlineIcon sx={{ color: "#BEAF9B" }} />
        <Typography 
          variant="h6" 
          component="h2" 
          sx={{ 
            color: "#453C33", 
            fontFamily: "'Poppins', 'Roboto', sans-serif",
            fontWeight: 600,
          }}
        >
          Customer Directory
        </Typography>
      </Box>
      
      {loading ? (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          py: 6,
          backgroundColor: "rgba(190, 175, 155, 0.05)",
          borderRadius: "10px",
        }}>
          <CircularProgress sx={{ color: "#BEAF9B" }} />
        </Box>
      ) : customers.length === 0 ? (
        <Box 
          sx={{ 
            textAlign: 'center', 
            py: 5,
            backgroundColor: "rgba(190, 175, 155, 0.05)",
            borderRadius: "10px",
          }}
        >
          <Typography 
            sx={{ 
              color: "#5D4037", 
              fontFamily: "'Poppins', 'Roboto', sans-serif",
              fontWeight: 500,
            }}
          >
            No customers found.
          </Typography>
        </Box>
      ) : (
        <>
          <TableContainer 
            component={Paper} 
            elevation={1} 
            sx={{ 
              mb: 3, 
              borderRadius: "10px",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.06)",
              overflow: 'hidden',
            }}
          >
            <Table aria-label="customer table">
              <TableHead>
                <TableRow sx={{ backgroundColor: "rgba(190, 175, 155, 0.05)" }}>
                  <TableCell 
                    sx={{ 
                      fontFamily: "'Poppins', 'Roboto', sans-serif", 
                      fontWeight: 600,
                      color: "#5D4037",
                      borderBottom: "1px solid rgba(190, 175, 155, 0.2)",
                      py: 2
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <TagIcon sx={{ color: "#BEAF9B", fontSize: 18 }} />
                      ID
                    </Box>
                  </TableCell>
                  <TableCell 
                    sx={{ 
                      fontFamily: "'Poppins', 'Roboto', sans-serif", 
                      fontWeight: 600,
                      color: "#5D4037",
                      borderBottom: "1px solid rgba(190, 175, 155, 0.2)",
                      py: 2
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <PersonIcon sx={{ color: "#BEAF9B", fontSize: 18 }} />
                      Name
                    </Box>
                  </TableCell>
                  <TableCell 
                    sx={{ 
                      fontFamily: "'Poppins', 'Roboto', sans-serif", 
                      fontWeight: 600,
                      color: "#5D4037",
                      borderBottom: "1px solid rgba(190, 175, 155, 0.2)",
                      py: 2
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <EmailIcon sx={{ color: "#BEAF9B", fontSize: 18 }} />
                      Email
                    </Box>
                  </TableCell>
                  <TableCell 
                    sx={{ 
                      fontFamily: "'Poppins', 'Roboto', sans-serif", 
                      fontWeight: 600,
                      color: "#5D4037",
                      borderBottom: "1px solid rgba(190, 175, 155, 0.2)",
                      py: 2
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AccountCircleIcon sx={{ color: "#BEAF9B", fontSize: 18 }} />
                      Username
                    </Box>
                  </TableCell>
                  <TableCell 
                    sx={{ 
                      fontFamily: "'Poppins', 'Roboto', sans-serif", 
                      fontWeight: 600,
                      color: "#5D4037",
                      borderBottom: "1px solid rgba(190, 175, 155, 0.2)",
                      py: 2
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <DirectionsWalkIcon sx={{ color: "#BEAF9B", fontSize: 18 }} />
                      Walk-in
                    </Box>
                  </TableCell>
                  <TableCell 
                    sx={{ 
                      fontFamily: "'Poppins', 'Roboto', sans-serif", 
                      fontWeight: 600,
                      color: "#5D4037",
                      borderBottom: "1px solid rgba(190, 175, 155, 0.2)",
                      py: 2,
                      textAlign: 'center'
                    }}
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {customers.map((customer) => (
                  <TableRow 
                    key={customer.customer_ID}
                    sx={{ 
                      '&:last-child td': { border: 0 },
                      '&:hover': {
                        backgroundColor: "rgba(190, 175, 155, 0.03)",
                      },
                    }}
                  >
                    <TableCell 
                      component="th" 
                      scope="row"
                      sx={{ 
                        fontFamily: "'Poppins', 'Roboto', sans-serif",
                        color: "#5D4037",
                        borderBottom: "1px solid rgba(190, 175, 155, 0.1)",
                        py: 2
                      }}
                    >
                      {customer.customer_ID}
                    </TableCell>
                    <TableCell
                      sx={{ 
                        fontFamily: "'Poppins', 'Roboto', sans-serif",
                        color: "#5D4037",
                        fontWeight: 500,
                        borderBottom: "1px solid rgba(190, 175, 155, 0.1)",
                        py: 2
                      }}
                    >
                      {`${customer.firstname || ''} ${customer.lastname || ''}`}
                    </TableCell>
                    <TableCell
                      sx={{ 
                        fontFamily: "'Poppins', 'Roboto', sans-serif",
                        color: "#5D4037",
                        borderBottom: "1px solid rgba(190, 175, 155, 0.1)",
                        py: 2
                      }}
                    >
                      {customer.email || ''}
                    </TableCell>
                    <TableCell
                      sx={{ 
                        fontFamily: "'Poppins', 'Roboto', sans-serif",
                        color: "#5D4037",
                        borderBottom: "1px solid rgba(190, 175, 155, 0.1)",
                        py: 2
                      }}
                    >
                      {customer.username || ''}
                    </TableCell>
                    <TableCell
                      sx={{ 
                        fontFamily: "'Poppins', 'Roboto', sans-serif",
                        color: "#5D4037",
                        borderBottom: "1px solid rgba(190, 175, 155, 0.1)",
                        py: 2
                      }}
                    >
                      <Box 
                        sx={{ 
                          display: 'inline-block',
                          px: 1.5,
                          py: 0.5,
                          borderRadius: "12px",
                          backgroundColor: customer.is_walk_in 
                            ? "rgba(46, 125, 50, 0.1)" 
                            : "rgba(190, 175, 155, 0.1)",
                          color: customer.is_walk_in ? "#2E7D32" : "#5D4037",
                          fontWeight: 500,
                          fontSize: "0.75rem",
                        }}
                      >
                        {customer.is_walk_in ? 'Yes' : 'No'}
                      </Box>
                    </TableCell>
                    <TableCell
                      sx={{ 
                        borderBottom: "1px solid rgba(190, 175, 155, 0.1)",
                        py: 1.5,
                        textAlign: 'center'
                      }}
                    >
                      <Stack direction="row" spacing={1} justifyContent="center">
                        <Tooltip title="View Details" arrow placement="top">
                          <Button
                            size="small"
                            variant="contained"
                            onClick={() => onSelectCustomer(customer)}
                            aria-label="View details"
                            sx={{
                              minWidth: '36px',
                              height: '36px',
                              p: 0,
                              backgroundColor: "#BEAF9B",
                              color: "#fff",
                              borderRadius: "8px",
                              boxShadow: "0 2px 8px rgba(190, 175, 155, 0.3)",
                              '&:hover': {
                                backgroundColor: "#A89683",
                                boxShadow: "0 4px 10px rgba(190, 175, 155, 0.4)",
                              }
                            }}
                          >
                            <VisibilityIcon fontSize="small" />
                          </Button>
                        </Tooltip>
                        <Tooltip title="Delete Customer" arrow placement="top">
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => onDeleteCustomer(customer.customer_ID)}
                            aria-label="Delete customer"
                            sx={{
                              minWidth: '36px',
                              height: '36px',
                              p: 0,
                              borderColor: alpha("#FF5252", 0.5),
                              color: "#FF5252",
                              borderRadius: "8px",
                              '&:hover': {
                                borderColor: "#FF5252",
                                backgroundColor: alpha("#FF5252", 0.04),
                              }
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </Button>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination 
                count={totalPages} 
                page={currentPage} 
                onChange={(event, value) => onPageChange(value)}
                sx={{
                  '& .MuiPaginationItem-root': {
                    fontFamily: "'Poppins', 'Roboto', sans-serif",
                    color: "#5D4037",
                  },
                  '& .MuiPaginationItem-root.Mui-selected': {
                    backgroundColor: "rgba(190, 175, 155, 0.2)",
                    color: "#5D4037",
                    fontWeight: 600,
                    '&:hover': {
                      backgroundColor: "rgba(190, 175, 155, 0.3)",
                    }
                  },
                  '& .MuiPaginationItem-root:hover': {
                    backgroundColor: "rgba(190, 175, 155, 0.1)",
                  }
                }}
                showFirstButton
                showLastButton
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default CustomerList;