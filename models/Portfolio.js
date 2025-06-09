// models/Portfolio.js - Fixed Version
const mongoose = require('mongoose');

const options = { discriminatorKey: 'type', timestamps: true };

// Base Portfolio Schema with all possible fields
const BasePortfolioSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  category: { type: String, trim: true },
  image: { type: String, trim: true },
  url: { type: String, trim: true },
  featured: { type: Boolean, default: false },
  
  // Common fields for all types
  client: { type: String, trim: true },
  technologies: [{ type: String, trim: true }],
  services: [{ type: String, trim: true }],
  
  // Flexible metrics object to handle all metric types
  metrics: {
    // Tech Project metrics
    users: { type: String, trim: true },
    transactions: { type: String, trim: true },
    uptime: { type: String, trim: true },
    performance: { type: String, trim: true },
    
    // Digital Marketing metrics
    organicTraffic: { type: String, trim: true },
    keywordRankings: { type: String, trim: true },
    conversionRate: { type: String, trim: true },
    timeframe: { type: String, trim: true }
  }
}, options);

// Check if models already exist to prevent OverwriteModelError
let Portfolio, BasicPortfolio, TechProject, DigitalMarketingCampaign;

try {
  // Try to get existing models
  Portfolio = mongoose.model('Portfolio');
  BasicPortfolio = mongoose.model('BasicPortfolio');
  TechProject = mongoose.model('TechProject');
  DigitalMarketingCampaign = mongoose.model('DigitalMarketingCampaign');
} catch (error) {
  // Models don't exist, create them
  Portfolio = mongoose.model('Portfolio', BasePortfolioSchema);
  
  // Create discriminators with different names than the base model
  BasicPortfolio = Portfolio.discriminator('BasicPortfolio', new mongoose.Schema({
    // No additional fields needed for basic portfolio
  }, options));
  
  TechProject = Portfolio.discriminator('TechProject', new mongoose.Schema({
    // You can add tech-specific fields here if needed
  }, options));
  
  DigitalMarketingCampaign = Portfolio.discriminator('DigitalMarketingCampaign', new mongoose.Schema({
    // You can add marketing-specific fields here if needed
  }, options));
}

module.exports = {
  Portfolio,
  BasicPortfolio,
  TechProject,
  DigitalMarketingCampaign
};