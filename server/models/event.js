const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    quoteId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'quote'
    },
    customer: {
        recipient: String,
        contactPerson: String,
        phone: String,
        email: String
    },
    activityType: String,
    eventDate: Date,
    eventTime: String,
    duration: Number,
    childrenCount: Number,
    childrenAges: String,
    address: String,
    price: Number,
    notes: String,
    status: {
        type: String,
        enum: ["scheduled", "confirmed", "completed", "cancelled"],
        default: "scheduled"
    },
    paymentStatus: {
        type: String,
        enum: ["unpaid", "partial", "paid"],
        default: "unpaid"
    },
    receiptIssued: {
        type: Boolean,
        default: false
    },
    amountPaid: Number,
    reminder: {
        enabled: {
            type: Boolean,
            default: true
        },
        sent: {
            type: Boolean,
            default: false
        },
        sendBeforeHours: {
            type: Number,
            default: 24
        }
    }
}, {
    timestamps: true
});

// Pre-save hook for business rules
eventSchema.pre('save', function (next) {
    const doc = this;

    // If status = cancelled → reminder.enabled = false
    if (doc.isModified('status') && doc.status === 'cancelled') {
        doc.reminder.enabled = false;
    }

    // If event date or time changes → reminder.sent = false
    if (doc.isModified('eventDate') || doc.isModified('eventTime')) {
        doc.reminder.sent = false;
    }

    next();
});

module.exports = mongoose.model('event', eventSchema);
