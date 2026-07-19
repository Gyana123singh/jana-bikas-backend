const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getPlatforms,
  trackPlatformClick,
  getPosts,
  likePost,
  commentPost,
  sharePost,
  getSocialAnalytics,
  getAllPlatformsAdmin,
  createPlatform,
  updatePlatform,
  deletePlatform,
  getAllPostsAdmin,
  createPost,
  updatePost,
  deletePost
} = require('../controllers/socialController');

// Public routes
router.get('/platforms', getPlatforms);
router.post('/platforms/:id/click', trackPlatformClick);
router.get('/posts', getPosts);
router.post('/posts/:id/like', likePost);
router.post('/posts/:id/comment', commentPost);
router.post('/posts/:id/share', sharePost);

// Admin routes
router.get('/admin/analytics', protect, getSocialAnalytics);
router.get('/platforms/admin/all', protect, getAllPlatformsAdmin);
router.post('/platforms/admin', protect, createPlatform);
router.put('/platforms/admin/:id', protect, updatePlatform);
router.delete('/platforms/admin/:id', protect, deletePlatform);

router.get('/posts/admin/all', protect, getAllPostsAdmin);
router.post('/posts/admin', protect, createPost);
router.put('/posts/admin/:id', protect, updatePost);
router.delete('/posts/admin/:id', protect, deletePost);

module.exports = router;
