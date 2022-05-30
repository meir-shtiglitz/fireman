let allowedImgTypes = ['image/jpeg', 'image/jpg', 'image/png','image/gif','image/bmp'];
let allowedVideoTypes = ['video/m4v', 'video/avi','video/mpg','video/mp4', 'video/webm'];
let allowedMediaTypes = [...allowedImgTypes, ...allowedVideoTypes];

const validMedia = (file) => {
    console.log("file.type",file.mimetype);
    console.log("allowedTypes",allowedMediaTypes);
    return allowedMediaTypes.includes(file.mimetype);
}

const validImage = (file) => {
    console.log("file.type",file.mimetype);
    return allowedImgTypes.includes(file.mimetype);
}

module.exports.validmedia = validMedia;
module.exports.validImage = validImage;