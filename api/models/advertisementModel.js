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
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'User',
      key: 'id',
      name: 'user_id'
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