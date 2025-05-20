import React from 'react';
import { 
  Box, Button, Grid, Paper, FormControl, 
  InputLabel, Select, MenuItem, CircularProgress,
  Typography, TextField, IconButton
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { 
  BarChart, Download, CalendarMonth, 
  Assessment, CategoryOutlined, ArrowBack 
} from '@mui/icons-material';

export const ReportForm = ({
  reportConfig,
  setReportConfig,
  loading,
  handlePreview,
  handleDownload,
  previewData,
  reportTypes,
  groupByOptions,
  onClose
}) => {
  return (
    <Paper 
      elevation={0}
      sx={{
        borderRadius: "10px",
        overflow: "hidden",
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
        mb: 3
      }}
    >
      {/* Header */}
      <Box sx={{ 
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        p: 3,
        borderBottom: "1px solid rgba(190, 175, 155, 0.2)",
        background: "rgba(190, 175, 155, 0.05)"
      }}>
        <Box sx={{ 
          display: "flex", 
          alignItems: "center",
          gap: 1
        }}>
          {onClose && (
            <IconButton
              sx={{
                color: "#BEAF9B",
                "&:hover": {
                  backgroundColor: "rgba(190, 175, 155, 0.1)",
                  transform: "scale(1.05)",
                  transition: "all 0.2s",
                },
              }}
              onClick={onClose}
            >
              <ArrowBack />
            </IconButton>
          )}
          <Typography 
            variant="h5" 
            sx={{ 
              fontFamily: "'Poppins', 'Roboto', sans-serif",
              fontWeight: 600,
              color: "#453C33"
            }}
          >
            Generate Reports
          </Typography>
        </Box>
      </Box>

      {/* Message */}
      <Box 
        sx={{ 
          p: 2, 
          backgroundColor: "rgba(190, 175, 155, 0.05)",
          borderBottom: "1px solid rgba(190, 175, 155, 0.1)",
        }}
      >
        <Typography 
          variant="body2" 
          sx={{ 
            color: "#666", 
            fontStyle: "italic",
            textAlign: "center",
            fontFamily: "'Poppins', 'Roboto', sans-serif"
          }}
        >
          Configure your report parameters below
        </Typography>
      </Box>

      {/* Form Content */}
      <Box sx={{ p: 3, bgcolor: "#fff" }}>
        {/* Single Row for All Parameters */}
        <Box sx={{ mb: 3 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: "8px",
              border: "1px solid rgba(190, 175, 155, 0.2)",
              bgcolor: "rgba(190, 175, 155, 0.02)",
            }}
          >
            <Box sx={{ 
              display: "flex",
              flexDirection: { xs: "column", lg: "row" },
              gap: 2,
              alignItems: "stretch"
            }}>
              {/* Start Date */}
              <Box sx={{ flex: 1 }}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Start Date"
                    value={reportConfig.startDate}
                    onChange={(newValue) => setReportConfig({...reportConfig, startDate: newValue})}
                    renderInput={(params) => (
                      <TextField 
                        {...params} 
                        fullWidth
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            "& fieldset": {
                              borderColor: "rgba(190, 175, 155, 0.3)",
                            },
                            "&:hover fieldset": {
                              borderColor: "rgba(190, 175, 155, 0.5)",
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "#BEAF9B",
                            },
                            borderRadius: "8px",
                          },
                          "& .MuiInputLabel-root": {
                            color: "#453C33",
                            fontFamily: "'Poppins', 'Roboto', sans-serif",
                            fontWeight: 500,
                          },
                          "& .MuiInputBase-input": {
                            fontFamily: "'Poppins', 'Roboto', sans-serif",
                          },
                        }}
                      />
                    )}
                  />
                </LocalizationProvider>
              </Box>
              
              {/* End Date */}
              <Box sx={{ flex: 1 }}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="End Date"
                    value={reportConfig.endDate}
                    onChange={(newValue) => setReportConfig({...reportConfig, endDate: newValue})}
                    renderInput={(params) => (
                      <TextField 
                        {...params} 
                        fullWidth
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            "& fieldset": {
                              borderColor: "rgba(190, 175, 155, 0.3)",
                            },
                            "&:hover fieldset": {
                              borderColor: "rgba(190, 175, 155, 0.5)",
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "#BEAF9B",
                            },
                            borderRadius: "8px",
                          },
                          "& .MuiInputLabel-root": {
                            color: "#453C33",
                            fontFamily: "'Poppins', 'Roboto', sans-serif",
                            fontWeight: 500,
                          },
                          "& .MuiInputBase-input": {
                            fontFamily: "'Poppins', 'Roboto', sans-serif",
                          },
                        }}
                      />
                    )}
                  />
                </LocalizationProvider>
              </Box>
              
              {/* Report Type */}
              <Box sx={{ flex: 1 }}>
                <FormControl fullWidth>
                  <InputLabel 
                    sx={{ 
                      color: "#453C33",
                      fontFamily: "'Poppins', 'Roboto', sans-serif",
                      fontWeight: 500,
                    }}
                  >
                    Report Type
                  </InputLabel>
                  <Select
                    value={reportConfig.reportType}
                    onChange={(e) => setReportConfig({...reportConfig, reportType: e.target.value})}
                    label="Report Type"
                    sx={{
                      borderRadius: "8px",
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgba(190, 175, 155, 0.3)",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgba(190, 175, 155, 0.5)",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#BEAF9B",
                      },
                      "& .MuiSvgIcon-root": {
                        color: "#BEAF9B",
                      },
                      "& .MuiSelect-select": {
                        fontFamily: "'Poppins', 'Roboto', sans-serif",
                      },
                    }}
                  >
                    {reportTypes.map((type) => (
                      <MenuItem 
                        key={type.value} 
                        value={type.value} 
                        sx={{ 
                          fontFamily: "'Poppins', 'Roboto', sans-serif",
                          '&:hover': {
                            backgroundColor: 'rgba(190, 175, 155, 0.05)'
                          }
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {type.icon}
                          {type.label}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
              
              {/* Group By */}
              <Box sx={{ flex: 1 }}>
                <FormControl fullWidth>
                  <InputLabel 
                    sx={{ 
                      color: "#453C33",
                      fontFamily: "'Poppins', 'Roboto', sans-serif",
                      fontWeight: 500,
                    }}
                  >
                    Group By
                  </InputLabel>
                  <Select
                    value={reportConfig.groupBy}
                    onChange={(e) => setReportConfig({...reportConfig, groupBy: e.target.value})}
                    label="Group By"
                    disabled={reportConfig.reportType === 'stylist'}
                    sx={{
                      borderRadius: "8px",
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgba(190, 175, 155, 0.3)",
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgba(190, 175, 155, 0.5)",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#BEAF9B",
                      },
                      "&.Mui-disabled .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgba(190, 175, 155, 0.1)",
                      },
                      "& .MuiSvgIcon-root": {
                        color: "#BEAF9B",
                      },
                      "& .MuiSelect-select": {
                        fontFamily: "'Poppins', 'Roboto', sans-serif",
                      },
                    }}
                  >
                    {groupByOptions.map((option) => (
                      <MenuItem 
                        key={option.value} 
                        value={option.value} 
                        sx={{ 
                          fontFamily: "'Poppins', 'Roboto', sans-serif",
                          '&:hover': {
                            backgroundColor: 'rgba(190, 175, 155, 0.05)'
                          }
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CategoryOutlined sx={{ color: "#BEAF9B", fontSize: "1rem" }} />
                          {option.label}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Box>

      {/* Footer */}
      <Box
        sx={{
          p: 3, 
          bgcolor: "rgba(190, 175, 155, 0.05)",
          borderTop: "1px solid rgba(190, 175, 155, 0.2)",
          display: "flex",
          justifyContent: "center",
          gap: 2,
          flexWrap: "wrap"
        }}
      >
        <Button
          variant="contained"
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <BarChart />}
          onClick={handlePreview}
          disabled={loading}
          sx={{
            backgroundColor: "#BEAF9B",
            color: '#fff',
            py: 1.5,
            px: 4,
            borderRadius: "8px",
            minWidth: { xs: "100%", sm: "auto" },
            fontFamily: "'Poppins', 'Roboto', sans-serif",
            fontWeight: 500,
            textTransform: "none",
            fontSize: "1rem",
            boxShadow: "0 4px 10px rgba(190, 175, 155, 0.3)",
            transition: "all 0.3s ease",
            '&:hover': { 
              backgroundColor: "#A89683",
              boxShadow: "0 6px 12px rgba(190, 175, 155, 0.4)",
            },
            '&.Mui-disabled': {
              background: "#e0e0e0",
              color: "#a0a0a0"
            }
          }}
        >
          Generate Report
        </Button>
        
        <Button
          variant="outlined"
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Download />}
          onClick={() => handleDownload('pdf')}
          disabled={loading || !previewData}
          sx={{
            color: "#BEAF9B",
            py: 1.5,
            px: 4,
            borderRadius: "8px",
            minWidth: { xs: "48%", sm: "auto" },
            fontFamily: "'Poppins', 'Roboto', sans-serif",
            fontWeight: 500,
            textTransform: "none",
            fontSize: "1rem",
            border: "1px solid #BEAF9B",
            transition: "all 0.3s ease",
            '&:hover': { 
              backgroundColor: "rgba(190, 175, 155, 0.1)",
              borderColor: "#A89683",
              color: "#A89683"
            },
            '&.Mui-disabled': {
              borderColor: "#e0e0e0",
              color: "#a0a0a0"
            }
          }}
        >
          PDF
        </Button>
        
        <Button
          variant="outlined"
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Download />}
          onClick={() => handleDownload('csv')}
          disabled={loading || !previewData}
          sx={{
            color: "#BEAF9B",
            py: 1.5,
            px: 4,
            borderRadius: "8px",
            minWidth: { xs: "48%", sm: "auto" },
            fontFamily: "'Poppins', 'Roboto', sans-serif",
            fontWeight: 500,
            textTransform: "none",
            fontSize: "1rem",
            border: "1px solid #BEAF9B",
            transition: "all 0.3s ease",
            '&:hover': { 
              backgroundColor: "rgba(190, 175, 155, 0.1)",
              borderColor: "#A89683",
              color: "#A89683"
            },
            '&.Mui-disabled': {
              borderColor: "#e0e0e0",
              color: "#a0a0a0"
            }
          }}
        >
          CSV
        </Button>
      </Box>
    </Paper>
  );
};

export default ReportForm;