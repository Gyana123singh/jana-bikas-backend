const Contact = require('../models/Contact');
const sendMail = require('../config/email');

// @desc    Submit contact form (public)
// @route   POST /api/contact
const submitContact = async (req, res) => {
  try {
    const contact = await Contact.create(req.body);

    // Send email notification to admin
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@janabikasngo.org';
    await sendMail({
      to: adminEmail,
      subject: `New Contact Request: ${req.body.subject || 'No Subject'}`,
      text: `You have received a new contact inquiry from ${req.body.fullName}.\n\nEmail: ${req.body.email}\nMobile: ${req.body.mobile || 'Not provided'}\nSubject: ${req.body.subject || 'Not provided'}\nMessage:\n${req.body.message}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; line-height: 1.6; color: #333;">
          <h2 style="color: #10b981; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">New Inquiry Received</h2>
          <p>Hello Admin,</p>
          <p>A user has submitted a contact request on the Jana Bikas portal. Here are the particulars:</p>
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
              <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${req.body.mobile || 'Not provided'}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #e5e7eb;">Subject:</td>
              <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${req.body.subject || 'Not provided'}</td>
            </tr>
          </table>
          <p style="margin-top: 20px; font-weight: bold;">User Message:</p>
          <div style="background: #f9fafb; padding: 15px; border-left: 4px solid #10b981; font-style: italic; border-radius: 4px;">
            ${req.body.message.replace(/\n/g, '<br />')}
          </div>
          <p style="margin-top: 20px; font-size: 11px; color: #6b7280; border-top: 1px solid #e5e7eb; padding-top: 10px;">
            This email was generated automatically by the Jana Bikas portal database trigger.
          </p>
        </div>
      `
    });

    res.status(201).json({ message: 'Message sent successfully', contact });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all contact messages (admin)
// @route   GET /api/admin/contacts
const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark contact as read (admin)
// @route   PUT /api/admin/contacts/:id
const updateContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete contact (admin)
// @route   DELETE /api/admin/contacts/:id
const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.json({ message: 'Contact deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { submitContact, getContacts, updateContact, deleteContact };