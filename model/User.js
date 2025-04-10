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
        await db.execute(query, [newuser.name, newuser.email, newuser.password]); 
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

    //O codigo abaixo segue em construção, manutenção ou correção.
    static async findById(id){}
    static async findByEmail(email){}

}

//Exporta a classe User, tornando disponivel(além dos metodos) para as outras classes.
module.exports = User;