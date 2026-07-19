const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  user: { type: String, default: 'Anonymous Beneficiary' },
  text: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

const socialPostSchema = new mongoose.Schema({
  platform: { type: String, required: true }, // 'YouTube' | 'Facebook' | 'Instagram' | 'Twitter' | etc.
  author: { type: String, required: true },
  time: { type: String, default: 'Just now' },
  text: { type: String, required: true },
  image: { type: String },
  likes: { type: Number, default: 0 },
  comments: [commentSchema],
  shares: { type: Number, default: 0 },
  likedByIPs: [{ type: String }],
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('SocialPost', socialPostSchema);
