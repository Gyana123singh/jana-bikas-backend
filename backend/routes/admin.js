const express = require('express');
const router = express.Router();
const multer = require('multer');
const { getAdminDashboard } = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const { uploadToCloudinary } = require('../config/cloudinary');

// Setup multer memory storage
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

router.get('/dashboard', protect, getAdminDashboard);

router.post('/upload', protect, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an image file.' });
    }
    const hostUrl = `${req.protocol}://${req.get('host')}`;
    const result = await uploadToCloudinary(req.file, hostUrl);
    res.json({ url: result.url });
  } catch (error) {
    res.status(500).json({ message: error.message || 'File upload failed' });
  }
});

module.exports = router;