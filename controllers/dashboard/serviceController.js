// controllers/dashboard/serviceController.js
const serviceModel = require('../../models/dashboard/serviceModel');

const getServicePopularity = async (req, res) => {
  const { period } = req.query;
  
  try {
    const data = await serviceModel.getServicePopularity(period);
    res.status(200).json(data);
  } catch (error) {
    console.error('Error in getServicePopularity:', error);
    res.status(500).json({ 
      message: 'Internal server error',
      error: error.message
    });
  }
};

module.exports = {
  getServicePopularity
};