const express = require('express');
const router = express.Router();
const WordController = require('../controllers/WordController');

router.post('/', WordController.create);
router.get('/:id', WordController.getById);
router.get('/', WordController.getAll);
router.put('/:id', WordController.update);
router.delete('/:id', WordController.delete);

module.exports = router;
