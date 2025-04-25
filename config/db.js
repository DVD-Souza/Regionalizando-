require('dotenv').config();
const mysql = require('mysql2/promise');

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
});

db.getConnection()
    .then(() => console.log('Conexão com o banco de dados protegida e bem-sucedida!'))
    .catch((err) => console.error('Erro ao conectar ao banco de dados:', err));

module.exports = db;