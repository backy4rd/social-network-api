const express = require('express');
const cookieParser = require('cookie-parser');

const friendController = require('../controllers/friendController');

const validateMiddleware = require('../middlewares/validateMiddleware');
const finderMiddleware = require('../middlewares/finderMiddleware');

const router = express.Router();

router.use(cookieParser());
router.use(validateMiddleware.authorize);
router.use(finderMiddleware.findTarget);

// add friend
router.get(
  '/add',
  validateMiddleware.authorize,
  finderMiddleware.findTarget,
  friendController.addFriend,
);

// unfriend
router.get(
  '/breakup',
  validateMiddleware.authorize,
  finderMiddleware.findTarget,
  friendController.unfriend,
);

// decide friend request
router.get(
  '/decide',
  validateMiddleware.authorize,
  finderMiddleware.findTarget,
  friendController.decide,
);

// unsent friend request
router.get(
  '/unsent',
  validateMiddleware.authorize,
  finderMiddleware.findTarget,
  friendController.unsent,
);

module.exports = router;
