const db = require('../config/db');

class MeaningLog {
  static async create(data) {
    return db.query('INSERT INTO meaning_logs SET ?', [data]);
  }

  static async findById(id) {
    return db.query('SELECT * FROM meaning_logs WHERE id = ?', [id]);
  }
}

module.exports = MeaningLog;
