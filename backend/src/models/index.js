const Sequelize = require('sequelize');
const sequelize = require('../config/database');

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require('./user')(sequelize, Sequelize.DataTypes);
db.Project = require('./project')(sequelize, Sequelize.DataTypes);
db.Task = require('./task')(sequelize, Sequelize.DataTypes);
db.TimeEntry = require('./timeEntry')(sequelize, Sequelize.DataTypes);
db.Comment = require('./comment')(sequelize, Sequelize.DataTypes);

Object.values(db)
  .filter((model) => typeof model.associate === 'function')
  .forEach((model) => model.associate(db));

module.exports = db;

