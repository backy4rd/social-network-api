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
