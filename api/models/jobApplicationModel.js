const handleDB = require('../db_operation');

class JobApplication 
{
  static async getAll() 
  {
    const sql = 'SELECT * FROM job_application';
    return handleDB.operation(sql);
  }

  static async getById(id) 
  {
    const sql = 'SELECT * FROM job_application WHERE id = ?';
    const values = [id];

    return handleDB.operation(sql, values);
  }

  static async create(jobApplicationData) 
  {
    const { candidate_id, advertisement_id, advertisement_company_id, cv, cover_letter } = jobApplicationData;
    
    if (!candidate_id || !advertisement_id || !advertisement_company_id || !cv || !cover_letter) 
    {
      return Promise.reject({ message: 'You need to provide all the information of the new candidate!' });
    }

    const sql = 'INSERT INTO job_application (candidate_id, advertisement_id, advertisement_company_id, cv, cover_letter) VALUES (?, ?, ?, ?, ?)';
    const values = [candidate_id, advertisement_id, advertisement_company_id, cv, cover_letter];
    
    return handleDB.operation(sql, values, 'Job application data inserted successfully.');
  }

  static async update(id, data) 
  {
    if (!data) 
    {
      return Promise.reject({ message: 'You need to provide data to update the database!' });
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

      sql += numberOfKeys > 1 ? ', ' : '';
      numberOfKeys--;
    }

    const updateSql = `UPDATE job_application SET ${sql} WHERE id = ?`;

    return handleDB.operation(updateSql, values, 'Job application data updated successfully.');
  }

  static async delete(id) 
  {
    const sql = 'DELETE FROM job_application WHERE id = ?';
    const values = [id];
    
    return handleDB.operation(sql, values, `ID ${id} was successfully deleted`);
  }
}

module.exports = JobApplication;