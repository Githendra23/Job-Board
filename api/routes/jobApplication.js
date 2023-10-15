const express = require('express');
const JobApplication = require('../models/jobApplicationModel');

const router = express.Router();

router.get('/', async (req, res) => {
  try 
  {
    const jobApplications = await JobApplication.getAll();

    if (jobApplications) 
    {
      return res.status(200).json(jobApplications);
    } 
    else 
    {
      return res.status(404).json({ message: 'Resource not found' });
    }
  } 
  catch (error) 
  {
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try 
  {
    const jobApplication = await JobApplication.getById(id);

    if (jobApplication) 
    {
      return res.status(200).json(jobApplication);
    } 
    else 
    {
      return res.status(404).json({ message: 'Resource not found' });
    }
  } 
  catch (error) 
  {
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.post('/', async (req, res) => {
  const jobApplicationData = req.body;

  try 
  {
    const result = await JobApplication.create(jobApplicationData);

    if (result) 
    {
      return res.status(200).json({ message: 'Job application data inserted successfully.' });
    } 
    else 
    {
      return res.status(400).json({ message: 'You need to provide all the information of the new candidate!' });
    }
  } 
  catch (error) 
  {
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  try 
  {
    const result = await JobApplication.update(id, data);

    if (result) 
    {
      return res.status(200).json({ message: 'Job application data updated successfully.' });
    } 
    else 
    {
      return res.status(400).json({ message: 'You need to provide data to update the database!' });
    }
  } 
  catch (error) 
  {
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try 
  {
    const result = await JobApplication.delete(id);
    if 
    (result) 
    {
      return res.status(200).json({ message: `ID ${id} was successfully deleted` });
    } 
    else 
    {
      return res.status(404).json({ message: 'Resource not found' });
    }
  } 
  catch (error) 
  {
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;