module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define(
    'Task',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: 'TODO',
        validate: {
          isIn: [['TODO', 'IN_PROGRESS', 'DONE']],
        },
      },
      position: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      projectId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'project_id',
      },
      assigneeId: {
        type: DataTypes.UUID,
        allowNull: true,
        field: 'assignee_id',
      },
    },
    {
      tableName: 'tasks',
      underscored: true,
    }
  );

  Task.associate = (models) => {
    Task.belongsTo(models.Project, {
      foreignKey: 'projectId',
      as: 'project',
    });

    Task.belongsTo(models.User, {
      foreignKey: 'assigneeId',
      as: 'assignee',
    });

    Task.hasMany(models.Comment, {
      foreignKey: 'taskId',
      as: 'comments',
    });

    Task.hasMany(models.TimeEntry, {
      foreignKey: 'taskId',
      as: 'timeEntries',
    });
  };

  return Task;
};

