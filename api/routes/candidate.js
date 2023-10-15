const express = require('express');
const bcrypt = require('bcryptjs');
const handleDB = require('../db_operation');
const router = express.Router();

router.get('/', async (req, res) => {
    const sql = 'SELECT * FROM candidate';
    const result = await handleDB.asyncOperation(res, sql);
    
    if (result) 
    {
        const data = result.map(row => {
            const { password, ...newRow } = row;
            return newRow;
        });

        if (data.length === 0) 
        {
            return res.status(404).json({ message: 'Resource not found' });
        }

        return res.status(200).json(data);
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM candidate WHERE id = ?';
    const values = [id];
    const result = await handleDB.asyncOperation(res, sql, values);

    if (result) 
    {
        if (result.length === 0) 
        {
            return res.status(404).json({ message: 'Candidate not found' });
        }

        const data = result.map(row => {
            const { password, ...newRow } = row;
            return newRow;
        });

        return res.status(200).json(data);
    }
});

router.post(`/`, async (req, res) => {
    const { name, surname, age, address, country, telephone, email, password } = req.body;

    if (!name || !surname || !age || !address || !country || !telephone || !email || !password) 
    {
        return res.status(400).json({ message: 'Please provide all the required information for the new candidate.' });
    }

    try 
    {
        let sql = `SELECT COUNT(*) AS emailCount FROM candidate WHERE email = ?`;
        let values = [email];
        const emailCountResult = await handleDB.asyncOperation(res, sql, values);

        if (emailCountResult) 
        {
            const emailCount = emailCountResult[0].emailCount;
            if (emailCount > 0) 
            {
                return res.status(409).json({ message: 'The provided email has already been used.' });
            }
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        sql = `INSERT INTO candidate (name, surname, age, address, country, telephone, email, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        values = [name, surname, age, address, country, telephone, email, hashedPassword];

        await handleDB.asyncOperation(res, sql, values);
        return res.status(200).json({ message: 'Candidate data inserted successfully.' });
    } catch (error) 
    {
        console.error(error);
        return res.status(500).json({ message: 'An error occurred while creating a new candidate.' });
    }
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
        if (key === 'id' || key === 'age' || key === 'telephone') 
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

    const updateSql = `UPDATE candidate SET ${sql} WHERE id = ?`;
    const result = await handleDB.asyncOperation(res, updateSql, values);

    if (result) 
    {
        return res.status(200).json({ message: `Candidate data updated successfully.` });
    }
});

/* ---------------------------- VERIFY AUTHENTICATION ---------------------------- */

router.post(`/verify`, async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) 
    {
        return res.status(400).json({ message: 'Please provide both email and password for authentication.' });
    }

    const sql = `SELECT password FROM candidate WHERE email = ?`;
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
    const sql = 'DELETE FROM candidate WHERE id = ?';
    const values = [id];

    const result = await handleDB.asyncOperation(res, sql, values);

    if (result) 
    {
        return res.status(200).json({ message: `Candidate with ID ${id} was successfully deleted` });
    }
});

module.exports = router;