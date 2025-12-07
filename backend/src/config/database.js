const { Sequelize } = require('sequelize');
const path = require('path');

// Always use SQLite in this training project.
// No environment configuration is needed beyond the storage file path.
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../../database.sqlite'),
  logging: false,
});

module.exports = sequelize;

