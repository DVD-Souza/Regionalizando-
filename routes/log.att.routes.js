router.get('/', LogAtualizacaoController.listar);
router.get('/usuario/:id', LogAtualizacaoController.listarPorUsuario);
router.get('/significado/:id', LogAtualizacaoController.listarPorSignificado);
