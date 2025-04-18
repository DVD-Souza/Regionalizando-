const db = require('../config/db');
const UpdateLog = require('../models/UpdateLog');

// Controller responsável por logs de alterações genéricas nas palavras
class UpdateLogController {
  // Cria um novo log de atualização
  async create(req, res) {
    try {
      const { palavraId, fieldUpdated, oldValue, newValue } = req.body;
      const updatedBy = req.user.id;
      const updatedAt = new Date();

      const [result] = await db.execute(
        'INSERT INTO update_logs (palavra_id, field_updated, old_value, new_value, updated_by, updated_at) VALUES (?, ?, ?, ?, ?, ?)',
        [palavraId, fieldUpdated, oldValue, newValue, updatedBy, updatedAt]
      );

      const newLog = new UpdateLog(result.insertId, palavraId, fieldUpdated, oldValue, newValue, updatedBy, updatedAt);
      res.status(201).json(newLog);
    } catch (err) {
      res.status(400).json({ message: 'Erro ao registrar log de atualização', error: err.message });
    }
  }

  // Retorna todos os logs de atualização
  async getAll(req, res) {
    try {
      const [rows] = await db.execute('SELECT * FROM update_logs');
      res.status(200).json(rows);
    } catch (err) {
      res.status(500).json({ message: 'Erro ao buscar logs de atualização', error: err.message });
    }
  }
}

module.exports = new UpdateLogController();
