// models/User.js

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

  // Method to create a new user
  static async create(newUser) {
    // Hash the password before saving it
    const hashedPassword = await bcrypt.hash(newUser.password, 10);
    
    const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
    await db.execute(query, [newUser.name, newUser.email, hashedPassword]);
  }

  // Method to update user data
  static async update(id, { name, email, password }) {
    let fields = [];
    let values = [];

    // If password is provided, hash it again
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10); // Hash the new password
      fields.push('password = ?');
      values.push(hashedPassword);
    }

    if (name) {
      fields.push('name = ?');
      values.push(name);
    }
    if (email) {
      fields.push('email = ?');
      values.push(email);
    }

    // If no fields were provided, return a result with affectedRows as 0
    if (fields.length === 0) {
      return { affectedRows: 0 };
    }

    const query = `UPDATE users SET ${fields.join(', ')} WHERE user_id = ?`;
    values.push(id);
    const [result] = await db.execute(query, values);
    return result;
  }

  // Method to delete a user
  static async delete(id) {
    const query = 'DELETE FROM users WHERE user_id = ?';
    const [result] = await db.execute(query, [id]);
    return result;
  }

  // Method to find a user by email (used during login)
  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = ?';
    const [rows] = await db.execute(query, [email]);
  
    if (rows.length === 0) return null;
  
    const user = rows[0];
  
    return {
      id: user.user_id,         // Renomeia aqui
      email: user.email,
      password: user.password   // Inclui se for necessário comparar com bcrypt
    };
  }

  // Method to search users by name (uses LIKE for partial matches)
  static async findByName(name) {
    const query = 'SELECT * FROM users WHERE name LIKE ?';
    const [rows] = await db.execute(query, [`%${name}%`]);
    return rows;
  }
}

module.exports = User;
