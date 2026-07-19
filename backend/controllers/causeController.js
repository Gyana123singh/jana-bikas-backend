const Cause = require('../models/Cause');

// @desc    Get all active causes (public)
// @route   GET /api/causes
const getCauses = async (req, res) => {
  try {
    const causes = await Cause.find({ isActive: true }).sort({ order: 1 });
    res.json(causes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single cause by slug (public)
// @route   GET /api/causes/:slug
const getCauseBySlug = async (req, res) => {
  try {
    const cause = await Cause.findOne({ slug: req.params.slug, isActive: true });
    if (!cause) {
      return res.status(404).json({ message: 'Cause not found' });
    }
    res.json(cause);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all causes (admin)
// @route   GET /api/admin/causes
const getAllCauses = async (req, res) => {
  try {
    const causes = await Cause.find().sort({ order: 1 });
    res.json(causes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create cause (admin)
// @route   POST /api/admin/causes
const createCause = async (req, res) => {
  try {
    const cause = await Cause.create(req.body);
    res.status(201).json(cause);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update cause (admin)
// @route   PUT /api/admin/causes/:id
const updateCause = async (req, res) => {
  try {
    const cause = await Cause.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!cause) {
      return res.status(404).json({ message: 'Cause not found' });
    }
    res.json(cause);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete cause (admin)
// @route   DELETE /api/admin/causes/:id
const deleteCause = async (req, res) => {
  try {
    const cause = await Cause.findByIdAndDelete(req.params.id);
    if (!cause) {
      return res.status(404).json({ message: 'Cause not found' });
    }
    res.json({ message: 'Cause deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getCauses, getCauseBySlug, getAllCauses, createCause, updateCause, deleteCause };