module.exports = (sequelize, DataTypes) => {
  const PostPhoto = sequelize.define(
    'PostPhoto',
    {
      postId: { type: DataTypes.INTEGER, validate: { isInt: true } },
      photo: { type: DataTypes.STRING(128), unique: true },
    },
    { timestamps: false, underscored: true },
  );
  PostPhoto.associate = function (models) {
    PostPhoto.belongsTo(models.Post, {
      foreignKey: 'postId',
      sourceKey: 'id',
      targetKey: 'id',
    });
  };
  return PostPhoto;
};
