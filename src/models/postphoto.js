const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PostPhoto extends Model {
    static associate(models) {
      PostPhoto.belongsTo(models.Post, {
        foreignKey: 'postId',
        sourceKey: 'id',
        targetKey: 'id',
      });
    }
  }

  const attributes = {
    postId: { type: DataTypes.INTEGER, validate: { isInt: true } },
    photo: { type: DataTypes.STRING(128), unique: true },
  };

  const options = {
    timestamps: false,
    underscored: true,
    sequelize: sequelize,
  };

  PostPhoto.init(attributes, options);

  return PostPhoto;
};
