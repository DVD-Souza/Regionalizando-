const express = require('express');
const router = express.Router();
const interacaoController = require('../controllers/interacaoController');
const { protect } = require('../middleware/authMiddleware');

router.post('/palavra/:id/significado/:id/interacao', protect, interacaoController.create);
router.get('/palavra/:id/usuario/significado/:id', protect, interacaoController.getById);
router.get('/palavra/:id/count/significado/:id', interacaoController.getall)

module.exports = router;
