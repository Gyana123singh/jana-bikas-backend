const express = require('express');
const router = express.Router();
const { getStripeConfig } = require('../controllers/stripeConfigController');

router.get('/config', getStripeConfig);

module.exports = router;
