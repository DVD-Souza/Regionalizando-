const db = require('../config/db');
const MeaningLog = require('../models/MeaningLog');

// Controller que lida com o histórico de significados (Meaning Log)
class MeaningLogController {
  // Cria um novo log de alteração de significado
  async create(req, res) {
    try {
      const { palavraId, previousMeaning, newMeaning } = req.body;
      const changedBy = req.user.id;
      const changedAt = new Date();

      const [result] = await db.execute(
        'INSERT INTO meaning_logs (palavra_id, previous_meaning, new_meaning, changed_by, changed_at) VALUES (?, ?, ?, ?, ?)',
        [palavraId, previousMeaning, newMeaning, changedBy, changedAt]
      );

      const newLog = new MeaningLog(result.insertId, palavraId, previousMeaning, newMeaning, changedBy, changedAt);
      res.status(201).json(newLog);
    } catch (err) {
      res.status(400).json({ message: 'Erro ao registrar log de significado', error: err.message });
    }
  }

  // Retorna todos os logs de alteração de significados
  async getAll(req, res) {
    try {
      const [rows] = await db.execute('SELECT * FROM meaning_logs');
      res.status(200).json(rows);
    } catch (err) {
      res.status(500).json({ message: 'Erro ao buscar logs de significado', error: err.message });
    }
  }
}

module.exports = new MeaningLogController();
