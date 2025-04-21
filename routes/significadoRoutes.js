// routes/significadoRoutes.js
const express = require('express');
const router = express.Router();
const significadoController = require('../controllers/significadoController');
const { protect } = require('../middleware/auth');

// Cria o significado associando-o a uma palavra
router.post('/palavra/:palavraId/significado/criar', protect, significadoController.create);

// Busca os significados de uma palavra
router.get('/palavra/:palavraId/significado', significadoController.getByWord);

// Remove um significado associado à palavra
router.delete('/palavra/:palavraId/significado/:significadoId', protect, significadoController.remove);

// Atualiza um significado associado à palavra
router.put('/palavra/:palavraId/significado/:significadoId', protect, significadoController.update);

module.exports = router;
