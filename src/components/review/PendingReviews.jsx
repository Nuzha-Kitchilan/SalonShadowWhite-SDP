import React, { useState } from 'react';
import {
  Table, TableHead, TableBody, TableRow, TableCell,
  TableContainer, Paper, Box, Typography, IconButton,
  TablePagination, Chip, Tooltip, Avatar, CircularProgress,
  Button
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import StarIcon from '@mui/icons-material/Star';
import moment from 'moment';

const PendingReviews = ({ reviews = [], onApprove, onDelete, loading = false }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => setPage(newPage);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Apply pagination
  const emptyRows = page > 0 
    ? Math.max(0, (1 + page) * rowsPerPage - (reviews?.length || 0)) 
    : 0;

  const visibleReviews = reviews?.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  ) || [];

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return "#66bb6a"; 
    if (rating >= 3.5) return "#BEAF9B"; 
    return "#ff6b6b"; 
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress sx={{ color: "#BEAF9B" }} />
      </Box>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <Paper 
        elevation={0}
        sx={{ 
          border: "1px solid rgba(190, 175, 155, 0.2)",
          borderRadius: "8px",
          p: 4,
          textAlign: 'center'
        }}
      >
        <Typography 
          sx={{ 
            fontFamily: "'Poppins', 'Roboto', sans-serif",
            color: "#666"
          }}
        >
          No pending reviews to display.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper 
      elevation={0}
      sx={{ 
        border: "1px solid rgba(190, 175, 155, 0.2)",
        borderRadius: "8px",
        overflow: "hidden",
        mb: 4
      }}
    >
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell 
                sx={{ 
                  fontWeight: 600, 
                  color: "#453C33",
                  fontFamily: "'Poppins', 'Roboto', sans-serif",
                  borderBottom: "2px solid rgba(190, 175, 155, 0.3)"
                }}
              >
                Customer
              </TableCell>
              <TableCell 
                sx={{ 
                  fontWeight: 600, 
                  color: "#453C33",
                  fontFamily: "'Poppins', 'Roboto', sans-serif",
                  borderBottom: "2px solid rgba(190, 175, 155, 0.3)"
                }}
              >
                Stylist
              </TableCell>
              <TableCell 
                sx={{ 
                  fontWeight: 600, 
                  color: "#453C33",
                  fontFamily: "'Poppins', 'Roboto', sans-serif",
                  borderBottom: "2px solid rgba(190, 175, 155, 0.3)"
                }}
              >
                Rating
              </TableCell>
              <TableCell 
                sx={{ 
                  fontWeight: 600, 
                  color: "#453C33",
                  fontFamily: "'Poppins', 'Roboto', sans-serif",
                  borderBottom: "2px solid rgba(190, 175, 155, 0.3)"
                }}
              >
                Review
              </TableCell>
              <TableCell 
                sx={{ 
                  fontWeight: 600, 
                  color: "#453C33",
                  fontFamily: "'Poppins', 'Roboto', sans-serif",
                  borderBottom: "2px solid rgba(190, 175, 155, 0.3)"
                }}
              >
                Date
              </TableCell>
              <TableCell 
                sx={{ 
                  fontWeight: 600, 
                  color: "#453C33",
                  fontFamily: "'Poppins', 'Roboto', sans-serif",
                  borderBottom: "2px solid rgba(190, 175, 155, 0.3)"
                }}
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleReviews.map((review) => {
              // Use the new field names from backend
              const customerName = review?.customer_name || 'Unknown Customer';
              const customerInitial = customerName.charAt(0).toUpperCase();
              const stylistName = review?.stylist_name || 'N/A';
              const stylistInitial = stylistName.charAt(0).toUpperCase();
              const reviewText = review?.review_text || 'No review text provided';
              const rating = review?.rating || 0;
              const reviewDate = review?.created_at
                ? moment(review.created_at).format('MMM D, YYYY')
                : 'N/A';
              const reviewId = review?.review_ID;
              const ratingColor = getRatingColor(rating);

              return (
                <TableRow 
                  key={reviewId || Math.random()}
                  sx={{ 
                    '&:nth-of-type(odd)': { backgroundColor: "rgba(190, 175, 155, 0.03)" },
                    '&:hover': { backgroundColor: "rgba(190, 175, 155, 0.1)" },
                    transition: "background-color 0.2s"
                  }}
                >
                  <TableCell
                    sx={{ 
                      fontFamily: "'Poppins', 'Roboto', sans-serif"
                    }}
                  >
                    <Box display="flex" alignItems="center" gap={1}>
                      <Avatar 
                        sx={{ 
                          bgcolor: "rgba(190, 175, 155, 0.8)", 
                          color: "white",
                          width: 36, 
                          height: 36,
                          fontFamily: "'Poppins', 'Roboto', sans-serif",
                          fontWeight: 500
                        }}
                      >
                        {customerInitial}
                      </Avatar>
                      <Typography
                        sx={{ 
                          fontWeight: 500,
                          color: "#453C33",
                          fontFamily: "'Poppins', 'Roboto', sans-serif"
                        }}
                      >
                        {customerName}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell
                    sx={{ 
                      fontFamily: "'Poppins', 'Roboto', sans-serif"
                    }}
                  >
                    <Box display="flex" alignItems="center" gap={1}>
                      <Avatar 
                        sx={{ 
                          bgcolor: "rgba(69, 60, 51, 0.8)", 
                          color: "white",
                          width: 36, 
                          height: 36,
                          fontFamily: "'Poppins', 'Roboto', sans-serif",
                          fontWeight: 500
                        }}
                      >
                        {stylistInitial}
                      </Avatar>
                      <Typography
                        sx={{ 
                          fontWeight: 500,
                          color: "#453C33",
                          fontFamily: "'Poppins', 'Roboto', sans-serif" 
                        }}
                      >
                        {stylistName}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell
                    sx={{ 
                      fontFamily: "'Poppins', 'Roboto', sans-serif"
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <StarIcon 
                        fontSize="small" 
                        sx={{ color: ratingColor }} 
                      />
                      <Chip 
                        label={`${rating}/5`} 
                        size="small"
                        sx={{ 
                          backgroundColor: `${ratingColor}20`,
                          color: ratingColor,
                          fontFamily: "'Poppins', 'Roboto', sans-serif",
                          fontWeight: 500
                        }}
                      />
                    </Box>
                  </TableCell>
                  <TableCell
                    sx={{ 
                      fontFamily: "'Poppins', 'Roboto', sans-serif",
                      maxWidth: 250,
                      minWidth: 200
                    }}
                  >
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: "#666", 
                        fontFamily: "'Poppins', 'Roboto', sans-serif",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {reviewText}
                    </Typography>
                  </TableCell>
                  <TableCell
                    sx={{ 
                      fontFamily: "'Poppins', 'Roboto', sans-serif",
                      color: "#666"
                    }}
                  >
                    {reviewDate}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Tooltip title="Approve Review">
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => onApprove(reviewId)}
                          startIcon={<CheckCircleOutlineIcon />}
                          sx={{ 
                            backgroundColor: "#66bb6a", 
                            color: "white",
                            fontFamily: "'Poppins', 'Roboto', sans-serif",
                            fontWeight: 500,
                            textTransform: "none",
                            boxShadow: "none",
                            "&:hover": {
                              backgroundColor: "#5aaf5a",
                              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)"
                            }
                          }}
                        >
                          Approve
                        </Button>
                      </Tooltip>
                      <Tooltip title="Delete Review">
                        <IconButton 
                          onClick={() => onDelete(reviewId)}
                          sx={{ color: "#ff6b6b" }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={reviews.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{
          borderTop: "1px solid rgba(190, 175, 155, 0.2)",
          '.MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows': {
            fontFamily: "'Poppins', 'Roboto', sans-serif",
            color: "#666"
          },
          '.MuiTablePagination-select': {
            fontFamily: "'Poppins', 'Roboto', sans-serif",
          },
          '.MuiTablePagination-actions': {
            '& .MuiIconButton-root': {
              color: "#BEAF9B"
            }
          }
        }}
      />
    </Paper>
  );
};

export default PendingReviews;