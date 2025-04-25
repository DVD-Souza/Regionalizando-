// controllers/user.controller.js

const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const create = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).send('All fields are required.');
    }
    const newUser = new User(null, name, email, password);
    await User.create(newUser);
    res.status(201).send("User successfully registered.");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error.");
  }
};

const update = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password } = req.body;

    // Optional: check if at least one field is provided
    if (!name && !email && !password) {
      return res.status(400).send("No fields provided for update.");
    }

    await User.update(id, { name, email, password });
    res.send('User successfully updated.');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error.');
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.params;
    await User.delete(id);
    res.send('User successfully deleted.');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error.');
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(404).send('User not found.');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).send('Invalid password.');
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES }
    );

    res.status(200).json({ message: 'Login successful.', token });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error.');
  }
};

const findByName = async (req, res) => {
  try {
    const { name } = req.params;

    const users = await User.findByName(name);
    if (users.length === 0) {
      return res.status(404).send('No users found with that name.');
    }
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error.');
  }
};

module.exports = { create, update, remove, login, findByName };
