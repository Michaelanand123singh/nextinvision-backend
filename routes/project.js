const express = require('express');
const router = express.Router();
const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  getProjectStats,
  updateProjectProgress
} = require('../controllers/projectController');
const { protect } = require('../middleware/auth');
const { body, param, query } = require('express-validator');
const { validationResult } = require('express-validator');

// Validation middleware
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

// Validation rules
const createProjectValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Project title is required')
    .isLength({ max: 200 })
    .withMessage('Title cannot exceed 200 characters'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Project description is required')
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),
  body('status')
    .optional()
    .isIn(['upcoming', 'ongoing', 'completed', 'on_hold'])
    .withMessage('Invalid status'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'critical'])
    .withMessage('Invalid priority'),
  body('startDate')
    .optional()
    .isISO8601()
    .withMessage('Invalid start date format'),
  body('endDate')
    .optional()
    .isISO8601()
    .withMessage('Invalid end date format'),
  body('estimatedEndDate')
    .optional()
    .isISO8601()
    .withMessage('Invalid estimated end date format'),
  body('client')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Client name cannot exceed 100 characters'),
  body('teamMembers')
    .optional()
    .isArray()
    .withMessage('Team members must be an array'),
  body('budget')
    .optional()
    .isNumeric()
    .withMessage('Budget must be a number')
    .custom(value => {
      if (value < 0) {
        throw new Error('Budget cannot be negative');
      }
      return true;
    }),
  body('progress')
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage('Progress must be between 0 and 100'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array')
];

const updateProjectValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid project ID'),
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Project title cannot be empty')
    .isLength({ max: 200 })
    .withMessage('Title cannot exceed 200 characters'),
  body('description')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Project description cannot be empty')
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),
  body('status')
    .optional()
    .isIn(['upcoming', 'ongoing', 'completed', 'on_hold'])
    .withMessage('Invalid status'),
  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'critical'])
    .withMessage('Invalid priority'),
  body('startDate')
    .optional()
    .isISO8601()
    .withMessage('Invalid start date format'),
  body('endDate')
    .optional()
    .isISO8601()
    .withMessage('Invalid end date format'),
  body('estimatedEndDate')
    .optional()
    .isISO8601()
    .withMessage('Invalid estimated end date format'),
  body('client')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Client name cannot exceed 100 characters'),
  body('teamMembers')
    .optional()
    .isArray()
    .withMessage('Team members must be an array'),
  body('budget')
    .optional()
    .isNumeric()
    .withMessage('Budget must be a number')
    .custom(value => {
      if (value < 0) {
        throw new Error('Budget cannot be negative');
      }
      return true;
    }),
  body('progress')
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage('Progress must be between 0 and 100'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array')
];

const progressValidation = [
  param('id')
    .isMongoId()
    .withMessage('Invalid project ID'),
  body('progress')
    .isInt({ min: 0, max: 100 })
    .withMessage('Progress must be between 0 and 100')
];

const queryValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('status')
    .optional()
    .isIn(['upcoming', 'ongoing', 'completed', 'on_hold'])
    .withMessage('Invalid status filter'),
  query('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'critical'])
    .withMessage('Invalid priority filter')
];

// Apply authentication middleware to all routes
router.use(protect);

// Routes
// GET /api/projects/stats - Get project statistics (must be before /:id route)
router.get('/stats', getProjectStats);

// GET /api/projects - Get all projects with filtering
router.get('/', queryValidation, handleValidationErrors, getProjects);

// POST /api/projects - Create new project
router.post('/', createProjectValidation, handleValidationErrors, createProject);

// GET /api/projects/:id - Get single project
router.get('/:id', 
  param('id').isMongoId().withMessage('Invalid project ID'),
  handleValidationErrors,
  getProject
);

// PUT /api/projects/:id - Update project
router.put('/:id', updateProjectValidation, handleValidationErrors, updateProject);

// DELETE /api/projects/:id - Delete project
router.delete('/:id',
  param('id').isMongoId().withMessage('Invalid project ID'),
  handleValidationErrors,
  deleteProject
);

// PATCH /api/projects/:id/progress - Update project progress
router.patch('/:id/progress', progressValidation, handleValidationErrors, updateProjectProgress);

module.exports = router;