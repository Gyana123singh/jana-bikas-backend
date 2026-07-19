const mongoose = require('mongoose');

const siteContentSchema = new mongoose.Schema({
  key: {
    type: String,
    unique: true,
    default: 'default',
  },
  content: {
    type: Object,
    default: {},
  },
}, { timestamps: true });

module.exports = mongoose.model('SiteContent', siteContentSchema);
