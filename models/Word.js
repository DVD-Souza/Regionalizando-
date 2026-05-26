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
    const query = 'INSERT INTO textual_elements (user_id, word) VALUES (?, ?)';
    const [result] = await db.execute(query, [addedBy, word]);
    return { id: result.insertId, addedBy, word };
  }

  // Word removal
  static async remove(id) {
    const query = 'DELETE FROM textual_elements WHERE element_id = ?';
    const [result] = await db.execute(query, [id]);
    return result;
  }

  // Find a word by ID
  static async findById(id) {
    const query = 'SELECT * FROM textual_elements WHERE id = ?';
    const [rows] = await db.execute(query, [id]);
    return rows[0];
  }

  static async byParams({name}) {
    let query = 'SELECT * FROM textual_elements WHERE 1=1';
    const values = [];
    if (name) {
      query += ' AND word LIKE ?';
      values.push(`%${name}%`);
    }
    const [rows] = await db.execute(query, values);
    return rows;
  }

  // Word update (field "word")
  static async update(id, word) {
    if (!word) return { affectedRows: 0 };

    const query = 'UPDATE textual_elements SET word = ? WHERE element_id = ?';
    const [result] = await db.execute(query, [word, id]);
    return result;
  }
}

module.exports = Word;
