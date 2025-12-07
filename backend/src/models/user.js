const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      passwordHash: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'password_hash',
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: 'users',
      underscored: true,
      hooks: {
        beforeCreate: async (user) => {
          if (user.passwordHash) {
            user.passwordHash = await bcrypt.hash(user.passwordHash, 10);
          }
        },
      },
    }
  );

  User.prototype.validatePassword = function validatePassword(password) {
    return bcrypt.compare(password, this.passwordHash);
  };

  User.associate = (models) => {
    User.hasMany(models.Project, {
      foreignKey: 'ownerId',
      as: 'ownedProjects',
    });

    User.hasMany(models.Task, {
      foreignKey: 'assigneeId',
      as: 'tasks',
    });

    User.hasMany(models.Comment, {
      foreignKey: 'userId',
      as: 'comments',
    });

    User.hasMany(models.TimeEntry, {
      foreignKey: 'userId',
      as: 'timeEntries',
    });
  };

  return User;
};

