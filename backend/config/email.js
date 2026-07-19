const nodemailer = require('nodemailer');

const host = process.env.SMTP_HOST || 'smtp.ethereal.email';
const port = parseInt(process.env.SMTP_PORT) || 587;
const user = process.env.SMTP_USER || '';
const pass = process.env.SMTP_PASS || '';
const from = process.env.SMTP_FROM || 'Jana Bikas NGO <no-reply@janabikasngo.org>';

let transporter;

if (user && pass) {
  transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass }
  });
}

const sendMail = async ({ to, subject, text, html }) => {
  try {
    if (!transporter) {
      console.log('No SMTP user credentials configured in .env. Initializing a free Ethereal sandbox test account...');
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass
        }
      });
      console.log('Ethereal sandboxed credentials created:');
      console.log(`User: ${testAccount.user}`);
      console.log(`Pass: ${testAccount.pass}`);
    }

    const info = await transporter.sendMail({
      from,
      to,
      subject,
      text,
      html
    });

    console.log('Email sent successfully! MessageID: %s', info.messageId);
    if (info.messageId && (host.includes('ethereal') || !user)) {
      console.log('Ethereal mail preview link: %s', nodemailer.getTestMessageUrl(info));
    }
    return info;
  } catch (error) {
    console.error('Failed to dispatch SMTP email notification:', error);
    return null;
  }
};

module.exports = sendMail;
