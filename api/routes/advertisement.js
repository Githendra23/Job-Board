const express = require('express');
const Advertisement = require('../models/advertisementModel');
const router = express.Router();

router.get('/', async (req, res) => {
  try 
  {
    const advertisement = await Advertisement.findAll();
    return res.status(200).json(advertisement);
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
    const advertisement = await Advertisement.findByPk(parseInt(id));
    if (advertisement) 
    {
      return res.status(200).json(advertisement);
    } 
    else 
    {
      return res.status(404).json({ message: 'Advertisement not found' });
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
    const advertisement = await Advertisement.findByPk(id);

    if (advertisement)
    {
      await Advertisement.update(req.body, {
        where: { id },
      });
      return res.status(200).json(advertisement);
    }
    else 
    {
      return res.status(404).json({ message: 'Advertisement not found' });
    }
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
    const advertisement = await Advertisement.findByPk(id);
    if (advertisement) 
    {
      await Advertisement.destroy();
      return res.status(200).json({ message: 'Advertisement deleted successfully' });
    } 
    else 
    {
      return res.status(404).json({ message: 'Advertisement not found' });
    }
  } 
  catch (error) 
  {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;