const db = require('../db');
const bcrypt = require('bcryptjs');

class Company 
{
  constructor(companyData) 
  {
    this.data = companyData;
  }

  async save() 
  {
    const { name, email, password, telephone, description, country } = this.data;

    if (!name || !description || !country || !telephone || !email || !password) 
    {
      return Promise.reject({ message: 'Please provide all the required information for the new company.' });
    }

    const emailCount = await this.checkEmailAvailability(email);
    if (emailCount > 0) 
    {
      return Promise.reject({ message: 'The provided email address is already in use.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const sql = `
      INSERT INTO company (name, description, country, telephone, email, password)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const values = [name, description, country, telephone, email, hashedPassword];
    await db.query(sql, values);
    return { message: 'Company data inserted successfully.' };
  }

  static async findById(id) 
  {
    const sql = 'SELECT * FROM company WHERE id = ?';
    const values = [id];
    const result = await db.query(sql, values);

    if (result.length === 0) 
    {
      return Promise.reject({ message: 'Company not found' });
    }

    const { password, ...newRow } = result[0];
    return newRow;
  }

  static async findAll() 
  {
    const sql = 'SELECT * FROM company';
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
      if (key === 'id' || key === 'telephone') 
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

    const updateSql = `UPDATE company SET ${sql} WHERE id = ?`;
    await db.query(updateSql, values);
    return { message: 'Company data updated successfully.' };
  }

  static async remove(id) 
  {
    const sql = 'DELETE FROM company WHERE id = ?';
    const values = [id];

    await db.query(sql, values);
    return { message: `Company with ID ${id} was successfully deleted` };
  }

  async checkEmailAvailability(email) 
  {
    const sql = 'SELECT COUNT(*) AS emailCount FROM company WHERE email = ?';
    const values = [email];
    const result = await db.query(sql, values);

    return result[0].emailCount;
  }

  static async authenticate(email, password) 
  {
    const sql = `SELECT password FROM company WHERE email = ?`;
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

module.exports = Company;
