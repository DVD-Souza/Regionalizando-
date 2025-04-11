const Word = require('../models/Word');

module.exports = {
  async create(req, res) {
    const word = await Word.create(req.body);
    return res.status(201).json(word);
  },

  async getById(req, res) {
    const word = await Word.findById(req.params.id);
    if (!word) return res.status(404).json({ error: 'Word not found' });
    return res.json(word);
  },

  async getAll(req, res) {
    const words = await Word.findAll();
    return res.json(words);
  },

  async update(req, res) {
    const updatedWord = await Word.update(req.params.id, req.body);
    return res.json(updatedWord);
  },

  async delete(req, res) {
    await Word.delete(req.params.id);
    return res.status(204).send();
  }
};
