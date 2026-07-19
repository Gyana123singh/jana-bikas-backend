const Donation = require('../models/Donation');
const Cause = require('../models/Cause');
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const isStripeEnabled = Boolean(stripeSecretKey) && !stripeSecretKey.includes('placeholder');
const stripe = isStripeEnabled ? require('stripe')(stripeSecretKey) : null;

// @desc    Create a new donation (Stripe Checkout Session)
// @route   POST /api/donations/create-payment-intent
const createPaymentIntent = async (req, res) => {
  try {
    const { totalAmount, cause, donationType, generalAmount, kits, kitsAmount, donor, frontendUrl } = req.body;

    if (!isStripeEnabled) {
      return res.json({
        clientSecret: 'mock_client_secret',
        paymentIntentId: `mock_${Date.now()}`,
        mockMode: true,
      });
    }

    const originUrl = frontendUrl || req.headers.origin || 'http://localhost:3000';

    // Create a Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'upi'],
      line_items: [{
        price_data: {
          currency: 'inr',
          product_data: {
            name: `Donation to Jana Bikas NGO - ${cause === 'general' ? 'General Support' : cause.replace('-', ' ')}`,
          },
          unit_amount: Math.round(totalAmount * 100),
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${originUrl}/donation-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${originUrl}/donate`,
      metadata: {
        cause,
        donationType,
        generalAmount: String(generalAmount),
        kitsAmount: String(kitsAmount),
        totalAmount: String(totalAmount),
        donorName: donor.fullName,
        donorEmail: donor.email,
        donorMobile: donor.mobile,
        donorPan: donor.pan || '',
        donorDob: donor.dob || '',
        donorAddress: donor.address || '',
        donorDisplayPublicly: String(donor.displayPublicly),
      },
    });

    res.json({
      checkoutUrl: session.url,
      sessionId: session.id,
      paymentIntentId: session.payment_intent,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Confirm donation after successful payment
// @route   POST /api/donations/confirm
const confirmDonation = async (req, res) => {
  try {
    const { sessionId, paymentIntentId } = req.body;

    let cause, donationType, generalAmount, kitsAmount, totalAmount, donor, paymentMode;
    let stripePaymentIntentId = paymentIntentId;

    if (!isStripeEnabled) {
      // Mock mode
      cause = req.body.cause;
      donationType = req.body.donationType;
      generalAmount = req.body.generalAmount;
      kitsAmount = req.body.kitsAmount;
      totalAmount = req.body.totalAmount;
      donor = req.body.donor;
      paymentMode = req.body.paymentMode || 'MOCK';
    } else if (sessionId) {
      // Retrieve Stripe Checkout Session to verify payment
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      console.log('Stripe Session retrieved: status =', session.status, ', payment_status =', session.payment_status, ', session_id =', session.id);
      if (session.payment_status !== 'paid') {
        return res.status(400).json({ message: 'Payment not completed' });
      }

      stripePaymentIntentId = session.payment_intent;

      // Check if donation already exists for this payment intent to avoid duplicates
      const existing = await Donation.findOne({ stripePaymentIntentId });
      if (existing) {
        return res.json({
          donationId: existing.donationId,
          amount: existing.totalAmount,
          date: existing.createdAt.toLocaleDateString('en-IN'),
          donorName: existing.donor.fullName,
          email: existing.donor.email,
          mobile: existing.donor.mobile,
          pan: existing.donor.pan,
          cause: existing.cause,
          paymentMode: existing.paymentMode,
          transactionId: existing.transactionId,
        });
      }

      // Extract metadata
      const meta = session.metadata;
      cause = meta.cause;
      donationType = meta.donationType;
      generalAmount = Number(meta.generalAmount || 0);
      kitsAmount = Number(meta.kitsAmount || 0);
      totalAmount = Number(meta.totalAmount || 0);
      donor = {
        fullName: meta.donorName,
        email: meta.donorEmail,
        mobile: meta.donorMobile,
        pan: meta.donorPan,
        dob: meta.donorDob,
        address: meta.donorAddress,
        displayPublicly: meta.donorDisplayPublicly === 'true',
      };
      // Determine payment mode (CARD or UPI) based on the PaymentIntent's payment method type
      paymentMode = 'CARD';
      try {
        if (stripePaymentIntentId) {
          const paymentIntent = await stripe.paymentIntents.retrieve(stripePaymentIntentId, {
            expand: ['payment_method']
          });
          if (paymentIntent.payment_method && paymentIntent.payment_method.type === 'upi') {
            paymentMode = 'UPI';
          }
        }
      } catch (err) {
        console.error('Error mapping stripe payment mode:', err);
      }
    } else {
      // Fallback verification for inline intents
      cause = req.body.cause;
      donationType = req.body.donationType;
      generalAmount = req.body.generalAmount;
      kitsAmount = req.body.kitsAmount;
      totalAmount = req.body.totalAmount;
      donor = req.body.donor;
      paymentMode = req.body.paymentMode || 'CARD';

      if (!paymentIntentId) {
        return res.status(400).json({ message: 'Payment Intent ID is required' });
      }
      // Verify payment intent with Stripe
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      if (paymentIntent.status !== 'succeeded') {
        return res.status(400).json({ message: 'Payment not completed' });
      }
    }

    // Generate donation ID
    const donationId = 'DON-' + Math.floor(10000 + Math.random() * 90000);
    const transactionId = 'TXN-' + Math.floor(100000000 + Math.random() * 900000000);

    const donation = await Donation.create({
      donationId,
      cause,
      donationType,
      generalAmount,
      kits: req.body.kits || [],
      kitsAmount: kitsAmount || 0,
      totalAmount,
      donor,
      paymentMode,
      transactionId,
      stripePaymentIntentId,
      status: 'completed',
    });

    // Update cause raised amount
    if (cause !== 'general') {
      const causeDoc = await Cause.findOne({ slug: cause });
      if (causeDoc) {
        causeDoc.raisedAmount += totalAmount;
        await causeDoc.save();
      }
    }

    res.json({
      donationId,
      amount: totalAmount,
      date: new Date().toLocaleDateString('en-IN'),
      donorName: donor.fullName,
      email: donor.email,
      mobile: donor.mobile,
      pan: donor.pan,
      cause,
      paymentMode,
      transactionId,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all donations (admin)
// @route   GET /api/donations
const getDonations = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const status = req.query.status;

    let query = {};
    if (status) query.status = status;

    const total = await Donation.countDocuments(query);
    const donations = await Donation.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      donations,
      page,
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single donation
// @route   GET /api/donations/:id
const getDonationById = async (req, res) => {
  try {
    const donation = await Donation.findOne({ donationId: req.params.id });
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }
    res.json(donation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get donation stats (admin dashboard)
// @route   GET /api/donations/stats
const getDonationStats = async (req, res) => {
  try {
    const totalDonations = await Donation.countDocuments({ status: 'completed' });
    const totalAmount = await Donation.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]);
    
    const monthlyData = await Donation.aggregate([
      { $match: { status: 'completed' } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
          total: { $sum: '$totalAmount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $limit: 12 },
    ]);

    const recentDonations = await Donation.find({ status: 'completed' })
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      totalDonations,
      totalAmount: totalAmount[0]?.total || 0,
      monthlyData,
      recentDonations,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update donation status (admin)
// @route   PUT /api/donations/:id
const updateDonation = async (req, res) => {
  try {
    const donation = await Donation.findOne({ donationId: req.params.id });
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    donation.status = req.body.status || donation.status;
    donation.receiptUrl = req.body.receiptUrl || donation.receiptUrl;
    donation.certificate80gUrl = req.body.certificate80gUrl || donation.certificate80gUrl;
    donation.form10beUrl = req.body.form10beUrl || donation.form10beUrl;

    const updated = await donation.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createPaymentIntent,
  confirmDonation,
  getDonations,
  getDonationById,
  getDonationStats,
  updateDonation,
};