const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema( {
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
        type: mongoose.Schema.Types.ObjectId || Number,
        ref: 'Recommend'
    },
    title: String,
    type: {
        type: String,
        required: true
    },
    publish: {
        type: Boolean,
        default: false
    },
    top: {
        type: Boolean,
        default: false
    },
}, {timestamps:true} )

module.exports = mongoose.model('Media', mediaSchema);