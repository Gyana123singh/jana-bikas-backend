const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  donationId: {
    type: String,
    required: true,
    unique: true,
  },
  cause: {
    type: String,
    default: 'general',
  },
  donationType: {
    type: String,
    enum: ['one-time', 'monthly'],
    default: 'one-time',
  },
  generalAmount: {
    type: Number,
    default: 0,
  },
  kits: [{
    id: String,
    name: String,
    price: Number,
    qty: Number,
  }],
  kitsAmount: {
    type: Number,
    default: 0,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  donor: {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    mobile: { type: String, required: true },
    pan: { type: String },
    dob: { type: String },
    address: { type: String },
    displayPublicly: { type: Boolean, default: true },
  },
  paymentMode: {
    type: String,
    enum: ['UPI', 'CARD', 'NETBANKING'],
  },
  transactionId: {
    type: String,
  },
  stripePaymentIntentId: {
    type: String,
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending',
  },
  receiptUrl: {
    type: String,
  },
  certificate80gUrl: {
    type: String,
  },
  form10beUrl: {
    type: String,
  },
}, { timestamps: true });

module.exports = mongoose.model('Donation', donationSchema);