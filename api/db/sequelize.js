const { Sequelize } = require('sequelize');

const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_DIALECT } = process.env;

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: DB_DIALECT,
  define: {},
});

async function testDatabaseConnection() 
{
  try 
  {
    await sequelize.authenticate();
    console.log('\x1b[32mDatabase connection has been established successfully.\x1b[0m');
  } 
  catch (error) 
  {
    console.error('\x1b[31mUnable to connect to the database:\x1b[0m', error);
  }
}

async function syncDatabase() 
{
  await sequelize.sync({ alter: true }); 
  console.log('\x1b[32mDatabase models synchronized.\x1b[0m');
}

module.exports = sequelize;

testDatabaseConnection();
syncDatabase();