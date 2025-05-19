// ReportTable.jsx
import React from 'react';
import { 
  Paper, Typography, TableContainer, Table, 
  TableHead, TableBody, TableRow, TableCell, Chip 
} from '@mui/material';

const formatCurrency = (value) => {
  const num = Number(value);
  return isNaN(num) ? '$0.00' : `$${num.toFixed(2)}`;
};

const safeNumber = (value) => {
  const num = Number(value);
  return isNaN(num) ? 0 : num;
};

const ReportTable = ({ reportConfig, previewData }) => {
  if (!previewData) return null;

  return (
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
            {(previewData.rows || previewData.current_period || []).slice(0, 50).map((row, idx) => (
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
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default ReportTable;