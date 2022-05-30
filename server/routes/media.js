const { uploadFiles } = require("../controlers/uploadAssets");
const cloudinary = require('cloudinary').v2;
const multer  = require('multer');
const Media = require("../models/media");
const { deleteMedia } = require("../controlers/deleteMedia");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, new Date().getTime().toString()+'.'+file.originalname.split('.')[1])
    }
})
const upload = multer({storage})
const router = require("express").Router();

router.get('/', (req, res) => {
    console.log("from get media");
    Media.find({}).populate('recommendID').exec( (error, media) => {
        console.log("error || media", error);
        if (error || !media || !media.length) return res.status(401).json({ error: error || 'media are not found' });
        return res.status(200).json(media);
    })
})

router.post('/upload', upload.array('files',12), async(req,res) => {
    console.log('req.files',req.files);
    if ( !req.files ) return;
    uploadFiles(req.files, 0, true);
    return res.status(200).json('result');
})

router.get('/publish/:_id/:status', (req, res) => {
    var { _id, status } = req.params;
    console.log("image id from publish router + status", _id + ':' + status);
    Media.findByIdAndUpdate(_id, {publish: !!status}, {new: true}, (error, media) => {
        console.log('error || media', error || media);
        if (error||!media) return res.status(401).json(error);
        media.save();
        return res.status(200).json(media);
    })
})

router.get('/top/:_id/:status', (req, res) => {
    var { _id, status } = req.params;
    console.log("media _id from publish router", _id);
    Media.findByIdAndUpdate(_id).exec((error, media) => {
        console.log('error || media', error || media);
        if (error||!media) return res.status(401).json(error);
        media.top = status;
        media.save();
        return res.status(200).send(media);
    })
})

router.delete('/delete/:_id', (req, res) => {
    const { _id } = req.params;
    console.log("_id from delete file router", _id);
    deleteMedia(_id, res);
    // Media.findByIdAndDelete(_id).exec((error, result) => {
    //     console.log('result from delete file || error', result||error);
    //     if ( error || !result ) return res.status(401).json(error)
    //     cloudinary.uploader.destroy(result.publicID, (err,response) => {
    //         console.log("response||err after delete", response||err)
    //         if (err) return res.status(401).json(err);
    //         return res.status(200).send(response);
    //     });
    // })
})

module.exports = router;