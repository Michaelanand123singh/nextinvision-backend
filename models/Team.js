const mongoose = require('mongoose');

const TeamMemberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  role: {
    type: String,
    required: [true, 'Role is required'],
    trim: true
  },
  image: {
    type: String,
    trim: true
  },
  bio: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/\S+@\S+\.\S+/, 'Please provide a valid email address']
  },
  linkedin: {
    type: String,
    trim: true,
    match: [/^https?:\/\/(www\.)?linkedin\.com\/.+$/, 'Please provide a valid LinkedIn URL']
  },
  twitter: {
    type: String,
    trim: true,
    match: [/^https?:\/\/(www\.)?twitter\.com\/.+$/, 'Please provide a valid Twitter URL']
  }
});

module.exports = mongoose.model('TeamMember', TeamMemberSchema);
