const express = require('express');
const db = require('../db');
const router = express.Router();

router.get('/', (req, res, next) => {
    db.query(`SELECT * FROM job_application`, (error, result, fields) => {
        if (error) 
        {
            res.status(500).json({
                message: "Couldn't get job_application table"
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

    db.query(`SELECT * FROM job_application WHERE id = ${id}`, (error, result, fields) => {
        if (error) 
        {
            res.status(500).json({
                message: "job_application doesn't exist"
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
    const { candidate_id, advertisement_id, advertisement_company_id, cv, cover_letter } = req.body;

    if (!candidate_id || !advertisement_id || !advertisement_company_id || !cv || !cover_letter)
    {
        return res.status(400).json({ message: 'You need to provide all the information of the new candidate!' });
    }

    const sql = `INSERT INTO job_application (candidate_id, advertisement_id, advertisement_company_id, cv, cover_letter) VALUES (?, ?, ?, ?, ?)`;
    const values = [candidate_id, advertisement_id, advertisement_company_id, cv, cover_letter];

    db.query(sql, values, (error, result, fields) => {
        if (error)
        {
            console.log(error);
            return res.status(500).json({ message: 'An error occurred while adding a new job application.' });
        }

        return res.status(200).json({ message: `Job application data inserted successfully.` });
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

    db.query(`UPDATE job_application SET ${sql} WHERE id = ${id}`, (error, result, fields) => {
        if (error) 
        {
            console.log(error);
            return res.status(500).json({ message: 'An error occurred while updating.' });
        } 

            return res.status(200).json({ message: `job_application data updated successfully.` });
    });
});

router.delete(`/:id`, (req, res) => {
    const { id } = req.params;

    db.query(`DELETE FROM job_application WHERE id = ${id}`, (error, result, fields) => {
        if (error) 
        {
            console.log(error);
            return res.status(500).json({ message: 'An error occurred while deleting.' });
        }

        return res.status(200).json({ message: `id ${id} was succesfully deleted`});
    });
});

module.exports = router;