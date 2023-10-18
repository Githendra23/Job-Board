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
  advertisement_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Advertisement',
      key: 'id',
      name: 'company_id'
    },
  },
  company_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Company',
      key: 'id',
      name: 'advertisement_id'
    },
  },
  employer_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'User',
      key: 'id',
      name: 'employer_id'
    },
  },
  candidate_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'User',
      key: 'id',
      name: 'candidate_id'
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