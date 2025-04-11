const db = require('../config/db'); // Database connection

class User {
  static async create(data) {
    return db.query('INSERT INTO users SET ?', [data]);
  }

  static async findById(id) {
    return db.query('SELECT * FROM users WHERE id = ?', [id]);
  }

  static async findByEmail(email) {
    return db.query('SELECT * FROM users WHERE email = ?', [email]);
  }

  static async update(id, data) {
    return db.query('UPDATE users SET ? WHERE id = ?', [data, id]);
  }

  static async delete(id) {
    return db.query('DELETE FROM users WHERE id = ?', [id]);
  }
}

module.exports = User;
