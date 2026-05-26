// Connects the code with the dependencies.
const express = require('express');
// Configures the use of a router.
const router = express.Router();
// Connects to the user controller.
const userController = require('../controllers/user.controller');
// Requests the use of middleware
const { protect } = require('../middleware/auth'); // Authentication middleware

// Implemented routes.
router.post('/signup', userController.create);
router.put('/user/:id', protect, userController.update);
router.delete('/user/:id', protect, userController.remove);
router.post('/user/login', userController.login);
router.get('/user/:name', userController.findByName);

// Exports the module as a route.
module.exports = router;
