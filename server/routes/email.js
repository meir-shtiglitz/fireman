const express = require('express');
const sendMail = require('../controlers/sendMail');
const router = express.Router();

router.post('/send-quote-email', async (req, res) => {
  const { to, subject, text, html, attachments } = req.body;

  if (!to || !subject || !attachments || attachments.length === 0) {
    return res.status(400).json({ message: 'Missing required email fields (to, subject, attachments).' });
  }

  try {
    await sendMail(subject, text, html, to, attachments);
    res.status(200).json({ message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Failed to send email', error: error.message });
  }
});

module.exports = router;
