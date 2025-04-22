// controllers/wordController.js
const db = require('../config/db');
const Word = require('../models/Word');
const Meaning = require('../models/Meaning');

const create = async (req, res) => {
  try {
    const { word, region, description, info, type } = req.body;
    const addedBy = req.user.id; // Authenticated user's ID

    if (!word || !region || !description || !info || !type) {
      return res.status(400).json({ message: 'All required fields must be provided.' });
    }

    // Create the word and get the created object with ID
    const createdWord = await Word.create({ addedBy, word });
    
    // Create the meaning
    const newMeaning = new Meaning(null, region, description, info, type);
    const createdMeaning = await Meaning.create(newMeaning);
    
    // Associate the meaning with the word in the relationship table,
    // assuming the table is "words_meanings"
    const associationQuery = 'INSERT INTO words_meanings (word_id, meaning_id) VALUES (?, ?)';
    await db.execute(associationQuery, [createdWord.id, createdMeaning.id]);

    res.status(201).send("Word added successfully.");
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Error while adding word', error: err.message });
  }
};

const getSix = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 6;
    const offset = (page - 1) * limit;

    const [rows] = await db.execute(
      `SELECT p.*, u.username 
       FROM words p 
       JOIN users u ON p.added_by = u.id 
       ORDER BY RAND() 
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );

    res.status(200).json({
      currentPage: page,
      results: rows.length,
      data: rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error while fetching words' });
  }
};

const getByParams = async (req, res) => {
  try {
    const { name, region, type, page } = req.query; // Get query string parameters

    // Call the model search method that filters based on provided parameters
    const results = await Word.byParams({ name, region, type });

    if (!results || results.length === 0) {
      return res.status(404).json({ message: 'No words found with the provided filters.' });
    }

    res.status(200).json({
      currentPage: page || 1,
      results: results.length,
      data: results,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Error while fetching words',
      error: error.message,
    });
  }
};

const remove = async (req, res) => {
  try {
    const { palavraId } = req.params;

    // Check if the word exists
    const [rows] = await db.execute('SELECT * FROM words WHERE id = ?', [palavraId]);
    const word = rows[0];

    if (!word) {
      return res.status(404).json({ message: 'Word not found' });
    }

    // Check if user is authorized to delete (handled by protect middleware)
    if (word.added_by !== req.user.id) {
      return res.status(403).json({ message: 'You are not allowed to delete this word' });
    }

    await Word.remove(palavraId);
    res.status(200).json({ message: 'Word successfully deleted' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Error while deleting word', error: err.message });
  }
};

const update = async (req, res) => {
  try {
    const { palavraId } = req.params;
    const { name } = req.body; // New name to update

    if (!name) {
      return res.status(400).json({ message: 'No field provided for update.' });
    }

    const result = await Word.update(palavraId, name);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Word not found.' });
    }

    res.status(200).json({ message: 'Word successfully updated.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error while updating word', error: error.message });
  }
};

module.exports = { create, getSix, getByParams, remove, update };
