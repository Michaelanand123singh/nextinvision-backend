// controllers/careerController.js
const Career = require('../models/Career');

exports.getAllCareers = async (req, res) => {
  try {
    const { featured, department, type, location } = req.query;
    let filter = {};
    
    if (featured === 'true') filter.featured = true;
    if (department) filter.department = new RegExp(department, 'i');
    if (type) filter.type = type;
    if (location) filter.location = new RegExp(location, 'i');

    const careers = await Career.find(filter).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: careers.length,
      data: careers
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.getCareerById = async (req, res) => {
  try {
    const career = await Career.findOne({ id: req.params.id });
    
    if (!career) {
      return res.status(404).json({
        success: false,
        message: 'Career not found'
      });
    }

    res.json({
      success: true,
      data: career
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.createCareer = async (req, res) => {
  try {
    const career = await Career.create(req.body);
    
    res.status(201).json({
      success: true,
      data: career
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.updateCareer = async (req, res) => {
  try {
    const career = await Career.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!career) {
      return res.status(404).json({
        success: false,
        message: 'Career not found'
      });
    }

    res.json({
      success: true,
      data: career
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

exports.deleteCareer = async (req, res) => {
  try {
    const career = await Career.findOneAndDelete({ id: req.params.id });

    if (!career) {
      return res.status(404).json({
        success: false,
        message: 'Career not found'
      });
    }

    res.json({
      success: true,
      message: 'Career deleted successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};