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
                res.status(500).send({ message: error })
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

/* ---------------------------- POST CREATE ---------------------------- */

app.post(`/api/work_trailer/${table[0]}/add`, (req, res) => {
    const { name, surname, age, address, country, telephone, email, password } = req.body;

    if (!name || !surname || !age || !address || !country || !telephone || !email || !password)
    {
        res.status(400).json({ message: 'You need to provide all the information of the new candidate!' });
    }
    else
    {
        const sql = `INSERT INTO ${table[0]} (name, surname, age, address, country, telephone, email, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        const values = [name, surname, age, address, country, telephone, email, password];

        db.query(sql, values, (error, result, fields) => {
            if (error)
            {
                res.status(500).json({ message: error });
            }
            else
            {
                res.status(200).json({ message: `${table[0]} data inserted successfully.` });
            }
        });
    }
});

app.post(`/api/work_trailer/${table[1]}/add`, (req, res) => {
    const { name, email, password, telephone, description, country } = req.body;

    if (!name || !description || !country || !telephone || !email || !password)
    {
        res.status(400).json({ message: 'You need to provide all the information of the new candidate!' });
    }
    else
    {
        const sql = `INSERT INTO ${table[1]} (name, description, country, telephone, email, password) VALUES (?, ?, ?, ?, ?, ?)`;
        const values = [name, description, country, telephone, email, password];

        db.query(sql, values, (error, result, fields) => {
            if (error)
            {
                res.status(500).json({ message: error });
            }
            else
            {
                res.status(200).json({ message: `${table[1]} data inserted successfully.` });
            }
        });
    }
});

app.post(`/api/work_trailer/${table[2]}/add`, (req, res) => {
    const { title, description, address, employment_contact_type, country, wage, tag, company_id } = req.body;

    if (!title || !description || !address || !employment_contact_type || !country || !wage || !company_id)
    {
        res.status(400).json({ message: 'You need to provide all the information of the new candidate!' });
    }
    else
    {
        const sql = `INSERT INTO ${table[2]} (title, description, address, employment_contact_type, country, wage, tag, company_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        const values = [title, description, address, employment_contact_type, country, wage];

        db.query(sql, values, (error, result, fields) => {
            if (error)
            {
                res.status(500).json({ message: error });
            }
            else
            {
                res.status(200).json({ message: `${table[2]} data inserted successfully.` });
            }
        });
    }
});

app.post(`/api/work_trailer/${table[3]}/add`, (req, res) => {
    const { user_id, advertisement_id, advertisement_company_id, cv, cover_letter } = req.body;

    if (!user_id || !advertisement_id || !advertisement_company_id || !cv || !cover_letter)
    {
        res.status(400).json({ message: 'You need to provide all the information of the new candidate!' });
    }
    else
    {
        const sql = `INSERT INTO ${table[3]} (user_id, advertisement_id, advertisement_company_id, cv, cover_letter) VALUES (?, ?, ?, ?, ?)`;
        const values = [user_id, advertisement_id, advertisement_company_id, cv, cover_letter];

        db.query(sql, values, (error, result, fields) => {
            if (error)
            {
                res.status(500).json({ message: error });
            }
            else
            {
                res.status(200).json({ message: `${table[3]} data inserted successfully.` });
            }
        });
    }
});