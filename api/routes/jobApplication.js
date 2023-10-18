const express = require('express');
const JobApplication = require('../models/jobApplicationModel');
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
    if (jobApplication) 
    {
      return res.status(200).json(jobApplication);
    } 
    else 
    {
      return res.status(404).json({ message: 'JobApplication not found' });
    }
  } 
  catch (error) 
  {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
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
    const jobApplication = await JobApplication.findByPk(id);

    if (jobApplication)
    {
      await JobApplication.update(req.body, {
        where: { id },
      });
      return res.status(200).json(jobApplication);
    }
    else 
    {
      return res.status(404).json({ message: 'JobApplication not found' });
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
    const jobApplication = await JobApplication.findByPk(id);
    if (jobApplication) 
    {
      await JobApplication.destroy();
      return res.status(200).json({ message: 'JobApplication deleted successfully' });
    } 
    else
    {
      return res.status(404).json({ message: 'JobApplication not found' });
    }
  } 
  catch (error) 
  {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;