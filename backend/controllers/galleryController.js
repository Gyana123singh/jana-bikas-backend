const Gallery = require('../models/Gallery');

// @desc    Get all active gallery items (public)
// @route   GET /api/gallery
const getGallery = async (req, res) => {
  try {
    const type = req.query.type;
    let query = { isActive: true };
    if (type) query.type = type;
    
    const items = await Gallery.find(query).sort({ order: 1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all gallery items (admin)
// @route   GET /api/admin/gallery
const getAllGallery = async (req, res) => {
  try {
    const items = await Gallery.find().sort({ order: 1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create gallery item (admin)
// @route   POST /api/admin/gallery
const createGalleryItem = async (req, res) => {
  try {
    const item = await Gallery.create(req.body);
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update gallery item (admin)
// @route   PUT /api/admin/gallery/:id
const updateGalleryItem = async (req, res) => {
  try {
    const item = await Gallery.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) {
      return res.status(404).json({ message: 'Gallery item not found' });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete gallery item (admin)
// @route   DELETE /api/admin/gallery/:id
const deleteGalleryItem = async (req, res) => {
  try {
    const item = await Gallery.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Gallery item not found' });
    }
    res.json({ message: 'Gallery item deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getGallery, getAllGallery, createGalleryItem, updateGalleryItem, deleteGalleryItem };