const app = require('express')();
const mysql = require('mysql');
const PORT = 8080;

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

app.listen(
    PORT
);

/* --------------------- candidates --------------------- */

app.get('/api/advertisement/candidate/total', (req, res) => {
    db.query("SELECT count(*) FROM candidate", (error, result, fields) => {
        if (error) throw error;

        const TOTAL = result[0]['count(*)'];

        res.status(200).json( TOTAL );
    });
});

app.get('/api/advertisement/candidate', (req, res) => {
    db.query("SELECT * FROM candidate", (error, result, fields) => {
        if (error) throw error;

        const CANDIDATES = result.map(row => ({ ...row }));

        res.status(200).json( CANDIDATES );
    });
});

app.get('/api/advertisement/candidate/:id', (req, res) => {
    const { id } = req.params;

    db.query("SELECT * FROM candidate WHERE id = ?", [id], (error, result, fields) => {
        if (error) throw error;

        const CANDIDATE = result.map(row => ({ ...row }));

        res.status(200).json( CANDIDATE );
    });
});

/* --------------------- companies --------------------- */

app.get('/api/advertisement/company/total', (req, res) => {
    db.query("SELECT count(*) FROM company", (error, result, fields) => {
        if (error) throw error;

        const TOTAL = result[0]['count(*)'];

        res.status(200).json( TOTAL );
    });
});

app.get('/api/advertisement/company', (req, res) => {
    db.query("SELECT * FROM company", (error, result, fields) => {
        if (error) throw error;

        const COMPANIES = result.map(row => ({ ...row }));

        res.status(200).json( COMPANIES );
    });
});

app.get('/api/advertisement/company/:id', (req, res) => {
    const { id } = req.params;

    db.query("SELECT * FROM candidate WHERE id = ?", [id], (error, result, fields) => {
        if (error) throw error;

        const CANDIDATE = result.map(row => ({ ...row }));

        res.status(200).json( CANDIDATE );
    });
});