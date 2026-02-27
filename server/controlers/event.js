const Event = require('../models/event');

// Create a new event
const createEvent = async (req, res) => {
    try {
        const event = new Event(req.body);
        await event.save();
        res.status(201).json(event);
    } catch (error) {
        res.status(500).json({ message: 'Error creating event', error: error.message });
    }
};

// Get all events with optional filters
const getEvents = async (req, res) => {
    try {
        const { start, end, status, paymentStatus } = req.query;
        let query = {};

        // Filtering by date range
        if (start && end) {
            query.eventDate = {
                $gte: new Date(start),
                $lte: new Date(end)
            };
        } else if (start) {
            query.eventDate = { $gte: new Date(start) };
        } else if (end) {
            query.eventDate = { $lte: new Date(end) };
        }

        if (status) query.status = status;
        if (paymentStatus) query.paymentStatus = paymentStatus;

        const events = await Event.find(query).populate('quoteId', 'quoteNumber').sort({ eventDate: 1, eventTime: 1 });
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching events', error: error.message });
    }
};

// Get event by ID
const getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id).populate('quoteId', 'quoteNumber');
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching event', error: error.message });
    }
};

// Update event
const updateEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Update fields
        Object.keys(req.body).forEach(key => {
            event[key] = req.body[key];
        });

        // Trigger pre-save hook
        await event.save();

        res.status(200).json(event);
    } catch (error) {
        res.status(500).json({ message: 'Error updating event', error: error.message });
    }
};

// Delete event
const deleteEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting event', error: error.message });
    }
};

module.exports = {
    createEvent,
    getEvents,
    getEventById,
    updateEvent,
    deleteEvent
};
