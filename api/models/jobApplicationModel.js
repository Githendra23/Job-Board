const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../db/sequelize');

const JobApplication = sequelize.define('JobApplication', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  cv: DataTypes.BLOB,
  cover_letter: DataTypes.BLOB,
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'User',
      key: 'id',
      name: 'user_id'
    },
    unique: true
  },
  advertisement_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Advertisement',
      key: 'id',
      name: 'advertisement_id'
    },
  },
  employer_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Advertisement',
      key: 'employer_id',
      name: 'employer_id'
    },
  },
  company_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Advertisement',
      key: 'company_id',
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
  tableName: 'job_application',
});

module.exports = JobApplication;