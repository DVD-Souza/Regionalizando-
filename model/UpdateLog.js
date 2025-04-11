const db = require('../config/db');

class UpdateLog {
  static async create(data) {
    return db.query('INSERT INTO update_logs SET ?', [data]);
  }

  static async findById(id) {
    return db.query('SELECT * FROM update_logs WHERE id = ?', [id]);
  }
}

module.exports = UpdateLog;