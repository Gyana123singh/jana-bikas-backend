const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['photo', 'video'],
    required: true,
  },
  title: { type: String, required: true },
  category: { type: String },
  url: { type: String },
  thumbnail: { type: String },
  embedUrl: { type: String },
  date: { type: String },
  location: { type: String },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Gallery', gallerySchema);