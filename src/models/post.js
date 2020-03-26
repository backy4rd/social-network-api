const url = require('url');

module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define(
    'Post',
    {
      createdBy: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          is: /^[A-z0-9_.]+$/,
        },
      },
      content: {
        type: DataTypes.STRING,
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

  Post.addHook('afterFind', posts => {
    const staticUrl = url.format({
      protocol: process.env.PROTOCOL || 'http',
      hostname: process.env.DOMAIN || 'localhost',
      port: process.env.DOMAIN ? undefined : process.env.PORT,
      pathname: '/static/',
    });

    if (!Array.isArray(posts)) {
      posts.photos.forEach(photo => {
        photo.dataValues.photo = staticUrl + photo.photo;
      });
    }

    posts.forEach(post => {
      post.photos.forEach(photo => {
        photo.dataValues.photo = staticUrl + photo.photo;
      });
    });
  });

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
  };
  return Post;
};
