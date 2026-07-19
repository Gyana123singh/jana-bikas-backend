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

    const previousStatus = donation.status;
    donation.status = req.body.status || donation.status;
    donation.receiptUrl = req.body.receiptUrl || donation.receiptUrl;
    donation.certificate80gUrl = req.body.certificate80gUrl || donation.certificate80gUrl;
    donation.form10beUrl = req.body.form10beUrl || donation.form10beUrl;
    if (req.body.transactionId) {
      donation.transactionId = req.body.transactionId;
    }

    const updated = await donation.save();

    // If donation status transitions to completed, increment the cause raised amount
    if (updated.status === 'completed' && previousStatus !== 'completed') {
      if (updated.cause && updated.cause !== 'general') {
        const causeDoc = await Cause.findOne({ slug: updated.cause });
        if (causeDoc) {
          causeDoc.raisedAmount = (causeDoc.raisedAmount || 0) + updated.totalAmount;
          await causeDoc.save();
        }
      }
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get public completed donors for supporters list
// @route   GET /api/donations/public/supporters
const getPublicSupporters = async (req, res) => {
  try {
    let donations = await Donation.find({ status: 'completed' })
      .select('totalAmount donor.fullName donor.displayPublicly createdAt')
      .sort({ createdAt: -1 });

    // Auto-seed default donors if the collection is empty
    if (donations.length === 0) {
      await Donation.insertMany([
        {
          donationId: 'DON-10001', cause: 'education', donationType: 'one-time',
          generalAmount: 25000, kits: [], kitsAmount: 0, totalAmount: 25000,
          donor: { fullName: 'Rajesh Kumar Singhal', email: 'rajesh.singhal@email.com', mobile: '9876543210', pan: 'ABCPS1234R', dob: '1978-05-12', address: 'Sector 15, Noida, UP', displayPublicly: true },
          paymentMode: 'UPI', transactionId: 'TXN-900000001', stripePaymentIntentId: 'mock_seed_1', status: 'completed', createdAt: new Date('2026-07-18T10:30:00Z')
        },
        {
          donationId: 'DON-10002', cause: 'health-care', donationType: 'monthly',
          generalAmount: 10000, kits: [{ id: 'med', name: 'Medical Health Kit', price: 2500, qty: 2 }], kitsAmount: 5000, totalAmount: 15000,
          donor: { fullName: 'Dr. Ananya Sharma', email: 'ananya.sharma@hospital.org', mobile: '9012345678', pan: 'BNAPS5678K', dob: '1985-11-03', address: 'Civil Lines, Lucknow, UP', displayPublicly: true },
          paymentMode: 'CARD', transactionId: 'TXN-900000002', stripePaymentIntentId: 'mock_seed_2', status: 'completed', createdAt: new Date('2026-07-15T14:20:00Z')
        },
        {
          donationId: 'DON-10003', cause: 'environment', donationType: 'one-time',
          generalAmount: 50000, kits: [], kitsAmount: 0, totalAmount: 50000,
          donor: { fullName: 'Sunil Verma', email: 'sunil.verma@private.com', mobile: '8899776655', pan: 'CCCPV9999L', dob: '1970-01-22', address: 'MG Road, Jaipur, Rajasthan', displayPublicly: false },
          paymentMode: 'NETBANKING', transactionId: 'TXN-900000003', stripePaymentIntentId: 'mock_seed_3', status: 'completed', createdAt: new Date('2026-07-10T09:00:00Z')
        },
        {
          donationId: 'DON-10004', cause: 'general', donationType: 'one-time',
          generalAmount: 5000, kits: [{ id: 'edu', name: 'Education Kit', price: 500, qty: 4 }], kitsAmount: 2000, totalAmount: 7000,
          donor: { fullName: 'Priya Mehra', email: 'priya.mehra@gmail.com', mobile: '7788996655', pan: '', dob: '1992-08-30', address: 'Varanasi, UP', displayPublicly: true },
          paymentMode: 'UPI', transactionId: 'TXN-900000004', stripePaymentIntentId: 'mock_seed_4', status: 'completed', createdAt: new Date('2026-07-05T16:45:00Z')
        },
        {
          donationId: 'DON-10005', cause: 'empowerment', donationType: 'one-time',
          generalAmount: 100000, kits: [], kitsAmount: 0, totalAmount: 100000,
          donor: { fullName: 'Vikram Singh Chauhan', email: 'vikram@industry.co.in', mobile: '9988776655', pan: 'DDDPC1111M', dob: '1965-03-14', address: 'Bandra West, Mumbai, Maharashtra', displayPublicly: true },
          paymentMode: 'CARD', transactionId: 'TXN-900000005', stripePaymentIntentId: 'mock_seed_5', status: 'completed', createdAt: new Date('2026-06-28T11:00:00Z')
        },
        {
          donationId: 'DON-10006', cause: 'agriculture', donationType: 'monthly',
          generalAmount: 2000, kits: [{ id: 'food', name: 'Food Support Pack', price: 1000, qty: 3 }], kitsAmount: 3000, totalAmount: 5000,
          donor: { fullName: 'Kiran Devi Yadav', email: 'kiran.yadav@outlook.com', mobile: '9123456780', pan: '', dob: '1988-12-05', address: 'Patna, Bihar', displayPublicly: true },
          paymentMode: 'UPI', transactionId: 'TXN-900000006', stripePaymentIntentId: 'mock_seed_6', status: 'completed', createdAt: new Date('2026-06-20T08:15:00Z')
        },
        {
          donationId: 'DON-10007', cause: 'education', donationType: 'one-time',
          generalAmount: 30000, kits: [], kitsAmount: 0, totalAmount: 30000,
          donor: { fullName: 'Arun Prakash Jha', email: 'arun.jha@corp.in', mobile: '8877665544', pan: 'EEEPJ2222N', dob: '1982-07-19', address: 'Ranchi, Jharkhand', displayPublicly: true },
          paymentMode: 'NETBANKING', transactionId: 'TXN-900000007', stripePaymentIntentId: 'mock_seed_7', status: 'completed', createdAt: new Date('2026-06-15T13:30:00Z')
        },
        {
          donationId: 'DON-10008', cause: 'health-care', donationType: 'one-time',
          generalAmount: 20000, kits: [], kitsAmount: 0, totalAmount: 20000,
          donor: { fullName: 'Confidential Donor', email: 'private@email.com', mobile: '9000000000', pan: '', dob: '', address: '', displayPublicly: false },
          paymentMode: 'CARD', transactionId: 'TXN-900000008', stripePaymentIntentId: 'mock_seed_8', status: 'completed', createdAt: new Date('2026-06-10T17:00:00Z')
        }
      ]);

      // Re-query after seeding
      donations = await Donation.find({ status: 'completed' })
        .select('totalAmount donor.fullName donor.displayPublicly createdAt')
        .sort({ createdAt: -1 });
    }

    const publicDonors = donations.map(d => ({
      _id: d._id,
      isAnonymous: !d.donor.displayPublicly,
      name: d.donor.displayPublicly ? d.donor.fullName : 'Anonymous Supporter',
      amount: d.donor.displayPublicly ? d.totalAmount : 0,
      date: new Date(d.createdAt).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }));

    res.json(publicDonors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Search public donation by ID and Mobile for Downloads page
// @route   POST /api/donations/public/search
const searchPublicDonation = async (req, res) => {
  try {
    const { donationId, mobile } = req.body;
    if (!donationId || !mobile) {
      return res.status(400).json({ message: 'Donation ID and Mobile registration number are required.' });
    }

    const donation = await Donation.findOne({
      donationId: { $regex: new RegExp(`^${donationId.trim()}$`, 'i') },
      'donor.mobile': mobile.trim(),
      status: 'completed'
    });

    if (!donation) {
      return res.status(404).json({ message: 'No completed donation record matches that ID and Mobile number.' });
    }

    res.json({
      donationId: donation.donationId,
      donorName: donation.donor.fullName,
      mobile: donation.donor.mobile,
      email: donation.donor.email,
      pan: donation.donor.pan,
      amount: donation.totalAmount,
      cause: donation.cause,
      paymentMode: donation.paymentMode,
      transactionId: donation.transactionId,
      date: new Date(donation.createdAt).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new offline donation (Bank Transfer / QR Scan)
// @route   POST /api/donations/offline
const createOfflineDonation = async (req, res) => {
  try {
    const { totalAmount, cause, generalAmount, kits, kitsAmount, donor, paymentMode } = req.body;

    if (!totalAmount || isNaN(totalAmount) || totalAmount <= 0) {
      return res.status(400).json({ message: 'A valid donation amount is required.' });
    }
    if (!donor || !donor.fullName || !donor.email || !donor.mobile) {
      return res.status(400).json({ message: 'Donor name, email, and mobile are required.' });
    }

    // Generate donation ID
    const donationId = 'DON-' + Math.floor(10000 + Math.random() * 90000);
    
    const donation = await Donation.create({
      donationId,
      cause: cause || 'general',
      donationType: req.body.donationType || 'one-time',
      generalAmount: generalAmount || totalAmount,
      kits: kits || [],
      kitsAmount: kitsAmount || 0,
      totalAmount,
      donor,
      paymentMode: paymentMode || 'BANK_TRANSFER',
      status: 'pending',
    });

    res.status(201).json(donation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update UTR transaction reference for offline donation
// @route   POST /api/donations/offline/confirm-ref
const submitOfflineReference = async (req, res) => {
  try {
    const { donationId, transactionId } = req.body;
    if (!donationId || !transactionId) {
      return res.status(400).json({ message: 'Donation ID and Transaction Reference are required.' });
    }

    const donation = await Donation.findOne({ donationId: donationId.trim() });
    if (!donation) {
      return res.status(404).json({ message: 'Donation record not found.' });
    }

    donation.transactionId = transactionId.trim();
    await donation.save();

    res.json({ success: true, message: 'Reference submitted successfully.', donation });
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
  getPublicSupporters,
  searchPublicDonation,
  createOfflineDonation,
  submitOfflineReference,
};