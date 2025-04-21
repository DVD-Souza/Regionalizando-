// models/Palavra.js
const db = require('../config/db');

class Palavra {
  constructor(id, word, addedBy) {
    this.id = id;
    this.word = word;
    this.addedBy = addedBy;
  }

  // Criação da palavra e retorno do objeto com o ID gerado
  static async create({ addedBy, word }) {
    const query = 'INSERT INTO palavras (id_usuario, palavra) VALUES (?, ?)';
    const [result] = await db.execute(query, [addedBy, word]);
    return { id: result.insertId, addedBy, word };
  }

  // Remoção da palavra
  static async remove(id) {
    const query = 'DELETE FROM palavras WHERE id = ?';
    const [result] = await db.execute(query, [id]);
    return result;
  }

  // Busca por parâmetro (filtrando por nome, região, etc.) — adapte conforme a estrutura da tabela
  static async byParams({ name, region, type }) {
    let query = 'SELECT * FROM palavras WHERE 1=1';
    const values = [];
    if (name) {
      query += ' AND palavra LIKE ?';
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

  // Busca uma palavra pelo ID
  static async findById(id) {
    const query = 'SELECT * FROM palavras WHERE id = ?';
    const [rows] = await db.execute(query, [id]);
    return rows[0];
  }

  // Atualização da palavra (campo "palavra")
  static async update(id, name) {
    if (!name) return { affectedRows: 0 };

    const query = 'UPDATE palavras SET palavra = ? WHERE id = ?';
    const [result] = await db.execute(query, [name, id]);
    return result;
  }
}

module.exports = Palavra;