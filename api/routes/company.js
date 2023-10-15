const express = require('express');
const router = express.Router();
const Company = require('../models/companyModel');

router.get('/', async (req, res) => {
  try 
  {
    const companies = await Company.findAll();
    return res.status(200).json(companies);
  } 
  catch (error) 
  {
    return res.status(404).json({ message: 'No companies found' });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try 
  {
    const company = await Company.findById(id);
    return res.status(200).json(company);
  } 
  catch (error) 
  {
    return res.status(404).json(error);
  }
});

router.post('/', async (req, res) => {
  try 
  {
    const newCompany = new Company(req.body);
    const result = await newCompany.save();
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
    const result = await Company.update(id, data);
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
    const isMatch = await Company.authenticate(email, password);
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
    const result = await Company.remove(id);
    return res.status(200).json(result);
  } 
  catch (error) 
  {
    return res.status(404).json(error);
  }
});

module.exports = router;