const db = require('./db');

const asyncOperation = async (res, sql, values) => {
    try 
    {
        const result = await db.query(sql, values);
        return result;
    } 
    catch (error) 
    {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
        return null;
    }
};

const operation = (res, sql, values, successMessage) => {
    db.query(sql, values, (error, result, fields) => {
        if (error) 
        {
            console.log(error);
            return res.status(500).json({ message: 'An error occurred while processing the request.' });
        }

        if (successMessage) 
        {
            return res.status(200).json({ message: successMessage });
        }

        if (result.length === 0) 
        {
            return res.status(404).json({ message: 'Resource not found' });
        }

        const data = result.map(row => {
            const { password, ...newRow } = row;
            return newRow;
        });

        return res.status(200).json(data);
    });
}

module.exports = {
    asyncOperation,
    operation,
};