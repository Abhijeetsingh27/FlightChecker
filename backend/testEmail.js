const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

transporter.sendMail({
  from: process.env.EMAIL_USER,
  to: process.env.EMAIL_USER, // send to yourself for testing
  subject: 'Test Email',
  text: 'This is a test email from your flight booking app.'
}, (err, info) => {
  if (err) {
    return console.error('Error:', err);
  }
  console.log('Email sent:', info.response);
}); 