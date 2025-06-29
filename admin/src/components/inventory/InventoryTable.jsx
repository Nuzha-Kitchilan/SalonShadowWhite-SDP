import React, { useState } from "react";
import {
  Table, TableHead, TableBody, TableRow, TableCell, TableContainer,
  Paper, IconButton, TablePagination, Box, Chip, Typography, Tooltip
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import EventIcon from "@mui/icons-material/Event";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";

const InventoryTable = ({ inventory, onEdit, onDelete, tableSx, buttonSx }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Intl.DateTimeFormat("en-US", { 
      year: "numeric", 
      month: "short", 
      day: "2-digit" 
    }).format(new Date(dateString));
  };

const formatCurrency = (price) => {
  if (price === undefined || price === null) return "Rs. 0.00";
  return `Rs. ${new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price)}`;
};

  const isExpiringSoon = (expireDate) => {
    if (!expireDate) return false;
    
    const today = new Date();
    const expiry = new Date(expireDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays <= 30 && diffDays > 0;
  };

  const isExpired = (expireDate) => {
    if (!expireDate) return false;
    
    const today = new Date();
    const expiry = new Date(expireDate);
    return expiry < today;
  };

  const getLowStockStatus = (quantity) => {
    if (quantity <= 5) return "low";
    if (quantity <= 10) return "medium";
    return "good";
  };

  // Apply pagination to the inventory data
  const emptyRows = page > 0 
    ? Math.max(0, (1 + page) * rowsPerPage - inventory.length) 
    : 0;

  const visibleRows = inventory.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Paper 
      elevation={0}
      sx={{ 
        border: "1px solid rgba(190, 175, 155, 0.2)",
        borderRadius: "8px",
        overflow: "hidden",
        ...tableSx
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
                ID
              </TableCell>
              <TableCell 
                sx={{ 
                  fontWeight: 600, 
                  color: "#453C33",
                  fontFamily: "'Poppins', 'Roboto', sans-serif",
                  borderBottom: "2px solid rgba(190, 175, 155, 0.3)"
                }}
              >
                Product Name
              </TableCell>
              <TableCell 
                sx={{ 
                  fontWeight: 600, 
                  color: "#453C33",
                  fontFamily: "'Poppins', 'Roboto', sans-serif",
                  borderBottom: "2px solid rgba(190, 175, 155, 0.3)"
                }}
              >
                Brand
              </TableCell>
              <TableCell 
                sx={{ 
                  fontWeight: 600, 
                  color: "#453C33",
                  fontFamily: "'Poppins', 'Roboto', sans-serif",
                  borderBottom: "2px solid rgba(190, 175, 155, 0.3)"
                }}
              >
                Quantity
              </TableCell>
              <TableCell 
                sx={{ 
                  fontWeight: 600, 
                  color: "#453C33",
                  fontFamily: "'Poppins', 'Roboto', sans-serif",
                  borderBottom: "2px solid rgba(190, 175, 155, 0.3)"
                }}
              >
                Price
              </TableCell>
              <TableCell 
                sx={{ 
                  fontWeight: 600, 
                  color: "#453C33",
                  fontFamily: "'Poppins', 'Roboto', sans-serif",
                  borderBottom: "2px solid rgba(190, 175, 155, 0.3)"
                }}
              >
                Dates
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
            {visibleRows.map((item) => {
              const stockStatus = getLowStockStatus(item.quantity);
              const expired = isExpired(item.expire_date);
              const expiringSoon = isExpiringSoon(item.expire_date);
              
              return (
                <TableRow 
                  key={item.inventory_id}
                  sx={{ 
                    '&:nth-of-type(odd)': { backgroundColor: "rgba(190, 175, 155, 0.03)" },
                    '&:hover': { backgroundColor: "rgba(190, 175, 155, 0.1)" },
                    transition: "background-color 0.2s"
                  }}
                >
                  <TableCell
                    sx={{ 
                      fontFamily: "'Poppins', 'Roboto', sans-serif",
                      color: "#666"
                    }}
                  >
                    {item.inventory_id}
                  </TableCell>
                  <TableCell
                    sx={{ 
                      fontFamily: "'Poppins', 'Roboto', sans-serif",
                      fontWeight: 500,
                      color: "#453C33"
                    }}
                  >
                    {item.product_name}
                  </TableCell>
                  <TableCell
                    sx={{ 
                      fontFamily: "'Poppins', 'Roboto', sans-serif",
                      color: "#666"
                    }}
                  >
                    <Chip 
                      label={item.brand} 
                      size="small"
                      sx={{ 
                        backgroundColor: "rgba(190, 175, 155, 0.2)",
                        color: "#453C33",
                        fontFamily: "'Poppins', 'Roboto', sans-serif",
                        fontWeight: 500
                      }}
                    />
                  </TableCell>
                  <TableCell
                    sx={{ 
                      fontFamily: "'Poppins', 'Roboto', sans-serif"
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography
                        sx={{ 
                          fontWeight: 500,
                          color: stockStatus === "low" ? "#ff6b6b" : 
                                 stockStatus === "medium" ? "#ffaa5a" : "#453C33",
                          fontFamily: "'Poppins', 'Roboto', sans-serif"
                        }}
                      >
                        {item.quantity}
                      </Typography>
                      
                      {stockStatus === "low" && (
                        <Tooltip title="Low stock alert">
                          <PriorityHighIcon 
                            fontSize="small"
                            sx={{ color: "#ff6b6b" }}
                          />
                        </Tooltip>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell
                    sx={{ 
                      fontFamily: "'Poppins', 'Roboto', sans-serif",
                      color: "#453C33",
                      fontWeight: 500
                    }}
                  >
                    {formatCurrency(item.price)}
                  </TableCell>
                  <TableCell
                    sx={{ 
                      fontFamily: "'Poppins', 'Roboto', sans-serif"
                    }}
                  >
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <EventIcon sx={{ fontSize: 14, color: "#666" }} />
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: "#666", 
                            fontFamily: "'Poppins', 'Roboto', sans-serif" 
                          }}
                        >
                          Made: {formatDate(item.manufacture_date)}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <EventIcon sx={{ 
                          fontSize: 14, 
                          color: expired ? "#ff6b6b" : 
                                 expiringSoon ? "#ffaa5a" : "#666" 
                        }} />
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: expired ? "#ff6b6b" : 
                                   expiringSoon ? "#ffaa5a" : "#666",
                            fontFamily: "'Poppins', 'Roboto', sans-serif",
                            fontWeight: expired || expiringSoon ? 500 : 400
                          }}
                        >
                          Exp: {formatDate(item.expire_date)}
                          {expired && " (Expired)"}
                          {expiringSoon && " (Soon)"}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex' }}>
                      <Tooltip title="Edit Item">
                        <IconButton 
                          onClick={() => onEdit(item)} 
                          sx={buttonSx?.edit || { color: "#BEAF9B" }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Item">
                        <IconButton 
                          onClick={() => onDelete(item)} 
                          sx={buttonSx?.delete || { color: "#ff6b6b" }}
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
                <TableCell colSpan={7} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={inventory.length}
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

export default InventoryTable;