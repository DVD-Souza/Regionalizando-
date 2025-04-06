router.post('/', PalavraController.criar);
router.get('/', PalavraController.listar);
router.get('/:id', PalavraController.buscarPorId);
router.get('/busca/:q', PalavraController.buscarPorTexto);
