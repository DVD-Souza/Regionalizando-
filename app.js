const express = require('express');
const app = express();

// Middleware nativo do express (substitui body-parser)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const userRoute = require('./routes/user.routes'); 
const wordRoute = require('./routes/wordRoutes');
const meaningRoute = require('./routes/meaningRoutes');
const interactionRoute = require('./routes/interactionRoutes');

// Rotas organizadas
app.use('/users', userRoute);
app.use('/words', wordRoute);
app.use('/meanings', meaningRoute);
app.use('/interactions', interactionRoute);

// Inicialização do servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
