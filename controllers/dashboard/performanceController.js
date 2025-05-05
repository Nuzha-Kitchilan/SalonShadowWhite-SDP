const PerformanceModel = require('../../models/dashboard/performanceModel');

class PerformanceController {
  static async getTimeHeatmapData(req, res) {
    try {
      const { period = 'week' } = req.query;
      const data = await PerformanceModel.getTimeHeatmapData(period);
      
      res.json({
        success: true,
        data: data,
        message: 'Heatmap data retrieved successfully'
      });
    } catch (error) {
      console.error('Error fetching heatmap data:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve heatmap data'
      });
    }
  }
}

module.exports = PerformanceController;