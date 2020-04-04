const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      username: {
        type: DataTypes.STRING(32),
        primaryKey: true,
        validate: {
          is: { args: /^[A-z0-9_.]+$/, msg: 'invalid username' },
          len: { args: [5, 32], msg: 'username length must around 5-32' },
        },
      },
      password: {
        type: DataTypes.STRING(80),
        allowNull: false,
        validate: {
          not: { args: /\s/, msg: 'password can not contain white space' },
          len: { args: [6, 32], msg: 'password length must around 6-32' },
        },
      },
      fullName: {
        type: DataTypes.STRING(64) + ' CHARSET utf8 COLLATE utf8_unicode_ci',
        allowNull: false,
        validate: {
          is: { args: /^[A-z][A-z._\s]+[A-z]$/, msg: 'invalid name' },
          not: { args: /\s{2,}/, msg: 'invalid name' },
        },
      },
      female: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(64),
        allowNull: false,
        validate: {
          isEmail: { args: true, msg: 'invalid email' },
        },
      },
      avatar: {
        type: DataTypes.STRING(128),
        defaultValue: 'avatars/default.jpg',
        allowNull: false,
      },
      verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
    },
    {},
  );

  User.prototype.encryptPassword = async function () {
    const salt = parseInt(process.env.SALT_ROUND, 10);
    this.password = await bcrypt.hash(this.password, salt);
  };

  User.prototype.comparePassword = function (password) {
    const { password: encrypted } = this;
    return bcrypt.compare(password, encrypted);
  };

  User.prototype.generateAccessToken = function () {
    const payload = {
      username: this.username,
      email: this.email,
      fullName: this.fullName,
      verified: this.verified,
    };
    const secret = process.env.SECRET;
    const header = {
      expiresIn: '7d',
    };

    return new Promise((resolve, reject) => {
      jwt.sign(payload, secret, header, (err, token) => {
        if (err) reject(err);
        resolve(token);
      });
    });
  };

  User.prototype.generateVerificationToken = function () {
    const payload = {
      username: this.username,
      verify: true,
    };
    const secret = process.env.SECRET;
    const header = {
      expiresIn: '1d',
    };

    return new Promise((resolve, reject) => {
      jwt.sign(payload, secret, header, (err, token) => {
        if (err) reject(err);
        resolve(token);
      });
    });
  };

  User.associate = function (models) {
    User.hasMany(models.Post, {
      foreignKey: 'createdBy',
      sourceKey: 'username',
    });

    User.hasMany(models.Comment, {
      foreignKey: 'commenter',
      sourceKey: 'username',
    });

    User.hasMany(models.Friend, {
      foreignKey: 'userA',
      sourceKey: 'username',
    });
  };
  return User;
};
