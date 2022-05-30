const express = require('express');
const sendMail = require('../controlers/sendMail');
const router = express.Router();

router.post('/', (req, res) => {
    console.log('contact form',req.body);
    const bodyMail = `from: ${req.body.mailUser}\n msg: ${req.body.msg}`;
    sendMail('CONTACT FIREMAN', bodyMail);
})

module.exports = router;