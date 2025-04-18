//Faz a ligação com a biblioteca exprees js.
const express = require('express');
const router = express.Router(); // Cria o roteador do Express
const palavraController = require('../controllers/palavraController'); // Importa o controller
const { protect } = require('../middleware/auth'); // Middleware de autenticação

// Rota para criar uma nova palavra (somente usuários autenticados) coms significado inicial
router.post('/palavra/criar', protect, palavraController.create);

// Rota para buscar todas as palavras
router.get('/palavra', palavraController.getAll);

// Rota para buscar uma palavra por ID
router.get('/palavra/:busca', palavraController.getById);

// Rota para deletar uma palavra (somente o criador pode)
router.delete('/palavra/:id', protect, palavraController.delete);

// Rota para atualizar uma palavra (somente o criador pode)
router.put('/palavra/:id', protect, palavraController.update);

module.exports = router; // Exporta o roteador
