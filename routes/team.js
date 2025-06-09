// Updated routes/team.js
const express = require('express');
const router = express.Router();
const { uploadSingle } = require('../middleware/upload'); // Import the upload middleware
const {
  getAllTeamMembers,
  getTeamMemberById,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember
} = require('../controllers/teamController');
const { protect, authorize } = require('../middleware/auth');
const { validateTeamMember } = require('../middleware/validation');

// Public routes
router.get('/', getAllTeamMembers);
router.get('/:id', getTeamMemberById);

// Protected routes (admin/editor only) with image upload
router.post('/', protect, authorize('admin', 'editor'), uploadSingle('image'), validateTeamMember, createTeamMember);
router.put('/:id', protect, authorize('admin', 'editor'), uploadSingle('image'), validateTeamMember, updateTeamMember);
router.delete('/:id', protect, authorize('admin'), deleteTeamMember);

module.exports = router;