const express = require('express');
const router = express.Router();
const { getAdminDashboard } = require('../controllers/adminController');
const { protect } = require('../middleware/auth');

router.get('/dashboard', protect, getAdminDashboard);

module.exports = router;