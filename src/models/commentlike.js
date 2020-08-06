module.exports = (sequelize, DataTypes) => {
  const CommentLike = sequelize.define(
    'CommentLike',
    {
      liker: {
        type: DataTypes.STRING(32),
        primaryKey: true,
        validate: {
          is: { args: /^[A-z0-9_.]+$/, msg: 'invalid username' },
          len: { args: [5, 32], msg: 'username length must around 5-32' },
        },
      },
      commentId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        validate: { isInt: true },
      },
      createdAt: {
        type: 'TIMESTAMP',
      },
    },
    { timestamps: false, underscored: true },
  );
  CommentLike.associate = function (models) {
    CommentLike.belongsTo(models.User, {
      foreignKey: 'liker',
      sourceKey: 'username',
      targetKey: 'username',
    });

    CommentLike.belongsTo(models.Comment, {
      foreignKey: 'commentId',
      sourceKey: 'id',
      targetKey: 'id',
    });
  };
  return CommentLike;
};
