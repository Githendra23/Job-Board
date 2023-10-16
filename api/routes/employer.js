const express = require('express');
const Employer = require('../models/employerModel');
const router = express.Router();

router.get('/', async (req, res) => {
  try 
  {
    const employer = await Employer.findAll();
    return res.status(200).json(employer);
  } 
  catch (error) 
  {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  
  try
  {
    const employer = await Employer.findByPk(parseInt(id));
    if (employer) 
    {
      return res.status(200).json(employer);
    } 
    else 
    {
      return res.status(404).json({ message: 'Employer not found' });
    }
  } 
  catch (error) 
  {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.post('/register', async (req, res) => {
  try 
  {
    const { email, password, ...otherData } = req.body;

    const existingEmployer = await Employer.findOne({ where: { email } });

    if (existingEmployer) 
    {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const employer = Employer.build({ email, ...otherData });
    employer.password = await employer.hashPassword(password);

    await employer.save();

    return res.status(200).json(employer);
  } 
  catch (error) 
  {
    console.error(error);
    return res.status(400).json({ message: 'Bad Request' });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;

  if (!req.body) 
  {
    return res.status(400).json({ message: 'Please provide data to update the database.' });
  }

  try
  {
    const employer = await Employer.findByPk(id);

    if (req.body.hasOwnProperty('password'))
    {
      const { password, ...otherData } = req.body;

      req.body.password = await employer.hashPassword(password);
    }

    if (req.body.hasOwnProperty('email'))
    {
      const { email, password, ...otherData } = req.body;

      const existingEmployer = await Employer.findOne({ where: { email } });

      if (existingEmployer)
      {
        return res.status(400).json({ message: 'Email already exists' });
      }
    }

    if (employer)
    {
      await Employer.update(req.body);
      return res.status(200).json(employer);
    }
    else 
    {
      return res.status(404).json({ message: 'Employer not found' });
    }
  } 
  catch (error) 
  {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
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
    else 
    {
      return res.status(404).json({ message: 'Employer not found' });
    }
  } 
  catch (error) 
  {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) 
  {
    return res.status(400).json({ message: 'Please provide both email and password for authentication.' });
  }

  try 
  {
    const employer = await Employer.findOne({ where: { email } });
    if (employer)
    {
      const isMatch = await Employer.comparePassword(password);

      if (isMatch) 
      {
        return res.status(200).json({ message: 'Authentication successful' });
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

module.exports = router;