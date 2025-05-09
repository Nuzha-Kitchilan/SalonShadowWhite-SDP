import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Select, MenuItem, Box } from '@mui/material';
import axios from 'axios';

const RevenueCard = () => {
    const [range, setRange] = useState('weekly');
    const [revenue, setRevenue] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRevenue = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`http://localhost:5001/api/revenue?range=${range}`);
                const revenueValue = typeof res.data.revenue === 'number' 
                    ? res.data.revenue 
                    : parseFloat(res.data.revenue) || 0;
                setRevenue(revenueValue);
            } catch (err) {
                console.error('Failed to fetch revenue:', err);
                setRevenue(0);
            } finally {
                setLoading(false);
            }
        };
        fetchRevenue();
    }, [range]);

    return (
        <Card sx={{ height: '100%' , width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
            <CardContent sx={{ p: 2 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="subtitle1" color="text.secondary">
                        Revenue
                    </Typography>
                    <Select 
                        value={range} 
                        onChange={(e) => setRange(e.target.value)} 
                        size="small"
                        disabled={loading}
                        sx={{ 
                            height: 30,
                            fontSize: '0.875rem',
                            '& .MuiSelect-select': { py: 0.5 }
                        }}
                    >
                        <MenuItem value="weekly" sx={{ fontSize: '0.875rem' }}>Weekly</MenuItem>
                        <MenuItem value="monthly" sx={{ fontSize: '0.875rem' }}>Monthly</MenuItem>
                        <MenuItem value="yearly" sx={{ fontSize: '0.875rem' }}>Yearly</MenuItem>
                    </Select>
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    {loading ? '...' : `$${revenue.toFixed(2)}`}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default RevenueCard;