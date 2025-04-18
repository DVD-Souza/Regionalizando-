const express = require('express');
const router = express.Router();
const locationController = require('../controllers/locationController');
const { protect } = require('../middleware/authMiddleware');

// Rota protegida para criar uma nova localidade (location)
router.post('/', protect, locationController.create);

// Rota pública para obter todas as localidades cadastradas
router.get('/', locationController.getAll);

module.exports = router;
