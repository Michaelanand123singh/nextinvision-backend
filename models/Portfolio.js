// models/Portfolio.js - Improved Version
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

// Create the base Portfolio model
const Portfolio = mongoose.model('Portfolio', BasePortfolioSchema);

// TechProject discriminator (inherits all base fields)
const TechProjectSchema = new mongoose.Schema({
  // Additional tech-specific fields if needed
}, options);

// DigitalMarketingCampaign discriminator (inherits all base fields)
const DigitalMarketingCampaignSchema = new mongoose.Schema({
  // Additional marketing-specific fields if needed
}, options);

// Create discriminators
const TechProject = Portfolio.discriminator('TechProject', TechProjectSchema);
const DigitalMarketingCampaign = Portfolio.discriminator('DigitalMarketingCampaign', DigitalMarketingCampaignSchema);

module.exports = {
  Portfolio,
  TechProject,
  DigitalMarketingCampaign
};