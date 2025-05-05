const RevenueModel = require('../../models/dashboard/revenueModel');

exports.getRevenue = async (req, res) => {
    const range = req.query.range || 'weekly';
    try {
        const data = await RevenueModel.getRevenue(range);
        res.json({ range, revenue: data.total });
    } catch (error) {
        console.error('Error fetching revenue:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};




exports.getRevenueByService = async (req, res) => {
    const range = req.query.range || 'weekly';
    try {
        const data = await RevenueModel.getRevenueByService(range);
        res.json({ range, data });
    } catch (error) {
        console.error('Error fetching revenue by service:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.getStylistRevenue = async (req, res) => {
    const range = req.query.range || 'weekly';
    try {
        const data = await RevenueModel.getStylistRevenue(range);
        res.json({ range, data });
    } catch (error) {
        console.error('Error fetching stylist revenue:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


exports.getAverageTicket = async (req, res) => {
    const range = req.query.range || 'weekly';
    try {
        const data = await RevenueModel.getAverageTicket(range);
        res.json({ range, data });
    } catch (error) {
        console.error('Error fetching average ticket:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


exports.getDetailedRevenue = async (req, res) => {
    const range = req.query.range || 'weekly';
    
    try {
      const data = await RevenueModel.getDetailedRevenue(range);
      res.json({
        success: true,
        data
      });
    } catch (error) {
      console.error('Error fetching detailed revenue:', error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  };




  exports.getRevenueTrendData = async (req, res) => {
    try {
      const { type = 'week', year = new Date().getFullYear() } = req.query;
      
      // Validate type parameter
      const validTypes = ['week', 'month', 'year'];
      if (!validTypes.includes(type)) {
        return res.status(400).json({ 
          success: false, 
          error: 'Invalid type parameter. Expected: week, month, or year' 
        });
      }

      // Validate year parameter
      if (year && isNaN(year)) {
        return res.status(400).json({ 
          success: false, 
          error: 'Invalid year parameter' 
        });
      }

      const revenueData = await RevenueModel.getRevenueTrendData(type, year);

      // Format response data
      const formattedData = revenueData.map(item => ({
        period: item.period,
        revenue: parseFloat(item.totalRevenue),
        // Include additional date info for weekly reports
        ...(type === 'week' && item.start_date && item.end_date && {
          startDate: item.start_date,
          endDate: item.end_date
        })
      }));

      res.json({
        success: true,
        data: formattedData
      });
    } catch (error) {
      console.error('Error fetching revenue trend data:', error);
      res.status(500).json({ 
        success: false, 
        error: 'Server error',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
};