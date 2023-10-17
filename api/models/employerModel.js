const bcrypt = require('bcryptjs');
const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../db/sequelize');

const Employer = sequelize.define('Employer', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  surname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  telephone: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    isEmail: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  company_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Company',
      key: 'id',
      name: 'company_id'
    },
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    allowNull: false,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    allowNull: false,
  },
}, {
  tableName: 'employer',
});

Employer.prototype.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

Employer.prototype.hashPassword = async function (password)
{
  try
  {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    return hashedPassword;
  }
  catch (error)
  {
    console.log(error);
  }
};

Employer.prototype.generateToken = function () {
  try 
  {
    const token = jwt.sign(
      { userId: this.id, email: this.email },
      secretKey,
      { expiresIn: '1h' }
    );

    return token;
  } 
  catch (err) 
  {
    console.error(err);
    return null;
  }
};

module.exports = Employer;