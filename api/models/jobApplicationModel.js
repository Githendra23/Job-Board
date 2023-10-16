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
  candidate_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Candidate', // Assuming 'Candidate' is the name of your Candidate model
      key: 'id',
      name: 'candidate_id'
    },
  },
  advertisement_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Advertisement', // Assuming 'Advertisement' is the name of your Advertisement model
      key: 'id',
      name: 'company_id'
    },
  },
  company_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Company', // Assuming 'Company' is the name of your Company model
      key: 'id',
      name: 'advertisement_id'
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