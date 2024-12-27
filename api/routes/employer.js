const express = require('express');
const Employer = require('../models/employerModel');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const employers = await Employer.findAll({
      attributes: { exclude: ['password'] },
    });

    return res.status(200).json(employers);
  } 
  catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const employer = await Employer.findByPk(id, {
      attributes: { exclude: ['password'] },
    });

    if (employer) return res.status(200).json(employer);
    else return res.status(404).json({ message: 'Company not found' });

  } 
  catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { name, surname, email, password, company_id } = req.body;

    if (!name || !surname || !email || !password || !company_id) {
      const missingFields = [];

      if (!name)       missingFields.push('name');
      if (!surname)    missingFields.push('surname');
      if (!email)      missingFields.push('email');
      if (!password)   missingFields.push('password');
      if (!company_id) missingFields.push('company_id');
    
      return res.status(400).json({
        message: `Please provide data to create an employer. Missing fields: ${missingFields.join(', ')}.`
      });
    }

    else if (typeof name !== 'string' || typeof surname !== 'string' || typeof email !== 'string' ||
             typeof password !== 'string' || typeof company_id !== 'number') {
      const wrongFields = [];

      if (typeof name !== 'string')       wrongFields.push('name');
      if (typeof surname !== 'string')    wrongFields.push('surname');
      if (typeof email !== 'string')      wrongFields.push('email');
      if (typeof password !== 'string')   wrongFields.push('password');
      if (typeof company_id !== 'string') wrongFields.push('company_id');
    
      return res.status(400).json({
        message: `Please provide the correct types to create an employer. wrong fields: ${wrongFields.join(', ')}.`
      });
    }

    let existingEmployer = await Employer.findOne({ where: { email } });

    if (existingEmployer) return res.status(400).json({ message: 'Email already exists' });

    const employer = Employer.build({ name, surname, email, company_id });
    employer.password = await employer.hashPassword(password);

    await employer.save();

    return res.status(201).json({ message: 'Employer registered successfully' });
  } 
  catch (error)
  {
    console.error(error);
    return res.status(400).json({ message: 'Bad Request' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
  {
    return res.status(400).json({ message: `Please provide ${!email ? 'email' : ''}${!email && !password ? ' and ' : ''}${!password ? 'password' : ''} for authentication.` });
  }
  else if (typeof email !== 'string' || typeof password !== 'string')
  {
    const wrongFields = [];

    if (typeof email !== 'string') wrongFields.push('email');
    if (typeof password !== 'string') wrongFields.push('password');

    return res.status(400).json({
      message: `Please provide both email and password for authentication. Missing fields: ${missingFields.join(', ')}.`
    });
  }

  try
  {
    const employer = await Employer.findOne({ where: { email } });
    if (employer)
    {
      const isMatch = await employer.comparePassword(password);

      if (isMatch)
      {
        const token = employer.generateToken();
        return res.cookie('jwt_token', token, { httpOnly: true }).status(200).json({ message: 'Authentication successful'});
      }
    }
    return res.status(401).json({ message: 'Authentication failed. Invalid email or password' });
  }
  catch (error)
  {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, surname, email, password, company_id } = req.body;
  const updateFields = {};

  if (!req.body) return res.status(400).json({ message: 'Please provide data to update the database.' });

  try
  {
    const employer = await Employer.findByPk(id, { attributes: { exclude: ['password'] } });

    if (email)
    {
      const existingEmployer = await Employer.findOne({ where: { email } });

      if (existingEmployer) return res.status(400).json({ message: 'Email already exists' });

      updateFields.email = email;
    }

    if (employer)
    {
      if (name) updateFields.name = name;
      if (surname) updateFields.surname = surname;
      if (company_id) updateFields.company_id = company_id;
      if (password) updateFields.password = await employer.hashPassword(password);

      await Employer.update(updateFields, {
        where: { id },
      });
      return res.status(200).json(employer);
    }
    else return res.status(404).json({ message: 'Employer not found' });
    
  } 
  catch (error) 
  {
    console.error(error);
    return res.status(400).json({ message: 'Invalid JSON format. Please check the provided keys and values.' });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try 
  {
    const employer = await Employer.findByPk(id);
    if (employer) 
    {
      await employer.destroy();
      return res.status(200).json({ message: 'Employer deleted successfully' });
    } 
    else return res.status(404).json({ message: 'Employer not found' });
    
  } 
  catch (error) 
  {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;