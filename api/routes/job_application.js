const express = require('express');
const handleDB = require('../db_operation');
const router = express.Router();

router.get('/', (req, res) => {
    const sql = 'SELECT * FROM job_application';

    handleDB.operation(res, sql);
});

router.get('/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM job_application WHERE id = ?';
    const values = [id];

    handleDB.operation(res, sql, values);
});

router.post(`/`, (req, res) => {
    const { candidate_id, advertisement_id, advertisement_company_id, cv, cover_letter } = req.body;

    if (!candidate_id || !advertisement_id || !advertisement_company_id || !cv || !cover_letter) 
    {
        return res.status(400).json({ message: 'You need to provide all the information of the new candidate!' });
    }

    const sql = `INSERT INTO job_application (candidate_id, advertisement_id, advertisement_company_id, cv, cover_letter) VALUES (?, ?, ?, ?, ?)`;
    const values = [candidate_id, advertisement_id, advertisement_company_id, cv, cover_letter];

    handleDB.operation(res, sql, values, 'Job application data inserted successfully.');
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
    
    handleDB.operation(res, updateSql, values, 'Job application data updated successfully.');
});

router.delete(`/:id`, (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM job_application WHERE id = ?';
    const values = [id];

    handleDB.operation(res, sql, values, `id ${id} was successfully deleted`);
});

module.exports = router;