const Location = require('../models/Location');

module.exports = {
  async create(req, res) {
    const location = await Location.create(req.body);
    return res.status(201).json(location);
  },

  async getById(req, res) {
    const location = await Location.findById(req.params.id);
    if (!location) return res.status(404).json({ error: 'Location not found' });
    return res.json(location);
  }
};