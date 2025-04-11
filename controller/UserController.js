const User = require('../models/User');

module.exports = {
  async create(req, res) {
    const user = await User.create(req.body);
    return res.status(201).json(user);
  },

  async login(req, res) {
    const user = await User.findByEmail(req.body.email);
    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.json(user);
  },

  async getById(req, res) {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.json(user);
  },

  async update(req, res) {
    const updatedUser = await User.update(req.params.id, req.body);
    return res.json(updatedUser);
  },

  async delete(req, res) {
    await User.delete(req.params.id);
    return res.status(204).send();
  }
};
