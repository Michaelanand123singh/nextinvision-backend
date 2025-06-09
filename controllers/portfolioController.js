// controllers/portfolioController.js - FIXED VERSION
const Portfolio = require('../models/Portfolio'); // Import the single Portfolio model

exports.createPortfolio = async (req, res) => {
  try {
    // Clean up the data before saving
    const cleanData = { ...req.body };
    
    // Set default type if not provided
    if (!cleanData.type) {
      cleanData.type = 'Portfolio';
    }
    
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
        if (cleanData.metrics[key] === '' || cleanData.metrics[key] === null || cleanData.metrics[key] === undefined) {
          delete cleanData.metrics[key];
        }
      });
      
      // If metrics object is empty after cleanup, remove it
      if (Object.keys(cleanData.metrics).length === 0) {
        delete cleanData.metrics;
      }
    }
    
    // Clean up empty URL fields
    if (cleanData.url === '') delete cleanData.url;
    if (cleanData.image === '') delete cleanData.image;
    if (cleanData.description === '') delete cleanData.description;
    if (cleanData.category === '') delete cleanData.category;
    if (cleanData.client === '') delete cleanData.client;
    
    console.log('Creating portfolio with cleaned data:', JSON.stringify(cleanData, null, 2));
    
    // Create the portfolio using the single Portfolio model
    const portfolio = new Portfolio(cleanData);
    
    // Save the portfolio
    await portfolio.save();
    
    res.status(201).json({
      success: true,
      data: portfolio
    });
    
  } catch (error) {
    console.error('Portfolio creation error:', error);
    
    // Handle validation errors more gracefully
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message,
        value: err.value
      }));
      
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors
      });
    }
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Duplicate entry detected',
        error: error.keyValue
      });
    }
    
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create portfolio',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
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
        if (cleanData.metrics[key] === '' || cleanData.metrics[key] === null || cleanData.metrics[key] === undefined) {
          delete cleanData.metrics[key];
        }
      });
      
      if (Object.keys(cleanData.metrics).length === 0) {
        delete cleanData.metrics;
      }
    }
    
    // Clean up empty fields
    if (cleanData.url === '') delete cleanData.url;
    if (cleanData.image === '') delete cleanData.image;
    if (cleanData.description === '') delete cleanData.description;
    if (cleanData.category === '') delete cleanData.category;
    if (cleanData.client === '') delete cleanData.client;

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
    console.error('Portfolio update error:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message,
        value: err.value
      }));
      
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors
      });
    }
    
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update portfolio'
    });
  }
};

exports.getAllPortfolios = async (req, res) => {
  try {
    // Add error checking for Portfolio model
    if (!Portfolio) {
      console.error('Portfolio model is undefined');
      return res.status(500).json({
        success: false,
        message: 'Portfolio model not properly initialized'
      });
    }

    const { category, featured, type } = req.query;
    let filter = {};
    
    if (category) filter.category = new RegExp(category, 'i');
    if (featured === 'true') filter.featured = true;
    if (type) filter.type = type;

    console.log('Fetching portfolios with filter:', filter);
    
    const portfolios = await Portfolio.find(filter).sort({ createdAt: -1 });
    
    console.log(`Found ${portfolios.length} portfolios`);
    
    res.json({
      success: true,
      count: portfolios.length,
      data: portfolios
    });
  } catch (error) {
    console.error('Get portfolios error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch portfolios'
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
    console.error('Get portfolio by ID error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch portfolio'
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
    console.error('Delete portfolio error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete portfolio'
    });
  }
};