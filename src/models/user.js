const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Model } = require('sequelize');

const vietnamese =
  '[A-zÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]';
const nameRegex = new RegExp(
  `^${vietnamese}(${vietnamese}|\\s)+${vietnamese}$`,
);

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    async encryptPassword() {
      const salt = parseInt(process.env.SALT_ROUND, 10);
      this.password = await bcrypt.hash(this.password, salt);
    }

    comparePassword(password) {
      const { password: encrypted } = this;
      return bcrypt.compare(password, encrypted);
    }

    generateAccessToken() {
      const payload = {
        username: this.username,
        email: this.email,
        firstName: this.firstName,
        lastName: this.lastName,
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
    }

    generateVerificationToken() {
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
    }

    static associate(models) {
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
    }
  }

  const attributes = {
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

    firstName: {
      type: DataTypes.STRING(64) + ' CHARSET utf8 COLLATE utf8_unicode_ci',
      allowNull: false,
      validate: {
        is: { args: nameRegex, msg: 'invalid firstName' },
        not: { args: /\s{2,}/, msg: 'invalid firstName' },
      },
    },

    lastName: {
      type: DataTypes.STRING(64) + ' CHARSET utf8 COLLATE utf8_unicode_ci',
      allowNull: false,
      validate: {
        is: { args: nameRegex, msg: 'invalid lastName' },
        not: { args: /\s{2,}/, msg: 'invalid lastName' },
      },
    },

    female: {
      type: DataTypes.BOOLEAN,
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
  };

  const options = {
    underscored: true,
    sequelize: sequelize,
  };

  User.init(attributes, options);

  return User;
};
