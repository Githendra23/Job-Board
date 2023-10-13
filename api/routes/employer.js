const express = require('express');
const db = require('../db');
const bcrypt = require('bcryptjs');
const router = express.Router();

router.get('/', (req, res, next) => {
    db.query(`SELECT * FROM employer`, (error, result, fields) => {
        if (error) 
        {
            res.status(500).json({
                message: "Couldn't get employer table"
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

    db.query(`SELECT * FROM employer WHERE id = ${id}`, (error, result, fields) => {
        if (error) 
        {
            res.status(500).json({
                message: "employer doesn't exist"
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
    const { name, surname, telephone, email, password, company_id } = req.body;

    if (!name || !surname || !telephone || !email || !password || !company_id) 
    {
        return res.status(400).json({ message: 'You need to provide all the information of the new employer!' });
    } 

    let sql = `SELECT COUNT(*) AS emailCount FROM employer WHERE email = ?`;
    let values = [email];

    db.query(sql, values, (error, result, fields) => {
        if (error) 
        {
            console.log(error);
            return res.status(500).json({ message: 'Error adding new employer.'})
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

    sql = `INSERT INTO employer (name, surname, telephone, email, password, company_id) VALUES (?, ?, ?, ?, ?, ?)`;
    values = [name, surname, telephone, email, hashedPassword, company_id];

    db.query(sql, values, (error, result, fields) => {
        if (error) 
        {
            console.log(error);
            return res.status(500).json({ message: 'An error occurred while hashing the password.' });
        } 

        return res.status(200).json({ message: `Employer data inserted successfully.` });
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
        if (key === 'id' || 'age')
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

    db.query(`UPDATE employer SET ${sql} WHERE id = ${id}`, (error, result, fields) => {
        if (error) 
        {
            console.log(error);
            return res.status(500).json({ message: 'An error occurred while updating.' });
        } 

            return res.status(200).json({ message: `Employer data updated successfully.` });
    });
});

/* ---------------------------- VERIFY AUTHENTICATION ---------------------------- */

router.post(`/verify`, async (req, res) => {
    const { email } = req.body;
    const { password } = req.body;

    db.query(`SELECT password FROM employer WHERE email = '${email}'`, async (error, result, fields) => {
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

    db.query(`DELETE FROM employer WHERE id = ${id}`, (error, result, fields) => {
        if (error) 
        {
            console.log(error);
            return res.status(500).json({ message: 'An error occurred while deleting.' });
        }

        return res.status(200).json({ message: `id ${id} was succesfully deleted`});
    });
});

module.exports = router;