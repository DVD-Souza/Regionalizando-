// model/User.js

const db = require('../config/db');
const bcrypt = require('bcrypt');

class User {
  #id;
  #name;
  #email;
  #password;

  constructor(id, name, email, password) {
    this.#id = id;
    this.#name = name;
    this.#email = email;
    this.#password = password;
  }

  // Getters
  get id() {
    return this.#id;
  }
  get name() {
    return this.#name;
  }
  get email() {
    return this.#email;
  }
  get password() {
    return this.#password;
  }

  // Método para criar um usuário
  static async create(newUser) {
    const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
    const hashedPassword = await bcrypt.hash(newUser.password, 10);
    await db.execute(query, [newUser.name, newUser.email, hashedPassword]);
  }

  // Método para atualizar um usuário
  static async update(id, { name, email, password }) {
    // Se a senha for enviada, a re-hasheamos
    let hashedPassword;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }
    
    // Definindo os campos e valores dinamicamente
    let fields = [];
    let values = [];

    if (name) {
      fields.push('name = ?');
      values.push(name);
    }
    if (email) {
      fields.push('email = ?');
      values.push(email);
    }
    if (password) {
      fields.push('password = ?');
      values.push(hashedPassword);
    }
    // Se nenhum campo foi enviado, retorna uma resposta com affectedRows zero
    if (fields.length === 0) {
      return { affectedRows: 0 };
    }
    
    const query = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
    values.push(id);
    const [result] = await db.execute(query, values);
    return result;
  }

  // Método para deletar um usuário
  static async delete(id) {
    const query = 'DELETE FROM users WHERE id = ?';
    const [result] = await db.execute(query, [id]);
    return result;
  }

  // Método para buscar um usuário pelo email (utilizado no login)
  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = ?';
    const [rows] = await db.execute(query, [email]);
    return rows[0]; // Retorna o primeiro resultado
  }

  // Método para buscar usuários pelo nome (usa LIKE para buscas parciais)
  static async findByName(name) {
    const query = 'SELECT * FROM users WHERE name LIKE ?';
    const [rows] = await db.execute(query, [`%${name}%`]);
    return rows;
  }
}

module.exports = User;