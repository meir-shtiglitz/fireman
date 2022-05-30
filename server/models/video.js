const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema( {
    url: {
        type: String,
        required: true,
        unique: true
    },
    publicID: {
        type: String,
        required: true,
        unique: true
    },
    recommendID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Recommend'
    },
    title: String,
    publish: {
        type: Boolean,
        default: false
    }
}, {timestamps:true} )

module.exports = mongoose.model('Video', videoSchema);