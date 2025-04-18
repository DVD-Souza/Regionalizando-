const express = require('express');
const router = express.Router();
const updateLogController = require('../controllers/updateLogController');
const { protect } = require('../middleware/authMiddleware');

// Rota protegida para criar um novo log de atualização genérica
router.post('/', protect, updateLogController.create);

// Rota pública para buscar todos os logs de atualização
router.get('/', updateLogController.getAll);

module.exports = router;
