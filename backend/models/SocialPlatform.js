const mongoose = require('mongoose');

const socialPlatformSchema = new mongoose.Schema({
  name: { type: String, required: true },
  handle: { type: String, required: true },
  followers: { type: String, default: '0' },
  description: { type: String },
  color: { type: String, default: 'bg-slate-50 border-slate-200' },
  btnColor: { type: String, default: 'bg-slate-900' },
  link: { type: String, required: true },
  clicks: { type: Number, default: 0 },
  order: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('SocialPlatform', socialPlatformSchema);
