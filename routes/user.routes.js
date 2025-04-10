//conecta o codigo com as dependencias.
const express = require('express');
//configura o uso de um roteador.
const router = express.Router();
//conecta ao controlador de usuário.
const userController = require('../controller/user.controller');

//Rotas implemetadas.
router.post('/', userController.criar);
router.put('/:id', userController.atualizar);
router.delete('/:id', userController.remover);


////O codigo abaixo segue em construção, manutenção ou correção.
router.post('/login', UsuarioController.login);
router.get('/:id', UsuarioController.buscarPorId);

//exporta o modulo como uma rota.
module.exports = router;