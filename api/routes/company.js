const express = require('express');
const db = require('../db');
const bcrypt = require('bcryptjs');
const router = express.Router();

router.get('/', (req, res, next) => {
    db.query(`SELECT * FROM company`, (error, result, fields) => {
        if (error) 
        {
            res.status(500).json({
                message: "Couldn't get company table"
            });
        }

        const data = result.map(row => {
            // Create a new object without the 'password' key
            const { password, ...newRow } = row;
            return newRow;
        });

        return res.status(200).json(data);
    });
});

router.get('/:id', (req, res, next) => {
    const { id } = req.params;

    db.query(`SELECT * FROM company WHERE id = ${id}`, (error, result, fields) => {
        if (error) 
        {
            res.status(500).json({
                message: "company doesn't exist"
            });
        }

        const data = result.map(row => {
            // Create a new object without the 'password' key
            const { password, ...newRow } = row;
            return newRow;
        });

        return res.status(200).json(data[0]);
    }); 
});

router.post(`/`, async (req, res) => {
    const { name, email, password, telephone, description, country } = req.body;

    if (!name || !description || !country || !telephone || !email || !password)
    {
        return res.status(400).json({ message: 'You need to provide all the information of the new candidate!' });
    }

    let sql = `SELECT COUNT(*) AS emailCount FROM company WHERE email = ?`;
    let values = [email];

    db.query(sql, values, (error, result, fields) => {
        if (error) 
        {
            console.log(error);
            return res.status(500).json({ message: 'Error adding new company.'})
        }
        else 
        {
            const emailCount = result[0].emailCount;
            if (emailCount > 0) 
            {
                return res.status(409).send({ message: `The email has been used.` });
            } 
        }
    });
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    sql = `INSERT INTO company (name, description, country, telephone, email, password) VALUES (?, ?, ?, ?, ?, ?)`;
    values = [name, description, country, telephone, email, hashedPassword];

    db.query(sql, values, (error, result, fields) => {
        if (error)
        {
            console.log(error);
            return res.status(500).json({ message: 'An error occurred while hashing the password.' });
        }
        return res.status(200).json({ message: `Company data inserted successfully.` });
    });
});

router.put(`/:id`, (req, res) => {
    const { id } = req.params;
    const { data } = req.body;

    if (!data) 
    {
        return res.status(400).json({ message: 'You need to provide data to update the database!' });
    } 

    const numberOfKeys = Object.keys(data).length;
    let sql = '';

    let count = 0;
    for (const key in data) 
    {
        if (key === 'id' || key === 'telephone')
        {
            sql += `${key} = ${data[key]}`;
        } 
        else 
        {
            sql += `${key} = '${data[key]}'`;
        }
        
        sql += (count < numberOfKeys - 1) ? ', ' : '';
        count++;
    }

    db.query(`UPDATE company SET ${sql} WHERE id = ${id}`, (error, result, fields) => {
        if (error) 
        {
            console.log(error);
            return res.status(500).json({ message: 'An error occurred while updating.' });
        } 

            return res.status(200).json({ message: `Company data updated successfully.` });
    });
});

/* ---------------------------- VERIFY AUTHENTICATION ---------------------------- */

router.post(`/verify`, async (req, res) => {
    const { email } = req.body;
    const { password } = req.body;

    db.query(`SELECT password FROM company WHERE email = '${email}'`, async (error, result, fields) => {
        if (error)
        {
            console.error(error);
            res.status(500).json({ message: 'An error occurred while verifying authentication' }); 
        }
        
        if (result.length === 0) 
        {
            return res.status(404).json({ message: 'Record not found' });
        }

        const hashedPassword = result[0].password;
        const isMatch = await bcrypt.compare(password, hashedPassword);

        res.status(200).json({ isMatch });
    });
});

router.delete(`/:id`, (req, res) => {
    const { id } = req.params;

    db.query(`DELETE FROM company WHERE id = ${id}`, (error, result, fields) => {
        if (error) 
        {
            console.log(error);
            return res.status(500).json({ message: 'An error occurred while deleting.' });
        }

        return res.status(200).json({ message: `id ${id} was succesfully deleted`});
    });
});

module.exports = router;