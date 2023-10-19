const express = require('express');
const JobApplication = require('../models/jobApplicationModel');
const Employer = require('../models/employerModel');
const User = require('../models/userModel');
const Company = require('../models/companyModel');
const Advertisement = require('../models/advertisementModel')
const router = express.Router();

router.get('/', async (req, res) => {
  try 
  {
    const jobApplication = await JobApplication.findAll();
    return res.status(200).json(jobApplication);
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
    const jobApplication = await JobApplication.findByPk(parseInt(id));

    if (jobApplication) return res.status(200).json(jobApplication);
    else return res.status(404).json({ message: 'JobApplication not found' });

  } 
  catch (error) 
  {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.post('/', async (req, res) => {
  const { advertisement_id, company_id, employer_id, cv, cover_letter, user_id } = req.body;

  if (!advertisement_id || !company_id || !cv || !cover_letter || !user_id)
  {
    const missingFields = [];

    if (!advertisement_id) missingFields.push('advertisement_id');
    if (!company_id) missingFields.push('company_id');
    if (!cv) missingFields.push('cv');
    if (!cover_letter) missingFields.push('cover_letter');
    if (!user_id) missingFields.push('user_id');
  
    return res.status(400).json({
      message: `Please provide data to create a job application. Missing fields: ${missingFields.join(', ')}.`
    });
  }
  
  if (!Number.isInteger(advertisement_id) || !Number.isInteger(company_id) || !Number.isInteger(employer_id) || 
      !Number.isInteger(cv) || !Number.isInteger(cover_letter) || !Number.isInteger(user_id))
  {
    const invalidFields = [];

    if (!Number.isInteger(advertisement_id)) invalidFields.push('advertisement_id');
    if (!Number.isInteger(company_id)) invalidFields.push('company_id');
    if (!Number.isInteger(employer_id)) invalidFields.push('employer_id');
    if (!Number.isInteger(cv)) invalidFields.push('cv');
    if (!Number.isInteger(cover_letter)) invalidFields.push('cover_letter');
    if (!Number.isInteger(user_id)) invalidFields.push('user_id');
  
    return res.status(400).json({
      message: `Please provide IDs as valid integers. Invalid fields: ${invalidFields.join(', ')}.`
    });
  }

  try
  {
    const user = await User.findByPk(user_id);
    const advertisement = await Advertisement.findByPk(advertisement_id);
    const employer = await Employer.findByPk(employer_id);
    const company = await Company.findByPk(company_id);

    if ([user, employer, advertisement, company].every(item => item === null))
    {
      let missingResources = [];

      if (!user) missingResources.push('User');
      if (!advertisement) missingResources.push('Advertisement');
      if (!employer) missingResources.push('Employer');
      if (!company) missingResources.push('Company');
  
      return res.status(400).json({ message: `${missingResources.join(', ')} don't exist` });
    }
    
    const existingUserApplication = await JobApplication.findOne({
      where: { user_id: user_id }
    });

    if (existingUserApplication) return res.status(400).json({ message: 'A job application with the same user already exists.' });


    const newJobApplication = await JobApplication.create({
      advertisement_id: advertisement_id,
      company_id: company_id,
      employer_id: employer_id,
      user_id: user_id,
      cv: cv,
      cover_letter: cover_letter
    });

    return res.status(200).json({ message: 'Job application saved successfully', jobApplication: newJobApplication });
  }
  catch (error)
  {
    console.log(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { advertisement_id, company_id, employer_id, user_id } = req.body;

  if (!req.body) return res.status(400).json({ message: 'Please provide data to update the database.' });

  try
  {
    const jobApplication = await JobApplication.findByPk(id);
    const updateFields = {};

    if (user_id)
    {
      const existingUserApplication = await JobApplication.findOne({
        where: { user_id: user_id }
      });

      if (existingUserApplication) return res.status(400).json({ message: 'A job application with the same user already exists.' });

      updateFields.user_id = user_id;
    }

    if (company_id) updateFields.company_id = company_id; 
    if (advertisement_id) updateFields.advertisement_id = advertisement_id;
    if (employer_id) updateFields.employer_id = employer_id;

    if (jobApplication)
    {
      await JobApplication.update(updateFields, { where: { id } });
      return res.status(200).json(jobApplication);
    }
    else return res.status(404).json({ message: 'JobApplication not found' });
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
    const jobApplication = await JobApplication.findByPk(id);
    if (jobApplication) 
    {
      await JobApplication.destroy();
      return res.status(200).json({ message: 'JobApplication deleted successfully' });
    } 
    else return res.status(404).json({ message: 'JobApplication not found' });

  } 
  catch (error) 
  {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;