const Media = require("../models/media");
const cloudinary = require('cloudinary').v2;

exports.deleteMedia = (_id, res) => {
    console.log('id from delete file || error', _id);
    Media.findByIdAndDelete(_id).exec((error, result) => {
        console.log('result from delete file || error', result||error);
        if ( error || !result ) return error;
        cloudinary.uploader.destroy(result.publicID, (err,response) => {
            console.log("response||err after delete", response||err)
            return response || err;
        });
    })
}
