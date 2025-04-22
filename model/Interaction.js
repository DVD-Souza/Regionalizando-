// models/Interaction.js

const db = require('../config/db');

class Interaction {
  constructor(id, user_id, like, dislike) {
    this.id = id;
    this.user_id = user_id;
    this.like = like;
    this.dislike = dislike;
  }

  // Creates an interaction in the database
  static async create(user_id, like, dislike) {
    // Uses three placeholders for the table fields
    const query = `INSERT INTO interactions (user_id, like, dislike) VALUES (?, ?, ?)`;
    const [result] = await db.execute(query, [user_id, like, dislike]);
    return result;
  }

  // Retrieves the interaction of a user for a specific meaning
  static async byUser(meaningId, user_id) {
    const query = `
      SELECT i.*
      FROM interactions AS i
      INNER JOIN interactions_meanings AS im ON i.id = im.interaction_id
      WHERE im.meaning_id = ? AND i.user_id = ?`;
    const [rows] = await db.execute(query, [meaningId, user_id]);
    return rows[0];
  }

  // Returns the count of likes and dislikes for a meaning
  static async allInt(meaningId) {
    const query = `
      SELECT 
        SUM(CASE WHEN i.like = 1 THEN 1 ELSE 0 END) AS total_likes,
        SUM(CASE WHEN i.dislike = 1 THEN 1 ELSE 0 END) AS total_dislikes
      FROM interactions AS i
      INNER JOIN interactions_meanings AS im ON i.id = im.interaction_id
      WHERE im.meaning_id = ?`;
      
    const [rows] = await db.execute(query, [meaningId]);
    return rows[0];
  }
}

module.exports = Interaction;
