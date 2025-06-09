// models/Portfolio.js - FIXED VERSION
const mongoose = require('mongoose');

// Single Portfolio Schema that handles all types
const PortfolioSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  category: { type: String, trim: true },
  image: { type: String, trim: true },
  url: { type: String, trim: true },
  featured: { type: Boolean, default: false },
  type: { 
    type: String, 
    enum: ['Portfolio', 'TechProject', 'DigitalMarketingCampaign'],
    default: 'Portfolio'
  },
  
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
}, { timestamps: true });

// Check if model exists before creating
const Portfolio = mongoose.models.Portfolio || mongoose.model('Portfolio', PortfolioSchema);

// Export only the Portfolio model
module.exports = Portfolio;