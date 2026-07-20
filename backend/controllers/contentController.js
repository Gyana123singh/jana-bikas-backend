const SiteContent = require('../models/SiteContent');

const defaultAboutPage = {
  heroTag: 'Learn More About Us',
  heroTitle: 'A premium experience for purpose-driven giving',
  heroSubtitle: 'Your donations power education, healthcare, skill development, and environmental care with measurable impact.',
  heroBgImage: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80',
  overviewTag: 'Establishment Overview',
  overviewTitle: 'A Journey Built on Trust, Inclusion, and Sustainability',
  overviewParagraph1: 'Jana Bikas NGO was founded by a collective of social scientists, healthcare professionals, and farmers with a single dream: to create an inclusive environment where individuals in marginalized communities have full access to opportunities.',
  overviewParagraph2: 'We focus on bottom-up development, ensuring that our programs are owned and maintained by the local communities themselves. We do not just distribute relief; we construct pathways to self-reliance.',
  operationalPrinciples: [
    '100% Financial Auditing',
    'Community Co-ownership',
    'Ecologically Friendly Projects',
    'Inclusion & Equal Respect'
  ],
  registrationDetails: [
    { label: 'Registration No.', value: 'S-56439/2014-BR' },
    { label: 'Registration Date', value: '14th April 2014' },
    { label: 'NITI Aayog Darpan ID', value: 'BR/2016/0104592' },
    { label: 'NGO PAN Number', value: 'AAATJ9024E' },
    { label: '12A Registration No.', value: 'IT/12A/2018-19/204' },
    { label: '80G Registration No.', value: 'IT/80G/2020-21/105' }
  ],
  taxExemptionNote: 'Donations to Jana Bikas NGO are 50% tax exempt under Section 80G of the Income Tax Act.',
  visionTitle: 'Our Vision',
  visionDescription: 'We envision a just, equitable, and self-sufficient society where every household has clean water, healthy food, basic medical care, and quality education. We work to empower the last mile so they can lead lives of dignity, prosperity, and respect.',
  missionTitle: 'Our Mission',
  missionDescription: 'Our mission is to establish sustainable community programs in education, youth skill certifications, women SHGs, maternal health access, and ecological agriculture. By collaborating with donors, local administrations, and volunteers, we translate contributions into verified long-term change.',
  customSections: []
};

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
  },
  aboutPage: defaultAboutPage
};

const getSiteContent = async (req, res) => {
  try {
    let content = await SiteContent.findOne({ key: 'default' });
    if (!content) {
      content = await SiteContent.create({ key: 'default', content: defaultContent });
    } else {
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
      if (!content.content.aboutPage) {
        content.content.aboutPage = defaultAboutPage;
        modified = true;
      } else {
        // Fill missing keys in aboutPage if any
        content.content.aboutPage = { ...defaultAboutPage, ...content.content.aboutPage };
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
          : existing.paymentConfig,
        aboutPage: payload.aboutPage
          ? { ...(existing.aboutPage || defaultAboutPage), ...payload.aboutPage }
          : (existing.aboutPage || defaultAboutPage)
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
