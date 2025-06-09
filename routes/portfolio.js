// Updated routes/portfolio.js
const express = require('express');
const router = express.Router();
const { uploadSingle } = require('../middleware/upload'); // Import the upload middleware
const {
  getAllPortfolios,
  getPortfolioById,
  createPortfolio,
  updatePortfolio,
  deletePortfolio
} = require('../controllers/portfolioController');
const { protect, authorize } = require('../middleware/auth');
const { validatePortfolio } = require('../middleware/validation');

// Public routes
router.get('/', getAllPortfolios);
router.get('/:id', getPortfolioById);

// Protected routes (admin/editor only) with image upload
router.post('/', protect, authorize('admin', 'editor'), uploadSingle('image'), validatePortfolio, createPortfolio);
router.put('/:id', protect, authorize('admin', 'editor'), uploadSingle('image'), validatePortfolio, updatePortfolio);
router.delete('/:id', protect, authorize('admin'), deletePortfolio);

module.exports = router;