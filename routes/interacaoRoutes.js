const express = require('express');
const router = express.Router();
const interacaoController = require('../controllers/interacaoController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, interacaoController.create);
router.get('/', interacaoController.getAll);

module.exports = router;
