module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          is: /^[A-z0-9_.]+$/,
          len: [5, 32],
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      fullName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          is: /^[A-z0-9][A-z0-9._\s]+[A-z0-9]$/,
          not: /\s{2,}/,
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isEmail: true,
        },
      },
      verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
    },
    {},
  );

  User.prototype.validatePassword = function (user) {
    const { password } = user;
    if (/\s/.test(password)) {
      throw new Error('password contain white space');
    }
    if (password.length < 6) {
      throw new Error('password must longer than 5 character');
    }
  };

  User.associate = function (models) {
    User.hasMany(models.Post, {
      foreignKey: 'createdBy',
      sourceKey: 'username',
    });

    User.hasMany(models.Comment, {
      foreignKey: 'createdBy',
      sourceKey: 'username',
    });
  };
  return User;
};
