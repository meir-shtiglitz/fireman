const { Schema, model } = require('mongoose');

const recommendSchema = new Schema({
    title: {
        type: String,
        // required: true
    },
    description: {
        type: String,
        // required: true
    },
    author: {
        type: String,
        // required: true
    },
    email: {
        type: String,
        // required: true
    },
    location: {
        type: String,
        // required: true
    },
    stars: {
        type: Number,
        // required: true
    },
    hide: {
        type: Boolean,
        // required: true
    },
    public: {
        type: Boolean,
        // required: true,
        default: false
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

recommendSchema.virtual('media', {
    ref: 'Media',
    localField: '_id',
    foreignField: 'recommendID'
});


module.exports = model('Recommend', recommendSchema);