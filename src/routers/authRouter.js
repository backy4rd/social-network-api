const express = require('express');

const authController = require('../controllers/authController');

const validateMiddleware = require('../middlewares/validateMiddleware');

const mySession = require('../utils/mySession');

const router = express.Router();

router.use(express.json());
router.use(express.urlencoded({ extended: false }));

// register
router.post('/register', authController.register);

// login
router.post('/login', authController.login);

// login with google
router.get('/oauth/google', authController.OAuthGoogle);

// login with facebook
router.get('/oauth/facebook', authController.OAuthFacebook);

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
  validateMiddleware.authorize,
  authController.sendVerificationMail,
);

// send forgot password mail
router.get(
  '/sendForgotMail',
  mySession('forgotCode', { expire: 4 * 1000 }),
  authController.sendForgotMail,
);

module.exports = router;
