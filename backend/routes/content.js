const express = require('express');
const router = express.Router();
const { getSiteContent, upsertSiteContent } = require('../controllers/contentController');
const { protect } = require('../middleware/auth');

router.get('/', getSiteContent);
router.put('/', protect, upsertSiteContent);

module.exports = router;
