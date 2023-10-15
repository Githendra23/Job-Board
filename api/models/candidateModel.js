const db = require('../db');
const bcrypt = require('bcryptjs');

class Candidate 
{
  constructor(candidateData) 
  {
    this.data = candidateData;
  }

  async save() 
  {
    const { name, surname, age, address, country, telephone, email, password } = this.data;
    
    if (!name || !surname || !age || !address || !country || !telephone || !email || !password) 
    {
      return Promise.reject({ message: 'Please provide all the required information for the new candidate.' });
    }

    const emailCount = await this.checkEmailAvailability(email);
    if (emailCount > 0) 
    {
      return Promise.reject({ message: 'The provided email has already been used.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const sql = `
      INSERT INTO candidate (name, surname, age, address, country, telephone, email, password)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [name, surname, age, address, country, telephone, email, hashedPassword];
    await db.query(sql, values);
    return { message: 'Candidate data inserted successfully.' };
  }

  static async findById(id) 
  {
    const sql = 'SELECT * FROM candidate WHERE id = ?';
    const values = [id];
    const result = await db.query(sql, values);

    if (result.length === 0) 
    {
      return Promise.reject({ message: 'Candidate not found' });
    }

    return result[0];
  }

  static async findAll() 
  {
    const sql = 'SELECT * FROM candidate';
    return db.query(sql);
  }

  static async update(id, data) 
  {
    const numberOfKeys = Object.keys(data).length;
    let sql = '';
    let values = [id];

    for (const key in data) 
    {
        if (key === 'id' || key === 'age' || key === 'telephone') 
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

    const updateSql = `UPDATE candidate SET ${sql} WHERE id = ?`;
    const result = await handleDB.asyncOperation(res, updateSql, values);

    return result;
  }

  static async remove(id) 
  {
    const sql = 'DELETE FROM candidate WHERE id = ?';
    const values = [id];

    const result = await handleDB.asyncOperation(res, sql, values);
    return result;
  }

  async checkEmailAvailability(email) 
  {
    const sql = 'SELECT COUNT(*) AS emailCount FROM candidate WHERE email = ?';
    const values = [email];
    const result = await db.query(sql, values);
    return result[0].emailCount;
  }

  static async authenticate(email, password) 
  {
    const sql = `SELECT password FROM candidate WHERE email = ?`;
    const values = [email];
    const result = await db.query(sql, values);

    if (result.length === 0) 
    {
      return false;
    }

    const hashedPassword = result[0].password;
    return bcrypt.compare(password, hashedPassword);
  }
}

module.exports = Candidate;