const express = require('express');
const router = express.Router();
const MeaningLogController = require('../controllers/MeaningLogController');

router.post('/', MeaningLogController.create);
router.get('/:id', MeaningLogController.getById);

module.exports = router;
