// controllers/palavraController.js
const db = require('../config/db');
const Palavra = require('../models/Palavra');
const Significado = require('../model/Significado');

const create = async (req, res) => {
  try {
    const { word, region, description, info, type } = req.body;
    const addedBy = req.user.id; // ID do usuário autenticado

    if (!word || !region || !description || !info || !type) {
      return res.status(400).json({ message: 'Todos os campos obrigatórios devem ser fornecidos.' });
    }

    // Cria a palavra e recupera o objeto criado com o ID
    const palavraCriada = await Palavra.create({ addedBy, word });
    
    // Cria o significado
    const newSig = new Significado(null, region, description, info, type);
    const significadoCriado = await Significado.create(newSig);
    
    // Associa o significado com a palavra na tabela de relacionamento,
    // supondo que a tabela seja "palavras_significados"
    const associationQuery = 'INSERT INTO palavras_significados (palavra_id, significado_id) VALUES (?, ?)';
    await db.execute(associationQuery, [palavraCriada.id, significadoCriado.id]);

    res.status(201).send("Palavra adicionada com sucesso.");
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Erro ao adicionar palavra', error: err.message });
  }
};

const getSix = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 6;
    const offset = (page - 1) * limit;

    const [rows] = await db.execute(
      `SELECT p.*, u.username 
       FROM palavras p 
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
    res.status(500).json({ message: 'Erro ao buscar palavras' });
  }
};

const getByParams = async (req, res) => {
  try {
    const { name, region, type, page } = req.query; // Pega os parâmetros da query string

    // Chama o método de busca no model que filtra com base nos parametros fornecidos
    const resultados = await Palavra.byParams({ name, region, type });

    if (!resultados || resultados.length === 0) {
      return res.status(404).json({ message: 'Nenhuma palavra encontrada com os filtros fornecidos.' });
    }

    res.status(200).json({
      currentPage: page || 1,
      results: resultados.length,
      data: resultados,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Erro ao buscar palavras',
      error: error.message,
    });
  }
};

const remove = async (req, res) => {
  try {
    const { palavraId } = req.params;
    // Verifica se a palavra existe
    const [rows] = await db.execute('SELECT * FROM palavras WHERE id = ?', [palavraId]);
    const palavra = rows[0];

    if (!palavra) {
      return res.status(404).json({ message: 'Palavra não encontrada' });
    }

    // Verifica se o usuário tem permissão para excluir (disparado pelo middleware protect)
    if (palavra.added_by !== req.user.id) {
      return res.status(403).json({ message: 'Você não tem permissão para excluir esta palavra' });
    }

    await Palavra.remove(palavraId);
    res.status(200).json({ message: 'Palavra excluída com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Erro ao excluir palavra', error: err.message });
  }
};

const update = async (req, res) => {
  try {
    const { palavraId } = req.params;
    const { name } = req.body; // Nome a ser atualizado

    if (!name) {
      return res.status(400).json({ message: 'Nenhum campo para atualização foi fornecido.' });
    }

    const result = await Palavra.update(palavraId, name);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Palavra não encontrada.' });
    }

    res.status(200).json({ message: 'Palavra atualizada com sucesso.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao atualizar palavra', error: error.message });
  }
};

module.exports = { create, getSix, getByParams, remove, update };
