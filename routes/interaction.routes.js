const express = require('express');
const router = express.Router();
const InteractionController = require('../controllers/InteractionController');

router.post('/', InteractionController.create);
router.get('/:id', InteractionController.getById);
router.get('/', InteractionController.getAll);
router.delete('/:id', InteractionController.delete);

module.exports = router;
