const bcrypt = require('bcryptjs');
const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../db/sequelize');
const jwt = require('jsonwebtoken');
const secretKey = '5Gf6R7Cz$T6aV3PwYbB9qZrGw*HnMxJ1sK3vL8s$VdKfNjQsThWmZp3s6v9yB';

const User = sequelize.define('user', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  surname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    isEmail: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isAdmin: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
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
    tableName: 'user',
});

User.prototype.comparePassword = async function (password) 
{
  return bcrypt.compare(password, this.password);
};

User.prototype.hashPassword = async function (password)
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
  };
};

User.prototype.generateToken = function () {
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

module.exports = User;