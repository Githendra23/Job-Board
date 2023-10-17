const express = require('express');
const Company = require('../models/companyModel');
const router = express.Router();

router.get('/', async (req, res) => {
  try 
  {
    const companies = await Company.findAll({
      attributes: { exclude: ['password'] },
    });

    return res.status(200).json(companies);
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
    const company = await Company.findByPk(id, {
      attributes: { exclude: ['password'] },
    });

    if (company) 
    {
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

router.post('/register', async (req, res) => {
  try 
  {
    const { email, password, ...otherData } = req.body;

    const existingCompany = await Company.findOne({ where: { email } });

    if (existingCompany) 
    {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const company = Company.build({ email, ...otherData });
    company.password = await company.hashPassword(password);

    // Generate a token using the user's ID and email
    const token = company.generateToken();

    await company.save();

    return res.status(200).json(company, token);
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

    if (req.body.hasOwnProperty('password'))
    {
      const { password, ...otherData } = req.body;

      req.body.password = await company.hashPassword(password);
    }

    if (req.body.hasOwnProperty('email'))
    {
      const { email, password, ...otherData } = req.body;

      const existingCompany = await Company.findOne({ where: { email } });

      if (existingCompany)
      {
        return res.status(400).json({ message: 'Email already exists' });
      }
    }

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
        const token = candidate.generateToken();
        return res.status(200).json({ message: 'Authentication successful', token });
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