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
    const newMeaning = new Meaning(null, addedBy, region, description, info, type);
    const createdMeaning = await Meaning.create(newMeaning);
    
    // Associate the meaning with the word in the relationship table,
    // assuming the table is "words_meanings"
    const associationQuery = 'INSERT INTO meaning_logs (element_id, meaning_id) VALUES (?, ?)';
    await db.execute(associationQuery, [createdWord.id, createdMeaning.id]);

    res.status(201).send("Word added successfully.");
  } catch (err) {
    console.error(err);
    // Tratamento específico para erro de duplicidade no banco
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Palavra já existe no banco de dados.' });
    }
    res.status(400).json({ message: 'Error while adding word', error: err.message });
  }
};


const getSix = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 100;
    const offset = (page - 1) * limit;
    const { element_id } = req.query;

    let query;
    let params = [];

    if (element_id) {
      // Consulta para um element_id específico — mantém placeholders normais
      query = `
        SELECT p.*, u.name
        FROM textual_elements p
        JOIN users u ON p.user_id = u.user_id
        WHERE p.element_id = ?
        LIMIT 1
      `;
      params = [element_id];
    } else {
      // Consulta padrão, interpolando LIMIT e OFFSET direto na string
      query = `
        SELECT p.*, u.name
        FROM textual_elements p
        JOIN users u ON p.user_id = u.user_id
        ORDER BY RAND()
        LIMIT ${limit} OFFSET ${offset}
      `;
      params = []; // não usa mais placeholders para limit e offset
    }

    const [rows] = await db.execute(query, params);

    res.status(200).json({
      currentPage: page,
      results: rows.length,
      data: rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao buscar palavras', error: err.message });
  }
};


const getByParams = async (req, res) => {
  try {
    const {name, page } = req.query; // Get query string parameters

    // Call the model search method that filters based on provided parameters
    const results = await Word.byParams({ name });

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
    const { id } = req.params;

    // Check if the word exists
    const [rows] = await db.execute('SELECT * FROM textual_elements WHERE element_id = ?', [id]);
    const word = rows[0];

    if (!word) {
      return res.status(404).json({ message: 'Word not found' });
    }

    // Check if user is authorized to delete (handled by protect middleware)
    if (word.user_id !== req.user.id) {
      return res.status(403).json({ message: 'You are not allowed to delete this word' });
    }

    await Word.remove(id);
    res.status(200).json({ message: 'Word successfully deleted' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Error while deleting word', error: err.message });
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { word } = req.body; // New name to update

    if (!word) {
      return res.status(400).json({ message: 'No field provided for update.' });
    }

    const result = await Word.update(id, word);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Word not found.' });
    }

    res.status(200).json({ message: 'Word successfully updated.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error while updating word', error: error.message });
  }
};

const getMeaningLogs = async (req, res) => {
  try {
    const { meaning_id } = req.query;

    let query = 'SELECT * FROM meaning_logs';
    const params = [];

    if (meaning_id) {
      query += ' WHERE meaning_id = ?';
      params.push(meaning_id);
    }

    const [rows] = await db.execute(query, params);

    res.status(200).json({
      count: rows.length,
      data: rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao buscar registros de meaning_logs', error: err.message });
  }
};



module.exports = { create, getSix, getByParams, remove, update, getMeaningLogs };

