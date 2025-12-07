module.exports = (sequelize, DataTypes) => {
  const Project = sequelize.define(
    'Project',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      ownerId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'owner_id',
      },
    },
    {
      tableName: 'projects',
      underscored: true,
    }
  );

  Project.associate = (models) => {
    Project.belongsTo(models.User, {
      foreignKey: 'ownerId',
      as: 'owner',
    });

    Project.hasMany(models.Task, {
      foreignKey: 'projectId',
      as: 'tasks',
    });
  };

  return Project;
};

