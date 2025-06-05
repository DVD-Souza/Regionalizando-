const db = require('../config/db');

class Meaning {
  constructor(id, addedBy, region, description, additional_info, type) {
    this.id = id;
    this.user_id = addedBy;
    this.region_id = region;
    this.description = description;
    this.additional_info = additional_info;
    this.type = type || 'empty';
  }

  static async create(newMeaning) {
    const query = 'INSERT INTO meanings (user_id, location_id, description, additional_info, type) VALUES (?, ?, ?, ?, ?)';
    const [result] = await db.execute(query, [
      newMeaning.user_id,
      newMeaning.region_id,
      newMeaning.description,
      newMeaning.additional_info,
      newMeaning.type
    ]);
    return { id: result.insertId };
  }

  static async getByWordId(wordId) {
  const query = `
    SELECT 
      m.*,
      u.name AS author_name,  -- <- Nome do criador do significado
      u.user_id AS author_id  -- <- ID do criador, se quiser usar também
    FROM meanings m
    JOIN meaning_logs wm ON m.meaning_id = wm.meaning_id
    JOIN users u ON m.user_id = u.user_id
    WHERE wm.element_id = ?`;
    
  const [rows] = await db.execute(query, [wordId]);
  return rows;
  }

  static async byParams({region, type }) {
    let query = 'SELECT * FROM meanings WHERE 1=1';
    const values = [];
    if (region) {
      query += ' AND location_id = ?';
      values.push(region);
    }
    if (type) {
      query += ' AND type = ?';
      values.push(type);
    }
    const [rows] = await db.execute(query, values);
    return rows;
  }


  static async delete(wordId, meaningId) {
    const query = `
      DELETE wm
      FROM meaning_logs wm
      JOIN meanings m ON wm.meaning_id = m.meaning_id
      WHERE wm.element_id = ? AND wm.meaning_id = ?`;
    const [result] = await db.execute(query, [wordId, meaningId]);
    return result;
  }

  static async update(meaningId, { region, description, info, type }) {
    if (!region && !description && !info && !type) {
      return { affectedRows: 0 };
    }

    let query = 'UPDATE meanings SET ';
    const values = [];

    if (region) {
      query += 'location_id = ?, ';
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

    query = query.slice(0, -2); // remove última vírgula
    query += ' WHERE meaning_id = ?';
    values.push(meaningId);

    const [result] = await db.execute(query, values);
    return result;
  }
}

module.exports = Meaning;
