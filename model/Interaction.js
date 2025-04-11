const db = require('../config/db');

class Interaction {
  static async create(data) {
    return db.query('INSERT INTO interactions SET ?', [data]);
  }

  static async findById(id) {
    return db.query('SELECT * FROM interactions WHERE id = ?', [id]);
  }

  static async findAll() {
    return db.query('SELECT * FROM interactions');
  }

  static async delete(id) {
    return db.query('DELETE FROM interactions WHERE id = ?', [id]);
  }
}

module.exports = Interaction;
