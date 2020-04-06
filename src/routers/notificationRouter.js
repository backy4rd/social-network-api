const express = require('express');
const cookieParser = require('cookie-parser');

const notificationController = require('../controllers/notificationController');

const validateMiddleware = require('../middlewares/validateMiddleware');

const router = express.Router();

router.use(cookieParser());

// get own notification
router.get(
  '/',
  validateMiddleware.authorize,
  notificationController.getNotification,
);

module.exports = router;
