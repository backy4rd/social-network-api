const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    static associate(models) {
      Notification.belongsTo(models.User, {
        foreignKey: 'from',
        sourceKey: 'username',
        targetKey: 'username',
      });

      Notification.belongsTo(models.Post, {
        foreignKey: 'postId',
        sourceKey: 'id',
        targetKey: 'id',
      });

      Notification.belongsTo(models.Comment, {
        foreignKey: 'commentId',
        sourceKey: 'id',
        targetKey: 'id',
      });
    }
  }

  const attributes = {
    owner: {
      type: DataTypes.STRING(32),
      allowNull: false,
      validate: {
        is: { args: /^[A-z0-9_.]+$/, msg: 'invalid username' },
        len: { args: [5, 32], msg: 'username length must around 5-32' },
      },
    },

    from: {
      type: DataTypes.STRING(32),
      allowNull: false,
      validate: {
        is: { args: /^[A-z0-9_.]+$/, msg: 'invalid username' },
        len: { args: [5, 32], msg: 'username length must around 5-32' },
      },
    },

    postId: {
      type: DataTypes.INTEGER,
      validate: { isInt: true },
    },

    commentId: {
      type: DataTypes.INTEGER,
      validate: { isInt: true },
    },

    action: {
      type: DataTypes.STRING(10),
      allowNull: false,
      validate: {
        is: /^(comment)|(like)$/,
      },
    },
  };

  const options = {
    timestamps: true,
    updatedAt: false,
    underscored: true,
    sequelize: sequelize,
  };

  Notification.init(attributes, options);

  return Notification;
};
