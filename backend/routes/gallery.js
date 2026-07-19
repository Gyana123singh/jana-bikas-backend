const express = require('express');
const router = express.Router();
const {
  getGallery,
  getAllGallery,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
} = require('../controllers/galleryController');
const { protect } = require('../middleware/auth');

// Public routes
router.get('/', getGallery);

// Admin routes
router.get('/admin/all', protect, getAllGallery);
router.post('/admin', protect, createGalleryItem);
router.put('/admin/:id', protect, updateGalleryItem);
router.delete('/admin/:id', protect, deleteGalleryItem);

module.exports = router;