const mongoose = require('mongoose');

const eventTrickSchema = new mongoose.Schema({
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'event',
        required: true
    },
    trickId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'trick',
        required: true
    },
    order: {
        type: Number,
        required: true
    },
    performed: {
        type: Boolean,
        default: false
    },
    notes: {
        type: String
    },
    actualDurationMinutes: {
        type: Number
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('eventTrick', eventTrickSchema);
