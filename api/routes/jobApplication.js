const express = require('express');
const db = require('../db');
const router = express.Router();

const handleDatabaseOperation = (res, sql, values, successMessage) => {
    db.query(sql, values, (error, result, fields) => {
        if (error) 
        {
            console.log(error);
            return res.status(500).json({ message: 'An error occurred while processing the request.' });
        }

        if (successMessage) 
        {
            return res.status(200).json({ message: successMessage });
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
};

router.get('/', (req, res) => {
    const sql = 'SELECT * FROM job_application';

    handleDatabaseOperation(res, sql);
});

router.get('/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM job_application WHERE id = ?';
    const values = [id];

    handleDatabaseOperation(res, sql, values);
});

router.post(`/`, (req, res) => {
    const { candidate_id, advertisement_id, advertisement_company_id, cv, cover_letter } = req.body;

    if (!candidate_id || !advertisement_id || !advertisement_company_id || !cv || !cover_letter) 
    {
        return res.status(400).json({ message: 'You need to provide all the information of the new candidate!' });
    }

    const sql = `INSERT INTO job_application (candidate_id, advertisement_id, advertisement_company_id, cv, cover_letter) VALUES (?, ?, ?, ?, ?)`;
    const values = [candidate_id, advertisement_id, advertisement_company_id, cv, cover_letter];

    handleDatabaseOperation(res, sql, values, 'Job application data inserted successfully.');
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
    const values = [id];

    for (const key in data) 
    {
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

    const updateSql = `UPDATE job_application SET ${sql} WHERE id = ?`;
    
    handleDatabaseOperation(res, updateSql, values, 'Job application data updated successfully.');
});

router.delete(`/:id`, (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM job_application WHERE id = ?';
    const values = [id];

    handleDatabaseOperation(res, sql, values, `id ${id} was successfully deleted`);
});

module.exports = router;