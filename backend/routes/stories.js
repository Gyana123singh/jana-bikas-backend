const express = require('express');
const router = express.Router();
const {
  getStories,
  getStoryBySlug,
  getAllStories,
  createStory,
  updateStory,
  deleteStory,
} = require('../controllers/storyController');
const { protect } = require('../middleware/auth');

// Admin routes (must be before parameterized routes)
router.get('/admin/all', protect, getAllStories);
router.post('/admin', protect, createStory);
router.put('/admin/:id', protect, updateStory);
router.delete('/admin/:id', protect, deleteStory);

// Public routes
router.get('/', getStories);
router.get('/:slug', getStoryBySlug);

module.exports = router;