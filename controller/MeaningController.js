const Meaning = require('../models/Meaning');

module.exports = {
  async create(req, res) {
    const meaning = await Meaning.create(req.body);
    return res.status(201).json(meaning);
  },

  async getById(req, res) {
    const meaning = await Meaning.findById(req.params.id);
    if (!meaning) return res.status(404).json({ error: 'Meaning not found' });
    return res.json(meaning);
  },

  async update(req, res) {
    const updatedMeaning = await Meaning.update(req.params.id, req.body);
    return res.json(updatedMeaning);
  },

  async delete(req, res) {
    await Meaning.delete(req.params.id);
    return res.status(204).send();
  }
};
