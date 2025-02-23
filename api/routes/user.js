const express = require('express');
const User = require('../models/userModel');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: {
        exclude: ['password']
      },
    });

    return res.status(200).json(users);
  } 
  catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id, {
      attributes: { 
        exclude: ['password']
    }
    });

    if (user) {
      return res.status(200).json(user);
    } 
    else {
      return res.status(404).json({ message: 'User not found' });
    }
  } 
  catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { name, surname, email, password } = req.body;

    if (!name || !surname || !email || !password) {
      const missingFields = [];

      if (!name) missingFields.push('name');
      if (!surname) missingFields.push('surname');
      if (!email) missingFields.push('email');
      if (!password) missingFields.push('password');

      return res.status(400).json({
        message: `Please provide data to create a user. Missing fields: ${missingFields.join(', ')}.`
      });
    }
    else if (typeof name !== 'string' || typeof surname !== 'string' || 
             typeof email !== 'string' || typeof password !== 'string') {
      const wrongFields = [];
    
      if (typeof name !== 'string') wrongFields.push('name');
      if (typeof surname !== 'string') wrongFields.push('surname');
      if (typeof email !== 'string') wrongFields.push('email');
      if (typeof password !== 'string') wrongFields.push('password');
    
      return res.status(400).json({
        message: `Please provide the correct types to create an employer. Wrong fields: ${wrongFields.join(', ')}.`
      });
    }

    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const user = User.build({ name, surname, email, isAdmin: false });
    user.password = await user.hashPassword(password);

    await user.save();

    return res.status(201).json({ message: 'User registered successfully' });
  } 
  catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: `Please provide ${!email ? 'email' : ''}${!email && !password ? ' and ' : ''}${!password ? 'password' : ''} for authentication.` });
  }
  else if (typeof email !== 'string' || typeof password !== 'string') {
    const wrongFields = [];

    if (typeof email !== 'string') wrongFields.push('email');
    if (typeof password !== 'string') wrongFields.push('password');

    return res.status(400).json({
      message: `Please provide both email and password for authentication. Missing fields: ${wrongFields.join(', ')}.`
    });
  }

  try {
    const user = await User.findOne({ where: { email }});

    if (user) {
      const isMatch = await user.comparePassword(password);

      if (isMatch) {
        const token = user.generateToken();
        return res.cookie('jwt_token', token, { httpOnly: true }).status(200).json({ message: 'Authentication successful'});
      }
    }

    return res.status(401).json({ message: 'Authentication failed. Invalid email or password' });

  }
  catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, surname, email, password } = req.body;

  if (!req.body) return res.status(400).json({ message: 'Please provide data to update the database.' });

  try {
    const user = await User.findByPk(id, { attributes: { exclude: ['password'] } });
    const updateFields = {};

    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.isAdmin === true) return res.status(400).json({ message: 'User not found' });

    if (email && email !== user.email) {
      const existingUser = await User.findOne({ where: { email } });

      if (existingUser) return res.status(400).json({ message: 'Email already exists' });

      updateFields.email = email;
    }

    if (name) updateFields.name = name;
    if (surname) updateFields.surname = surname;
    if (password) updateFields.password = await user.hashPassword(password);

    await user.update(updateFields);
    return res.status(200).json(user);
  } 
  catch (error) {
    console.error(error);
    return res.status(400).json({ message: 'Invalid JSON format. Please check the provided keys and values.' });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);
    if (user.isAdmin === true) return res.status(404).json({ message: 'User not found' });

    if (user) {
      await user.destroy();
      return res.status(200).json({ message: 'User deleted successfully' });
    } 
    else return res.status(404).json({ message: 'User not found' });
  } 
  catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;