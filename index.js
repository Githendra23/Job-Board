const express = require('express');
const app = express();
const mysql = require('mysql');
const PORT = 8080;

app.use(express.json());

var db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "db_job_board"
});

db.connect((err) => {
    if (err) throw err;
    console.log("Connected!");
});

app.listen(PORT);

const table = ['candidate', 'company', 'advertisement', 'job_application'];

for (const tableName of table)
{
    app.get(`/api/work_trailer/${tableName}/total`, (req, res) => {
        db.query(`SELECT count(*) FROM ${tableName}`, (error, result, fields) => {
            if (error) 
            {
                res.send({ message: error })
            }

            const TOTAL = result[0]['count(*)'];

            res.status(200).json( TOTAL );
        });
    });

    app.get(`/api/work_trailer/${tableName}`, (req, res) => {
        db.query(`SELECT * FROM ${tableName}`, (error, result, fields) => {
            if (error) throw error;

            const DATA = result.map(row => ({ ...row }));

            res.status(200).json( DATA );
        });
    });

    app.get(`/api/work_trailer/${tableName}/:id`, (req, res) => {
        const { id } = req.params;

        db.query(`SELECT * FROM ${tableName} WHERE id = ?`, [id], (error, result, fields) => {
            if (error) throw error;

            const DATA = result.map(row => ({ ...row }));

            res.status(200).json( DATA );
        });
    });

    /* app.put(`/api/work_trailer/update/${tableName}/:id`, (req, res) => {
        const { id } = req.params;
        const { data } = req.body;

        db.query(`UPDATE ${tableName} SET ... WHERE id = ${id}`, (error, result, fields) => {
            if (error) throw error;

            
        });

        if (!data)
        {
            res.status(418).send({ message: 'You need to provide data in JSON format to update!'})
        }

        res.send({
            add: `${data}`,
            id: `${id}`
        });
    }); */
}