const bcrypt = require('bcryptjs');
const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../db/sequelize');
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.SECRET_KEY;

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
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    isEmail: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  company_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'company',
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

Employer.prototype.hashPassword = async function (password) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    return hashedPassword;
  }
  catch (error) {
    console.log(error);
  }
};

Employer.prototype.generateToken = function (role) {
  try {
    const token = jwt.sign(
      { id: this.id, email: this.email, role: role },
        SECRET_KEY,
      { expiresIn: '1h' }
    );

    return token;
  } 
  catch (err) {
    console.error(err);
    return null;
  }
};

Employer.prototype.getInfoFromToken = function (token) {
  try {
    const decoded = jwt.verify(token, SECRET_KEY);

    if (decoded) {
      const id = decoded.id;
      const email = decoded.email;
      const role = decoded.role;

      return { id, email, role };
    }

    return null;
  } 
  catch (err) {
    console.error(err);
    return null;
  }
};

module.exports = Employer;