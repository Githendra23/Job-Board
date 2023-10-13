const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db');
const router = express.Router();

const handleDatabaseOperation = async (res, sql, values) => {
    try 
    {
        const result = await db.query(sql, values);
        return result;
    } 
    catch (error) 
    {
        console.error(error);
        return null;
    }
};

router.get('/', async (req, res) => {
    const sql = 'SELECT * FROM employer';
    const result = await handleDatabaseOperation(res, sql);

    if (!result) 
    {
        return res.status(500).json({ message: 'Internal Server Error' });
    }

    if (result.length === 0) 
    {
        return res.status(404).json({ message: 'Resource not found' });
    }

    const data = result.map(row => {
        const { password, ...newRow } = row;
        return newRow;
    });

    return res.status(200).json(data);
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM employer WHERE id = ?';
    const values = [id];
    const result = await handleDatabaseOperation(res, sql, values);

    if (!result) 
    {
        return res.status(500).json({ message: 'Internal Server Error' });
    }

    if (result.length === 0) 
    {
        return res.status(404).json({ message: 'Resource not found' });
    }

    const data = result.map(row => {
        const { password, ...newRow } = row;
        return newRow;
    });

    return res.status(200).json(data);
});

router.post(`/`, async (req, res) => {
    const { name, surname, telephone, email, password, company_id } = req.body;

    if (!name || !surname || !telephone || !email || !password || !company_id) 
    {
        return res.status(400).json({ message: 'Please provide all required information for the new employer.' });
    }

    let sql = `SELECT COUNT(*) AS emailCount FROM employer WHERE email = ?`;
    let values = [email];

    const emailCountResult = await handleDatabaseOperation(res, sql, values);

    if (!emailCountResult) 
    {
        return res.status(500).json({ message: 'Internal Server Error' });
    }

    const emailCount = emailCountResult[0].emailCount;
    if (emailCount > 0) 
    {
        return res.status(409).json({ message: 'The provided email address is already in use.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    sql = `INSERT INTO employer (name, surname, telephone, email, password, company_id) VALUES (?, ?, ?, ?, ?, ?)`;
    values = [name, surname, telephone, email, hashedPassword, company_id];

    await handleDatabaseOperation(res, sql, values);
    return res.status(200).json({ message: 'Employer data inserted successfully.' });
});

router.put(`/:id`, async (req, res) => {
    const { id } = req.params;
    const { data } = req.body;

    if (!data) 
    {
        return res.status(400).json({ message: 'Please provide data for updating the database.' });
    }

    const numberOfKeys = Object.keys(data).length;
    let sql = '';
    let values = [id];

    for (const key in data) {
        if (key === 'id' || key === 'age') 
        {
            sql += `${key} = ${data[key]}`;
        } 
        else 
        {
            sql += `${key} = '${data[key]}'`;
        }

        sql += (numberOfKeys > 1) ? ', ' : '';
        numberOfKeys--;
    }

    const updateSql = `UPDATE employer SET ${sql} WHERE id = ?`;
    const result = await handleDatabaseOperation(res, updateSql, values);

    if (!result) 
    {
        return res.status(500).json({ message: 'Internal Server Error' });
    }

    return res.status(200).json({ message: `Employer data updated successfully.` });
});

/* ---------------------------- VERIFY AUTHENTICATION ---------------------------- */

router.post(`/verify`, async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) 
    {
        return res.status(400).json({ message: 'Please provide both email and password for authentication.' });
    }

    const sql = `SELECT password FROM employer WHERE email = ?`;
    const values = [email];

    const result = await handleDatabaseOperation(res, sql, values);

    if (!result) 
    {
        return res.status(500).json({ message: 'Internal Server Error' });
    }

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
    const sql = 'DELETE FROM employer WHERE id = ?';
    const values = [id];

    const result = await handleDatabaseOperation(res, sql, values);

    if (!result) 
    {
        return res.status(500).json({ message: 'Internal Server Error' });
    }

    return res.status(200).json({ message: `Employer with ID ${id} was successfully deleted` });
});

module.exports = router;