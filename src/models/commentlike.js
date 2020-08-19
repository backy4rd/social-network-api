const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class CommentLike extends Model {
    static associate(models) {
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

    commentId: {
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

  CommentLike.init(attributes, options);

  return CommentLike;
};
