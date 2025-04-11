const express = require('express');
const router = express.Router();

router.use('/User', require('./user.routes'));
router.use('/palavra', require('./palavra.routes'));
router.use('/sig', require('./sig.routes'));
router.use('/interacoes', require('./interacoes.routes'));
router.use('/log.att', require('./log.att.routes'));
router.use('/log.sig', require('./log.sig.routes'));
router.use('/localidade', require('./localidade.routes'));

module.exports = router;
