const db = require('../config/db');
const Interacao = require('../models/Interacao');

class InteracaoController {
  async create(req, res) {
    try {
      const { like, deslike } = req.body;
      const id_usuario = req.user.id;

      const [result] = await db.execute(
        'INSERT INTO interacoes (id_usuario, like, deslike) VALUES (?, ?, ?)',
        [id_usuario, like, deslike]
      );

      const novaInteracao = new Interacao(result.insertId, id_usuario, like, deslike);
      res.status(201).json(novaInteracao);
    } catch (err) {
      res.status(400).json({ message: 'Erro ao registrar interação', error: err.message });
    }
  }

  async getAll(req, res) {
    try {
      const [rows] = await db.execute('SELECT * FROM interacoes');
      res.status(200).json(rows);
    } catch (err) {
      res.status(500).json({ message: 'Erro ao buscar interações', error: err.message });
    }
  }
}

module.exports = new InteracaoController();
