// routes/meaningRoutes.js
const express = require('express');
const router = express.Router();
const meaningController = require('../controllers/meaningController');
const { protect } = require('../middleware/auth');

// Create the meaning associating it with a word
router.post('/word/:wordId/meaning/create', protect, meaningController.create);

// Fetch meanings of a word
router.get('/word/:wordId/meaning', meaningController.getByWord);

// Remove a meaning associated with the word
router.delete('/word/:wordId/meaning/:meaningId', protect, meaningController.remove);

// Update a meaning associated with the word
router.put('/word/:wordId/meaning/:meaningId', protect, meaningController.update);

module.exports = router;
