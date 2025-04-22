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
    const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
    const hashedPassword = await bcrypt.hash(newUser.password, 10);
    await db.execute(query, [newUser.name, newUser.email, hashedPassword]);
  }

  // Method to update user data
  static async update(id, { name, email, password }) {
    // If password is provided, hash it again
    let hashedPassword;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    // Dynamically define fields and values
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

    // If no fields were provided, return a result with affectedRows as 0
    if (fields.length === 0) {
      return { affectedRows: 0 };
    }

    const query = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
    values.push(id);
    const [result] = await db.execute(query, values);
    return result;
  }

  // Method to delete a user
  static async delete(id) {
    const query = 'DELETE FROM users WHERE id = ?';
    const [result] = await db.execute(query, [id]);
    return result;
  }

  // Method to find a user by email (used during login)
  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = ?';
    const [rows] = await db.execute(query, [email]);
    return rows[0]; // Returns the first result
  }

  // Method to search users by name (uses LIKE for partial matches)
  static async findByName(name) {
    const query = 'SELECT * FROM users WHERE name LIKE ?';
    const [rows] = await db.execute(query, [`%${name}%`]);
    return rows;
  }
}

module.exports = User;
