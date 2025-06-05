// controllers/interactionController.js

const db = require('../config/db');
const Interaction = require('../models/Interaction');

// controllers/interactionController.js

// controllers/interactionController.js

const create = async (req, res) => {
  try {
    const { meaningId } = req.params;
    const { like, dislike } = req.body;
    const userId = req.user?.id;

    if (!userId || (like === undefined && dislike === undefined)) {
      return res.status(400).json({ message: 'Required fields not provided.' });
    }

    const existingInteraction = await Interaction.byUser(meaningId, userId);

    if (existingInteraction) {
      // Se like e dislike forem zero ou falsos, remove a interação
      if ((like === 0 || like === false) && (dislike === 0 || dislike === false)) {
        await Interaction.remove(existingInteraction.interaction_id);
        return res.status(200).json({ message: 'Interaction removed successfully.' });
      }

      // Caso contrário, atualiza a interação existente
      await Interaction.update(existingInteraction.interaction_id, like, dislike);
      return res.status(200).json({ message: 'Interaction updated successfully.' });

    } else {
      // Se like e dislike forem zero, não cria interação (não faz sentido criar sem reação)
      if ((like === 0 || like === false) && (dislike === 0 || dislike === false)) {
        return res.status(400).json({ message: 'No reaction to create.' });
      }

      // Cria nova interação
      const newInteraction = new Interaction(null, userId, like, dislike);
      const result = await Interaction.create(newInteraction);

      const associationQuery = `INSERT INTO meaning_interactions (interaction_id, meaning_id) VALUES (?, ?)`;
      await db.execute(associationQuery, [result.insertId, meaningId]);

      return res.status(201).json({ message: 'Interaction created successfully.', id: result.insertId });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error processing interaction.', error: error.message });
  }
};



const getByUser = async (req, res) => {
  try {
    const { meaningId } = req.params;
    // The userId can come via query or, if available, from the token (req.user)
    // const { userId } = req.query;
    const userId = req.user?.id;


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
