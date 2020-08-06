module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define(
    'Notification',
    {
      owner: {
        type: DataTypes.STRING(32),
        allowNull: false,
        validate: {
          is: { args: /^[A-z0-9_.]+$/, msg: 'invalid username' },
          len: { args: [5, 32], msg: 'username length must around 5-32' },
        },
      },
      from: {
        type: DataTypes.STRING(32),
        allowNull: false,
        validate: {
          is: { args: /^[A-z0-9_.]+$/, msg: 'invalid username' },
          len: { args: [5, 32], msg: 'username length must around 5-32' },
        },
      },
      postId: {
        type: DataTypes.INTEGER,
        validate: { isInt: true },
      },
      commentId: {
        type: DataTypes.INTEGER,
        validate: { isInt: true },
      },
      action: {
        type: DataTypes.STRING(10),
        allowNull: false,
        validate: {
          is: /^(comment)|(like)$/,
        },
      },
      createdAt: {
        type: 'TIMESTAMP',
      },
    },
    { timestamps: false, underscored: true },
  );
  Notification.associate = function (models) {
    Notification.belongsTo(models.User, {
      foreignKey: 'from',
      sourceKey: 'username',
      targetKey: 'username',
    });

    Notification.belongsTo(models.Post, {
      foreignKey: 'postId',
      sourceKey: 'id',
      targetKey: 'id',
    });

    Notification.belongsTo(models.Comment, {
      foreignKey: 'commentId',
      sourceKey: 'id',
      targetKey: 'id',
    });
  };
  return Notification;
};
