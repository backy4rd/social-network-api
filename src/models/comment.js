module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define(
    'Comment',
    {
      postId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: true,
        },
      },
      createdBy: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          is: /^[A-z0-9_.]+$/,
        },
      },
      content: { type: DataTypes.STRING },
      like: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
        validate: {
          isInt: true,
        },
      },
      replyOf: { type: DataTypes.INTEGER, validate: { isInt: true } },
    },
    {},
  );
  Comment.associate = function (models) {
    Comment.belongsTo(models.User, {
      foreignKey: 'createdBy',
      sourceKey: 'username',
      targetKey: 'username',
    });

    Comment.belongsTo(models.Post, {
      foreignKey: 'postId',
      sourceKey: 'id',
      targetKey: 'id',
    });

    Comment.belongsTo(Comment, {
      foreignKey: 'replyOf',
      sourceKey: 'id',
      targetKey: 'id',
    });
  };
  return Comment;
};
