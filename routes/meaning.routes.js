const express = require('express');
const router = express.Router();
const MeaningController = require('../controllers/MeaningController');

router.post('/', MeaningController.create);
router.get('/:id', MeaningController.getById);
router.put('/:id', MeaningController.update);
router.delete('/:id', MeaningController.delete);

module.exports = router;
