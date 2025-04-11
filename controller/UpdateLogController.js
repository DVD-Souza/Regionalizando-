const UpdateLog = require('../models/UpdateLog');

module.exports = {
  async create(req, res) {
    const log = await UpdateLog.create(req.body);
    return res.status(201).json(log);
  },

  async getById(req, res) {
    const log = await UpdateLog.findById(req.params.id);
    if (!log) return res.status(404).json({ error: 'Log not found' });
    return res.json(log);
  }
};
