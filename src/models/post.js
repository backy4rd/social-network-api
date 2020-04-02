module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define(
    'Post',
    {
      createdBy: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          is: { args: /^[A-z0-9_.]+$/, msg: 'invalid username' },
          len: { args: [5, 32], msg: 'username length must around 5-32' },
        },
      },
      content: {
        type: DataTypes.STRING,
      },
      status: {
        type: DataTypes.STRING,
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
    },
    {},
  );

  Post.associate = function (models) {
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
  };
  return Post;
};
