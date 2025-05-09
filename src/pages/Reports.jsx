
import React, { useState, useMemo } from 'react';
import { 
  Box, Button, Container, TextField, Typography, CircularProgress, Alert,
  FormControl, InputLabel, Select, MenuItem, Grid, Paper, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Tabs, Tab, Chip
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { 
  Download, BarChart, ShowChart, TableChart, Timeline, 
  CompareArrows, People, PieChart, TrendingUp 
} from '@mui/icons-material';
import { Chart } from 'react-chartjs-2';
import 'chart.js/auto';

const reportTypes = [
  { value: 'summary', label: 'Summary', icon: <BarChart /> },
  { value: 'detailed', label: 'Detailed', icon: <TableChart /> },
  { value: 'trend', label: 'Trend Analysis', icon: <TrendingUp /> },
  { value: 'comparison', label: 'Period Comparison', icon: <CompareArrows /> },
  { value: 'stylist', label: 'Stylist Performance', icon: <People /> }
];

const groupByOptions = [
  { value: 'day', label: 'Daily' },
  { value: 'week', label: 'Weekly' },
  { value: 'month', label: 'Monthly' },
  { value: 'quarter', label: 'Quarterly' },
  { value: 'year', label: 'Yearly' }
];

const RevenueReport = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [previewData, setPreviewData] = useState(null);
  const [activeTab, setActiveTab] = useState('charts');
  const [reportConfig, setReportConfig] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)),
    endDate: new Date(),
    reportType: 'summary',
    groupBy: 'day',
    format: 'pdf'
  });

  const handlePreview = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams({
        startDate: reportConfig.startDate.toISOString().split('T')[0],
        endDate: reportConfig.endDate.toISOString().split('T')[0],
        reportType: reportConfig.reportType,
        groupBy: reportConfig.groupBy,
        preview: true
      });

      const response = await fetch(`http://localhost:5001/api/reports/advanced-revenue?${params}`);
      
      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data = await response.json();
      setPreviewData(data);
      setActiveTab('charts');
    } catch (err) {
      console.error('Preview error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (format) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        startDate: reportConfig.startDate.toISOString().split('T')[0],
        endDate: reportConfig.endDate.toISOString().split('T')[0],
        reportType: reportConfig.reportType,
        groupBy: reportConfig.groupBy,
        format
      });

      const response = await fetch(`http://localhost:5001/api/reports/advanced-revenue?${params}`);
      
      if (!response.ok) {
        throw new Error(await response.text());
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `revenue_report_${reportConfig.reportType}_${reportConfig.startDate.toISOString().split('T')[0]}_to_${reportConfig.endDate.toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error('Download error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const generateChartData = useMemo(() => {
    if (!previewData) return null;
    
    // Make sure we have data to work with
    const data = previewData.rows || [];
    if (data.length === 0) {
      return {
        labels: [],
        datasets: [{
          label: 'Revenue',
          data: [],
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      };
    }
    
    const isComparison = reportConfig.reportType === 'comparison';
    
    // Handle trend report type
    if (reportConfig.reportType === 'trend') {
      return {
        labels: data.map(item => item.period_label || ''),
        datasets: [
          {
            label: 'Revenue',
            data: data.map(item => {
              const revenue = Number(item.revenue || 0);
              return isNaN(revenue) ? 0 : revenue;
            }),
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
            yAxisID: 'y',
          },
          {
            label: '7-Period Moving Avg',
            data: data.map(item => {
              const movingAvg = Number(item.moving_avg_7 || 0); 
              return isNaN(movingAvg) ? 0 : movingAvg;
            }),
            borderColor: 'rgb(153, 102, 255)',
            backgroundColor: 'rgba(153, 102, 255, 0.5)',
            borderDash: [5, 5],
            yAxisID: 'y',
          },
          {
            label: 'Growth Rate (%)',
            data: data.map(item => {
              const growthRate = Number(item.growth_rate || 0);
              return isNaN(growthRate) ? 0 : growthRate;
            }),
            borderColor: 'rgb(255, 159, 64)',
            backgroundColor: 'rgba(255, 159, 64, 0.5)',
            yAxisID: 'y1',
            type: 'line'
          }
        ]
      };
    }
    
    // Handle stylist report type
    if (reportConfig.reportType === 'stylist') {
      return {
        labels: data.map(item => item.stylist_name || 'Unknown'),
        datasets: [
          {
            label: 'Revenue',
            data: data.map(item => {
              const revenue = Number(item.total_revenue || 0);
              return isNaN(revenue) ? 0 : revenue;
            }),
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          }
        ]
      };
    }
    
    // Default chart for summary/detailed/comparison reports
    return {
      labels: data.map(item => item.period_label || item.service_name || item.stylist_name || 'Unknown'),
      datasets: [
        {
          label: 'Revenue',
          data: data.map(item => {
            const revenue = Number(item.revenue || item.total_revenue || 0);
            return isNaN(revenue) ? 0 : revenue;
          }),
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }
      ]
    };
  }, [previewData, reportConfig.reportType]);

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
          <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6">Current Period</Typography>
            <Typography variant="h4" sx={{ my: 1 }}>${current_total.toFixed(2)}</Typography>
            <Typography variant="body2">Total Revenue</Typography>
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6">Vs Previous Period</Typography>
            <Typography 
              variant="h4" 
              sx={{ my: 1, color: prevPeriodChange >= 0 ? 'success.main' : 'error.main' }}
            >
              {prevPeriodChange.toFixed(1)}%
            </Typography>
            <Typography variant="body2">Change</Typography>
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="h6">Year Over Year</Typography>
            <Typography 
              variant="h4" 
              sx={{ my: 1, color: yoyChange >= 0 ? 'success.main' : 'error.main' }}
            >
              {yoyChange.toFixed(1)}%
            </Typography>
            <Typography variant="body2">Change</Typography>
          </Paper>
        </Grid>
      </Grid>
    );
  };

  // Helper function to safely get numerical values
  const safeNumber = (value) => {
    const num = Number(value);
    return isNaN(num) ? 0 : num;
  };
  
  // Helper function to safely format numbers
  const formatCurrency = (value) => {
    const num = safeNumber(value);
    return `$${num.toFixed(2)}`;
  };

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" gutterBottom sx={{ mt: 3 }}>
        Advanced Revenue Analytics
        <Chip 
          label={reportTypes.find(r => r.value === reportConfig.reportType)?.label || 'Report'} 
          icon={reportTypes.find(r => r.value === reportConfig.reportType)?.icon}
          color="primary" 
          sx={{ ml: 2 }} 
        />
      </Typography>
      
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <DatePicker
              label="Start Date"
              value={reportConfig.startDate}
              onChange={(newValue) => setReportConfig({...reportConfig, startDate: newValue})}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <DatePicker
              label="End Date"
              value={reportConfig.endDate}
              onChange={(newValue) => setReportConfig({...reportConfig, endDate: newValue})}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Report Type</InputLabel>
              <Select
                value={reportConfig.reportType}
                onChange={(e) => setReportConfig({...reportConfig, reportType: e.target.value})}
                label="Report Type"
              >
                {reportTypes.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {type.icon}
                      {type.label}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Group By</InputLabel>
              <Select
                value={reportConfig.groupBy}
                onChange={(e) => setReportConfig({...reportConfig, groupBy: e.target.value})}
                label="Group By"
                disabled={reportConfig.reportType === 'stylist'}
              >
                {groupByOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        
        <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={loading ? <CircularProgress size={20} /> : <BarChart />}
            onClick={handlePreview}
            disabled={loading}
          >
            Generate Report
          </Button>
          
          <Button
            variant="contained"
            color="success"
            startIcon={loading ? <CircularProgress size={20} /> : <Download />}
            onClick={() => handleDownload('pdf')}
            disabled={loading || !previewData}
            sx={{ ml: 2 }}
          >
            Download PDF
          </Button>
          
          <Button
            variant="outlined"
            color="primary"
            startIcon={loading ? <CircularProgress size={20} /> : <Download />}
            onClick={() => handleDownload('csv')}
            disabled={loading || !previewData}
          >
            Download CSV
          </Button>
        </Box>
      </Paper>
      
      {previewData && (
        <Box sx={{ mt: 3 }}>
          {reportConfig.reportType === 'comparison' && renderComparisonMetrics()}
          
          <Tabs 
            value={activeTab} 
            onChange={(e, newValue) => setActiveTab(newValue)}
            sx={{ mb: 2 }}
          >
            <Tab label="Charts" value="charts" icon={<ShowChart />} />
            <Tab label="Data Table" value="table" icon={<TableChart />} />
            <Tab label="Insights" value="insights" icon={<Timeline />} />
          </Tabs>
          
          {activeTab === 'charts' && generateChartData && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={reportConfig.reportType === 'trend' ? 12 : 8}>
                <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
                  <Typography variant="h6" gutterBottom>
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
                          title: { display: true, text: 'Revenue ($)' }
                        },
                        y1: {
                          type: 'linear',
                          display: true,
                          position: 'right',
                          title: { display: true, text: 'Growth Rate (%)' },
                          grid: { drawOnChartArea: false }
                        }
                      } : undefined
                    }}
                  />
                </Paper>
              </Grid>
              
              {reportConfig.reportType !== 'trend' && previewData.serviceChartData && (
                <Grid item xs={12} md={4}>
                  <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
                    <Typography variant="h6" gutterBottom>
                      {reportConfig.reportType === 'stylist' ? 'Services Distribution' : 'Revenue Breakdown'}
                    </Typography>
                    <Chart
                      type={reportConfig.reportType === 'stylist' ? 'pie' : 'doughnut'}
                      data={previewData.serviceChartData}
                      options={{ responsive: true }}
                    />
                  </Paper>
                </Grid>
              )}
            </Grid>
          )}
          
          {activeTab === 'table' && (
            <Paper elevation={2} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Detailed Data
              </Typography>
              <TableContainer sx={{ maxHeight: 600 }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      {reportConfig.reportType === 'comparison' ? (
                        <>
                          <TableCell>Period</TableCell>
                          <TableCell align="right">Current Revenue</TableCell>
                          <TableCell align="right">Previous Revenue</TableCell>
                          <TableCell align="right">Growth</TableCell>
                        </>
                      ) : reportConfig.reportType === 'trend' ? (
                        <>
                          <TableCell>Period</TableCell>
                          <TableCell align="right">Revenue</TableCell>
                          <TableCell align="right">7-Period Avg</TableCell>
                          <TableCell align="right">Growth Rate</TableCell>
                        </>
                      ) : reportConfig.reportType === 'stylist' ? (
                        <>
                          <TableCell>Stylist</TableCell>
                          <TableCell align="right">Revenue</TableCell>
                          <TableCell align="right">Appointments</TableCell>
                          <TableCell align="right">Avg. Revenue</TableCell>
                          <TableCell align="right">Clients</TableCell>
                        </>
                      ) : (
                        <>
                          <TableCell>Period</TableCell>
                          <TableCell align="right">Revenue</TableCell>
                          <TableCell align="right">Appointments</TableCell>
                          <TableCell align="right">Avg. Revenue</TableCell>
                          <TableCell align="right">Unique Clients</TableCell>
                        </>
                      )}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {previewData && (
                      (previewData.rows || previewData.current_period || []).slice(0, 50).map((row, idx) => (
                        <TableRow key={`${row.period_key || row.stylist_name || idx}-${row.service_name || ''}`}>
                          {reportConfig.reportType === 'comparison' ? (
                            <>
                              <TableCell>{row.period_label || `Period ${idx + 1}`}</TableCell>
                              <TableCell align="right">{formatCurrency(row.total_revenue)}</TableCell>
                              <TableCell align="right">
                                {formatCurrency(
                                  previewData.previous_period && previewData.previous_period.find(p => p.period_key === row.period_key)?.total_revenue || 0
                                )}
                              </TableCell>
                              <TableCell align="right">
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
                                  />
                                )}
                              </TableCell>
                            </>
                          ) : reportConfig.reportType === 'trend' ? (
                            <>
                              <TableCell>{row.period_label || `Period ${idx + 1}`}</TableCell>
                              <TableCell align="right">{formatCurrency(row.revenue)}</TableCell>
                              <TableCell align="right">{formatCurrency(row.moving_avg_7)}</TableCell>
                              <TableCell align="right">
                                <Chip 
                                  label={`${safeNumber(row.growth_rate).toFixed(1)}%`}
                                  color={safeNumber(row.growth_rate) >= 0 ? 'success' : 'error'}
                                  size="small"
                                />
                              </TableCell>
                            </>
                          ) : reportConfig.reportType === 'stylist' ? (
                            <>
                              <TableCell>{row.stylist_name || `Stylist ${idx + 1}`}</TableCell>
                              <TableCell align="right">{formatCurrency(row.total_revenue)}</TableCell>
                              <TableCell align="right">{safeNumber(row.total_appointments)}</TableCell>
                              <TableCell align="right">{formatCurrency(row.avg_revenue_per_appointment)}</TableCell>
                              <TableCell align="right">{safeNumber(row.unique_clients)}</TableCell>
                            </>
                          ) : (
                            <>
                              <TableCell>{row.period_label || row.service_name || `Item ${idx + 1}`}</TableCell>
                              <TableCell align="right">{formatCurrency(row.revenue || row.total_revenue)}</TableCell>
                              <TableCell align="right">{safeNumber(row.appointments || row.total_appointments)}</TableCell>
                              <TableCell align="right">
                                {formatCurrency(
                                  (safeNumber(row.revenue || row.total_revenue) / 
                                  Math.max(safeNumber(row.appointments || row.total_appointments), 1))
                                )}
                              </TableCell>
                              <TableCell align="right">{safeNumber(row.unique_clients)}</TableCell>
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
            <Paper elevation={2} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Key Insights
              </Typography>
              <Typography paragraph>
                {generateInsightsText(previewData, reportConfig)}
              </Typography>
            </Paper>
          )}
        </Box>
      )}
      
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </Container>
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
    
    return `The current period generated $${currentTotal.toFixed(2)} in revenue. This represents ${
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
    } from $${safeNumber(first.moving_avg_7).toFixed(2)} to $${safeNumber(last.moving_avg_7).toFixed(2)}.`;
  }
  
  if (config.reportType === 'stylist') {
    if (!data.rows || data.rows.length === 0) return "No stylist data available.";
    
    const sortedStylists = [...data.rows].sort((a, b) => 
      safeNumber(b.total_revenue) - safeNumber(a.total_revenue));
    
    const topStylist = sortedStylists[0];
    const totalRevenue = sortedStylists.reduce((sum, row) => sum + safeNumber(row.total_revenue), 0);
    const topPercentage = totalRevenue ? (safeNumber(topStylist.total_revenue) / Math.max(totalRevenue, 1)) * 100 : 0;
    const totalAppointments = sortedStylists.reduce((sum, row) => sum + safeNumber(row.total_appointments), 0);
    
    return `The top performing stylist was ${topStylist.stylist_name || 'Unknown'}, generating $${safeNumber(topStylist.total_revenue).toFixed(2)} (${topPercentage.toFixed(1)}% of total revenue) from ${safeNumber(topStylist.total_appointments)} appointments. The average revenue per appointment across all stylists was $${(totalRevenue / Math.max(totalAppointments, 1)).toFixed(2)}.`;
  }
  
  // Default insights for summary/detailed reports
  if (!data.rows || data.rows.length === 0) return "No data available.";
  
  const totalRevenue = data.rows.reduce((sum, row) => 
    sum + safeNumber(row.revenue || row.total_revenue), 0);
  
  const totalAppointments = data.rows.reduce((sum, row) => 
    sum + safeNumber(row.appointments || row.total_appointments), 0);
  
  const avgRevenue = totalRevenue / Math.max(totalAppointments, 1);
  
  return `The report covers ${totalAppointments} appointments generating $${totalRevenue.toFixed(2)} in total revenue, with an average of $${avgRevenue.toFixed(2)} per appointment.`;
};

export default RevenueReport;