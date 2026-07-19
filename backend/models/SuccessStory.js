const mongoose = require('mongoose');

const successStorySchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  category: { type: String },
  image: { type: String },
  videoUrl: { type: String },
  shortDescription: { type: String },
  longDescription: { type: String },
  beforeAfter: {
    before: String,
    after: String,
  },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('SuccessStory', successStorySchema);