// routes/service.js
const express = require('express');
const router = express.Router();
const {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  addServiceToCategory,
  removeServiceFromCategory
} = require('../controllers/serviceController');
const { protect, authorize } = require('../middleware/auth');
const { validateService, validateCategory } = require('../middleware/validation');

// Service routes
// Public routes
router.get('/services', getAllServices);
router.get('/services/:id', getServiceById);

// Protected routes (admin/editor only)
router.post('/services', protect, authorize('admin', 'editor'), validateService, createService);
router.put('/services/:id', protect, authorize('admin', 'editor'), validateService, updateService);
router.delete('/services/:id', protect, authorize('admin'), deleteService);

// Category routes
// Public routes
router.get('/categories', getAllCategories);
router.get('/categories/:id', getCategoryById);

// Protected routes (admin/editor only)
router.post('/categories', protect, authorize('admin', 'editor'), validateCategory, createCategory);
router.put('/categories/:id', protect, authorize('admin', 'editor'), validateCategory, updateCategory);
router.delete('/categories/:id', protect, authorize('admin'), deleteCategory);

// Category-Service relationship routes
router.post('/categories/:categoryId/services', protect, authorize('admin', 'editor'), validateService, addServiceToCategory);
router.delete('/categories/:categoryId/services/:serviceId', protect, authorize('admin'), removeServiceFromCategory);

module.exports = router;