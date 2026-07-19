const express = require('express');
const router = express.Router();
const {
  createPaymentIntent,
  confirmDonation,
  getDonations,
  getDonationById,
  getDonationStats,
  updateDonation,
  getPublicSupporters,
  searchPublicDonation,
  createOfflineDonation,
  submitOfflineReference,
} = require('../controllers/donationController');
const { protect } = require('../middleware/auth');

// Admin routes (must be before parameterized routes)
router.get('/', protect, getDonations);
router.get('/stats/summary', protect, getDonationStats);
router.put('/:id', protect, updateDonation);

// Public routes
router.get('/public/supporters', getPublicSupporters);
router.post('/public/search', searchPublicDonation);
router.post('/offline', createOfflineDonation);
router.post('/offline/confirm-ref', submitOfflineReference);
router.post('/create-payment-intent', createPaymentIntent);
router.post('/confirm', confirmDonation);
router.get('/:id', getDonationById);

module.exports = router;