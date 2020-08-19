const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Friend extends Model {
    static associate(models) {
      Friend.belongsTo(models.User, {
        foreignKey: 'userB',
        sourceKey: 'username',
        targetKey: 'username',
      });
    }
  }

  const attributes = {
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
  };

  const options = { underscored: true, sequelize: sequelize };

  Friend.init(attributes, options);

  return Friend;
};
