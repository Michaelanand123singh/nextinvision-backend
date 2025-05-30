// routes/testimonial.js
const express = require('express');
const router = express.Router();
const {
  getAllTestimonials,
  getTestimonialById,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial
} = require('../controllers/testimonialController');
const { protect, authorize } = require('../middleware/auth');
const { validateTestimonial } = require('../middleware/validation');

// Public routes
router.get('/', getAllTestimonials);
router.get('/:id', getTestimonialById);

// Mixed routes - testimonials can be created by public but managed by admin
router.post('/', validateTestimonial, createTestimonial);

// Protected routes (admin/editor only)
router.put('/:id', protect, authorize('admin', 'editor'), validateTestimonial, updateTestimonial);
router.delete('/:id', protect, authorize('admin'), deleteTestimonial);

module.exports = router;