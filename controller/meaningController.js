// controllers/meaningController.js
const db = require('../config/db');
const Meaning = require('../models/Meaning');

const create = async (req, res) => {
  try {
    const { wordId } = req.params; // Word ID
    const { region, description, info, type } = req.body; // Sent data

    // Validate required fields
    if (!region || !description || !info || !type) {
      return res.status(400).json({
        message: 'All fields (region, description, info, and type) are required to create the meaning.'
      });
    }

    // Create the meaning object – note that the constructor maps:
    // region → region_id, description → description, info → additional_info, and type → type
    const newMeaning = new Meaning(null, region, description, info, type);
    await Meaning.create(newMeaning);

    // Retrieve the ID of the newly created meaning
    const [result] = await db.execute('SELECT LAST_INSERT_ID() AS id');
    const meaningId = result[0].id;

    // Associate the meaning with the word in the relationship table (e.g., words_meanings)
    const associationQuery = 'INSERT INTO words_meanings (word_id, meaning_id) VALUES (?, ?)';
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
    const { wordId, meaningId } = req.params; // wordId is here in case you want to do additional validation
    const { region, description, info, type } = req.body;

    // Check if at least one field was sent to update
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
