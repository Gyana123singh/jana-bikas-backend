const express = require('express');
const router = express.Router();
const { loginAdmin, getAdminProfile, seedAdmin, changeAdminPassword } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/login', loginAdmin);
router.get('/profile', protect, getAdminProfile);
router.put('/password', protect, changeAdminPassword);
router.post('/seed', seedAdmin);

module.exports = router;