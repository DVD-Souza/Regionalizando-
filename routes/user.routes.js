router.post('/', UsuarioController.criar);
router.post('/login', UsuarioController.login);
router.get('/:id', UsuarioController.buscarPorId);
router.put('/:id', UsuarioController.atualizar);
router.delete('/:id', UsuarioController.remover);
