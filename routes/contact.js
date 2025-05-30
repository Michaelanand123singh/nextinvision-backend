// routes/contact.js
const express = require('express');
const router = express.Router();
const {
  getAllContacts,
  getContactById,
  createContact,
  deleteContact
} = require('../controllers/contactController');
const { protect, authorize } = require('../middleware/auth');
const { validateContact } = require('../middleware/validation');

// Public routes
router.post('/', validateContact, createContact);

// Protected routes (admin/editor only)
router.get('/', protect, authorize('admin', 'editor'), getAllContacts);
router.get('/:id', protect, authorize('admin', 'editor'), getContactById);
router.delete('/:id', protect, authorize('admin'), deleteContact);

module.exports = router;