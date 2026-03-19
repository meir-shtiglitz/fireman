const express = require('express');
const router = express.Router();
const eventTrickController = require('../controlers/eventTrick');

router.post('/reorder', eventTrickController.batchReorder);
router.post('/', eventTrickController.attachTrick);
router.get('/event/:eventId', eventTrickController.getEventTricks);
router.put('/:id', eventTrickController.updateEventTrick);
router.delete('/:id', eventTrickController.removeTrick);

module.exports = router;
