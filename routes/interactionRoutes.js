// routes/interactionRoutes.js

const express = require('express');
const router = express.Router();
const interactionController = require('../controllers/interactionController');
const { protect } = require('../middleware/auth');

// Route to create an interaction for a meaning of a word
router.post('/word/:wordId/meaning/:meaningId/interaction', protect, interactionController.create);

// Route to fetch the interaction of a user for a meaning
router.get('/word/:wordId/user/meaning/:meaningId', protect, interactionController.getByUser);

// Route to get the total count of likes and dislikes for a meaning
router.get('/word/:wordId/count/meaning/:meaningId', interactionController.getAllInt);

module.exports = router;
