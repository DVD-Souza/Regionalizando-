const db = require('../config/db');
const Location = require('../models/Location');

// Controller responsável pelas operações relacionadas à entidade Location (Localidade)
class LocationController {
  // Cria uma nova localidade
  async create(req, res) {
    try {
      const { region, state } = req.body;
      const createdAt = new Date();

      const [result] = await db.execute(
        'INSERT INTO locations (region, state, created_at) VALUES (?, ?, ?)',
        [region, state, createdAt]
      );

      const newLocation = new Location(result.insertId, region, state, createdAt);
      res.status(201).json(newLocation);
    } catch (err) {
      res.status(400).json({ message: 'Erro ao adicionar localidade', error: err.message });
    }
  }

  // Retorna todas as localidades
  async getAll(req, res) {
    try {
      const [rows] = await db.execute('SELECT * FROM locations');
      res.status(200).json(rows);
    } catch (err) {
      res.status(500).json({ message: 'Erro ao buscar localidades', error: err.message });
    }
  }
}

module.exports = new LocationController();
