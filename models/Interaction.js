// models/Interaction.js

const db = require('../config/db');

class Interaction {
  constructor(id, userId, like, dislike) {
    this.id = id;
    this.user_id = userId;
    this.like = like;
    this.dislike = dislike;
  }

  // Creates an interaction in the database
  static async create(newInteraction) {
    // Uses three placeholders for the table fields
    const query = `INSERT INTO interactions (user_id, likes, dislike) VALUES (?, ?, ?)`;
    const [result] = await db.execute(query, [newInteraction.user_id, newInteraction.like, newInteraction.dislike]);
    return result;
  }

  // Retrieves the interaction of a user for a specific meaning
  static async byUser(meaningId, user_id) {
    const query = `
      SELECT i.interaction_id, i.user_id, i.likes, i.dislike
      FROM interactions AS i
      INNER JOIN meaning_interactions AS im ON i.interaction_id = im.interaction_id
      WHERE im.meaning_id = ? AND i.user_id = ?`;
    const [rows] = await db.execute(query, [meaningId, user_id]);
    return rows[0];
  }

  // Returns the count of likes and dislikes for a meaning
  static async allInt(meaningId) {
    const query = `
      SELECT 
        SUM(CASE WHEN i.likes = 1 THEN 1 ELSE 0 END) AS total_likes,
        SUM(CASE WHEN i.dislike = 1 THEN 1 ELSE 0 END) AS total_dislikes
      FROM interactions AS i
      INNER JOIN meaning_interactions AS im ON i.interaction_id = im.interaction_id
      WHERE im.meaning_id = ?`;
      
    const [rows] = await db.execute(query, [meaningId]);
    return rows[0];
  }

  // models/Interaction.js

// Atualiza a interação pelo interaction_id
static async update(interactionId, like, dislike) {
  const query = `UPDATE interactions SET likes = ?, dislike = ? WHERE interaction_id = ?`;
  const [result] = await db.execute(query, [like, dislike, interactionId]);
  return result;
}


// models/Interaction.js

// Remove interação pelo interaction_id
static async remove(interactionId) {
  const query = `DELETE FROM interactions WHERE interaction_id = ?`;
  const [result] = await db.execute(query, [interactionId]);
  return result;
}

}


module.exports = Interaction;
