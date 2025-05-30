const db = require('../config/db');
const Meaning = require('../models/Meaning');

const create = async (req, res) => {
  try {
    const { wordId } = req.params;
    const { addedBy, region, description, info, type } = req.body;

    console.log('Payload recebido:', { wordId, addedBy, region, description, info, type });

    // Validação básica
    if (!addedBy || !region || !description || !type) {
      return res.status(400).json({
        message: 'Fields addedBy, region, description, and type are required.'
      });
    }

    const newMeaning = new Meaning(null, addedBy, region, description, info, type);
    const { id: meaningId } = await Meaning.create(newMeaning); // Pegando insertId diretamente

    // Associação com a palavra
    const associationQuery = 'INSERT INTO meaning_logs (element_id, meaning_id) VALUES (?, ?)';
    await db.execute(associationQuery, [wordId, meaningId]);

    res.status(201).json({ message: 'Meaning created and successfully associated with the word.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating meaning or associating it with the word.', error: error.message });
  }
};

const getByWord = async (req, res) => {
  try {
    const { wordId } = req.params;
    const meanings = await Meaning.getByWordId(wordId);

    if (!meanings || meanings.length === 0) {
      return res.status(404).json({ message: 'No meanings found for this word.' });
    }

    res.status(200).json({
      wordId,
      totalMeanings: meanings.length,
      meanings,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error fetching meanings associated with the word.',
      error: error.message,
    });
  }
};

const remove = async (req, res) => {
  try {
    const { wordId, meaningId } = req.params;
    const result = await Meaning.delete(wordId, meaningId);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: 'Meaning not found or not associated with the specified word.'
      });
    }

    res.status(200).json({ message: 'Meaning deleted successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error deleting meaning.',
      error: error.message,
    });
  }
};

const update = async (req, res) => {
  try {
    const { wordId, meaningId } = req.params;
    const { region, description, info, type } = req.body;

    if (!region && !description && !info && !type) {
      return res.status(400).json({
        message: 'No fields for update were provided.'
      });
    }

    const result = await Meaning.update(meaningId, { region, description, info, type });

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: 'Meaning not found or not associated with the specified word.'
      });
    }

    res.status(200).json({ message: 'Meaning updated successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error updating meaning.',
      error: error.message,
    });
  }
};

module.exports = { create, getByWord, remove, update };
