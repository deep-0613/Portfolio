// Express server to handle contact form submissions and send emails
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();
console.log('CWD:', process.cwd());
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? 'Loaded' : 'Not loaded');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.post('/api/contact', async (req, res) => {
  const { Name, Email, Message } = req.body;
  if (!Name || !Email || !Message) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    // Configure your email transport (using Gmail as example)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `Portfolio Contact <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Send to yourself
      subject: `New Contact Form Submission from ${Name}`,
      text: `Name: ${Name}\nEmail: ${Email}\nMessage: ${Message}`,
      replyTo: Email,
    });

    res.json({ success: true, message: 'Message sent successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to send message.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 