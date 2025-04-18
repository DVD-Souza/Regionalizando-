const express = require('express');
const router = express.Router();
const meaningLogController = require('../controllers/meaningLogController');
const { protect } = require('../middleware/authMiddleware');

// Rota protegida para criar um novo log de mudança de significado
router.post('/', protect, meaningLogController.create);

// Rota pública para buscar todos os logs de alteração de significados
router.get('/', meaningLogController.getAll);

module.exports = router;
