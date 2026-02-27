const Quote = require('../models/quote');

// Create a new quote
const createQuote = async (req, res) => {
    try {
        const quote = new Quote(req.body);
        await quote.save();
        res.status(201).json(quote);
    } catch (error) {
        res.status(500).json({ message: 'Error creating quote', error: error.message });
    }
};

// Get all quotes (with search and sort)
const getQuotes = async (req, res) => {
    try {
        const { search, sortBy = 'createdAt', order = 'desc' } = req.query;
        let query = {};

        if (search) {
            const searchRegex = new RegExp(search, 'i');
            query = {
                $or: [
                    { 'customer.recipient': searchRegex },
                    { 'customer.contactPerson': searchRegex },
                    { 'customer.email': searchRegex }
                ]
            };

            // If search is a number, also try matching quoteNumber
            if (!isNaN(search)) {
                query.$or.push({ quoteNumber: Number(search) });
            }
        }

        const sortOrder = order === 'asc' ? 1 : -1;
        const quotes = await Quote.find(query).sort({ [sortBy]: sortOrder });

        res.status(200).json(quotes);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching quotes', error: error.message });
    }
};

// Get quote by ID
const getQuoteById = async (req, res) => {
    try {
        const quote = await Quote.findById(req.params.id);
        if (!quote) {
            return res.status(404).json({ message: 'Quote not found' });
        }
        res.status(200).json(quote);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching quote', error: error.message });
    }
};

// Update quote limit fields
const updateQuote = async (req, res) => {
    try {
        // Prevent updating quoteNumber manually via this route
        const updateData = { ...req.body };
        delete updateData.quoteNumber;

        const quote = await Quote.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!quote) {
            return res.status(404).json({ message: 'Quote not found' });
        }
        res.status(200).json(quote);
    } catch (error) {
        res.status(500).json({ message: 'Error updating quote', error: error.message });
    }
};

// Delete quote
const deleteQuote = async (req, res) => {
    try {
        const quote = await Quote.findByIdAndDelete(req.params.id);
        if (!quote) {
            return res.status(404).json({ message: 'Quote not found' });
        }
        if (req.query.deleteEvent === 'true') {
            const Event = require('../models/event');
            await Event.findOneAndDelete({ quoteId: req.params.id });
        }

        res.status(200).json({ message: 'Quote deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting quote', error: error.message });
    }
};

// Duplicate quote
const duplicateQuote = async (req, res) => {
    try {
        const originalQuote = await Quote.findById(req.params.id);
        if (!originalQuote) {
            return res.status(404).json({ message: 'Original quote not found' });
        }

        const duplicateData = originalQuote.toObject();
        delete duplicateData._id;
        delete duplicateData.createdAt;
        delete duplicateData.updatedAt;
        delete duplicateData.quoteNumber; // Force generation of new number

        // Append (Copy) to notes to indicate duplication
        if (duplicateData.service) {
            duplicateData.service.notes = duplicateData.service.notes
                ? `${duplicateData.service.notes} (Copy)`
                : `(Copy of Quote #${originalQuote.quoteNumber})`;
        }

        const newQuote = new Quote(duplicateData);
        await newQuote.save();

        res.status(201).json(newQuote);
    } catch (error) {
        res.status(500).json({ message: 'Error duplicating quote', error: error.message });
    }
};

module.exports = {
    createQuote,
    getQuotes,
    getQuoteById,
    updateQuote,
    deleteQuote,
    duplicateQuote
};
