const mongoose = require('mongoose');

const trusteeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  designation: { type: String },
  photo: { type: String },
  description: { type: String },
  order: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Trustee', trusteeSchema);