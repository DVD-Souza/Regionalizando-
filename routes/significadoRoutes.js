const express = require('express');
const router = express.Router();
const significadoController = require('../controllers/significadoController');

router.post('/', significadoController.create);
router.get('/', significadoController.getAll);

module.exports = router;
