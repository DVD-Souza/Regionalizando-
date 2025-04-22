// controllers/interactionController.js

const db = require('../config/db');
const Interaction = require('../models/Interaction');

const create = async (req, res) => {
  try {
    // Extract parameters – the meaning ID is the one that matters for the association
    const { meaningId } = req.params;
    const { userId, like, dislike } = req.body;

    if (!userId || (like === undefined && dislike === undefined)) {
      return res.status(400).json({ message: 'Required fields not provided.' });
    }

    // Create the interaction using the model
    const result = await Interaction.create(userId, like, dislike);

    // Associate the interaction with the meaning (relationship table)
    const associationQuery = `INSERT INTO interactions_meanings (interaction_id, meaning_id) VALUES (?, ?)`;
    await db.execute(associationQuery, [result.insertId, meaningId]);

    res.status(201).json({ message: 'Interaction successfully recorded.', id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating interaction.', error: error.message });
  }
};

const getByUser = async (req, res) => {
  try {
    const { meaningId } = req.params;
    // The userId can come via query or, if available, from the token (req.user)
    const { userId } = req.query; 

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required.' });
    }

    // Fetch the user's interaction for the meaning
    const interaction = await Interaction.byUser(meaningId, userId);
    if (!interaction) {
      return res.status(404).json({ message: 'Interaction not found.' });
    }

    res.status(200).json(interaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching interaction.', error: error.message });
  }
};

const getAllInt = async (req, res) => {
  try {
    const { meaningId } = req.params;
    if (!meaningId) {
      return res.status(400).json({ message: 'Meaning ID is required.' });
    }

    // Get the like and dislike counts for the meaning
    const counts = await Interaction.allInt(meaningId);

    // If no records, return zeroed counters
    if (!counts || (counts.total_likes === null && counts.total_dislikes === null)) {
      return res.status(200).json({ total_likes: 0, total_dislikes: 0 });
    }

    res.status(200).json(counts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching interaction counts.', error: error.message });
  }
};

module.exports = { create, getByUser, getAllInt };
