// controllers/portfolioController.js - Improved Version
const { Portfolio, TechProject, DigitalMarketingCampaign } = require('../models/Portfolio');

exports.createPortfolio = async (req, res) => {
  try {
    // Clean up the data before saving
    const cleanData = { ...req.body };
    
    // Clean up arrays - remove empty strings
    if (cleanData.technologies) {
      cleanData.technologies = cleanData.technologies.filter(tech => tech && tech.trim());
    }
    if (cleanData.services) {
      cleanData.services = cleanData.services.filter(service => service && service.trim());
    }
    
    // Clean up metrics - remove empty strings but keep the object structure
    if (cleanData.metrics) {
      Object.keys(cleanData.metrics).forEach(key => {
        if (cleanData.metrics[key] === '') {
          delete cleanData.metrics[key];
        }
      });
    }
    
    // Clean up empty URL fields
    if (cleanData.url === '') delete cleanData.url;
    if (cleanData.image === '') delete cleanData.image;
    
    let portfolio;
    const { type = 'Portfolio' } = cleanData; // Default to 'Portfolio' if not specified
    
    console.log('Creating portfolio with data:', cleanData); // Debug log
    
    // Create based on type
    switch (type) {
      case 'TechProject':
        portfolio = await TechProject.create(cleanData);
        break;
      case 'DigitalMarketingCampaign':
        portfolio = await DigitalMarketingCampaign.create(cleanData);
        break;
      default:
        // Default Portfolio type
        portfolio = await Portfolio.create(cleanData);
    }
    
    res.status(201).json({
      success: true,
      data: portfolio
    });
  } catch (error) {
    console.error('Portfolio creation error:', error); // Debug log
    
    // Handle validation errors more gracefully
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message
      }));
      
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }
    
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to create portfolio'
    });
  }
};

exports.updatePortfolio = async (req, res) => {
  try {
    // Clean up the data before updating
    const cleanData = { ...req.body };
    
    // Clean up arrays
    if (cleanData.technologies) {
      cleanData.technologies = cleanData.technologies.filter(tech => tech && tech.trim());
    }
    if (cleanData.services) {
      cleanData.services = cleanData.services.filter(service => service && service.trim());
    }
    
    // Clean up metrics
    if (cleanData.metrics) {
      Object.keys(cleanData.metrics).forEach(key => {
        if (cleanData.metrics[key] === '') {
          delete cleanData.metrics[key];
        }
      });
    }
    
    // Clean up empty URL fields
    if (cleanData.url === '') delete cleanData.url;
    if (cleanData.image === '') delete cleanData.image;

    const portfolio = await Portfolio.findByIdAndUpdate(
      req.params.id,
      cleanData,
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
    console.error('Portfolio update error:', error); // Debug log
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message
      }));
      
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }
    
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to update portfolio'
    });
  }
};

// Keep other methods the same
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