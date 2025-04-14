const db = require('../config/db'); // Conexão com o banco de dados
const Palavra = require('../models/Palavra'); // Classe Palavra usada para estruturar os dados

class PalavraController {
  // Método para criar uma nova palavra
  async create(req, res) {
    try {
      const { word, meaning, region } = req.body; // Dados do corpo da requisição
      const addedBy = req.user.id; // ID do usuário autenticado
      const createdAt = new Date(); // Data atual

      // Insere a nova palavra no banco de dados
      const [result] = await db.execute(
        'INSERT INTO palavras (word, meaning, region, added_by, created_at) VALUES (?, ?, ?, ?, ?)',
        [word, meaning, region, addedBy, createdAt]
      );

      // Cria uma instância da palavra para retornar
      const newPalavra = new Palavra(result.insertId, word, meaning, region, addedBy, createdAt);
      res.status(201).json(newPalavra); // Retorna a nova palavra criada
    } catch (err) {
      res.status(400).json({ message: 'Erro ao adicionar palavra', error: err.message });
    }
  }

  // Método para buscar todas as palavras
  async getAll(req, res) {
    try {
      // Busca todas as palavras com informações do usuário que adicionou
      const [rows] = await db.execute(
        'SELECT p.*, u.username FROM palavras p JOIN users u ON p.added_by = u.id'
      );
      res.status(200).json(rows); // Retorna os resultados
    } catch (err) {
      res.status(500).json({ message: 'Erro ao buscar palavras', error: err.message });
    }
  }

  // Método para buscar uma palavra por ID
  async getById(req, res) {
    try {
      const [rows] = await db.execute(
        'SELECT p.*, u.username FROM palavras p JOIN users u ON p.added_by = u.id WHERE p.id = ?',
        [req.params.id]
      );

      if (rows.length === 0) {
        return res.status(404).json({ message: 'Palavra não encontrada' });
      }

      res.status(200).json(rows[0]); // Retorna a palavra encontrada
    } catch (err) {
      res.status(400).json({ message: 'Erro ao buscar palavra', error: err.message });
    }
  }

  // Método para excluir uma palavra
  async delete(req, res) {
    try {
      // Verifica se a palavra existe
      const [rows] = await db.execute('SELECT * FROM palavras WHERE id = ?', [req.params.id]);
      const palavra = rows[0];

      if (!palavra) {
        return res.status(404).json({ message: 'Palavra não encontrada' });
      }

      // Verifica se o usuário tem permissão para excluir
      if (palavra.added_by !== req.user.id) {
        return res.status(403).json({ message: 'Você não tem permissão para excluir esta palavra' });
      }

      // Exclui do banco
      await db.execute('DELETE FROM palavras WHERE id = ?', [req.params.id]);
      res.status(200).json({ message: 'Palavra excluída com sucesso' });
    } catch (err) {
      res.status(400).json({ message: 'Erro ao excluir palavra', error: err.message });
    }
  }
}

module.exports = new PalavraController(); // Exporta uma instância do controller
