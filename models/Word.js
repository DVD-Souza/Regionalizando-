// models/Word.js
const db = require('../config/db');

class Word {
  constructor(id, word, addedBy) {
    this.id = id;
    this.word = word;
    this.addedBy = addedBy;
  }

  // Word creation and return of the object with the generated ID
  static async create({ addedBy, word }) {
    const query = 'INSERT INTO words (user_id, word) VALUES (?, ?)';
    const [result] = await db.execute(query, [addedBy, word]);
    return { id: result.insertId, addedBy, word };
  }

  // Word removal
  static async remove(id) {
    const query = 'DELETE FROM words WHERE id = ?';
    const [result] = await db.execute(query, [id]);
    return result;
  }

  // Search by parameter (filtering by name, region, etc.) — adapt according to table structure
  static async byParams({ name, region, type }) {
    let query = 'SELECT * FROM words WHERE 1=1';
    const values = [];
    if (name) {
      query += ' AND word LIKE ?';
      values.push(`%${name}%`);
    }
    if (region) {
      query += ' AND region = ?';
      values.push(region);
    }
    if (type) {
      query += ' AND type = ?';
      values.push(type);
    }
    const [rows] = await db.execute(query, values);
    return rows;
  }

  // Find a word by ID
  static async findById(id) {
    const query = 'SELECT * FROM words WHERE id = ?';
    const [rows] = await db.execute(query, [id]);
    return rows[0];
  }

  // Word update (field "word")
  static async update(id, name) {
    if (!name) return { affectedRows: 0 };

    const query = 'UPDATE words SET word = ? WHERE id = ?';
    const [result] = await db.execute(query, [name, id]);
    return result;
  }
}

module.exports = Word;
