const Cause = require('../models/Cause');
const SuccessStory = require('../models/SuccessStory');
const Gallery = require('../models/Gallery');
const Trustee = require('../models/Trustee');
const Volunteer = require('../models/Volunteer');
const Contact = require('../models/Contact');
const Donation = require('../models/Donation');

const getAdminDashboard = async (req, res) => {
  try {
    const [
      causesCount,
      storiesCount,
      galleryCount,
      trusteesCount,
      volunteersCount,
      contactsCount,
      donationsCount,
      totalRaised,
      recentDonations,
      monthlyData,
      pendingContacts,
    ] = await Promise.all([
      Cause.countDocuments(),
      SuccessStory.countDocuments(),
      Gallery.countDocuments(),
      Trustee.countDocuments(),
      Volunteer.countDocuments(),
      Contact.countDocuments(),
      Donation.countDocuments({ status: 'completed' }),
      Donation.aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),
      Donation.find({ status: 'completed' }).sort({ createdAt: -1 }).limit(6),
      Donation.aggregate([
        { $match: { status: 'completed' } },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
            total: { $sum: '$totalAmount' },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
        { $limit: 6 },
      ]),
      Contact.find({ isRead: false }).sort({ createdAt: -1 }).limit(5),
    ]);

    res.json({
      metrics: {
        causes: causesCount,
        stories: storiesCount,
        gallery: galleryCount,
        trustees: trusteesCount,
        volunteers: volunteersCount,
        contacts: contactsCount,
        donations: donationsCount,
        raised: totalRaised[0]?.total || 0,
      },
      recentDonations,
      monthlyData,
      pendingContacts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAdminDashboard };