require('dotenv').config();

module.exports = {
  development: {
    database: process.env.DB_DEV_NAME,
    username: process.env.DB_DEV_USER,
    password: process.env.DB_DEV_PASS,
    host: process.env.DB_DEV_HOST,
    dialect: 'mysql',
  },

  test: {
    database: null,
    username: null,
    password: null,
    host: '127.0.0.1',
    dialect: 'mysql',
  },

  production: {
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    host: process.env.DB_HOST,
    logging: false,
    dialect: 'mysql',
  },
};
