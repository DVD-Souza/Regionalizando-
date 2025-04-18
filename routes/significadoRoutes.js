const express = require('express');
const router = express.Router();
const significadoController = require('../controllers/significadoController');
const { protect } = require('../middleware/auth'); // Middleware de autenticação

//cria o significado associando a uma palavra
router.post('/palavra/:id/significado/criar', protect, significadoController.create);
// Rota para buscar uma palavra por ID
router.get('/palavra/:id/significado', significadoController.getAll);
router.delete('/palavra/:id/significado/:id', protect, significadoController.delete);
router.put('/palavra/:id/significado/:id', protect, significadoController.update)

module.exports = router;
