const mongoose = require('mongoose');

const options = { discriminatorKey: 'type', timestamps: true };

const BasePortfolioSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: String,
  category: String,
  image: String,
  url: String,
  featured: { type: Boolean, default: false }
}, options);

const Portfolio = mongoose.model('Portfolio', BasePortfolioSchema);

const TechProjectSchema = new mongoose.Schema({
  technologies: [String],
  metrics: {
    users: String,
    transactions: String,
    uptime: String,
    performance: String,
  }
}, options);

const DigitalMarketingCampaignSchema = new mongoose.Schema({
  client: String,
  services: [String],
  metrics: {
    organicTraffic: String,
    keywordRankings: String,
    conversionRate: String,
    timeframe: String,
  }
}, options);

const TechProject = Portfolio.discriminator('TechProject', TechProjectSchema);
const DigitalMarketingCampaign = Portfolio.discriminator('DigitalMarketingCampaign', DigitalMarketingCampaignSchema);

module.exports = {
  Portfolio,
  TechProject,
  DigitalMarketingCampaign
};
