module.exports = (sequelize, DataTypes) => {
  const Friend = sequelize.define(
    'Friend',
    {
      userA: {
        type: DataTypes.STRING,
        primaryKey: true,
        validate: {
          is: { args: /^[A-z0-9_.]+$/, msg: 'invalid username' },
          len: { args: [5, 32], msg: 'username length must around 5-32' },
        },
      },
      userB: {
        type: DataTypes.STRING,
        primaryKey: true,
        validate: {
          is: { args: /^[A-z0-9_.]+$/, msg: 'invalid username' },
          len: { args: [5, 32], msg: 'username length must around 5-32' },
        },
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          is: {
            args: /^(pending)|(sent)|(friend)|(blocked)$/,
            msg: 'invalid friend status',
          },
        },
      },
    },
    {},
  );

  Friend.associate = function (models) {
    Friend.belongsTo(models.User, {
      foreignKey: 'userA',
      sourceKey: 'username',
      targetKey: 'username',
    });
  };

  return Friend;
};
