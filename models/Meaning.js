// models/Meaning.js

const db = require('../config/db');

class Meaning {
  constructor(id, region_id, description, additional_info, type) {
    this.id = id;
    this.region_id = region_id;             // Value received as "region"
    this.description = description;         // Value received as "description"
    this.additional_info = additional_info; // Value received as "info"
    this.type = type || 'empty';            // Value received as "type", with default if not provided
  }

  static async create(newMeaning) {
    const query = 'INSERT INTO meanings (region_id, description, additional_info, type) VALUES (?, ?, ?, ?)';
    // Here we use the properties of the newMeaning object as defined in the constructor
    await db.execute(query, [newMeaning.region_id, newMeaning.description, newMeaning.additional_info, newMeaning.type]);
  }

  static async getByWordId(wordId) {
    const query = `
      SELECT m.*
      FROM meanings m
      JOIN words_meanings wm ON m.id = wm.meaning_id
      WHERE wm.word_id = ?`;
    const [rows] = await db.execute(query, [wordId]);
    return rows;
  }

  static async delete(wordId, meaningId) {
    const query = `
      DELETE wm
      FROM words_meanings wm
      JOIN meanings m ON wm.meaning_id = m.id
      WHERE wm.word_id = ? AND wm.meaning_id = ?`;
    const [result] = await db.execute(query, [wordId, meaningId]);
    return result;
  }

  static async update(meaningId, { region, description, info, type }) {
    // If no fields are provided, return an object simulating no affected rows
    if (!region && !description && !info && !type) {
      return { affectedRows: 0 };
    }

    let query = 'UPDATE meanings SET ';
    const values = [];

    if (region) {
      query += 'region_id = ?, ';
      values.push(region);
    }
    if (description) {
      query += 'description = ?, ';
      values.push(description);
    }
    if (info) {
      query += 'additional_info = ?, ';
      values.push(info);
    }
    if (type) {
      query += 'type = ?, ';
      values.push(type);
    }

    // Remove the last comma and space
    query = query.slice(0, -2);

    // Add the WHERE clause filtering by the meaning ID
    query += ' WHERE id = ?';
    values.push(meaningId);

    const [result] = await db.execute(query, values);
    return result;
  }
}

module.exports = Meaning;
