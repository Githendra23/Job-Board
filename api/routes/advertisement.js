const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res, next) => {
    db.query(`SELECT * FROM advertisement`, (error, result, fields) => {
        if (error) 
        {
            res.status(500).json({
                message: "Couldn't get advertisement table"
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

    db.query(`SELECT * FROM advertisement WHERE id = ${id}`, (error, result, fields) => {
        if (error) 
        {
            res.status(500).json({
                message: "advertisement doesn't exist"
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

router.post(`/`, (req, res) => {
    const { title, description, address, employment_contact_type, country, wage, tag, company_id } = req.body;

    if (!title || !description || !address || !employment_contact_type || !country || !wage || !company_id)
    {
        return res.status(400).json({ message: 'You need to provide all the information of the new candidate!' });
    }

    const sql = `INSERT INTO advertisement (title, description, address, employment_contact_type, country, wage, tag, company_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [title, description, address, employment_contact_type, country, wage];

    db.query(sql, values, (error, result, fields) => {
        if (error)
        {
            console.log(error);
            return res.status(500).json({ message: 'An error occurred while adding a new advertisement.' });
        }

        return res.status(200).json({ message: `advertisement data inserted successfully.` });
    });
});

router.put('/:id', (req, res, next) => {
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
        if (key === 'id')
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

    db.query(`UPDATE advertisement SET ${sql} WHERE id = ${id}`, (error, result, fields) => {
        if (error) 
        {
            console.log(error);
            return res.status(500).json({ message: 'An error occurred while updating.' });
        } 

            return res.status(200).json({ message: `Advertisement data updated successfully.` });
    });
});

router.delete('/:id', (req, res, next) => {
    const { id } = req.params;

    db.query(`DELETE FROM advertisement WHERE id = ${id}`, (error, result, fields) => {
        if (error) 
        {
            console.log(error);
            return res.status(500).json({ message: 'An error occurred while deleting.' });
        }

        return res.status(200).json({ message: `id ${id} was succesfully deleted`});
    });
});

module.exports = router;