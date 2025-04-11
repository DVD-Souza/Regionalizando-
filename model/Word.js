const db = require('../config/db');

class Word {
  static async create(data) {
    return db.query('INSERT INTO words SET ?', [data]);
  }

  static async findById(id) {
    return db.query('SELECT * FROM words WHERE id = ?', [id]);
  }

  static async findAll() {
    return db.query('SELECT * FROM words');
  }

  static async update(id, data) {
    return db.query('UPDATE words SET ? WHERE id = ?', [data, id]);
  }

  static async delete(id) {
    return db.query('DELETE FROM words WHERE id = ?', [id]);
  }
}

module.exports = Word;
