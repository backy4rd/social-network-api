const express = require('express');
const cookieParser = require('cookie-parser');

const authController = require('../controllers/authController');

const validateMiddleware = require('../middlewares/validateMiddleware');

const route = express.Router();

route.use(express.json());
route.use(express.urlencoded({ extended: false }));
route.use(cookieParser());

route.post('/register', authController.register);
route.post('/login', authController.login);
route.get('/verify', authController.verifyVerificationMail);
route.get(
  '/sendMail',
  validateMiddleware.validateAccessToken,
  authController.sendVerificationMail,
);

module.exports = route;
