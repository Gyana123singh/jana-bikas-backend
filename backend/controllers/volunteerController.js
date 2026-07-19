const Volunteer = require('../models/Volunteer');

// @desc    Submit volunteer application (public)
// @route   POST /api/volunteer
const submitVolunteer = async (req, res) => {
  try {
    const volunteer = await Volunteer.create(req.body);
    res.status(201).json({ message: 'Application submitted successfully', volunteer });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all volunteers (admin)
// @route   GET /api/admin/volunteers
const getVolunteers = async (req, res) => {
  try {
    const volunteers = await Volunteer.find().sort({ createdAt: -1 });
    res.json(volunteers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update volunteer status (admin)
// @route   PUT /api/admin/volunteers/:id
const updateVolunteer = async (req, res) => {
  try {
    const volunteer = await Volunteer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!volunteer) {
      return res.status(404).json({ message: 'Volunteer not found' });
    }
    res.json(volunteer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete volunteer (admin)
// @route   DELETE /api/admin/volunteers/:id
const deleteVolunteer = async (req, res) => {
  try {
    const volunteer = await Volunteer.findByIdAndDelete(req.params.id);
    if (!volunteer) {
      return res.status(404).json({ message: 'Volunteer not found' });
    }
    res.json({ message: 'Volunteer deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { submitVolunteer, getVolunteers, updateVolunteer, deleteVolunteer };