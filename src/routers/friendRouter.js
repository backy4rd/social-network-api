const express = require('express');
const cookieParser = require('cookie-parser');

const friendController = require('../controllers/friendController');

const validateMiddleware = require('../middlewares/validateMiddleware');
const finderMiddleware = require('../middlewares/finderMiddleware');
const checkerMiddleware = require('../middlewares/checkerMiddleware');

const router = express.Router();

router.use(cookieParser());
router.use(validateMiddleware.authorize);
router.use(finderMiddleware.findTarget);

// add friend
router.get(
  '/add',
  validateMiddleware.authorize,
  finderMiddleware.findTarget,
  checkerMiddleware.checkTargetExist,
  friendController.addFriend,
);

// unfriend
router.get(
  '/breakup',
  validateMiddleware.authorize,
  finderMiddleware.findTarget,
  checkerMiddleware.checkTargetExist,
  friendController.unfriend,
);

// decide friend request
router.get(
  '/decide',
  validateMiddleware.authorize,
  finderMiddleware.findTarget,
  checkerMiddleware.checkTargetExist,
  friendController.decide,
);

// unsent friend request
router.get(
  '/unsent',
  validateMiddleware.authorize,
  finderMiddleware.findTarget,
  checkerMiddleware.checkTargetExist,
  friendController.unsent,
);

module.exports = router;
