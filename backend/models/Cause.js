const mongoose = require('mongoose');

const causeSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  tagline: { type: String },
  image: { type: String },
  shortDescription: { type: String },
  longDescription: { type: String },
  goalAmount: { type: Number, default: 0 },
  raisedAmount: { type: Number, default: 0 },
  activities: [String],
  impact: [{
    count: String,
    label: String,
  }],
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Cause', causeSchema);