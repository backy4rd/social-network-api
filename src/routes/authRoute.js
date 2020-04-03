const express = require('express');
const cookieParser = require('cookie-parser');

const authController = require('../controllers/authController');

const validateMiddleware = require('../middlewares/validateMiddleware');

const mySession = require('../utils/mySession');

const route = express.Router();

route.use(express.json());
route.use(express.urlencoded({ extended: false }));
route.use(cookieParser());

// register
route.post('/register', authController.register);

// login
route.post('/login', authController.login);

// verify account
route.get('/verify', authController.verifyVerificationMail);

// reset password
route.post(
  '/resetPassword',
  mySession('forgotCode'),
  authController.resetPassword,
);

// send verification mail
route.get(
  '/sendMail',
  validateMiddleware.validateAccessToken,
  authController.sendVerificationMail,
);

// send forgot password mail
route.get(
  '/sendForgotMail',
  mySession('forgotCode', { expire: 4 * 1000 }),
  authController.sendForgotMail,
);

module.exports = route;
