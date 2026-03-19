const EventTrick = require('../models/eventTrick');

// Attach a trick to an event
const attachTrick = async (req, res) => {
    try {
        const { eventId, trickId, order, notes, actualDurationMinutes } = req.body;

        // Count existing tricks for this event to determine order if not provided
        let targetOrder = order;
        if (targetOrder === undefined) {
            const existingCount = await EventTrick.countDocuments({ eventId });
            targetOrder = existingCount;
        }

        const eventTrick = new EventTrick({
            eventId,
            trickId,
            order: targetOrder,
            notes,
            actualDurationMinutes
        });

        await eventTrick.save();

        // Populate trickId before returning
        await eventTrick.populate('trickId');

        res.status(201).json(eventTrick);
    } catch (error) {
        res.status(500).json({ message: 'Error attaching trick to event', error: error.message });
    }
};

// Get all tricks for a specific event
const getEventTricks = async (req, res) => {
    try {
        const { eventId } = req.params;
        const eventTricks = await EventTrick.find({ eventId })
            .populate('trickId')
            .sort({ order: 1 });

        res.status(200).json(eventTricks);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching event tricks', error: error.message });
    }
};

// Update an EventTrick
const updateEventTrick = async (req, res) => {
    try {
        const eventTrickId = req.params.id;
        const eventTrick = await EventTrick.findById(eventTrickId);

        if (!eventTrick) {
            return res.status(404).json({ message: 'Event trick link not found' });
        }

        Object.keys(req.body).forEach(key => {
            eventTrick[key] = req.body[key];
        });

        await eventTrick.save();
        await eventTrick.populate('trickId');

        res.status(200).json(eventTrick);
    } catch (error) {
        res.status(500).json({ message: 'Error updating event trick', error: error.message });
    }
};

// Remove a trick from an event
const removeTrick = async (req, res) => {
    try {
        const eventTrickId = req.params.id;
        const eventTrick = await EventTrick.findByIdAndDelete(eventTrickId);

        if (!eventTrick) {
            return res.status(404).json({ message: 'Event trick link not found' });
        }

        // Optionally, reorder remaining tricks here (or handle on frontend and call batch)

        res.status(200).json({ message: 'Trick removed from event successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error removing trick from event', error: error.message });
    }
};

// Batch reorder event tricks
const batchReorder = async (req, res) => {
    try {
        const { orders } = req.body; // Expecting array of { _id, order }

        if (!Array.isArray(orders)) {
            return res.status(400).json({ message: 'Orders must be an array' });
        }

        // Run updates in parallel
        await Promise.all(orders.map(item =>
            EventTrick.findByIdAndUpdate(item._id, { order: item.order })
        ));

        res.status(200).json({ message: 'Tricks reordered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error reordering tricks', error: error.message });
    }
};

module.exports = {
    attachTrick,
    getEventTricks,
    updateEventTrick,
    removeTrick,
    batchReorder
};
