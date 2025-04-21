// controllers/user.controller.js

const User = require('../model/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt'); // Certifique-se de importar o bcrypt

const create = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).send('Todos os campos são obrigatórios.');
    }
    const newUser = new User(null, name, email, password);
    await User.create(newUser);
    res.status(201).send("Usuário cadastrado com sucesso.");
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro interno do servidor.");
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params; // Correção: extraindo diretamente do params
    const { name, email, password } = req.body;
    
    // Opcional: verifique se ao menos um campo foi enviado.
    if (!name && !email && !password) {
      return res.status(400).send("Nenhum campo para atualização foi fornecido.");
    }
    
    await User.update(id, { name, email, password });
    
    res.send('Usuário atualizado com sucesso.');
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro interno do servidor.');
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    await User.delete(id);
    res.send('Usuário excluído com sucesso.');
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro interno do servidor.');
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Busca o usuário pelo email
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(404).send('Usuário não encontrado.');
    }

    // Verifica se a senha está correta
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).send('Senha inválida.');
    }

    // Gera o token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES }
    );

    res.status(200).json({ message: 'Login realizado com sucesso.', token });
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro interno do servidor.');
  }
};

const findByName = async (req, res) => {
  try {
    const { name } = req.params;

    const users = await User.findByName(name);
    if (users.length === 0) {
      return res.status(404).send('Nenhum usuário encontrado com esse nome.');
    }
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro interno do servidor.');
  }
};

module.exports = { create, update, remove, login, findByName };