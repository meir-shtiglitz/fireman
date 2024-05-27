let allowedImgTypes = ['image/jpeg', 'image/jpg', 'image/png','image/gif','image/bmp'];
let allowedVideoTypes = ['video/m4v', 'video/avi','video/mpg','video/mp4', 'video/webm'];
let allowedTypes = [...allowedImgTypes, ...allowedVideoTypes];

export const validFile = (file) => {
    console.log("file.type",file.type);
    console.log("allowedTypes",allowedTypes);
    return allowedTypes.includes(file.type);
}

export const validImage = (file) => {
    console.log("file.type",file.type);
    return allowedImgTypes.includes(file.type);
}