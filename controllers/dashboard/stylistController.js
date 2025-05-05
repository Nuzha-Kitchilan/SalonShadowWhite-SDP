// controllers/dashboard/stylistController.js
const stylistModel = require('../../models/dashboard/stylistModel');

const getStylistPopularity = async (req, res) => {
  const { period } = req.query;
  
  try {
    const data = await stylistModel.getStylistPopularity(period);
    res.status(200).json(data);
  } catch (error) {
    console.error('Error in getStylistPopularity:', error);
    res.status(500).json({ 
      message: 'Internal server error',
      error: error.message
    });
  }
};

module.exports = {
  getStylistPopularity
};