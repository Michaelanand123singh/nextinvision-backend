const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const CareerSchema = new Schema({
  id: { type: Number, required: true, unique: true },  // Job ID
  title: { type: String, required: true },             // Job title
  department: { type: String, required: true },
  location: { type: String, required: true },
  type: { type: String, required: true },               // e.g., Part-Time, Full-Time
  experience: { type: String, required: true },         // Experience required
  salary: { type: String, required: true },             // Salary info (string for flexibility)
  posted: { type: String, required: true },             // When posted, e.g., "2 days ago"
  description: { type: String, required: true },
  requirements: { type: [String], default: [] },         // List of requirements
  skills: { type: [String], default: [] },               // List of skills
  benefits: { type: [String], default: [] },             // List of benefits
  applyLink: { type: String, required: true },           // URL to application form
  featured: { type: Boolean, default: false }            // Highlight if featured job
}, { timestamps: true });                                 // createdAt and updatedAt

module.exports = model('Career', CareerSchema);
