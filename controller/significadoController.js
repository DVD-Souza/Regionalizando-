// controllers/significadoController.js
const db = require('../config/db');
const Significado = require('../models/Significado');

const create = async (req, res) => {
  try {
    const { palavraId } = req.params; // ID da palavra
    const { region, description, info, type } = req.body; // Dados enviados

    // Validação dos campos obrigatórios
    if (!region || !description || !info || !type) {
      return res.status(400).json({
        message: 'Todos os campos (region, description, info e type) são obrigatórios para criar o significado.'
      });
    }

    // Cria o objeto do significado – observe que o construtor mapeia:
    // region → id_regiao, description → descricao, info → infor_adicionais e type → tipo
    const newSig = new Significado(null, region, description, info, type);
    await Significado.create(newSig);

    // Recupera o ID do significado recém-criado
    const [result] = await db.execute('SELECT LAST_INSERT_ID() AS id');
    const significadoId = result[0].id;

    // Associa o significado à palavra na tabela de relacionamento (ex.: palavras_significados)
    const associationQuery = 'INSERT INTO palavras_significados (palavra_id, significado_id) VALUES (?, ?)';
    await db.execute(associationQuery, [palavraId, significadoId]);

    res.status(201).json({ message: 'Significado criado e associado à palavra com sucesso.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao criar significado ou associá-lo à palavra.', error: error.message });
  }
};

const getByWord = async (req, res) => {
  try {
    const { palavraId } = req.params;
    const significados = await Significado.getByWordId(palavraId);

    if (!significados || significados.length === 0) {
      return res.status(404).json({ message: 'Nenhum significado encontrado para esta palavra.' });
    }

    res.status(200).json({
      palavraId,
      totalSignificados: significados.length,
      significados,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Erro ao buscar significados associados à palavra.',
      error: error.message,
    });
  }
};

const remove = async (req, res) => {
  try {
    const { palavraId, significadoId } = req.params;

    const result = await Significado.delete(palavraId, significadoId);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: 'Significado não encontrado ou não associado à palavra especificada.'
      });
    }

    res.status(200).json({ message: 'Significado excluído com sucesso.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Erro ao excluir significado.',
      error: error.message,
    });
  }
};

const update = async (req, res) => {
  try {
    const { palavraId, significadoId } = req.params; // palavraId está aqui caso você queira fazer validação adicional
    const { region, description, info, type } = req.body;

    // Verifica se ao menos um campo foi enviado para atualizar
    if (!region && !description && !info && !type) {
      return res.status(400).json({
        message: 'Nenhum campo para atualização foi fornecido.'
      });
    }

    const result = await Significado.update(significadoId, { region, description, info, type });

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: 'Significado não encontrado ou não associado à palavra especificada.'
      });
    }

    res.status(200).json({ message: 'Significado atualizado com sucesso.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Erro ao atualizar significado.',
      error: error.message,
    });
  }
};

module.exports = { create, getByWord, remove, update };
