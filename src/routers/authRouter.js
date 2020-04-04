const express = require('express');
const cookieParser = require('cookie-parser');

const authController = require('../controllers/authController');

const validateMiddleware = require('../middlewares/validateMiddleware');

const mySession = require('../utils/mySession');

const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: false }));
router.use(cookieParser());

// register
router.post('/register', authController.register);

// login
router.post('/login', authController.login);

// verify account
router.get('/verify', authController.verifyVerificationMail);

// reset password
router.post(
  '/resetPassword',
  mySession('forgotCode'),
  authController.resetPassword,
);

// send verification mail
router.get(
  '/sendMail',
  validateMiddleware.validateAccessToken,
  authController.sendVerificationMail,
);

// send forgot password mail
router.get(
  '/sendForgotMail',
  mySession('forgotCode', { expire: 4 * 1000 }),
  authController.sendForgotMail,
);

module.exports = router;
