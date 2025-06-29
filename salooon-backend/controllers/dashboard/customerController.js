const CustomerModel = require('../../models/dashboard/customerModel');

class CustomerController {
  static async getTopCustomers(req, res) {
    try {
      const { period = 'weekly' } = req.query;
      
      const topCustomers = await CustomerModel.getTopCustomers(period);
      
      res.json({
        success: true,
        data: topCustomers,
        message: 'Top customers retrieved successfully'
      });
    } catch (error) {
      console.error('Error in CustomerController.getTopCustomers:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to retrieve top customers',
        details: error.message
      });
    }
  }
}

module.exports = CustomerController;