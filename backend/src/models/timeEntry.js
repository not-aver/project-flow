module.exports = (sequelize, DataTypes) => {
  const TimeEntry = sequelize.define(
    'TimeEntry',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      taskId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'task_id',
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'user_id',
      },
      startTime: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'start_time',
      },
      endTime: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'end_time',
      },
      durationSeconds: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'duration_seconds',
      },
      note: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      tableName: 'time_entries',
      underscored: true,
      hooks: {
        beforeSave: (entry) => {
          if (entry.endTime && entry.startTime) {
            const diffMs = entry.endTime.getTime() - entry.startTime.getTime();
            entry.durationSeconds = Math.max(0, Math.round(diffMs / 1000));
          }
        },
      },
    }
  );

  TimeEntry.associate = (models) => {
    TimeEntry.belongsTo(models.Task, {
      foreignKey: 'taskId',
      as: 'task',
    });

    TimeEntry.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });
  };

  return TimeEntry;
};

