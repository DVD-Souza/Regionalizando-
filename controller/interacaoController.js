// controllers/interacaoController.js

const db = require('../config/db');
const Interacao = require('../models/Interacao');

const create = async (req, res) => {
  try {
    // Extração dos parâmetros – o ID do significado é o que interessa para a associação
    const { significadoId } = req.params;
    const { id_usuario, like, deslike } = req.body;

    if (!id_usuario || (like === undefined && deslike === undefined)) {
      return res.status(400).json({ message: 'Campos obrigatórios não fornecidos.' });
    }

    // Cria a interação utilizando o model
    const result = await Interacao.create(id_usuario, like, deslike);

    // Associa a interação ao significado (tabela de relacionamento)
    const associationQuery = `INSERT INTO interacoes_significados (id_interacao, id_significado) VALUES (?, ?)`;
    await db.execute(associationQuery, [result.insertId, significadoId]);

    res.status(201).json({ message: 'Interação registrada com sucesso.', id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao criar interação.', error: error.message });
  }
};

const getByUser = async (req, res) => {
  try {
    const { significadoId } = req.params;
    // O id do usuário pode vir via query ou, se disponível, do token (req.user)
    const { id_usuario } = req.query; 

    if (!id_usuario) {
      return res.status(400).json({ message: 'O ID do usuário é obrigatório.' });
    }

    // Busca a interação do usuário para o significado
    const interacao = await Interacao.byUser(significadoId, id_usuario);
    if (!interacao) {
      return res.status(404).json({ message: 'Interação não encontrada.' });
    }

    res.status(200).json(interacao);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar interação.', error: error.message });
  }
};

const getAllInt = async (req, res) => {
  try {
    const { significadoId } = req.params;
    if (!significadoId) {
      return res.status(400).json({ message: 'O ID do significado é obrigatório.' });
    }

    // Obtém a contagem de likes e deslikes para o significado
    const counts = await Interacao.allInt(significadoId);

    // Caso não haja registros, retorna contadores zerados
    if (!counts || (counts.total_likes === null && counts.total_deslikes === null)) {
      return res.status(200).json({ total_likes: 0, total_deslikes: 0 });
    }

    res.status(200).json(counts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar contagem de interações.', error: error.message });
  }
};

module.exports = { create, getByUser, getAllInt };
