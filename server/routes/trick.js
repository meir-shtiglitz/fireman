const express = require('express');
const router = express.Router();
const trickController = require('../controlers/trick');

router.post('/', trickController.createTrick);
router.get('/', trickController.getTricks);
router.get('/:id', trickController.getTrickById);
router.put('/:id', trickController.updateTrick);
router.delete('/:id', trickController.deleteTrick);

module.exports = router;
