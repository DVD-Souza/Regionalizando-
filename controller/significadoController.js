const db = require('../config/db');
const Significado = require('../models/Significado');

class SignificadoController {
  async create(req, res) {
    try {
      const { id_regiao, id_elemento, descricao, infor_adicionais, tipo } = req.body;

      const [result] = await db.execute(
        'INSERT INTO significados (id_regiao, id_elemento, descricao, infor_adicionais, tipo) VALUES (?, ?, ?, ?, ?)',
        [id_regiao, id_elemento, descricao, infor_adicionais, tipo]
      );

      const novoSignificado = new Significado(result.insertId, id_regiao, id_elemento, descricao, infor_adicionais, tipo);
      res.status(201).json(novoSignificado);
    } catch (err) {
      res.status(400).json({ message: 'Erro ao criar significado', error: err.message });
    }
  }

  async getAll(req, res) {
    try {
      const [rows] = await db.execute('SELECT * FROM significados');
      res.status(200).json(rows);
    } catch (err) {
      res.status(500).json({ message: 'Erro ao buscar significados', error: err.message });
    }
  }
}

module.exports = new SignificadoController();
