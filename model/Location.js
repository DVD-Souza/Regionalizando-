const db = require('../config/db');

class Location {
  static async create(data) {
    return db.query('INSERT INTO locations SET ?', [data]);
  }

  static async findById(id) {
    return db.query('SELECT * FROM locations WHERE id = ?', [id]);
  }
}

module.exports = Location;
