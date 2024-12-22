const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../db/sequelize');

const JobApplication = sequelize.define('JobApplication', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  cv: {
    type: Sequelize.DataTypes.BLOB('medium'), // Use 'medium' for BlobLength
  },
  cover_letter: {
    type: Sequelize.DataTypes.BLOB('medium'), // Use 'medium' for BlobLength
  },
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'user',
      key: 'id',
      name: 'user_id'
    },
  },
  advertisement_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'advertisement',
      key: 'id',
      name: 'advertisement_id'
    },
  },
  employer_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'advertisement',
      key: 'employer_id',
      name: 'employer_id'
    },
  },
  company_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'advertisement',
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