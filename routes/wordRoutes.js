// routes/wordRoutes.js
const express = require('express');
const router = express.Router();
const wordController = require('../controllers/wordController');
const { protect } = require('../middleware/auth');

// Route to create a new word (only for authenticated users)
router.post('/word/create', protect, wordController.create);

// Route to fetch all words with pagination
router.get('/word', wordController.getSix);

// Route to search by parameters (by name, region or type) via query string
// Example: GET /word/search?name=someName&region=someRegion
router.get('/word/search', wordController.getByParams);

// Route to delete a word (only the creator can delete)
router.delete('/word/:wordId', protect, wordController.remove);

// Route to update a word (only the creator can update)
router.put('/word/:wordId', protect, wordController.update);

module.exports = router;
