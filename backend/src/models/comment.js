module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define(
    'Comment',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      text: {
        type: DataTypes.TEXT,
        allowNull: false,
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
    },
    {
      tableName: 'comments',
      underscored: true,
    }
  );

  Comment.associate = (models) => {
    Comment.belongsTo(models.Task, {
      foreignKey: 'taskId',
      as: 'task',
    });

    Comment.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });
  };

  return Comment;
};

