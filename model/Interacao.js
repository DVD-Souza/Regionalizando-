// models/Interacao.js

const db = require('../config/db');

class Interacao {
  constructor(id, id_usuario, like, deslike) {
    this.id = id;
    this.id_usuario = id_usuario;
    this.like = like;
    this.deslike = deslike;
  }

  // Cria uma interação no banco de dados
  static async create(id_usuario, like, deslike) {
    // Usa três placeholders para os campos da tabela
    const query = `INSERT INTO interacoes (id_usuario, like, deslike) VALUES (?, ?, ?)`;
    const [result] = await db.execute(query, [id_usuario, like, deslike]);
    return result;
  }

  // Busca a interação de um usuário para um determinado significado
  static async byUser(significadoId, id_usuario) {
    const query = `
      SELECT i.*
      FROM interacoes AS i
      INNER JOIN interacoes_significados AS isg ON i.id = isg.id_interacao
      WHERE isg.id_significado = ? AND i.id_usuario = ?`;
    const [rows] = await db.execute(query, [significadoId, id_usuario]);
    return rows[0];
  }

  // Retorna a contagem de likes e deslikes para um significado
  static async allInt(significadoId) {
    const query = `
      SELECT 
        SUM(CASE WHEN i.like = 1 THEN 1 ELSE 0 END) AS total_likes,
        SUM(CASE WHEN i.deslike = 1 THEN 1 ELSE 0 END) AS total_deslikes
      FROM interacoes AS i
      INNER JOIN interacoes_significados AS isg ON i.id = isg.id_interacao
      WHERE isg.id_significado = ?`;
      
    const [rows] = await db.execute(query, [significadoId]);
    return rows[0];
  }
}

module.exports = Interacao;