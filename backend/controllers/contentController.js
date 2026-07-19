const SiteContent = require('../models/SiteContent');

const getSiteContent = async (req, res) => {
  try {
    let content = await SiteContent.findOne({ key: 'default' });
    if (!content) {
      content = await SiteContent.create({ key: 'default', content: {} });
    }
    res.json(content.content);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const upsertSiteContent = async (req, res) => {
  try {
    const payload = req.body || {};
    const updated = await SiteContent.findOneAndUpdate(
      { key: 'default' },
      { $set: { content: payload } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    res.json(updated.content);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getSiteContent, upsertSiteContent };
