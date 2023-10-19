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

router.get('/logo/:id', async (req, res) => {
  const { id } = req.params;

  try 
  {
    const company = await Company.findByPk(id);

    if (company && company.logo) 
    {
      res.setHeader('Content-Type', 'image/jpeg');
      res.send(company.logo);
    } 
    else res.status(404).json({ message: 'Company not found or logo missing' });
  } 
  catch (error) 
  {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try 
  {
    const company = await Company.findByPk(id, {
      attributes: { exclude: ['password'] },
    });

    if (company) return res.status(200).json(company);
    else return res.status(404).json({ message: 'Company not found' });

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
    const { name, email, password, description, logo } = req.body;

    if (!name || !email || !password || !description)
    {
      const missingFields = [];

      if (!name)        missingFields.push('name');
      if (!email)       missingFields.push('email');
      if (!password)    missingFields.push('password');
      if (!description) missingFields.push('description');
    
      return res.status(400).json({
        message: `Please provide data to create an employer. Missing fields: ${missingFields.join(', ')}.`
      });
    }
    else if (typeof name !== 'string' || typeof email !== 'string' ||
             typeof password !== 'string' || typeof description !== 'string')
    {
      const wrongFields = [];

      if (typeof name !== 'string')        wrongFields.push('name');
      if (typeof email !== 'string')       wrongFields.push('email');
      if (typeof password !== 'string')    wrongFields.push('password');
      if (typeof description !== 'string') wrongFields.push('description');
    
      return res.status(400).json({
        message: `Please provide the correct types to create an employer. wrong fields: ${wrongFields.join(', ')}.`
      });
    }

    let existingCompany = await Company.findOne({ where: { email } });

    if (existingCompany) return res.status(400).json({ message: 'Email already exists' });

    if (logo) 
    {
      const uploadResult = await company.uploadIMG(logo);

      if (uploadResult === false) return res.status(500).json({ message: "Failed to upload the logo. Ensure it's a valid image file." });
    }

    const company = Company.build({ name, email, description });
    company.password = await company.hashPassword(password);

    // Generate a token using the user's ID and email
    const token = company.generateToken();

    await company.save();

    return res.status(200).json({ company, token, message: 'Company registered successfully' });
  } 
  catch (error)
  {
    console.error(error);
    return res.status(400).json({ message: 'Bad Request' });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, password, description } = req.body;
  const updateFields = {};

  if (!req.body) return res.status(400).json({ message: 'Please provide data to update the database.' });
  if (!req.body) return res.status(400).json({ message: 'Please provide data to update the database.' });

  try 
  {
    const company = await Company.findByPk(id, { attributes: { exclude: ['password'] } });

    if (!company) return res.status(404).json({ message: 'Company not found' });
    if (!company) return res.status(404).json({ message: 'Company not found' });

    if (email) 
    {
      const existingCompany = await Company.findOne({ where: { email } });

      if (existingCompany && existingCompany.id !== company.id) return res.status(400).json({ message: 'Email already exists' });
      
      updateFields.email = email;
    }

    if (name) updateFields.name = name;
    if (password) updateFields.password = await company.hashPassword(password);
    if (description) updateFields.description = description;

    await company.update(updateFields, {
      where: { id },
    });

    return res.status(200).json(company);
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
    const company = await Company.findByPk(id);
    if (company) 
    {
      await Company.destroy();
      return res.status(200).json({ message: 'Company deleted successfully' });
    } 
    else return res.status(404).json({ message: 'Company not found' });

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

  if (typeof email !== 'string' || typeof password !== 'string') 
  {
    return res.status(400).json({ message: 'Please provide the correct types for email and password.' });
  }

  try 
  {
    const company = await Company.findOne({ where: { email } });

    if (company) 
    {
      const isMatch = await company.comparePassword(password);

      if (isMatch) 
      {
        const token = company.generateToken();
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