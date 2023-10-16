const express = require('express');
const Company = require('../models/companyModel');
const router = express.Router();

router.get('/', async (req, res) => {
  try 
  {
    const company = await Company.findAll();
    return res.status(200).json(company);
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
    const company = await Company.findByPk(parseInt(id));
    if (company) 
    {
      return res.status(200).json(company);
    } 
    else 
    {
      return res.status(404).json({ message: 'company not found' });
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
    const newCompany = await Company.create(req.body);
    return res.status(200).json(newCompany);
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
    const company = await Company.findByPk(id);

    if (company)
    {
      await Company.update(req.body);
      return res.status(200).json(company);
    }
    else 
    {
      return res.status(404).json({ message: 'Company not found' });
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
    const company = await Company.findByPk(id);
    if (company) 
    {
      await Company.destroy();
      return res.status(200).json({ message: 'Company deleted successfully' });
    } 
    else 
    {
      return res.status(404).json({ message: 'Company not found' });
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
    const company = await Company.findOne({ where: { email } });
    if (company)
    {
      const isMatch = await Company.comparePassword(password);

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