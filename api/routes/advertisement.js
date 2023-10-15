const express = require('express');
const router = express.Router();
const handleDB = require('../db_operation');

const handleNotFoundError = (res) => {
    res.status(404).json({ message: 'Resource not found' });
};

router.get('/', async (req, res) => {
    const sql = 'SELECT * FROM advertisement';
    const result = await handleDB.asyncOperation(res, sql);

    if (result) 
    {
        const data = result.map(row => {
            const { password, ...newRow } = row;
            return newRow;
        });

        return data.length === 0 ? handleNotFoundError(res) : res.status(200).json(data);
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM advertisement WHERE id = ?';
    const values = [id];
    const result = await handleDB.asyncOperation(res, sql, values);

    if (result) 
    {
        return result.length === 0 ? handleNotFoundError(res) : res.status(200).json(result);
    }
});

router.post('/', async (req, res) => {
    const { title, description, address, employment_contact_type, country, wage, tag, company_id } = req.body;

    if (!title || !description || !address || !employment_contact_type || !country || !wage || !company_id) 
    {
        return res.status(400).json({ message: 'You need to provide all the required information for the new advertisement.' });
    }

    const sql = `INSERT INTO advertisement (title, description, address, employment_contact_type, country, wage, tag, company_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [title, description, address, employment_contact_type, country, wage, tag, company_id];

    if (await handleDB.asyncOperation(res, sql, values)) 
    {
        return res.status(200).json({ message: 'Advertisement data inserted successfully.' });
    }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { data } = req.body;

    if (!data) 
    {
        return res.status(400).json({ message: 'You need to provide data to update the database.' });
    }

    const numberOfKeys = Object.keys(data).length;
    let sql = `UPDATE advertisement SET `;
    let values = [];

    for (const key in data) 
    {
        sql += `${key} = ?`;
        values.push(data[key]);
        sql += numberOfKeys > 1 ? ', ' : ' ';
        numberOfKeys--;
    }

    sql += `WHERE id = ?`;
    values.push(id);

    if (await handleDB.asyncOperation(res, sql, values)) 
    {
        return res.status(200).json({ message: 'Advertisement data updated successfully.' });
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM advertisement WHERE id = ?';
    const values = [id];

    if (await handleDB.asyncOperation(res, sql, values)) 
    {
        return res.status(200).json({ message: `Advertisement with ID ${id} was successfully deleted` });
    }
});

module.exports = router;