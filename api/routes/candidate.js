const express = require('express');
const Candidate = require('../models/candidateModel');
const router = express.Router();

router.get('/', async (req, res) => {
  try 
  {
    const candidate = await Candidate.findAll();
    return res.status(200).json(candidate);
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
    const candidate = await Candidate.findByPk(parseInt(id));
    if (candidate) 
    {
      return res.status(200).json(candidate);
    } 
    else 
    {
      return res.status(404).json({ message: 'Candidate not found' });
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
    const { password, ...otherData } = req.body;
    const hashedPassword = await Candidate.hashPassword(password);
    req.body.password = hashedPassword;

    const newCandidate = await Candidate.create(req.body);
    return res.status(200).json(newCandidate);
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
    const candidate = await Candidate.findByPk(id);

    if (candidate)
    {
      await candidate.update(req.body);
      return res.status(200).json(candidate);
    }
    else 
    {
      return res.status(404).json({ message: 'Candidate not found' });
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
    const candidate = await Candidate.findByPk(id);
    if (candidate) 
    {
      await candidate.destroy();
      return res.status(200).json({ message: 'Candidate deleted successfully' });
    } 
    else 
    {
      return res.status(404).json({ message: 'Candidate not found' });
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
    const candidate = await Candidate.findOne({ where: { email } });
    if (candidate)
    {
      const isMatch = await candidate.comparePassword(password);

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