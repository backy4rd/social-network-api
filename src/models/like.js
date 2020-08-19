const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Like extends Model {
    static associate(models) {
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
    }
  }

  const attributes = {
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
  };

  const options = {
    timestamps: true,
    updatedAt: false,
    underscored: true,
    sequelize: sequelize,
  };

  Like.init(attributes, options);

  return Like;
};
