import React from 'react';
import {
  Box, Grid, Paper, Typography, Tabs, Tab,
  TableContainer, Table, TableHead, TableBody,
  TableRow, TableCell, Chip, Alert
} from '@mui/material';
import { ShowChart, TableChart, Timeline } from '@mui/icons-material';
import { Chart } from 'react-chartjs-2';
import 'chart.js/auto';

export const ReportVisualization = ({
  activeTab,
  setActiveTab,
  previewData,
  reportConfig,
  generateChartData,
  formatCurrency,
  safeNumber,
  error
}) => {
  const renderComparisonMetrics = () => {
    if (!previewData || !previewData.metrics) return null;
    
    const current_total = Number(previewData.metrics.current_total || 0);
    const previous_total = Number(previewData.metrics.previous_total || 0);
    const yoy_total = Number(previewData.metrics.yoy_total || 0);
    
    const prevPeriodChange = previous_total ? ((current_total - previous_total) / previous_total) * 100 : 0;
    const yoyChange = yoy_total ? ((current_total - yoy_total) / yoy_total) * 100 : 0;
    
    return (
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={4}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              textAlign: 'center',
              borderRadius: "8px",
              border: "1px solid rgba(190, 175, 155, 0.2)",
              bgcolor: "rgba(190, 175, 155, 0.02)",
            }}
          >
            <Typography 
              variant="h6" 
              sx={{ 
                fontFamily: "'Poppins', 'Roboto', sans-serif",
                color: "#453C33"
              }}
            >
              Current Period
            </Typography>
            <Typography 
              variant="h4" 
              sx={{ 
                my: 1,
                fontFamily: "'Poppins', 'Roboto', sans-serif",
                color: "#453C33"
              }}
            >
              ${current_total.toFixed(2)}
            </Typography>
            <Typography 
              variant="body2"
              sx={{ 
                fontFamily: "'Poppins', 'Roboto', sans-serif",
                color: "#666"
              }}
            >
              Total Revenue
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              textAlign: 'center',
              borderRadius: "8px",
              border: "1px solid rgba(190, 175, 155, 0.2)",
              bgcolor: "rgba(190, 175, 155, 0.02)",
            }}
          >
            <Typography 
              variant="h6"
              sx={{ 
                fontFamily: "'Poppins', 'Roboto', sans-serif",
                color: "#453C33"
              }}
            >
              Vs Previous Period
            </Typography>
            <Typography 
              variant="h4" 
              sx={{ 
                my: 1, 
                color: prevPeriodChange >= 0 ? '#2e7d32' : '#d32f2f',
                fontFamily: "'Poppins', 'Roboto', sans-serif"
              }}
            >
              {prevPeriodChange.toFixed(1)}%
            </Typography>
            <Typography 
              variant="body2"
              sx={{ 
                fontFamily: "'Poppins', 'Roboto', sans-serif",
                color: "#666"
              }}
            >
              Change
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              textAlign: 'center',
              borderRadius: "8px",
              border: "1px solid rgba(190, 175, 155, 0.2)",
              bgcolor: "rgba(190, 175, 155, 0.02)",
            }}
          >
            <Typography 
              variant="h6"
              sx={{ 
                fontFamily: "'Poppins', 'Roboto', sans-serif",
                color: "#453C33"
              }}
            >
              Year Over Year
            </Typography>
            <Typography 
              variant="h4" 
              sx={{ 
                my: 1, 
                color: yoyChange >= 0 ? '#2e7d32' : '#d32f2f',
                fontFamily: "'Poppins', 'Roboto', sans-serif"
              }}
            >
              {yoyChange.toFixed(1)}%
            </Typography>
            <Typography 
              variant="body2"
              sx={{ 
                fontFamily: "'Poppins', 'Roboto', sans-serif",
                color: "#666"
              }}
            >
              Change
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    );
  };

  return (
    <Box sx={{ mt: 3 }}>
      {reportConfig.reportType === 'comparison' && renderComparisonMetrics()}
      
      <Paper
        elevation={0}
        sx={{
          mb: 3,
          borderRadius: "8px",
          border: "1px solid rgba(190, 175, 155, 0.2)",
          bgcolor: "rgba(190, 175, 155, 0.02)",
        }}
      >
        <Tabs 
          value={activeTab} 
          onChange={(e, newValue) => setActiveTab(newValue)}
          sx={{
            '& .MuiTabs-indicator': {
              backgroundColor: '#BEAF9B',
            },
          }}
        >
          <Tab 
            label="Charts" 
            value="charts" 
            icon={<ShowChart />} 
            sx={{
              fontFamily: "'Poppins', 'Roboto', sans-serif",
              color: activeTab === 'charts' ? '#453C33' : '#666',
              '&.Mui-selected': {
                color: '#453C33',
              },
            }}
          />
          <Tab 
            label="Data Table" 
            value="table" 
            icon={<TableChart />} 
            sx={{
              fontFamily: "'Poppins', 'Roboto', sans-serif",
              color: activeTab === 'table' ? '#453C33' : '#666',
              '&.Mui-selected': {
                color: '#453C33',
              },
            }}
          />
          <Tab 
            label="Insights" 
            value="insights" 
            icon={<Timeline />} 
            sx={{
              fontFamily: "'Poppins', 'Roboto', sans-serif",
              color: activeTab === 'insights' ? '#453C33' : '#666',
              '&.Mui-selected': {
                color: '#453C33',
              },
            }}
          />
        </Tabs>
      </Paper>
      
      {activeTab === 'charts' && generateChartData && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={reportConfig.reportType === 'trend' ? 12 : 8}>
            <Paper 
              elevation={0}
              sx={{
                p: 3,
                height: '100%',
                borderRadius: "8px",
                border: "1px solid rgba(190, 175, 155, 0.2)",
                bgcolor: "rgba(190, 175, 155, 0.02)",
              }}
            >
              <Typography 
                variant="h6" 
                gutterBottom
                sx={{
                  fontFamily: "'Poppins', 'Roboto', sans-serif",
                  color: "#453C33",
                  fontWeight: 600
                }}
              >
                {reportConfig.reportType === 'comparison' ? 'Period Comparison' : 
                 reportConfig.reportType === 'trend' ? 'Revenue Trend Analysis' :
                 reportConfig.reportType === 'stylist' ? 'Stylist Performance' :
                 'Revenue Overview'}
              </Typography>
              <Chart
                type={reportConfig.reportType === 'stylist' ? 'bar' : 'line'}
                data={generateChartData}
                options={{
                  responsive: true,
                  scales: reportConfig.reportType === 'trend' ? {
                    y: {
                      type: 'linear',
                      display: true,
                      position: 'left',
                      title: { 
                        display: true, 
                        text: 'Revenue ($)',
                        font: {
                          family: "'Poppins', 'Roboto', sans-serif"
                        }
                      },
                      ticks: {
                        font: {
                          family: "'Poppins', 'Roboto', sans-serif"
                        }
                      }
                    },
                    y1: {
                      type: 'linear',
                      display: true,
                      position: 'right',
                      title: { 
                        display: true, 
                        text: 'Growth Rate (%)',
                        font: {
                          family: "'Poppins', 'Roboto', sans-serif"
                        }
                      },
                      grid: { drawOnChartArea: false },
                      ticks: {
                        font: {
                          family: "'Poppins', 'Roboto', sans-serif"
                        }
                      }
                    },
                    x: {
                      ticks: {
                        font: {
                          family: "'Poppins', 'Roboto', sans-serif"
                        }
                      }
                    }
                  } : {
                    y: {
                      ticks: {
                        font: {
                          family: "'Poppins', 'Roboto', sans-serif"
                        }
                      }
                    },
                    x: {
                      ticks: {
                        font: {
                          family: "'Poppins', 'Roboto', sans-serif"
                        }
                      }
                    }
                  },
                  plugins: {
                    legend: {
                      labels: {
                        font: {
                          family: "'Poppins', 'Roboto', sans-serif"
                        }
                      }
                    }
                  }
                }}
              />
            </Paper>
          </Grid>
          
          {reportConfig.reportType !== 'trend' && previewData.serviceChartData && previewData.serviceChartData.labels?.length > 0 && (
            <Grid item xs={12} md={4}>
              <Paper 
                elevation={0}
                sx={{
                  p: 3,
                  height: '100%',
                  borderRadius: "8px",
                  border: "1px solid rgba(190, 175, 155, 0.2)",
                  bgcolor: "rgba(190, 175, 155, 0.02)",
                }}
              >
                <Typography 
                  variant="h6" 
                  gutterBottom
                  sx={{
                    fontFamily: "'Poppins', 'Roboto', sans-serif",
                    color: "#453C33",
                    fontWeight: 600
                  }}
                >
                  {reportConfig.reportType === 'stylist' ? 'Services Distribution' : 'Revenue Breakdown'}
                </Typography>
                <Chart
                  type={reportConfig.reportType === 'stylist' ? 'pie' : 'doughnut'}
                  data={previewData.serviceChartData}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: 'bottom',
                        labels: {
                          font: {
                            family: "'Poppins', 'Roboto', sans-serif"
                          }
                        }
                      }
                    }
                  }}
                />
              </Paper>
            </Grid>
          )}
        </Grid>
      )}
      
      {activeTab === 'table' && (
        <Paper 
          elevation={0}
          sx={{
            p: 3,
            borderRadius: "8px",
            border: "1px solid rgba(190, 175, 155, 0.2)",
            bgcolor: "rgba(190, 175, 155, 0.02)",
          }}
        >
          <Typography 
            variant="h6" 
            gutterBottom
            sx={{
              fontFamily: "'Poppins', 'Roboto', sans-serif",
              color: "#453C33",
              fontWeight: 600
            }}
          >
            Detailed Data
          </Typography>
          <TableContainer sx={{ maxHeight: 600 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {reportConfig.reportType === 'comparison' ? (
                    <>
                      <TableCell
                        sx={{
                          fontFamily: "'Poppins', 'Roboto', sans-serif",
                          fontWeight: 600,
                          color: "#453C33",
                          backgroundColor: "rgba(190, 175, 155, 0.05)"
                        }}
                      >
                        Period
                      </TableCell>
                      <TableCell 
                        align="right"
                        sx={{
                          fontFamily: "'Poppins', 'Roboto', sans-serif",
                          fontWeight: 600,
                          color: "#453C33",
                          backgroundColor: "rgba(190, 175, 155, 0.05)"
                        }}
                      >
                        Current Revenue
                      </TableCell>
                      <TableCell 
                        align="right"
                        sx={{
                          fontFamily: "'Poppins', 'Roboto', sans-serif",
                          fontWeight: 600,
                          color: "#453C33",
                          backgroundColor: "rgba(190, 175, 155, 0.05)"
                        }}
                      >
                        Previous Revenue
                      </TableCell>
                      <TableCell 
                        align="right"
                        sx={{
                          fontFamily: "'Poppins', 'Roboto', sans-serif",
                          fontWeight: 600,
                          color: "#453C33",
                          backgroundColor: "rgba(190, 175, 155, 0.05)"
                        }}
                      >
                        Growth
                      </TableCell>
                    </>
                  ) : reportConfig.reportType === 'trend' ? (
                    <>
                      <TableCell
                        sx={{
                          fontFamily: "'Poppins', 'Roboto', sans-serif",
                          fontWeight: 600,
                          color: "#453C33",
                          backgroundColor: "rgba(190, 175, 155, 0.05)"
                        }}
                      >
                        Period
                      </TableCell>
                      <TableCell 
                        align="right"
                        sx={{
                          fontFamily: "'Poppins', 'Roboto', sans-serif",
                          fontWeight: 600,
                          color: "#453C33",
                          backgroundColor: "rgba(190, 175, 155, 0.05)"
                        }}
                      >
                        Revenue
                      </TableCell>
                      <TableCell 
                        align="right"
                        sx={{
                          fontFamily: "'Poppins', 'Roboto', sans-serif",
                          fontWeight: 600,
                          color: "#453C33",
                          backgroundColor: "rgba(190, 175, 155, 0.05)"
                        }}
                      >
                        7-Period Avg
                      </TableCell>
                      <TableCell 
                        align="right"
                        sx={{
                          fontFamily: "'Poppins', 'Roboto', sans-serif",
                          fontWeight: 600,
                          color: "#453C33",
                          backgroundColor: "rgba(190, 175, 155, 0.05)"
                        }}
                      >
                        Growth Rate
                      </TableCell>
                    </>
                  ) : reportConfig.reportType === 'stylist' ? (
                    <>
                      <TableCell
                        sx={{
                          fontFamily: "'Poppins', 'Roboto', sans-serif",
                          fontWeight: 600,
                          color: "#453C33",
                          backgroundColor: "rgba(190, 175, 155, 0.05)"
                        }}
                      >
                        Stylist
                      </TableCell>
                      <TableCell 
                        align="right"
                        sx={{
                          fontFamily: "'Poppins', 'Roboto', sans-serif",
                          fontWeight: 600,
                          color: "#453C33",
                          backgroundColor: "rgba(190, 175, 155, 0.05)"
                        }}
                      >
                        Revenue
                      </TableCell>
                      <TableCell 
                        align="right"
                        sx={{
                          fontFamily: "'Poppins', 'Roboto', sans-serif",
                          fontWeight: 600,
                          color: "#453C33",
                          backgroundColor: "rgba(190, 175, 155, 0.05)"
                        }}
                      >
                        Appointments
                      </TableCell>
                      <TableCell 
                        align="right"
                        sx={{
                          fontFamily: "'Poppins', 'Roboto', sans-serif",
                          fontWeight: 600,
                          color: "#453C33",
                          backgroundColor: "rgba(190, 175, 155, 0.05)"
                        }}
                      >
                        Avg. Revenue
                      </TableCell>
                      <TableCell 
                        align="right"
                        sx={{
                          fontFamily: "'Poppins', 'Roboto', sans-serif",
                          fontWeight: 600,
                          color: "#453C33",
                          backgroundColor: "rgba(190, 175, 155, 0.05)"
                        }}
                      >
                        Clients
                      </TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell
                        sx={{
                          fontFamily: "'Poppins', 'Roboto', sans-serif",
                          fontWeight: 600,
                          color: "#453C33",
                          backgroundColor: "rgba(190, 175, 155, 0.05)"
                        }}
                      >
                        Period
                      </TableCell>
                      <TableCell 
                        align="right"
                        sx={{
                          fontFamily: "'Poppins', 'Roboto', sans-serif",
                          fontWeight: 600,
                          color: "#453C33",
                          backgroundColor: "rgba(190, 175, 155, 0.05)"
                        }}
                      >
                        Revenue
                      </TableCell>
                      <TableCell 
                        align="right"
                        sx={{
                          fontFamily: "'Poppins', 'Roboto', sans-serif",
                          fontWeight: 600,
                          color: "#453C33",
                          backgroundColor: "rgba(190, 175, 155, 0.05)"
                        }}
                      >
                        Appointments
                      </TableCell>
                      <TableCell 
                        align="right"
                        sx={{
                          fontFamily: "'Poppins', 'Roboto', sans-serif",
                          fontWeight: 600,
                          color: "#453C33",
                          backgroundColor: "rgba(190, 175, 155, 0.05)"
                        }}
                      >
                        Avg. Revenue
                      </TableCell>
                      <TableCell 
                        align="right"
                        sx={{
                          fontFamily: "'Poppins', 'Roboto', sans-serif",
                          fontWeight: 600,
                          color: "#453C33",
                          backgroundColor: "rgba(190, 175, 155, 0.05)"
                        }}
                      >
                        Unique Clients
                      </TableCell>
                    </>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {previewData && (
                  (previewData.rows || previewData.current_period || []).slice(0, 50).map((row, idx) => (
                    <TableRow 
                      key={`${row.period_key || row.stylist_name || idx}-${row.service_name || ''}`}
                      sx={{
                        '&:nth-of-type(odd)': {
                          backgroundColor: 'rgba(190, 175, 155, 0.02)',
                        },
                      }}
                    >
                      {reportConfig.reportType === 'comparison' ? (
                        <>
                          <TableCell
                            sx={{
                              fontFamily: "'Poppins', 'Roboto', sans-serif",
                              color: "#453C33"
                            }}
                          >
                            {row.period_label || `Period ${idx + 1}`}
                          </TableCell>
                          <TableCell 
                            align="right"
                            sx={{
                              fontFamily: "'Poppins', 'Roboto', sans-serif",
                              color: "#453C33"
                            }}
                          >
                            {formatCurrency(row.total_revenue)}
                          </TableCell>
                          <TableCell 
                            align="right"
                            sx={{
                              fontFamily: "'Poppins', 'Roboto', sans-serif",
                              color: "#453C33"
                            }}
                          >
                            {formatCurrency(
                              previewData.previous_period && previewData.previous_period.find(p => p.period_key === row.period_key)?.total_revenue || 0
                            )}
                          </TableCell>
                          <TableCell 
                            align="right"
                            sx={{
                              fontFamily: "'Poppins', 'Roboto', sans-serif",
                              color: "#453C33"
                            }}
                          >
                            {previewData.previous_period && (
                              <Chip 
                                label={`${(
                                  ((safeNumber(row.total_revenue) - safeNumber(previewData.previous_period.find(p => p.period_key === row.period_key)?.total_revenue)) / 
                                  Math.max(safeNumber(previewData.previous_period.find(p => p.period_key === row.period_key)?.total_revenue), 1)) * 100
                                ).toFixed(1)}%`}
                                color={
                                  ((safeNumber(row.total_revenue) - safeNumber(previewData.previous_period.find(p => p.period_key === row.period_key)?.total_revenue)) / 
                                  Math.max(safeNumber(previewData.previous_period.find(p => p.period_key === row.period_key)?.total_revenue), 1)) >= 0 
                                  ? 'success' : 'error'
                                }
                                size="small"
                                sx={{
                                  fontFamily: "'Poppins', 'Roboto', sans-serif",
                                }}
                              />
                            )}
                          </TableCell>
                        </>
                      ) : reportConfig.reportType === 'trend' ? (
                        <>
                          <TableCell
                            sx={{
                              fontFamily: "'Poppins', 'Roboto', sans-serif",
                              color: "#453C33"
                            }}
                          >
                            {row.period_label || `Period ${idx + 1}`}
                          </TableCell>
                          <TableCell 
                            align="right"
                            sx={{
                              fontFamily: "'Poppins', 'Roboto', sans-serif",
                              color: "#453C33"
                            }}
                          >
                            {formatCurrency(row.revenue)}
                          </TableCell>
                          <TableCell 
                            align="right"
                            sx={{
                              fontFamily: "'Poppins', 'Roboto', sans-serif",
                              color: "#453C33"
                            }}
                          >
                            {formatCurrency(row.moving_avg_7)}
                          </TableCell>
                          <TableCell 
                            align="right"
                            sx={{
                              fontFamily: "'Poppins', 'Roboto', sans-serif",
                              color: "#453C33"
                            }}
                          >
                            <Chip 
                              label={`${safeNumber(row.growth_rate).toFixed(1)}%`}
                              color={safeNumber(row.growth_rate) >= 0 ? 'success' : 'error'}
                              size="small"
                              sx={{
                                fontFamily: "'Poppins', 'Roboto', sans-serif",
                              }}
                            />
                          </TableCell>
                        </>
                      ) : reportConfig.reportType === 'stylist' ? (
                        <>
                          <TableCell
                            sx={{
                              fontFamily: "'Poppins', 'Roboto', sans-serif",
                              color: "#453C33"
                            }}
                          >
                            {row.stylist_name || `Stylist ${idx + 1}`}
                          </TableCell>
                          <TableCell 
                            align="right"
                            sx={{
                              fontFamily: "'Poppins', 'Roboto', sans-serif",
                              color: "#453C33"
                            }}
                          >
                            {formatCurrency(row.total_revenue)}
                          </TableCell>
                          <TableCell 
                            align="right"
                            sx={{
                              fontFamily: "'Poppins', 'Roboto', sans-serif",
                              color: "#453C33"
                            }}
                          >
                            {safeNumber(row.total_appointments)}
                          </TableCell>
                          <TableCell 
                            align="right"
                            sx={{
                              fontFamily: "'Poppins', 'Roboto', sans-serif",
                              color: "#453C33"
                            }}
                          >
                            {formatCurrency(row.avg_revenue_per_appointment)}
                          </TableCell>
                          <TableCell 
                            align="right"
                            sx={{
                              fontFamily: "'Poppins', 'Roboto', sans-serif",
                              color: "#453C33"
                            }}
                          >
                            {safeNumber(row.unique_clients)}
                          </TableCell>
                        </>
                      ) : (
                        <>
                          <TableCell
                            sx={{
                              fontFamily: "'Poppins', 'Roboto', sans-serif",
                              color: "#453C33"
                            }}
                          >
                            {row.period_label || row.service_name || `Item ${idx + 1}`}
                          </TableCell>
                          <TableCell 
                            align="right"
                            sx={{
                              fontFamily: "'Poppins', 'Roboto', sans-serif",
                              color: "#453C33"
                            }}
                          >
                            {formatCurrency(row.revenue || row.total_revenue)}
                          </TableCell>
                          <TableCell 
                            align="right"
                            sx={{
                              fontFamily: "'Poppins', 'Roboto', sans-serif",
                              color: "#453C33"
                            }}
                          >
                            {safeNumber(row.appointments || row.total_appointments)}
                          </TableCell>
                          <TableCell 
                            align="right"
                            sx={{
                              fontFamily: "'Poppins', 'Roboto', sans-serif",
                              color: "#453C33"
                            }}
                            >
                            {formatCurrency(
                              (safeNumber(row.revenue || row.total_revenue) / 
                              Math.max(safeNumber(row.appointments || row.total_appointments), 1))
                            )}
                          </TableCell>
                          <TableCell 
                            align="right"
                            sx={{
                              fontFamily: "'Poppins', 'Roboto', sans-serif",
                              color: "#453C33"
                            }}
                          >
                            {safeNumber(row.unique_clients)}
                          </TableCell>
                        </>
                      )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
      
      {activeTab === 'insights' && (
        <Paper 
          elevation={0}
          sx={{
            p: 3,
            borderRadius: "8px",
            border: "1px solid rgba(190, 175, 155, 0.2)",
            bgcolor: "rgba(190, 175, 155, 0.02)",
          }}
        >
          <Typography 
            variant="h6" 
            gutterBottom
            sx={{
              fontFamily: "'Poppins', 'Roboto', sans-serif",
              color: "#453C33",
              fontWeight: 600
            }}
          >
            Key Insights
          </Typography>
          <Typography 
            paragraph
            sx={{
              fontFamily: "'Poppins', 'Roboto', sans-serif",
              color: "#453C33"
            }}
          >
            {generateInsightsText(previewData, reportConfig)}
          </Typography>
        </Paper>
      )}
      
      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            mt: 2,
            fontFamily: "'Poppins', 'Roboto', sans-serif",
            borderRadius: "8px",
          }}
        >
          {error}
        </Alert>
      )}
    </Box>
  );
};

// Helper function to generate insights text
const generateInsightsText = (data, config) => {
  if (!data) return "Generate a report to see insights.";
  
  // Helper function to safely get numerical values
  const safeNumber = (value) => {
    const num = Number(value);
    return isNaN(num) ? 0 : num;
  };
  
  if (config.reportType === 'comparison' && data.metrics) {
    const currentTotal = safeNumber(data.metrics.current_total);
    const prevTotal = safeNumber(data.metrics.previous_total);
    const yoyTotal = safeNumber(data.metrics.yoy_total);
    const prevChange = prevTotal ? ((currentTotal - prevTotal) / Math.max(prevTotal, 1)) * 100 : 0;
    const yoyChange = yoyTotal ? ((currentTotal - yoyTotal) / Math.max(yoyTotal, 1)) * 100 : 0;
    
    return `The current period generated Rs.${currentTotal.toFixed(2)} in revenue. This represents ${
      prevChange >= 0 ? 'an increase' : 'a decrease'
    } of ${Math.abs(prevChange).toFixed(1)}% compared to the previous period and ${
      yoyChange >= 0 ? 'an increase' : 'a decrease'
    } of ${Math.abs(yoyChange).toFixed(1)}% compared to the same period last year.`;
  }
  
  if (config.reportType === 'trend') {
    if (!data.rows || data.rows.length === 0) return "No trend data available.";
    
    const first = data.rows[0];
    const last = data.rows[data.rows.length - 1];
    const firstRevenue = safeNumber(first.revenue);
    const lastRevenue = safeNumber(last.revenue);
    const totalChange = firstRevenue ? ((lastRevenue - firstRevenue) / Math.max(firstRevenue, 1)) * 100 : 0;
    
    // Calculate average growth rate, handling potential non-numeric values
    const validGrowthRates = data.rows
      .map(row => safeNumber(row.growth_rate))
      .filter(rate => !isNaN(rate));
    
    const avgGrowth = validGrowthRates.length > 0 ? 
      validGrowthRates.reduce((sum, rate) => sum + rate, 0) / validGrowthRates.length : 0;
    
    return `Over the selected period, revenue ${
      totalChange >= 0 ? 'increased' : 'decreased'
    } by ${Math.abs(totalChange).toFixed(1)}%, with an average ${
      avgGrowth >= 0 ? 'growth' : 'decline'
    } rate of ${Math.abs(avgGrowth).toFixed(1)}% per ${config.groupBy}. The 7-period moving average ${
      safeNumber(last.moving_avg_7) > safeNumber(first.moving_avg_7) ? 'increased' : 'decreased'
    } from Rs.${safeNumber(first.moving_avg_7).toFixed(2)} to Rs.${safeNumber(last.moving_avg_7).toFixed(2)}.`;
  }
  
  if (config.reportType === 'stylist') {
    if (!data.rows || data.rows.length === 0) return "No stylist data available.";
    
    const sortedStylists = [...data.rows].sort((a, b) => 
      safeNumber(b.total_revenue) - safeNumber(a.total_revenue));
    
    const topStylist = sortedStylists[0];
    const totalRevenue = sortedStylists.reduce((sum, row) => sum + safeNumber(row.total_revenue), 0);
    const topPercentage = totalRevenue ? (safeNumber(topStylist.total_revenue) / Math.max(totalRevenue, 1)) * 100 : 0;
    const totalAppointments = sortedStylists.reduce((sum, row) => sum + safeNumber(row.total_appointments), 0);
    
    return `The top performing stylist was ${topStylist.stylist_name || 'Unknown'}, generating Rs.${safeNumber(topStylist.total_revenue).toFixed(2)} (${topPercentage.toFixed(1)}% of total revenue) from ${safeNumber(topStylist.total_appointments)} appointments.
    The average revenue per appointment across all stylists was Rs.${(totalRevenue / Math.max(totalAppointments, 1)).toFixed(2)}.`;
  }
  
  // Default insights for summary/detailed reports
  if (!data.rows || data.rows.length === 0) return "No data available.";
  
  const totalRevenue = data.rows.reduce((sum, row) => 
    sum + safeNumber(row.revenue || row.total_revenue), 0);
  
  const totalAppointments = data.rows.reduce((sum, row) => 
    sum + safeNumber(row.appointments || row.total_appointments), 0);
  
  const avgRevenue = totalRevenue / Math.max(totalAppointments, 1);
  
  return `The report covers ${totalAppointments} appointments generating Rs.${totalRevenue.toFixed(2)} in total revenue, 
  with an average of Rs.${avgRevenue.toFixed(2)} per appointment.`;
};