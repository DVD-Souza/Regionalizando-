// routes/palavraRoutes.js
const express = require('express');
const router = express.Router();
const palavraController = require('../controllers/palavraController');
const { protect } = require('../middleware/auth');

// Rota para criar uma nova palavra (somente usuários autenticados)
router.post('/palavra/criar', protect, palavraController.create);

// Rota para buscar todas as palavras com paginação
router.get('/palavra', palavraController.getSix);

// Rota para busca por parâmetros (por name, region ou type) via query string
// Exemplo: GET /palavra/busca?name=algumNome&region=algumaRegiao
router.get('/palavra/busca', palavraController.getByParams);

// Rota para deletar uma palavra (somente o criador pode)
router.delete('/palavra/:palavraId', protect, palavraController.remove);

// Rota para atualizar uma palavra (somente o criador pode)
router.put('/palavra/:palavraId', protect, palavraController.update);

module.exports = router;
