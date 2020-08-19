const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    static associate(models) {
      Post.belongsTo(models.User, {
        foreignKey: 'createdBy',
        sourceKey: 'username',
        targetKey: 'username',
      });

      Post.hasMany(models.Comment, {
        foreignKey: 'postId',
        sourceKey: 'id',
      });

      Post.hasMany(models.PostPhoto, {
        foreignKey: 'postId',
        sourceKey: 'id',
        as: 'photos',
      });

      Post.hasMany(models.Like, {
        foreignKey: 'postId',
        sourceKey: 'id',
      });
    }
  }

  const attributes = {
    createdBy: {
      type: DataTypes.STRING(32),
      allowNull: false,
      validate: {
        is: { args: /^[A-z0-9_.]+$/, msg: 'invalid username' },
        len: { args: [5, 32], msg: 'username length must around 5-32' },
      },
    },

    content: {
      type: DataTypes.STRING(1024) + ' CHARSET utf8 COLLATE utf8_unicode_ci',
    },

    status: {
      type: DataTypes.STRING(10),
      defaultValue: 'public',
      allowNull: false,
      validate: {
        is: {
          args: /^(public)|(friend)|(private)$/,
          msg: 'status only be public, friend and private',
        },
      },
    },

    like: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false,
      validate: {
        isInt: true,
      },
    },
  };

  const options = {
    underscored: true,
    sequelize: sequelize,
  };

  Post.init(attributes, options);

  return Post;
};
