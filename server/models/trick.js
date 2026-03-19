const mongoose = require('mongoose');

const trickSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    props: [{
        type: String
    }],
    durationMinutes: {
        type: Number
    },
    level: {
        type: String,
        enum: ['adults', 'kids', 'kindergarten', 'mixed']
    },
    status: {
        type: String,
        enum: ['ready', 'planning', 'building', 'idea']
    },
    notes: {
        type: String
    },
    isActive: {
        type: Boolean,
        default: true
    },
    tags: [{
        type: String
    }],
    energyLevel: {
        type: Number,
        min: 1,
        max: 5
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('trick', trickSchema);
