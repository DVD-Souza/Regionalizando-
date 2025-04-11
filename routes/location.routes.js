const express = require('express');
const router = express.Router();
const LocationController = require('../controllers/LocationController');

router.post('/', LocationController.create);
router.get('/:id', LocationController.getById);

module.exports = router;