const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../db/sequelize');

const Advertisement = sequelize.define('Advertisement', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  employmentContractType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  wage: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  tag: DataTypes.STRING,
  company_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Company',
      key: 'id',
      name: 'company_id'
    },
  },
  employer_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Employer',
      key: 'id',
      name: 'employer_id'
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
  tableName: 'advertisement',
});

module.exports = Advertisement;