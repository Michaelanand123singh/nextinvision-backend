
// routes/career.js
const express = require('express');
const router = express.Router();
const {
  getAllCareers,
  getCareerById,
  createCareer,
  updateCareer,
  deleteCareer
} = require('../controllers/careerController');
const { protect, authorize } = require('../middleware/auth');
const { validateCareer } = require('../middleware/validation');

// Public routes
router.get('/', getAllCareers);
router.get('/:id', getCareerById);

// Protected routes (admin/editor only)
router.post('/', protect, authorize('admin', 'editor'), validateCareer, createCareer);
router.put('/:id', protect, authorize('admin', 'editor'), validateCareer, updateCareer);
router.delete('/:id', protect, authorize('admin'), deleteCareer);

module.exports = router;