router.post('/', InteracaoController.criar);
router.get('/usuario/:id', InteracaoController.listarPorUsuario);
router.get('/significado/:id', InteracaoController.listarPorSignificado);
