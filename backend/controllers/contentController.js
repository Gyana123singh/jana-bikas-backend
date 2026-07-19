const SiteContent = require('../models/SiteContent');

const defaultContent = {
  siteName: 'Jana Bikas NGO',
  heroTitle: 'Create lasting impact through every act of kindness',
  heroSubtitle: 'Modern, transparent, and compassionate support for communities that need it most.',
  heroCtaText: 'Support the mission',
  aboutTitle: 'A premium experience for purpose-driven giving',
  aboutSubtitle: 'Your donations power education, healthcare, skill development, and environmental care with measurable impact.',
  paymentHeading: 'Secure and elegant giving experience',
  paymentText: 'Every donation is protected by modern payment rails, 80G-ready documentation, and complete transparency.',
  trustBadges: ['Transparent reporting', 'Fast digital receipts', 'Trusted by donors'],
  donationPresets: [500, 1000, 2000, 5000, 10000, 15000, 20000, 30000],
  essentialsKits: [
    { id: 'edu', name: 'Education Kit', price: 500, description: 'Books and stationery for a child.' },
    { id: 'food', name: 'Food Support Pack', price: 1000, description: 'Dry grocery provisions for a family.' },
    { id: 'med', name: 'Medical Health Kit', price: 2500, description: 'Diagnostic checks and basic medicines.' }
  ],
  galleryCategories: ['Education', 'Health Care', 'Environment', 'Agriculture', 'Empowerment'],
  bankDetails: {
    holderName: "JANA BIKAS NGO",
    bankName: "State Bank of India",
    accNumber: "39024564810",
    ifsc: "SBIN0000045",
    branch: "Boring Road Patna Branch",
    upiId: "janabikasngo@sbi",
    qrCodeUrl: ""
  }
};

const getSiteContent = async (req, res) => {
  try {
    let content = await SiteContent.findOne({ key: 'default' });
    if (!content) {
      content = await SiteContent.create({ key: 'default', content: defaultContent });
    } else {
      // Ensure existing site content has defaults for presets, kits, and gallery categories
      let modified = false;
      if (!content.content.donationPresets) {
        content.content.donationPresets = defaultContent.donationPresets;
        modified = true;
      }
      if (!content.content.essentialsKits) {
        content.content.essentialsKits = defaultContent.essentialsKits;
        modified = true;
      }
      if (!content.content.galleryCategories) {
        content.content.galleryCategories = defaultContent.galleryCategories;
        modified = true;
      }
      if (!content.content.bankDetails) {
        content.content.bankDetails = defaultContent.bankDetails;
        modified = true;
      }
      if (modified) {
        content.markModified('content');
        await content.save();
      }
    }
    res.json(content.content);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const upsertSiteContent = async (req, res) => {
  try {
    const payload = req.body || {};
    let contentDoc = await SiteContent.findOne({ key: 'default' });
    
    if (!contentDoc) {
      contentDoc = new SiteContent({ 
        key: 'default', 
        content: { ...defaultContent, ...payload } 
      });
    } else {
      const existing = contentDoc.content || {};
      contentDoc.content = {
        ...existing,
        ...payload,
        bankDetails: payload.bankDetails 
          ? { ...(existing.bankDetails || {}), ...payload.bankDetails }
          : existing.bankDetails,
        paymentConfig: payload.paymentConfig
          ? { ...(existing.paymentConfig || {}), ...payload.paymentConfig }
          : existing.paymentConfig
      };
      contentDoc.markModified('content');
    }
    
    await contentDoc.save();
    res.json(contentDoc.content);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getSiteContent, upsertSiteContent };
