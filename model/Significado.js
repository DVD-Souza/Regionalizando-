// models/Significado.js

const db = require('../config/db');

class Significado {
  constructor(id, id_regiao, descricao, infor_adicionais, tipo) {
    this.id = id;
    this.id_regiao = id_regiao;             // Valor recebido como "region"
    this.descricao = descricao;             // Valor recebido como "description"
    this.infor_adicionais = infor_adicionais; // Valor recebido como "info"
    this.tipo = tipo || 'vazio';            // Valor recebido como "type", com default se não for informado
  }

  static async create(newSig) {
    const query = 'INSERT INTO significados (id_regiao, descricao, infor_adicionais, tipo) VALUES (?, ?, ?, ?)';
    // Aqui utilizamos as propriedades do objeto newSig conforme definidas no construtor
    await db.execute(query, [newSig.id_regiao, newSig.descricao, newSig.infor_adicionais, newSig.tipo]);
  }

  static async getByWordId(wordId) {
    const query = `
      SELECT s.*
      FROM significados s
      JOIN palavras_significados ps ON s.id = ps.significado_id
      WHERE ps.palavra_id = ?`;
    const [rows] = await db.execute(query, [wordId]);
    return rows;
  }

  static async delete(palavraId, significadoId) {
    const query = `
      DELETE ps
      FROM palavras_significados ps
      JOIN significados s ON ps.significado_id = s.id
      WHERE ps.palavra_id = ? AND ps.significado_id = ?`;
    const [result] = await db.execute(query, [palavraId, significadoId]);
    return result;
  }

  static async update(significadoId, { region, description, info, type }) {
    // Se nenhum campo for fornecido, retorna um objeto simulando retorno sem linhas afetadas
    if (!region && !description && !info && !type) {
      return { affectedRows: 0 };
    }

    let query = 'UPDATE significados SET ';
    const values = [];

    if (region) {
      query += 'id_regiao = ?, ';
      values.push(region);
    }
    if (description) {
      query += 'descricao = ?, ';
      values.push(description);
    }
    if (info) {
      query += 'infor_adicionais = ?, ';
      values.push(info);
    }
    if (type) {
      query += 'tipo = ?, ';
      values.push(type);
    }

    // Remove a última vírgula e espaço
    query = query.slice(0, -2);

    // Adiciona a cláusula WHERE filtrando pelo ID do significado
    query += ' WHERE id = ?';
    values.push(significadoId);

    const [result] = await db.execute(query, values);
    return result;
  }
}

module.exports = Significado;