const nodemailer = require('nodemailer');
const NewsletterSubscriber = require('../models/NewsletterSubscriber');

const sendWelcomeEmail = async (email) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const siteUrl = process.env.CLIENT_URL || 'https://www.nashmaagribusiness.com';

  await transporter.sendMail({
    from: `"Nashma Agribusiness" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Welcome to Nashma Agribusiness updates!",
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#f4f7f0;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7f0;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#166534,#15803d);padding:32px;text-align:center;">
            <h1 style="color:#fff;margin:0;font-size:24px;font-weight:700;">Nashma Agribusiness Ltd.</h1>
            <p style="color:#bbf7d0;margin:6px 0 0;font-size:13px;">Growing Sustainable Futures</p>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:36px 40px;">
            <h2 style="color:#166534;margin:0 0 16px;font-size:20px;">You're subscribed!</h2>
            <p style="color:#374151;line-height:1.7;margin:0 0 16px;">
              Thank you for joining our community. You'll receive updates on:
            </p>
            <ul style="color:#374151;line-height:2;padding-left:20px;margin:0 0 24px;">
              <li>New cocoa potash products & pricing</li>
              <li>Women's training programme announcements</li>
              <li>Sustainable farming tips</li>
              <li>African black soap launches</li>
            </ul>
            <div style="text-align:center;margin:28px 0;">
              <a href="${siteUrl}/products" style="background:#d97706;color:#fff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:700;font-size:15px;display:inline-block;">
                Browse Our Products
              </a>
            </div>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="background:#f0fdf4;padding:20px 40px;text-align:center;border-top:1px solid #dcfce7;">
            <p style="color:#6b7280;font-size:12px;margin:0;">
              &copy; ${new Date().getFullYear()} Nashma Agribusiness Ltd. &bull; Apemso-KNUST, Kumasi, Ghana<br>
              <a href="${siteUrl}" style="color:#166534;text-decoration:none;">www.nashmaagribusiness.com</a>
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
    `,
  });
};

exports.subscribe = async (req, res) => {
  const { email } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ message: 'Please provide a valid email address.' });
  }

  try {
    const exists = await NewsletterSubscriber.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: 'You are already subscribed.' });
    }

    await NewsletterSubscriber.create({ email });

    // Welcome email — non-blocking
    sendWelcomeEmail(email).catch((err) =>
      console.error('Newsletter welcome email error:', err.message)
    );

    res.status(200).json({ message: 'Subscription successful! Check your inbox for a welcome email.' });
  } catch (err) {
    console.error('Newsletter subscribe error:', err);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
};
