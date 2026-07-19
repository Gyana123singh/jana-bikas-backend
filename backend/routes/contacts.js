const express = require('express');
const router = express.Router();
const { submitContact, getContacts, updateContact, deleteContact } = require('../controllers/contactController');
const { protect } = require('../middleware/auth');

// Public routes
router.post('/', submitContact);

// Admin routes
router.get('/admin', protect, getContacts);
router.put('/admin/:id', protect, updateContact);
router.delete('/admin/:id', protect, deleteContact);

module.exports = router;