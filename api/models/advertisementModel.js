const handleDB = require('../db_operation');

class Advertisement 
{
    static async getAll() 
    {
        const sql = 'SELECT * FROM advertisement';
        const result = await handleDB.asyncOperation(sql);

        if (result) 
        {
            const data = result.map(row => {
                const { password, ...newRow } = row;
                return newRow;
            });

            return data.length === 0 ? null : data;
        }

        return null;
    }

    static async getById(id) 
    {
        const sql = 'SELECT * FROM advertisement WHERE id = ?';
        const values = [id];
        const result = await handleDB.asyncOperation(sql, values);

        if (result) 
        {
            return result.length === 0 ? null : result[0];
        }

        return null;
    }

    static async create(advertisementData) 
    {
        const { title, description, address, employment_contact_type, country, wage, tag, company_id } = advertisementData;

        if (!title || !description || !address || !employment_contact_type || !country || !wage || !company_id) 
        {
            return null;
        }

        const sql = `INSERT INTO advertisement (title, description, address, employment_contact_type, country, wage, tag, company_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        const values = [title, description, address, employment_contact_type, country, wage, tag, company_id];

        return handleDB.asyncOperation(sql, values);
    }

    static async update(id, data) 
    {
        if (!data) 
        {
            return null;
        }

        const numberOfKeys = Object.keys(data).length;
        let sql = `UPDATE advertisement SET `;
        let values = [];

        for (const key in data) 
        {
            sql += `${key} = ?`;
            values.push(data[key]);
            sql += numberOfKeys > 1 ? ', ' : ' ';
            numberOfKeys--;
        }

        sql += `WHERE id = ?`;
        values.push(id);

        return handleDB.asyncOperation(sql, values);
    }

    static async delete(id) 
    {
        const sql = 'DELETE FROM advertisement WHERE id = ?';
        const values = [id];

        return handleDB.asyncOperation(sql, values);
    }
}

module.exports = Advertisement;