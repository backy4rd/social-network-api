module.exports = (sequelize, DataTypes) => {
  const Friend = sequelize.define(
    'Friend',
    {
      userA: {
        type: DataTypes.STRING(32),
        primaryKey: true,
        validate: {
          is: { args: /^[A-z0-9_.]+$/, msg: 'invalid username' },
          len: { args: [5, 32], msg: 'username length must around 5-32' },
        },
      },
      userB: {
        type: DataTypes.STRING(32),
        primaryKey: true,
        validate: {
          is: { args: /^[A-z0-9_.]+$/, msg: 'invalid username' },
          len: { args: [5, 32], msg: 'username length must around 5-32' },
        },
      },
      status: {
        type: DataTypes.STRING(10),
        allowNull: false,
        validate: {
          is: {
            args: /^(pending)|(sent)|(friend)|(blocked)$/,
            msg: 'invalid friend status',
          },
        },
      },
    },
    { underscored: true },
  );

  Friend.associate = function (models) {
    Friend.belongsTo(models.User, {
      foreignKey: 'userB',
      sourceKey: 'username',
      targetKey: 'username',
    });
  };

  return Friend;
};
