const express = require('express');
const app = express();
const cors = require('cors');
const mysql = require('mysql');
const PORT = 8080;

app.use(cors());
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

/* ---------------------------- GET ---------------------------- */

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
    
            const data = result.map(row => {
                // Create a new object without the 'password' key
                const { password, ...newRow } = row;
                return newRow;
            });
    
            res.status(200).json( data );
        });
    });
    

    app.get(`/api/work_trailer/${tableName}/:id`, (req, res) => {
        const { id } = req.params;

        db.query(`SELECT * FROM ${tableName} WHERE id = ?`, [id], (error, result, fields) => {
            if (error) throw error;

            const data = result.map(row => {
                // Create a new object without the 'password' key
                const { password, ...newRow } = row;
                return newRow;
            });

            res.status(200).json( data[0] );
        });
    });
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
    const { candidate_id, advertisement_id, advertisement_company_id, cv, cover_letter } = req.body;

    if (!candidate_id || !advertisement_id || !advertisement_company_id || !cv || !cover_letter)
    {
        res.status(400).json({ message: 'You need to provide all the information of the new candidate!' });
    }
    else
    {
        const sql = `INSERT INTO ${table[3]} (candidate_id, advertisement_id, advertisement_company_id, cv, cover_letter) VALUES (?, ?, ?, ?, ?)`;
        const values = [candidate_id, advertisement_id, advertisement_company_id, cv, cover_letter];

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

/* ---------------------------- UPDATE ---------------------------- */
for (const tableName of table) 
{
    app.post(`/api/work_trailer/${tableName}/update/:id`, (req, res) => {
        const { id } = req.params;
        const { data } = req.body;
  
        if (!data) 
        {
        res.status(400).json({ message: 'You need to provide data to update the database!' });
        } 
        else 
        {
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

        db.query(`UPDATE ${tableName} SET ${sql} WHERE id = ${id}`, (error, result, fields) => {
            if (error) 
            {
            res.status(500).json({ message: error });
            } 
            else 
            {
            res.status(200).json({ message: `${tableName} data updated successfully.` });
            }
        });
      }
    });
}
  

/* ---------------------------- DELETE ---------------------------- */

for (const tableName of table)
{
    app.delete(`/api/work_trailer/${tableName}/delete/:id`, (req, res) => {
        const { id } = req.params;

        db.query(`DELETE FROM ${tableName} WHERE id = ${id}`, (error, result, fields) => {
            if (error) 
            {
                res.send({ message: error});
            }
            else
            {
                res.status(200).send({ message: `id ${id} was succesfully deleted`});
            }
        });
    });
}