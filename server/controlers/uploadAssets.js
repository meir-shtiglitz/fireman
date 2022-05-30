const jwt = require('jsonwebtoken');
const { connection } = require('./db');
const sendMail = require('./sendMail');
const { validmedia, validImage } = require('./validMedia');
const fs = require('fs');
const Media = require('../models/media');
const Video = require('../models/video');

const cloudinary = require('cloudinary').v2;

const uploadFiles = async (files, recommendID, publish = false, title='') => {
    console.log('all files from upload func', files);
    for (let file of files) {
        console.log('file from upload func');
        if (!validmedia(file)) { console.log('file type is not allowed'); continue;}
        const isImg = validImage(file);
        const configFile = {
            resource_type: isImg ? 'image' : 'video',
            public_id: `${isImg ? 'images' : 'video'}/${file.filename}`
        }
        const res = await cloudinary.uploader.upload(file.path, configFile).catch(err => err);
        console.log("res upload image", res);
        if (!res.secure_url) continue;
        fs.unlink(file.path,(response)=> console.log('response dlete file',response))
        const rId = recommendID ? {recommendID} : null;
        let newMedia = new Media({
            url: res.secure_url,
            publicID: res.public_id,
            type: isImg ? 'image' : 'video',
            publish, 
            ...rId,
            title
        });
        newMedia.save((error, result) => {
            console.log("from insert media func - error || result", error || result);
            if (!publish) {
                const aproveLink = `${process.env.SERVER_URL}/media/publish/${result._id.toJSON()}/1`;
                console.log('aprove img Link', aproveLink);
                var html = `${isImg ? '<img src="' + res.secure_url + '" />' : '<video vidth="400" height="300" controls src="' + res.secure_url + '">Video not support</video>'}
                <a href="${aproveLink}">aprove media</a>`;
                sendMail('New Media', '', html);
            } else{
                console.log ('ok');
            }
        })

    }
}

// const uploadFiles = async (files, recommendID = null) => {
//     for (let file of files) {
//         console.log('file from upload func',file)
//         if (!validmedia(file)) return console.log('file type is not allowed')
//         const res = await cloudinary.uploader.upload(file.path).catch(err => err);
//         console.log("res", res);
//         if (!res.secure_url) return;
//         if (validImage(file)) {
//             connection.query(`INSERT INTO images (url, recommendID) VALUES ("${res.secure_url}", ${recommendID})`, (error, result, fields) => {
//                 console.log("error", error);
//                 console.log("result", result);
//                 const hshID = jwt.sign(result.insertId, process.env.TOKEN_SECRET);
//                 const aproveLink = `${process.env.SERVER_URL}/assets/images/publish/${hshID}/1`;
//                 console.log('aprove img Link', aproveLink);
//                 const html = `<img src="${res.secure_url}" />  
//             <a href="${aproveLink}">aprove image</a>`;
//                 sendMail('New Image', '', html)
//             })
//         }

//     }
// }

module.exports.uploadFiles = uploadFiles;