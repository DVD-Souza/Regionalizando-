const express = require('express');
const router = express.Router();
const UpdateLogController = require('../controllers/UpdateLogController');

router.post('/', UpdateLogController.create);
router.get('/:id', UpdateLogController.getById);

module.exports = router;
