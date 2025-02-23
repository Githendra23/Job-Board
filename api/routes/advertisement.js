const express = require('express');
const Advertisement = require('../models/advertisementModel');
const Employer = require('../models/employerModel');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const advertisement = await Advertisement.findAll();
    return res.status(200).json(advertisement);
  } 
  catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const advertisement = await Advertisement.findByPk(id);

    if (advertisement) return res.status(200).json(advertisement);
    else return res.status(404).json({ message: 'Advertisement not found' });
  } 
  catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;

  delete req.body.id;

  if (!req.body) return res.status(400).json({ message: 'Please provide data to update the database.' });

  try {
    const advertisement = await Advertisement.findByPk(id);

    if (advertisement) {
      await Advertisement.update(req.body, {
        where: { id },
      });
      return res.status(200).json(advertisement);
    }
    else return res.status(404).json({ message: 'Advertisement not found' });

  } 
  catch (error) {
    console.error(error);
    return res.status(400).json({ message: 'Invalid JSON format. Please check the provided keys and values.' });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const advertisement = await Advertisement.findByPk(id);
    if (advertisement) {
      await advertisement.destroy();
      return res.status(200).json({ message: 'Advertisement deleted successfully' });
    } 
    else return res.status(404).json({ message: 'Advertisement not found' });
  } 
  catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.post('/', async (req, res) => {
  const { title, description, address, employment_contract_type, country, wage, tag, employer_id, company_id } = req.body;

  try {
    const missingFields = [];

    if (!title) missingFields.push('title');
    if (!description) missingFields.push('description');
    if (!address) missingFields.push('address');
    if (!employment_contract_type) missingFields.push('employment_contract_type');
    if (!country) missingFields.push('country');
    if (!wage) missingFields.push('wage');
    if (!employer_id) missingFields.push('employer_id');
    if (!company_id) missingFields.push('company_id');

    if (missingFields.length > 0) {
      return res.status(401).json({ message: `Missing required information. Please provide ${missingFields.join(', ')}.` });
    }

    const invalidFields = [];

    if (typeof title !== 'string') invalidFields.push('title');
    if (typeof description !== 'string') invalidFields.push('description');
    if (typeof address !== 'string') invalidFields.push('address');
    if (typeof employment_contract_type !== 'string') invalidFields.push('employment_contract_type');
    if (typeof country !== 'string') invalidFields.push('country');
    if (typeof tag !== 'string' && tag) invalidFields.push('tag');
    if (typeof wage !== 'number') invalidFields.push('wage');
    if (typeof employer_id !== 'number') invalidFields.push('employer_id');
    if (typeof company_id !== 'number') invalidFields.push('company_id');

    if (invalidFields.length > 0) {
      return res.status(401).json({ message: `Missing required information. Please provide ${missingFields.join(', ')}.` });
    }

    const existingEmployer = await Employer.findOne({
      where: {
        id: employer_id,
        company_id: company_id
      }
    });

    if (!existingEmployer) return res.status(404).json({ message: 'Employer not found.' });

    const newAdvertisement = await Advertisement.create({
      title: title,
      description: description,
      address: address,
      employment_contract_type: employment_contract_type,
      country: country,
      tag: tag,
      wage: wage,
      employer_id: employer_id,
      company_id: company_id
    });

    return res.status(200).json({ message: 'Advertisement saved successfully', advertisement: newAdvertisement });
  }
  catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;