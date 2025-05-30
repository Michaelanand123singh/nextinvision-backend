const mongoose = require('mongoose');
const { Schema, model } = mongoose;

// Feature subdocument schema
const FeatureSchema = new Schema({
  icon: { type: String, required: true },  // e.g., "Smartphone", "Zap"
  text: { type: String, required: true }
});

// Service schema
const ServiceSchema = new Schema({
  icon: { type: String, required: true }, // icon name as string
  title: { type: String, required: true },
  headline: { type: String, required: true },
  description: { type: String, required: true },
  features: { type: [FeatureSchema], default: [] },
  gradient: { type: String, required: true },
  glowColor: { type: String, required: true },
  bgGradient: { type: String, required: true },
  borderGradient: { type: String, required: true }
}, { timestamps: true });

// Category schema containing services
const CategorySchema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  services: { type: [ServiceSchema], default: [] },
  color: { type: String, required: true },
  gradient: { type: String, required: true }
}, { timestamps: true });

// Export models
const Feature = model('Feature', FeatureSchema);       // Usually subdocs, optional export
const Service = model('Service', ServiceSchema);
const Category = model('Category', CategorySchema);

module.exports = {
  Feature,
  Service,
  Category
};
