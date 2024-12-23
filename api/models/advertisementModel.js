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
  country: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  employment_contract_type: {
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
      model: 'employer',
      key: 'company_id',
      name: 'company_id'
    },
  },
  employer_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'employer',
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