const express = require('express');
const cookieParser = require('cookie-parser');

const authController = require('../controllers/authController');

const validateMiddleware = require('../middlewares/validateMiddleware');

const mySession = require('../utils/mySession');

const route = express.Router();

route.use(express.json());
route.use(express.urlencoded({ extended: false }));
route.use(cookieParser());

route.post('/register', authController.register);
route.post('/login', authController.login);
route.post(
  '/resetPassword',
  mySession('forgotCode'),
  authController.resetPassword,
);
route.get('/verify', authController.verifyVerificationMail);
route.get(
  '/sendMail',
  validateMiddleware.validateAccessToken,
  authController.sendVerificationMail,
);
route.get(
  '/sendForgotMail',
  mySession('forgotCode', { expire: 4 * 1000 }),
  authController.sendForgotMail,
);

module.exports = route;
