const getStripeConfig = async (req, res) => {
  try {
    res.json({
      isEnabled: Boolean(process.env.STRIPE_SECRET_KEY && !process.env.STRIPE_SECRET_KEY.includes('placeholder')),
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || '',
      currency: process.env.STRIPE_CURRENCY || 'inr',
      mode: process.env.STRIPE_MODE || 'test',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getStripeConfig };
