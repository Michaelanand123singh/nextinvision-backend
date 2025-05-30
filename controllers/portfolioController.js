// controllers/portfolioController.js
const { Portfolio, TechProject, DigitalMarketingCampaign } = require('../models/Portfolio');

exports.getAllPortfolios = async (req, res) => {
  try {
    const { category, featured, type } = req.query;
    let filter = {};
    
    if (category) filter.category = new RegExp(category, 'i');
    if (featured === 'true') filter.featured = true;
    if (type) filter.type = type;

    const portfolios = await Portfolio.find(filter).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: portfolios.length,
      data: portfolios
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.getPortfolioById = async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id);
    
    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: 'Portfolio not found'
      });
    }

    res.json({
      success: true,
      data: portfolio
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.createPortfolio = async (req, res) => {
  try {
    let portfolio;
    const { type } = req.body;
    
    switch (type) {
      case 'TechProject':
        portfolio = await TechProject.create(req.body);
        break;
      case 'DigitalMarketingCampaign':
        portfolio = await DigitalMarketingCampaign.create(req.body);
        break;
      default:
        portfolio = await Portfolio.create(req.body);
    }
    
    res.status(201).json({
      success: true,
      data: portfolio
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.updatePortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: 'Portfolio not found'
      });
    }

    res.json({
      success: true,
      data: portfolio
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.deletePortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findByIdAndDelete(req.params.id);

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: 'Portfolio not found'
      });
    }

    res.json({
      success: true,
      message: 'Portfolio deleted successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};