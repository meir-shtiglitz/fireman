const express = require('express');
const { connection } = require('../controlers/db');
const router = express.Router();
var jwt = require('jsonwebtoken');
const sendMail = require('../controlers/sendMail');

const multer = require('multer');
const { uploadFiles } = require('../controlers/uploadAssets');
const Recommend = require('../models/recommend');
const { deleteMedia } = require('../controlers/deleteMedia');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})
module.exports.upload = multer({ storage });

// get recommend/s
router.get('/', (req, res) => {
    console.log('req.query', req.query)
    const isId = req.query.id ? { _id: req.query.id } : {};
    console.log('isId', isId);
    Recommend.find(isId).populate('media').exec( (error, recommends) => {
        console.log('from get recommends - error || result', error || recommends);
        if (error || !recommends.length) return res.status(401).json('recommends are not found');
        return res.status(200).json(recommends);
    })
})

//admin create new recommend
router.post('/', (req, res) => {
    console.log(req.body);
    const newRecommend = new Recommend();
    newRecommend.save((err, result) => {
        console.log('error || result', err || result);
        res.status(200).json({ _id: result._id.toJSON() })
    });
})

// get recommend from the user and sent to the admin for aprove
router.put('/', this.upload.array('files', 12), (req, res) => {
    console.log('req.body',req.body);
    const { _id, title, description, filesToDelete, author, location, stars, hide, public } = req.body;
    if (req.files.length) uploadFiles(req.files, _id);
    Recommend.findByIdAndUpdate(_id, { ...req.body }, {new: true}, (error, recommend) => {
        console.log('error || recommend - from update recommend', error || recommend);
        if (error || !recommend) return res.status(401).json({ error });
        recommend.save();
        console.log('updated recommend - from update recommend: ',recommend);
        res.status(200).json(recommend);
        const aproveLink = `${req.protocol}://${req.headers.host + req.originalUrl}/aprove/${_id}`;
        console.log('aproveLink', aproveLink);
        const bodyMail = `title: ${title}\n description: ${description}\n author: ${author} \n location: ${location} \n stars: ${stars}\n hide: ${hide} \n public: ${public} \n aprove: ${(!public || public === 'false') ? aproveLink : 'כבר אושר לפירסום'}`
        sendMail('New Recommend', bodyMail);
        const splitFilesToDelete = filesToDelete.split(',');
        for (const file of splitFilesToDelete) {
            deleteMedia(file, res);
        }
    })
})

// aprove publish
router.get('/aprove/:_id', (req, res) => {
    console.log('req.params', req.params);
    Recommend.findByIdAndUpdate(req.params._id, {public: true}, {new: true}, (error, recommend) => {
        console.log('error || recommend - from aprove recommend', error || recommend);
        if (error || !recommend) return res.status(401).json({ error })
        res.status(200).json(recommend);
    })
})

module.exports = router;
