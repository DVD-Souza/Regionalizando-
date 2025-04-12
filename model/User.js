//Conectando a classe modelo com a configuração do banco de dados.
const db = require('../config/database');
//Conecta a classe a biblioteca de criptografia para as senhas.
const bcrypt = require('bcrypt');

//Classe responsavel pela entidade usuário.
class User {
    //variaveis privadas
    #id;
    #name;
    #email;
    #password;
    
    //construtor do objeto usuário.
    constructor(id, name, email, password) {
        this.#id = id;
        this.#name = name;
        this.#email = email;
        this.#password = password
    }

    //Getters
    get name() {
        return this.#name;
    }
    
    get email() {
        return this.#email;
    }
    
    get password() {
        return this.#password;
    }
    

    //método para criar um objeto usuário dentro do banco de dados.
    static async create(newuser){
        const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
        const hashedPassword = await bcrypt.hash(newuser.password, 10);
        await db.execute(query, [newuser.name, newuser.email, hashedPassword]); 
    };
    
    //método para atualizar um objeto usuário dentro do banco de dados.
    static async update(id, user){
        const query = 'UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?';
        await db.execute(query, [user.name, user.email, user.password, id])
    };

    //método para excluir um objeto usuário dentro do banco de dados.
    static async delete(id){
        await db.execute('DELETE FROM users WHERE id = ?', [id]);
    };

    //método para buscar um usuário pelo email, permitindo realizar o login se existir um usuário.
    static async findByEmail(email) {
        const query = 'SELECT * FROM users WHERE email = ?';
        const [rows] = await db.execute(query, [email]);
        return rows[0]; // Retorna o primeiro resultado da busca
    } 

    //método para buscar usuário com base no nome.
    static async findByName(name) {
        const query = 'SELECT * FROM users WHERE name LIKE ?';
        const [rows] = await db.execute(query, [`%${name}%`]); // Usa LIKE para buscas parciais
        return rows; // Retorna todos os usuários que correspondem ao nome
    }       
}

//Exporta a classe User, tornando disponivel(além dos metodos) para as outras classes.
module.exports = User;