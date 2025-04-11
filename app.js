//Conecta com a bliblioteca express
const express = require('express');
//conecta as rotas do usuario
const userRoutes = require('./routes/user.routes');

//configuração da conexão.
const app = express();
const PORT = 3000;

// Middleware para processar JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//rotas
app.use('/regionalizando', userRoutes);

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

