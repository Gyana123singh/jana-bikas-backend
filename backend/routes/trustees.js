const express = require('express');
const router = express.Router();
const { getTrustees, createTrustee, updateTrustee, deleteTrustee } = require('../controllers/trusteeController');
const { protect } = require('../middleware/auth');

// Public routes
router.get('/', getTrustees);

// Admin routes
router.post('/admin', protect, createTrustee);
router.put('/admin/:id', protect, updateTrustee);
router.delete('/admin/:id', protect, deleteTrustee);

module.exports = router;