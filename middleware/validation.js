
// middleware/validation.js
const { body, validationResult } = require('express-validator');

// Helper function to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// Career validation
exports.validateCareer = [
  body('id').isNumeric().withMessage('ID must be a number'),
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('department').trim().notEmpty().withMessage('Department is required'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('type').trim().notEmpty().withMessage('Type is required'),
  body('experience').trim().notEmpty().withMessage('Experience is required'),
  body('salary').trim().notEmpty().withMessage('Salary is required'),
  body('posted').trim().notEmpty().withMessage('Posted date is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('applyLink').isURL().withMessage('Apply link must be a valid URL'),
  body('featured').optional().isBoolean().withMessage('Featured must be a boolean'),
  body('requirements').optional().isArray().withMessage('Requirements must be an array'),
  body('skills').optional().isArray().withMessage('Skills must be an array'),
  body('benefits').optional().isArray().withMessage('Benefits must be an array'),
  handleValidationErrors
];

// Contact validation
exports.validateContact = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('message').trim().notEmpty().withMessage('Message is required'),
  body('company').optional().trim(),
  handleValidationErrors
];

// Portfolio validation
exports.validatePortfolio = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').optional().trim(),
  body('category').optional().trim(),
  body('image').optional().trim(),
  body('url').optional().isURL().withMessage('URL must be valid'),
  body('featured').optional().isBoolean().withMessage('Featured must be a boolean'),
  body('type').optional().isIn(['TechProject', 'DigitalMarketingCampaign']).withMessage('Invalid type'),
  body('technologies').optional().isArray().withMessage('Technologies must be an array'),
  body('client').optional().trim(),
  body('services').optional().isArray().withMessage('Services must be an array'),
  handleValidationErrors
];

// Service validation
exports.validateService = [
  body('icon').trim().notEmpty().withMessage('Icon is required'),
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('headline').trim().notEmpty().withMessage('Headline is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('gradient').trim().notEmpty().withMessage('Gradient is required'),
  body('glowColor').trim().notEmpty().withMessage('Glow color is required'),
  body('bgGradient').trim().notEmpty().withMessage('Background gradient is required'),
  body('borderGradient').trim().notEmpty().withMessage('Border gradient is required'),
  body('features').optional().isArray().withMessage('Features must be an array'),
  body('features.*.icon').optional().trim().notEmpty().withMessage('Feature icon is required'),
  body('features.*.text').optional().trim().notEmpty().withMessage('Feature text is required'),
  handleValidationErrors
];

// Category validation
exports.validateCategory = [
  body('id').trim().notEmpty().withMessage('Category ID is required'),
  body('name').trim().notEmpty().withMessage('Category name is required'),
  body('color').trim().notEmpty().withMessage('Color is required'),
  body('gradient').trim().notEmpty().withMessage('Gradient is required'),
  body('services').optional().isArray().withMessage('Services must be an array'),
  handleValidationErrors
];

// Team member validation
exports.validateTeamMember = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('role').trim().notEmpty().withMessage('Role is required'),
  body('bio').optional().trim(),
  body('image').optional().trim(),
  body('email').optional().isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('linkedin').optional().isURL().withMessage('LinkedIn must be a valid URL'),
  body('twitter').optional().isURL().withMessage('Twitter must be a valid URL'),
  handleValidationErrors
];

// Testimonial validation
exports.validateTestimonial = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('company').trim().notEmpty().withMessage('Company is required'),
  body('role').trim().notEmpty().withMessage('Role is required'),
  body('quote').trim().notEmpty().withMessage('Quote is required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  handleValidationErrors
];

// User validation
exports.validateUser = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').optional().isIn(['admin', 'editor']).withMessage('Role must be admin or editor'),
  handleValidationErrors
];

// User login validation
exports.validateLogin = [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidationErrors
];