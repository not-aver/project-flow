const { Sequelize } = require('sequelize');
const path = require('path');

// In production (Render), use /opt/render/project/src/database.sqlite
// In development, use relative path
const isProduction = process.env.NODE_ENV === 'production';
const dbPath = isProduction 
  ? '/opt/render/project/src/database.sqlite'
  : path.join(__dirname, '../../database.sqlite');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath,
  logging: false,
});

module.exports = sequelize;

