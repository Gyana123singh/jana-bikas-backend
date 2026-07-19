const Trustee = require('../models/Trustee');

// @desc    Get all trustees (public)
// @route   GET /api/trustees
const getTrustees = async (req, res) => {
  try {
    const trustees = await Trustee.find().sort({ order: 1 });
    res.json(trustees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create trustee (admin)
// @route   POST /api/admin/trustees
const createTrustee = async (req, res) => {
  try {
    const trustee = await Trustee.create(req.body);
    res.status(201).json(trustee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update trustee (admin)
// @route   PUT /api/admin/trustees/:id
const updateTrustee = async (req, res) => {
  try {
    const trustee = await Trustee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!trustee) {
      return res.status(404).json({ message: 'Trustee not found' });
    }
    res.json(trustee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete trustee (admin)
// @route   DELETE /api/admin/trustees/:id
const deleteTrustee = async (req, res) => {
  try {
    const trustee = await Trustee.findByIdAndDelete(req.params.id);
    if (!trustee) {
      return res.status(404).json({ message: 'Trustee not found' });
    }
    res.json({ message: 'Trustee deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getTrustees, createTrustee, updateTrustee, deleteTrustee };