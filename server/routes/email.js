const express = require('express');
const sendMail = require('../controlers/sendMail');
const Quote = require('../models/quote');
const router = express.Router();

router.post('/send-quote-email', async (req, res) => {
  const { to, subject, text, html, attachments, quoteData } = req.body;

  if (!to || !subject || !attachments || attachments.length === 0) {
    return res.status(400).json({ message: 'Missing required email fields (to, subject, attachments).' });
  }

  try {
    // 1. Manage the Quote document if quoteData is provided
    let savedQuote = null;
    if (quoteData) {
      if (quoteData._id) {
        // Exists, so update it
        const updateData = { ...quoteData };
        delete updateData.quoteNumber; // Stop manual update
        savedQuote = await Quote.findByIdAndUpdate(quoteData._id, updateData, { new: true });
      } else {
        // Doesn't exist, create it
        const newQuote = new Quote(quoteData);
        savedQuote = await newQuote.save();
      }
    }

    // 2. Send the Email
    await sendMail(subject, text, html, to, attachments);
    res.status(200).json({ message: 'Email sent successfully!', quote: savedQuote });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Failed to send email', error: error.message });
  }
});

module.exports = router;
