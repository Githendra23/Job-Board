const bcrypt = require('bcryptjs');
const db = require('../db');

class Employer 
{
  constructor(employerData) 
  {
    this.data = employerData;
  }

  async save() 
  {
    const { name, surname, telephone, email, password, company_id } = this.data;

    if (!name || !surname || !telephone || !email || !password || !company_id) 
    {
      return Promise.reject({ message: 'Please provide all required information for the new employer.' });
    }

    const emailCount = await this.checkEmailAvailability(email);
    if (emailCount > 0) 
    {
      return Promise.reject({ message: 'The provided email address is already in use.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const sql = `
      INSERT INTO employer (name, surname, telephone, email, password, company_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const values = [name, surname, telephone, email, hashedPassword, company_id];
    await db.query(sql, values);
    return { message: 'Employer data inserted successfully.' };
  }

  static async findById(id) 
  {
    const sql = 'SELECT * FROM employer WHERE id = ?';
    const values = [id];
    const result = await db.query(sql, values);

    if (result.length === 0) 
    {
      return Promise.reject({ message: 'Resource not found' });
    }

    const { password, ...newRow } = result[0];
    return newRow;
  }

  static async findAll() 
  {
    const sql = 'SELECT * FROM employer';
    const results = await db.query(sql);
    const data = results.map(row => {
      const { password, ...newRow } = row;
      return newRow;
    });
    return data;
  }

  static async update(id, data) 
  {
    const numberOfKeys = Object.keys(data).length;
    let sql = '';
    let values = [id];

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

      sql += numberOfKeys > 1 ? ', ' : '';
      numberOfKeys--;
    }

    const updateSql = `UPDATE employer SET ${sql} WHERE id = ?`;
    await db.query(updateSql, values);
    return { message: 'Employer data updated successfully.' };
  }

  async checkEmailAvailability(email) 
  {
    const sql = 'SELECT COUNT(*) AS emailCount FROM employer WHERE email = ?';
    const values = [email];
    const result = await db.query(sql, values);

    return result[0].emailCount;
  }

  static async authenticate(email, password) 
  {
    const sql = `SELECT password FROM employer WHERE email = ?`;
    const values = [email];
    const result = await db.query(sql, values);

    if (result.length === 0) 
    {
      return false;
    }

    const hashedPassword = result[0].password;
    return bcrypt.compare(password, hashedPassword);
  }

  static async remove(id) 
  {
    const sql = 'DELETE FROM employer WHERE id = ?';
    const values = [id];
    
    await db.query(sql, values);
    return { message: `Employer with ID ${id} was successfully deleted` };
  }
}

module.exports = Employer;