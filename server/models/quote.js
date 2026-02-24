const mongoose = require('mongoose');
require('./counter'); // Ensure counter schema is registered

const quoteSchema = new mongoose.Schema({
    quoteNumber: {
        type: Number,
        unique: true
    },
    customer: {
        recipient: String,
        contactPerson: String,
        phone: String,
        email: String
    },
    service: {
        activityType: String,
        date: Date,
        duration: String,
        notes: String
    },
    price: Number,
    customFields: [{
        section: String,
        label: String,
        value: String
    }]
}, {
    timestamps: true // Adds createdAt and updatedAt automatically
});

// Auto-increment logic
quoteSchema.pre('save', async function (next) {
    const doc = this;
    if (!doc.isNew) return next();

    try {
        const Counter = mongoose.model('counter');
        const counter = await Counter.findByIdAndUpdate(
            { _id: 'quoteNumber' },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );
        doc.quoteNumber = counter.seq;
        next();
    } catch (error) {
        next(error);
    }
});

module.exports = mongoose.model('quote', quoteSchema);
