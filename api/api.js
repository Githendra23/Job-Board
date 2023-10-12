const express = require('express');
const app = express();
const cors = require('cors');
const mysql = require('mysql');
const bcrypt = require('bcryptjs');
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
    if (err) 
    {
        console.log('Database offline');
        process.exit(1);
    }
    console.log("Connected!");
});

app.listen(PORT);

const table = ['candidate', 'company', 'employer', 'advertisement', 'job_application'];

/* ---------------------------- GET ---------------------------- */

for (const tableName of table)
{
    app.get(`/api/work_trailer/${tableName}/total`, (req, res) => {
        db.query(`SELECT count(*) FROM ${tableName}`, (error, result, fields) => {
            if (error) 
            {
                return res.status(500).send({ message: error })
            }

            const TOTAL = result[0]['count(*)'];

            return res.status(200).json( TOTAL );
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
    
            return res.status(200).json(data);
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

            return res.status(200).json( data );
        });
    });
}

/* ---------------------------- POST CREATE ---------------------------- */

app.post(`/api/work_trailer/${table[0]}/add`, async (req, res) => {
    const { name, surname, age, address, country, telephone, email, password } = req.body;

    if (!name || !surname || !age || !address || !country || !telephone || !email || !password) 
    {
        return res.status(400).json({ message: 'You need to provide all the information of the new candidate!' });
    } 

    const accountExists = await isAccountExist(table[0], email);
    if (accountExists) 
    {
        return res.status(409).json({ message: `The email has been used.` });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const sql = `INSERT INTO ${table[0]} (name, surname, age, address, country, telephone, email, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [name, surname, age, address, country, telephone, email, hashedPassword];

    db.query(sql, values, (error, result, fields) => {
        if (error) 
        {
            console.log(error);
            return res.status(500).json({ message: 'An error occurred while hashing the password.' });
        }
        return res.status(200).json({ message: `${table[0]} data inserted successfully.` });
    });
});

app.post(`/api/work_trailer/${table[1]}/add`, async (req, res) => {
    const { name, email, password, telephone, description, country } = req.body;

    if (!name || !description || !country || !telephone || !email || !password)
    {
        return res.status(400).json({ message: 'You need to provide all the information of the new candidate!' });
    }

    const accountExists = await isAccountExist(table[1], email);
    if (accountExists) 
    {
        return res.status(409).send({ message: `The email has been used.` });
    } 
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const sql = `INSERT INTO ${table[1]} (name, description, country, telephone, email, password) VALUES (?, ?, ?, ?, ?, ?)`;
    const values = [name, description, country, telephone, email, hashedPassword];

    db.query(sql, values, (error, result, fields) => {
        if (error)
        {
            console.log(error);
            return res.status(500).json({ message: 'An error occurred while hashing the password.' });
        }
        return res.status(200).json({ message: `${table[1]} data inserted successfully.` });
    });
});

app.post(`/api/work_trailer/${table[2]}/add`, async (req, res) => {
    const { name, surname, telephone, email, password, company_id } = req.body;

    if (!name || !surname || !telephone || !email || !password || !company_id) 
    {
        return res.status(400).json({ message: 'You need to provide all the information of the new employer!' });
    } 

    const accountExists = await isAccountExist(table[2], email);
    if (accountExists) 
    {
        return res.status(409).send({ message: `The email has been used.` });
    } 

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const sql = `INSERT INTO ${table[2]} (name, surname, telephone, email, password, company_id) VALUES (?, ?, ?, ?, ?, ?)`;
    const values = [name, surname, telephone, email, hashedPassword, company_id];

    db.query(sql, values, (error, result, fields) => {
        if (error) 
        {
            console.log(error);
            return res.status(500).json({ message: 'An error occurred while hashing the password.' });
        } 

        return res.status(200).json({ message: `${table[2]} data inserted successfully.` });
    });
});

app.post(`/api/work_trailer/${table[3]}/add`, (req, res) => {
    const { title, description, address, employment_contact_type, country, wage, tag, company_id } = req.body;

    if (!title || !description || !address || !employment_contact_type || !country || !wage || !company_id)
    {
        return res.status(400).json({ message: 'You need to provide all the information of the new candidate!' });
    }

    const sql = `INSERT INTO ${table[3]} (title, description, address, employment_contact_type, country, wage, tag, company_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [title, description, address, employment_contact_type, country, wage];

    db.query(sql, values, (error, result, fields) => {
        if (error)
        {
            console.log(error);
            return res.status(500).json({ message: 'An error occurred while adding a new advertisement.' });
        }

        return res.status(200).json({ message: `${table[3]} data inserted successfully.` });
    });
});

app.post(`/api/work_trailer/${table[4]}/add`, (req, res) => {
    const { candidate_id, advertisement_id, advertisement_company_id, cv, cover_letter } = req.body;

    if (!candidate_id || !advertisement_id || !advertisement_company_id || !cv || !cover_letter)
    {
        return res.status(400).json({ message: 'You need to provide all the information of the new candidate!' });
    }

    const sql = `INSERT INTO ${table[4]} (candidate_id, advertisement_id, advertisement_company_id, cv, cover_letter) VALUES (?, ?, ?, ?, ?)`;
    const values = [candidate_id, advertisement_id, advertisement_company_id, cv, cover_letter];

    db.query(sql, values, (error, result, fields) => {
        if (error)
        {
            console.log(error);
            return res.status(500).json({ message: 'An error occurred while adding a new job application.' });
        }

        return res.status(200).json({ message: `${table[4]} data inserted successfully.` });
    });
});

/* ---------------------------- UPDATE ---------------------------- */
for (const tableName of table) 
{
    app.post(`/api/work_trailer/${tableName}/update/:id`, (req, res) => {
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

        db.query(`UPDATE ${tableName} SET ${sql} WHERE id = ${id}`, (error, result, fields) => {
            if (error) 
            {
                console.log(error);
                return res.status(500).json({ message: 'An error occurred while updating.' });
            } 

                return res.status(200).json({ message: `${tableName} data updated successfully.` });
        });
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
                console.log(error);
                return res.status(500).json({ message: 'An error occurred while deleting.' });
            }

            return res.status(200).send({ message: `id ${id} was succesfully deleted`});
        });
    });
}

/* ---------------------------- VERIFY AUTHENTICATION ---------------------------- */

for (let i = 0; i < 3; i++) 
{
    const tableName = table[i];

    app.post(`/api/work_trailer/${tableName}/verify/:id`, async (req, res) => {
        const { id } = req.params;
        const { password } = req.body;
    
        db.query(`SELECT password FROM ${tableName} WHERE id = ?`, [id], async (error, result, fields) => {
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
}

/* ---------------------------- FUNCTIONS ---------------------------- */

async function isAccountExist(tableName, email) 
{
    return new Promise((resolve, reject) => {
        let sql = `SELECT COUNT(*) AS emailCount FROM ${tableName} WHERE email = ?`;
        let values = [email];

        db.query(sql, values, (error, result, fields) => {
            if (error) 
            {
                reject(error);
            }
            else 
            {
                const emailCount = result[0].emailCount;
                resolve(emailCount > 0);
            }
        });
    });
}