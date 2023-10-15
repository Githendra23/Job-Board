const express = require('express');
const router = express.Router();
const Advertisement = require('../models/advertisementModel');

router.get('/', async (req, res) => {
    const advertisements = await Advertisement.getAll();

    if (advertisements) 
    {
        res.status(200).json(advertisements);
    } 
    else 
    {
        res.status(404).json({ message: 'Resource not found' });
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const advertisement = await Advertisement.getById(id);

    if (advertisement) 
    {
        res.status(200).json(advertisement);
    } 
    else 
    {
        res.status(404).json({ message: 'Resource not found' });
    }
});

router.post('/', async (req, res) => 
{
    const { title, description, address, employment_contact_type, country, wage, tag, company_id } = req.body;
    const advertisementData = 
    {
        title,
        description,
        address,
        employment_contact_type,
        country,
        wage,
        tag,
        company_id,
    };

    const result = await Advertisement.create(advertisementData);

    if (result) 
    {
        res.status(200).json({ message: 'Advertisement data inserted successfully.' });
    } 
    else 
    {
        res.status(400).json({ message: 'You need to provide all the required information for the new advertisement.' });
    }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { data } = req.body;

    const result = await Advertisement.update(id, data);

    if (result) 
    {
        res.status(200).json({ message: 'Advertisement data updated successfully.' });
    } 
    else 
    {
        res.status(400).json({ message: 'You need to provide data to update the database.' });
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const result = await Advertisement.delete(id);

    if (result) 
    {
        res.status(200).json({ message: `Advertisement with ID ${id} was successfully deleted` });
    } 
    else 
    {
        res.status(404).json({ message: 'Resource not found' });
    }
});

module.exports = router;