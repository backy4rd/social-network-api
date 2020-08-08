const express = require('express');

const notificationController = require('../controllers/notificationController');

const validateMiddleware = require('../middlewares/validateMiddleware');

const router = express.Router();

// get own notification
router.get(
  '/',
  validateMiddleware.authorize,
  notificationController.getNotification,
);

module.exports = router;
