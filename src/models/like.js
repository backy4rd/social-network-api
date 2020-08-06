module.exports = (sequelize, DataTypes) => {
  const Like = sequelize.define(
    'Like',
    {
      liker: {
        type: DataTypes.STRING(32),
        primaryKey: true,
        validate: {
          is: { args: /^[A-z0-9_.]+$/, msg: 'invalid username' },
          len: { args: [5, 32], msg: 'username length must around 5-32' },
        },
      },
      postId: {
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
  Like.associate = function (models) {
    Like.belongsTo(models.User, {
      foreignKey: 'liker',
      sourceKey: 'username',
      targetKey: 'username',
    });

    Like.belongsTo(models.Post, {
      foreignKey: 'postId',
      sourceKey: 'id',
      targetKey: 'id',
    });
  };
  return Like;
};
