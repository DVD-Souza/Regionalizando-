//conecta o codigo com as dependencias.
const express = require('express');
//configura o uso de um roteador.
const router = express.Router();
//conecta ao controlador de usuário.
const userController = require('../controller/user.controller');
//Solicita a utilização do middleware
const { protect } = require('../middleware/auth'); // Middleware de autenticação

//Rotas implemetadas.
router.post('/cadastro', userController.create);
router.put('/user/:id', protect, userController.update);
router.delete('/user/:id', protect, userController.remove);
router.post('/user/login', userController.login);
router.get('/user/:name', userController.findByName);

//exporta o modulo como uma rota.
module.exports = router;