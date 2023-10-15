const express = require('express');
const router = express.Router();
const Employer = require('../models/employerModel');

router.get('/', async (req, res) => {
  try 
  {
    const employers = await Employer.findAll();
    return res.status(200).json(employers);
  } 
  catch (error) 
  {
    return res.status(404).json({ message: 'No employers found' });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try 
  {
    const employer = await Employer.findById(id);
    return res.status(200).json(employer);
  } 
  catch (error) 
  {
    return res.status(404).json(error);
  }
});

router.post('/', async (req, res) => {
  try 
  {
    const newEmployer = new Employer(req.body);
    const result = await newEmployer.save();
    return res.status(200).json(result);
  } 
  catch (error) 
  {
    return res.status(400).json(error);
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { data } = req.body;

  if (!data) 
  {
    return res.status(400).json({ message: 'Please provide data to update the database.' });
  }

  try 
  {
    const result = await Employer.update(id, data);
    return res.status(200).json(result);
  } 
  catch (error) 
  {
    return res.status(400).json(error);
  }
});

router.post('/verify', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) 
  {
    return res.status(400).json({ message: 'Please provide both email and password for authentication.' });
  }

  try 
  {
    const isMatch = await Employer.authenticate(email, password);
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

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try 
  {
    const result = await Employer.remove(id);
    return res.status(200).json(result);
  } 
  catch (error) 
  {
    return res.status(404).json(error);
  }
});

module.exports = router;