const express = require('express');
const router = express.Router();
const {
  getCauses,
  getCauseBySlug,
  getAllCauses,
  createCause,
  updateCause,
  deleteCause,
} = require('../controllers/causeController');
const { protect } = require('../middleware/auth');

// Admin routes (must be before parameterized routes)
router.get('/admin/all', protect, getAllCauses);
router.post('/admin', protect, createCause);
router.put('/admin/:id', protect, updateCause);
router.delete('/admin/:id', protect, deleteCause);

// Public routes
router.get('/', getCauses);
router.get('/:slug', getCauseBySlug);

module.exports = router;