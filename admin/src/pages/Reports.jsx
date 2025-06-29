import React, { useState, useMemo } from 'react';
import { 
  Container, Typography, Chip, TextField, Paper, Box, useMediaQuery, useTheme
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { 
  BarChart, TableChart, TrendingUp, 
  CompareArrows, People, Assessment 
} from '@mui/icons-material';
import { ReportForm } from '../components/reports/ReportForm';
import { ReportVisualization } from '../components/reports/ReportVisualization';
import { jwtDecode } from 'jwt-decode';

// Custom styled chip
const StyledChip = styled(Chip)(({ theme }) => ({
  backgroundColor: 'rgba(190, 175, 155, 0.15)',
  color: '#453C33',
  fontFamily: "'Poppins', 'Roboto', sans-serif",
  fontWeight: 600,
  border: '1px solid rgba(190, 175, 155, 0.3)',
  '& .MuiChip-icon': {
    color: '#BEAF9B',
  },
  '&:hover': {
    backgroundColor: 'rgba(190, 175, 155, 0.25)',
  },
}));

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
  const [adminName, setAdminName] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [reportConfig, setReportConfig] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)),
    endDate: new Date(),
    reportType: 'summary',
    groupBy: 'day',
    format: 'pdf'
  });

  // Get admin info from JWT token
  React.useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setAdminName(decodedToken.name || decodedToken.username || 'Admin');
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

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
    
   
    const data = previewData.rows || [];
    if (data.length === 0) {
      return {
        labels: [],
        datasets: [{
          label: 'Revenue',
          data: [],
          backgroundColor: 'rgba(190, 175, 155, 0.5)',
          borderColor: 'rgba(190, 175, 155, 1)',
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
            borderColor: '#BEAF9B',
            backgroundColor: 'rgba(190, 175, 155, 0.2)',
            yAxisID: 'y',
          },
          {
            label: '7-Period Moving Avg',
            data: data.map(item => {
              const movingAvg = Number(item.moving_avg_7 || 0); 
              return isNaN(movingAvg) ? 0 : movingAvg;
            }),
            borderColor: '#8B7355',
            backgroundColor: 'rgba(139, 115, 85, 0.2)',
            borderDash: [5, 5],
            yAxisID: 'y',
          },
          {
            label: 'Growth Rate (%)',
            data: data.map(item => {
              const growthRate = Number(item.growth_rate || 0);
              return isNaN(growthRate) ? 0 : growthRate;
            }),
            borderColor: '#D4C4A8',
            backgroundColor: 'rgba(212, 196, 168, 0.2)',
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
            backgroundColor: 'rgba(190, 175, 155, 0.6)',
            borderColor: '#BEAF9B',
            borderWidth: 2
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
          backgroundColor: 'rgba(190, 175, 155, 0.6)',
          borderColor: '#BEAF9B',
          borderWidth: 2
        }
      ]
    };
  }, [previewData, reportConfig.reportType]);

  // Helper function to safely get numerical values
  const safeNumber = (value) => {
    const num = Number(value);
    return isNaN(num) ? 0 : num;
  };
  
  // Helper function to safely format numbers
  const formatCurrency = (value) => {
    const num = safeNumber(value);
    return `Rs.${num.toFixed(2)}`;
  };

  // Get current time greeting (same as service page)
  const getCurrentTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <Container maxWidth="xl" sx={{ mt: { xs: 2, md: 4 } }}>
      <Paper 
        elevation={0}
        sx={{ 
          borderRadius: '8px',
          overflow: 'hidden',
          border: '1px solid rgba(190, 175, 155, 0.2)',
          mb: 4,
          background: 'linear-gradient(to right, rgba(190, 175, 155, 0.1), rgba(255, 255, 255, 0.8))',
        }}
      >
        <Box sx={{ p: { xs: 2, md: 3 }, borderBottom: '1px solid rgba(190, 175, 155, 0.2)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 2, mb: 2 }}>
            <Typography 
              variant={isMobile ? "h5" : "h4"} 
              component="h1" 
              sx={{ 
                fontFamily: "'Poppins', 'Roboto', sans-serif",
                fontWeight: 600,
                color: '#453C33',
                display: 'flex',
                alignItems: 'center',
                gap: 2
              }}
            >
              <Assessment sx={{ color: '#BEAF9B', fontSize: { xs: '1.5rem', md: '2rem' } }} />
              Advanced Revenue Analytics
            </Typography>
            
            <StyledChip 
              label={reportTypes.find(r => r.value === reportConfig.reportType)?.label || 'Report'} 
              icon={reportTypes.find(r => r.value === reportConfig.reportType)?.icon}
              size={isMobile ? "small" : "medium"}
            />
          </Box>
          
          <Typography 
            variant="body1" 
            sx={{ 
              fontFamily: "'Poppins', 'Roboto', sans-serif",
              color: '#666',
              mb: 1
            }}
          >
            {getCurrentTimeGreeting()}, {adminName}. Generate comprehensive revenue reports and analytics here.
          </Typography>
        </Box>
        
        <Box sx={{ p: { xs: 2, md: 3 } }}>
          <ReportForm
            reportConfig={reportConfig}
            setReportConfig={setReportConfig}
            loading={loading}
            handlePreview={handlePreview}
            handleDownload={handleDownload}
            previewData={previewData}
            reportTypes={reportTypes}
            groupByOptions={groupByOptions}
          />
        </Box>
      </Paper>
      
      {previewData && (
        <Paper 
          elevation={0}
          sx={{ 
            borderRadius: '8px',
            overflow: 'hidden',
            border: '1px solid rgba(190, 175, 155, 0.2)',
            background: 'rgba(255, 255, 255, 0.9)',
          }}
        >
          <ReportVisualization
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            previewData={previewData}
            reportConfig={reportConfig}
            generateChartData={generateChartData}
            formatCurrency={formatCurrency}
            safeNumber={safeNumber}
            error={error}
          />
        </Paper>
      )}
    </Container>
  );
};

export default RevenueReport;