// routes/interacaoRoutes.js

const express = require('express');
const router = express.Router();
const interacaoController = require('../controllers/interacaoController');
const { protect } = require('../middleware/authMiddleware');

// Rota para criar uma interação para um significado de uma palavra
router.post('/palavra/:palavraId/significado/:significadoId/interacao', protect, interacaoController.create);

// Rota para buscar a interação de um usuário em um significado
router.get('/palavra/:palavraId/usuario/significado/:significadoId', protect, interacaoController.getByUser);

// Rota para obter a contagem total de likes e deslikes de um significado
router.get('/palavra/:palavraId/count/significado/:significadoId', interacaoController.getAllInt);

module.exports = router;
