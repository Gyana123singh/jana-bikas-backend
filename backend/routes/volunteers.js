const express = require('express');
const router = express.Router();
const { submitVolunteer, getVolunteers, updateVolunteer, deleteVolunteer } = require('../controllers/volunteerController');
const { protect } = require('../middleware/auth');

// Public routes
router.post('/', submitVolunteer);

// Admin routes
router.get('/admin', protect, getVolunteers);
router.put('/admin/:id', protect, updateVolunteer);
router.delete('/admin/:id', protect, deleteVolunteer);

module.exports = router;