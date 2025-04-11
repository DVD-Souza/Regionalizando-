const db = require('../config/db');

class Meaning {
  static async create(data) {
    return db.query('INSERT INTO meanings SET ?', [data]);
  }

  static async findById(id) {
    return db.query('SELECT * FROM meanings WHERE id = ?', [id]);
  }

  static async update(id, data) {
    return db.query('UPDATE meanings SET ? WHERE id = ?', [data, id]);
  }

  static async delete(id) {
    return db.query('DELETE FROM meanings WHERE id = ?', [id]);
  }
}

module.exports = Meaning;
