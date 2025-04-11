router.post('/', SignificadoController.criar);
router.get('/', SignificadoController.listar);
router.get('/:id', SignificadoController.buscarPorId);
router.get('/palavra/:id', SignificadoController.listarPorPalavra);
router.put('/:id', SignificadoController.atualizar);
router.delete('/:id', SignificadoController.remover);
