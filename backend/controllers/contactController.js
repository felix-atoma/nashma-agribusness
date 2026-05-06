const path = require('path');
const pug = require('pug');
const nodemailer = require('nodemailer');
const Contact = require('../models/Contact');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const createTransporter = () =>
  nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

const renderTemplate = (templateName, locals) =>
  pug.renderFile(
    path.join(__dirname, `../views/email/${templateName}.pug`),
    locals
  );

const sendContactEmails = async (contact) => {
  const transporter = createTransporter();
  const adminDashboardUrl = `${process.env.CLIENT_URL || 'https://www.nashmaagribusiness.com'}/admin/contacts`;

  // Confirmation to the person who submitted
  const confirmationHtml = renderTemplate('contactConfirmation', {
    firstName: contact.name.split(' ')[0],
    email: contact.email,
    subject: contact.subject,
  });

  // Notification to admin
  const notificationHtml = renderTemplate('contactNotification', {
    contact,
    url: adminDashboardUrl,
  });

  await Promise.all([
    transporter.sendMail({
      from: `"Nashma Agribusiness" <${process.env.EMAIL_USER}>`,
      to: contact.email,
      subject: `We received your message — ${contact.subject}`,
      html: confirmationHtml,
    }),
    transporter.sendMail({
      from: `"Nashma Contact Form" <${process.env.EMAIL_USER}>`,
      to: process.env.CLIENT_EMAIL,
      subject: `New Contact: ${contact.subject}`,
      html: notificationHtml,
    }),
  ]);
};

exports.submitContact = catchAsync(async (req, res, next) => {
  const { name, email, phone, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return next(new AppError('Name, email, subject and message are required.', 400));
  }

  const newContact = await Contact.create({ name, email, phone, subject, message });

  // Send emails non-blocking — don't fail the request if email fails
  sendContactEmails(newContact).catch((err) =>
    console.error('Contact email send error:', err.message)
  );

  res.status(201).json({
    status: 'success',
    message: 'Thank you for reaching out. We will get back to you shortly.',
    data: { contact: newContact },
  });
});

exports.getAllContacts = catchAsync(async (req, res, next) => {
  const contacts = await Contact.find().sort('-createdAt');
  res.status(200).json({
    status: 'success',
    results: contacts.length,
    data: { contacts },
  });
});

exports.getContact = catchAsync(async (req, res, next) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) return next(new AppError('No contact found with that ID', 404));
  res.status(200).json({ status: 'success', data: { contact } });
});

exports.deleteContact = catchAsync(async (req, res, next) => {
  const contact = await Contact.findByIdAndDelete(req.params.id);
  if (!contact) return next(new AppError('No contact found with that ID', 404));
  res.status(204).json({ status: 'success', data: null });
});

module.exports = {
  submitContact: exports.submitContact,
  getAllContacts: exports.getAllContacts,
  getContact: exports.getContact,
  deleteContact: exports.deleteContact,
};
