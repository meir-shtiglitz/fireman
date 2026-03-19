const Trick = require('../models/trick');
const EventTrick = require('../models/eventTrick');

// Create a new trick
const createTrick = async (req, res) => {
    try {
        const trick = new Trick(req.body);
        await trick.save();
        res.status(201).json(trick);
    } catch (error) {
        res.status(500).json({ message: 'Error creating trick', error: error.message });
    }
};

// Get all tricks with optional filters
const getTricks = async (req, res) => {
    try {
        const { level, status, tags, isActive } = req.query;
        let query = {};

        if (level) query.level = level;
        if (status) query.status = status;
        if (isActive !== undefined) query.isActive = isActive === 'true';
        if (tags) {
            const tagsArray = tags.split(',').map(tag => tag.trim());
            query.tags = { $in: tagsArray };
        }

        const tricks = await Trick.find(query).sort({ title: 1 });
        res.status(200).json(tricks);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tricks', error: error.message });
    }
};

// Get trick by ID
const getTrickById = async (req, res) => {
    try {
        const trick = await Trick.findById(req.params.id);
        if (!trick) {
            return res.status(404).json({ message: 'Trick not found' });
        }
        res.status(200).json(trick);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching trick', error: error.message });
    }
};

// Update trick
const updateTrick = async (req, res) => {
    try {
        const trick = await Trick.findById(req.params.id);
        if (!trick) {
            return res.status(404).json({ message: 'Trick not found' });
        }

        Object.keys(req.body).forEach(key => {
            trick[key] = req.body[key];
        });

        await trick.save();
        res.status(200).json(trick);
    } catch (error) {
        res.status(500).json({ message: 'Error updating trick', error: error.message });
    }
};

// Soft delete / Delete trick depending on links
const deleteTrick = async (req, res) => {
    try {
        const trickId = req.params.id;
        const trick = await Trick.findById(trickId);
        if (!trick) {
            return res.status(404).json({ message: 'Trick not found' });
        }

        // Check if trick is linked to any events
        const linkedEventsCount = await EventTrick.countDocuments({ trickId });

        if (linkedEventsCount > 0) {
            // Soft delete
            trick.isActive = false;
            await trick.save();
            return res.status(200).json({
                message: 'Trick is linked to events and cannot be fully deleted. It has been marked as inactive.',
                trick: trick,
                isSoftDeleted: true
            });
        }

        // Hard delete
        await Trick.findByIdAndDelete(trickId);
        res.status(200).json({ message: 'Trick deleted successfully', isSoftDeleted: false });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting trick', error: error.message });
    }
};

module.exports = {
    createTrick,
    getTricks,
    getTrickById,
    updateTrick,
    deleteTrick
};
