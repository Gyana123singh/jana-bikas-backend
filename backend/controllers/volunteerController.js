const Volunteer = require('../models/Volunteer');
const sendMail = require('../config/email');

// @desc    Submit volunteer application (public)
// @route   POST /api/volunteer
const submitVolunteer = async (req, res) => {
  try {
    const volunteer = await Volunteer.create(req.body);

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@janabikasngo.org';

    // 1. Send email to Admin
    await sendMail({
      to: adminEmail,
      subject: `New Volunteer Registration: ${req.body.fullName}`,
      text: `A new volunteer has applied to join Jana Bikas.\n\nName: ${req.body.fullName}\nEmail: ${req.body.email}\nMobile: ${req.body.mobile}\nAvailability: ${req.body.availability || 'Not provided'}\nAddress: ${req.body.address || 'Not provided'}\nCover Message:\n${req.body.message || 'Not provided'}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; line-height: 1.6; color: #333;">
          <h2 style="color: #10b981; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">Volunteer Application Registered</h2>
          <p>Hello Admin,</p>
          <p>A new volunteer application has been submitted on the Jana Bikas portal. Here are the particulars:</p>
          <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
            <tr>
              <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #e5e7eb; width: 30%;">Full Name:</td>
              <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${req.body.fullName}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #e5e7eb;">Email:</td>
              <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;"><a href="mailto:${req.body.email}">${req.body.email}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #e5e7eb;">Mobile:</td>
              <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${req.body.mobile}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #e5e7eb;">Interest Area:</td>
              <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-transform: capitalize;">${req.body.interest || 'Not provided'}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #e5e7eb;">Availability:</td>
              <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-transform: capitalize;">${req.body.availability || 'Not provided'}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #e5e7eb;">Address:</td>
              <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${req.body.address || 'Not provided'}</td>
            </tr>
          </table>
          <p style="margin-top: 20px; font-weight: bold;">Cover Message / Statement:</p>
          <div style="background: #f9fafb; padding: 15px; border-left: 4px solid #10b981; font-style: italic; border-radius: 4px;">
            ${(req.body.message || '').replace(/\n/g, '<br />')}
          </div>
          <p style="margin-top: 20px; font-size: 11px; color: #6b7280; border-top: 1px solid #e5e7eb; padding-top: 10px;">
            Please log in to the admin panel to review and approve/deny this application.
          </p>
        </div>
      `
    });

    // 2. Send email to Volunteer
    await sendMail({
      to: req.body.email,
      subject: `Thank you for volunteering with Jana Bikas NGO`,
      text: `Hello ${req.body.fullName},\n\nThank you for registering to volunteer with Jana Bikas NGO! We have successfully received your application. Our recruitment desk will review your details and reach out to you shortly.\n\nWarm regards,\nVolunteer Desk\nJana Bikas NGO`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; line-height: 1.6; color: #333; border: 1px solid #e5e7eb; border-radius: 12px; padding: 25px; background: #ffffff;">
          <div style="text-align: center; margin-bottom: 20px;">
            <span style="font-size: 35px;">🌱</span>
            <h2 style="color: #059669; margin: 10px 0 0 0;">JANA BIKAS NGO</h2>
            <p style="font-size: 11px; text-transform: uppercase; color: #6b7280; margin: 5px 0 0 0; tracking-widest: 0.1em;">Grassroots Transformation</p>
          </div>
          <p>Dear <strong>${req.body.fullName}</strong>,</p>
          <p>Thank you for offering your time and talent to serve underprivileged communities with us! We have successfully received your volunteer application.</p>
          <p>Here is what happens next:</p>
          <ol style="padding-left: 20px;">
            <li style="margin-bottom: 8px;"><strong>Desk Review:</strong> Our volunteer coordination desk reviews your application parameters against current ground requirements.</li>
            <li style="margin-bottom: 8px;"><strong>Introduction Call:</strong> We will reach out to you via your registered mobile number for a brief chat.</li>
            <li style="margin-bottom: 8px;"><strong>Orientation:</strong> Once aligned, you will be onboarded to our active program groups.</li>
          </ol>
          <p>We are deeply grateful for your generous intent to build a brighter, more sustainable future.</p>
          <div style="margin-top: 30px; border-top: 1px solid #e5e7eb; padding-top: 15px; font-size: 12px; color: #6b7280;">
            Warm regards,<br />
            <strong>Volunteer Onboarding Desk</strong><br />
            Jana Bikas NGO<br />
            <a href="mailto:contact@janabikasngo.org" style="color: #059669; text-decoration: none;">contact@janabikasngo.org</a>
          </div>
        </div>
      `
    });

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