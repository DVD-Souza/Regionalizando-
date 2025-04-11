const Interaction = require('../models/Interaction');

module.exports = {
  async create(req, res) {
    const interaction = await Interaction.create(req.body);
    return res.status(201).json(interaction);
  },

  async getById(req, res) {
    const interaction = await Interaction.findById(req.params.id);
    if (!interaction) return res.status(404).json({ error: 'Interaction not found' });
    return res.json(interaction);
  },

  async getAll(req, res) {
    const interactions = await Interaction.findAll();
    return res.json(interactions);
  },

  async delete(req, res) {
    await Interaction.delete(req.params.id);
    return res.status(204).send();
  }
};
