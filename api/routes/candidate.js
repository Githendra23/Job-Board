const express = require('express');
const Candidate = require('../models/candidateModel');

const router = express.Router();

router.get('/', async (req, res) => {
  try 
  {
    const candidates = await Candidate.findAll();
    return res.status(200).json(candidates);
  } 
  catch (error) 
  {
    return res.status(404).json({ message: 'Resource not found' });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  
  try 
  {
    const candidate = await Candidate.findById(id);
    return res.status(200).json(candidate);
  } 
  catch (error) 
  {
    return res.status(404).json(error);
  }
});

router.post('/register', async (req, res) => {
  try 
  {
    const newCandidate = new Candidate(req.body);
    const result = await newCandidate.save();

    return res.status(200).json(result);
  } 
  catch (error) 
  {
    return res.status(400).json(error);
  }
});

router.put(`/:id`, async (req, res) => {
    const { id } = req.params;
    const { data } = req.body;
  
    if (!data) 
    {
      return res.status(400).json({ message: 'Please provide data to update the database.' });
    }
  
    try 
    {
      const result = await Candidate.update(id, data);
      return res.status(200).json(result);
    } 
    catch (error) 
    {
      return res.status(500).json({ message: 'An error occurred while updating candidate data.' });
    }
  });
  
  router.delete(`/:id`, async (req, res) => {
    const { id } = req.params;
  
    try 
    {
      const result = await Candidate.remove(id);
      return res.status(200).json(result);
    } 
    catch (error) 
    {
      return res.status(500).json({ message: `An error occurred while deleting the candidate with ID ${id}.` });
    }
  });

router.post(`/login`, async (req, res) => {
    const { email, password } = req.body;

  if (!email || !password) 
  {
    return res.status(400).json({ message: 'Please provide both email and password for authentication.' });
  }

  try 
  {
    const isMatch = await Candidate.authenticate(email, password);
    
    if (isMatch) 
    {
      return res.status(200).json({ message: 'Authentication successful.' });
    } 
    else 
    {
      return res.status(401).json({ message: 'Authentication failed. Invalid password.' });
    }
  } 
  catch (error) 
  {
    return res.status(404).json({ message: 'Email address not found in records.' });
  }
});

module.exports = router;