//conecta o codigo com as dependencias.
const express = require('express');
//configura o uso de um roteador.
const router = express.Router();
//conecta ao controlador de usuário.
const userController = require('../controller/user.controller');
//Solicita a utilização do middleware
const authMiddleware = require('../middlewares/auth');

//Rotas implemetadas.
router.post('/', userController.create);
router.put('/:id', authMiddleware, userController.update);
router.delete('/:id', authMiddleware, userController.remove);
router.post('/login', userController.login);
router.get('/:id', userController.findByName);

//exporta o modulo como uma rota.
module.exports = router;