const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db');
const router = express.Router();

router.get('/', (req, res, next) => {
    db.query(`SELECT * FROM candidate`, (error, result, fields) => {
        if (error) 
        {
            res.status(500).json({
                message: "Couldn't get candidate table"
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

    db.query(`SELECT * FROM candidate WHERE id = ${id}`, (error, result, fields) => {
        if (error) 
        {
            res.status(500).json({
                message: "Candidate doesn't exist"
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
    const { name, surname, age, address, country, telephone, email, password } = req.body;

    try 
    {
        if (!name || !surname || !age || !address || !country || !telephone || !email || !password) 
        {
            return res.status(400).json({ message: 'You need to provide all the information of the new candidate.' });
        }

        let sql = `SELECT COUNT(*) AS emailCount FROM candidate WHERE email = ?`;
        let values = [email];

        db.query(sql, values, (error, result, fields) => {
            if (error) 
            {
                console.log(error);
                return res.status(500).json({ message: 'Error adding new candidate.'})
            } 
            else 
            {
                const emailCount = result[0].emailCount;
                if (emailCount > 0) 
                {
                    return res.status(409).json({ message: 'The email has already been used.' });
                }
            }
        });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        sql = `INSERT INTO candidate (name, surname, age, address, country, telephone, email, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        values = [name, surname, age, address, country, telephone, email, hashedPassword];

        await db.query(sql, values);
        return res.status(200).json({ message: 'Candidate data inserted successfully.' });
    } 
    catch (error) 
    {
        console.error(error);
        return res.status(500).json({ message: 'An error occurred while creating a new candidate.' });
    }
});

router.put(`/:id`, (req, res) => {
    const { id } = req.params;
    const { data } = req.body;

    console.log(data);

    if (!data) 
    {
        return res.status(400).json({ message: 'You need to provide data to update the database!' });
    } 

    const numberOfKeys = Object.keys(data).length;
    let sql = '';

    let count = 0;
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
        
        sql += (count < numberOfKeys - 1) ? ', ' : '';
        count++;
    }

    db.query(`UPDATE candidate SET ${sql} WHERE id = ${id}`, (error, result, fields) => {
        if (error) 
        {
            console.log(error);
            return res.status(500).json({ message: 'An error occurred while updating.' });
        } 

            return res.status(200).json({ message: `Candidate data updated successfully.` });
    });
});

/* ---------------------------- VERIFY AUTHENTICATION ---------------------------- */

router.post(`/verify`, (req, res) => {
    const { email, password } = req.body;

    if (!email || !password)
    {
        return res.status(400).json({ message: 'You need to provide the email and password of the candidate.' });
    }

    db.query(`SELECT password FROM candidate WHERE email = '${email}'`, async (error, result, fields) => {
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

    db.query(`DELETE FROM candidate WHERE id = ${id}`, (error, result, fields) => {
        if (error) 
        {
            console.log(error);
            return res.status(500).json({ message: 'An error occurred while deleting.' });
        }

        return res.status(200).json({ message: `id ${id} was succesfully deleted`});
    });
});

module.exports = router;