const express = require('express');
const bcrypt = require('bcryptjs');
const handleDB = require('../db_operation');
const router = express.Router();

router.get('/', async (req, res) => {
    const sql = 'SELECT * FROM company';
    const result = await handleDB.asyncOperation(res, sql);
    
    if (result) 
    {
        if (result.length === 0) 
        {
            return res.status(404).json({ message: 'No companies found' });
        }

        const data = result.map(row => {
            const { password, ...newRow } = row;
            return newRow;
        });

        return res.status(200).json(data);
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM company WHERE id = ?';
    const values = [id];
    const result = await handleDB.asyncOperation(res, sql, values);

    if (result) 
    {
        if (result.length === 0) 
        {
            return res.status(404).json({ message: 'Company not found' });
        }

        const data = result.map(row => {
            const { password, ...newRow } = row;
            return newRow;
        });

        return res.status(200).json(data);
    }
});

router.post(`/`, async (req, res) => {
    const { name, email, password, telephone, description, country } = req.body;

    if (!name || !description || !country || !telephone || !email || !password) 
    {
        return res.status(400).json({ message: 'Please provide all the required information for the new company.' });
    }

    let sql = `SELECT COUNT(*) AS emailCount FROM company WHERE email = ?`;
    let values = [email];

    const emailCountResult = await handleDB.asyncOperation(res, sql, values);

    if (emailCountResult) 
    {
        const emailCount = emailCountResult[0].emailCount;
        if (emailCount > 0) 
        {
            return res.status(409).json({ message: 'The provided email address is already in use.' });
        }
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    sql = `INSERT INTO company (name, description, country, telephone, email, password) VALUES (?, ?, ?, ?, ?, ?)`;
    values = [name, description, country, telephone, email, hashedPassword];

    await handleDB.asyncOperation(res, sql, values);
    return res.status(200).json({ message: 'Company data inserted successfully.' });
});

router.put(`/:id`, async (req, res) => {
    const { id } = req.params;
    const { data } = req.body;

    if (!data) 
    {
        return res.status(400).json({ message: 'Please provide data to update the database.' });
    }

    const numberOfKeys = Object.keys(data).length;
    let sql = '';
    let values = [id];

    for (const key in data) 
    {
        if (key === 'id' || key === 'telephone') {
            sql += `${key} = ${data[key]}`;
        } 
        else 
        {
            sql += `${key} = '${data[key]}'`;
        }

        sql += (numberOfKeys > 1) ? ', ' : '';
        numberOfKeys--;
    }

    const updateSql = `UPDATE company SET ${sql} WHERE id = ?`;
    const result = await handleDB.asyncOperation(res, updateSql, values);

    if (result) 
    {
        return res.status(200).json({ message: `Company data updated successfully.` });
    }
});

/* ---------------------------- VERIFY AUTHENTICATION ---------------------------- */

router.post(`/verify`, async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) 
    {
        return res.status(400).json({ message: 'Please provide both email and password for authentication.' });
    }

    const sql = `SELECT password FROM company WHERE email = ?`;
    const values = [email];

    const result = await handleDB.asyncOperation(res, sql, values);

    if (result.length === 0) 
    {
        return res.status(404).json({ message: 'Email address not found in records.' });
    }

    const hashedPassword = result[0].password;
    const isMatch = await bcrypt.compare(password, hashedPassword);

    if (isMatch) 
    {
        return res.status(200).json({ message: 'Authentication successful.' });
    } 
    else 
    {
        return res.status(401).json({ message: 'Authentication failed. Invalid password.' });
    }
});

router.delete(`/:id`, async (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM company WHERE id = ?';
    const values = [id];

    const result = await handleDB.asyncOperation(res, sql, values);

    if (result) 
    {
        return res.status(200).json({ message: `Company with ID ${id} was successfully deleted` });
    }
});

module.exports = router;