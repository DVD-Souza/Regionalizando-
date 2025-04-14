const express = require('express');
const router = express.Router(); // Cria o roteador do Express
const palavraController = require('../controllers/palavraController'); // Importa o controller
const { protect } = require('../middleware/auth'); // Middleware de autenticação

// Rota para criar uma nova palavra (somente usuários autenticados)
router.post('/', protect, palavraController.create);

// Rota para buscar todas as palavras
router.get('/', palavraController.getAll);

// Rota para buscar uma palavra por ID
router.get('/:id', palavraController.getById);

// Rota para deletar uma palavra (somente o criador pode)
router.delete('/:id', protect, palavraController.delete);

module.exports = router; // Exporta o roteador
