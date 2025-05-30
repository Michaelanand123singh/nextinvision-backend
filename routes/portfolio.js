// routes/portfolio.js
const express = require('express');
const router = express.Router();
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

// Protected routes (admin/editor only)
router.post('/', protect, authorize('admin', 'editor'), validatePortfolio, createPortfolio);
router.put('/:id', protect, authorize('admin', 'editor'), validatePortfolio, updatePortfolio);
router.delete('/:id', protect, authorize('admin'), deletePortfolio);

module.exports = router;