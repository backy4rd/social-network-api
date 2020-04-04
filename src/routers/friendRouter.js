const express = require('express');
const cookieParser = require('cookie-parser');

const friendController = require('../controllers/friendController');

const validateMiddleware = require('../middlewares/validateMiddleware');
const finderMiddleware = require('../middlewares/finderMiddleware');

const router = express.Router();

router.use(cookieParser());
router.use(validateMiddleware.validateAccessToken);
router.use(finderMiddleware.findTarget);

// add friend
router.get(
  '/add',
  validateMiddleware.validateAccessToken,
  finderMiddleware.findTarget,
  friendController.addFriend,
);

// unfriend
router.get(
  '/breakup',
  validateMiddleware.validateAccessToken,
  finderMiddleware.findTarget,
  friendController.unfriend,
);

// decide friend request
router.get(
  '/decide',
  validateMiddleware.validateAccessToken,
  finderMiddleware.findTarget,
  friendController.decide,
);

// unsend friend request
router.get(
  '/unsend',
  validateMiddleware.validateAccessToken,
  finderMiddleware.findTarget,
  friendController.unsend,
);

module.exports = router;
