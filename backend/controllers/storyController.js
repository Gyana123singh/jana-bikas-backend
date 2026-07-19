const SuccessStory = require('../models/SuccessStory');

// @desc    Get all active success stories (public)
// @route   GET /api/success-stories
const getStories = async (req, res) => {
  try {
    const stories = await SuccessStory.find({ isActive: true }).sort({ order: 1 });
    res.json(stories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single story by slug (public)
// @route   GET /api/success-stories/:slug
const getStoryBySlug = async (req, res) => {
  try {
    const story = await SuccessStory.findOne({ slug: req.params.slug, isActive: true });
    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }
    res.json(story);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all stories (admin)
// @route   GET /api/admin/success-stories
const getAllStories = async (req, res) => {
  try {
    const stories = await SuccessStory.find().sort({ order: 1 });
    res.json(stories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create story (admin)
// @route   POST /api/admin/success-stories
const createStory = async (req, res) => {
  try {
    const story = await SuccessStory.create(req.body);
    res.status(201).json(story);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update story (admin)
// @route   PUT /api/admin/success-stories/:id
const updateStory = async (req, res) => {
  try {
    const story = await SuccessStory.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }
    res.json(story);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete story (admin)
// @route   DELETE /api/admin/success-stories/:id
const deleteStory = async (req, res) => {
  try {
    const story = await SuccessStory.findByIdAndDelete(req.params.id);
    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }
    res.json({ message: 'Story deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getStories, getStoryBySlug, getAllStories, createStory, updateStory, deleteStory };