const { Sequelize } = require('sequelize');
require('dotenv').config();

const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_DIALECT } = process.env;

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: DB_DIALECT,
  define: {

  },
});

async function testDatabaseConnection() 
{
  try 
  {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
  } 
  catch (error) 
  {
    console.error('Unable to connect to the database:', error);
  }
}

async function syncDatabase() 
{
  await sequelize.sync({ alter: true }); 
  console.log('Database models synchronized.');
}

module.exports = sequelize;

testDatabaseConnection();
syncDatabase();