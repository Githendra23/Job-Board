const mysql = require('mysql');

require('dotenv').config();

const dbPool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

function query(sql, values) 
{
    return new Promise((resolve, reject) => 
    {
        dbPool.query(sql, values, (error, results, fields) => {
            if (error) 
            {
                reject(error);
            } 
            else 
            {
                resolve(results);
            }
        });
    });
}

module.exports = {
    query,
};