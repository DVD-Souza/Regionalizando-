const express = require('express');
const app = express();

// Middleware nativo do express (substitui body-parser)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas organizadas
app.use('/users', require('./routes/user.routes'));
app.use('/words', require('./routes/wordRoutes'));
app.use('/meanings', require('./routes/meaningRoutes'));
app.use('/interactions', require('./routes/interactionRoutes'));

// Inicialização do servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
