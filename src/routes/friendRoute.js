const express = require('express');
const cookieParser = require('cookie-parser');

const friendController = require('../controllers/friendController');

const validateMiddleware = require('../middlewares/validateMiddleware');
const finderMiddleware = require('../middlewares/finderMiddleware');

const route = express.Router();

route.use(cookieParser());
route.use(validateMiddleware.validateAccessToken);
route.use(finderMiddleware.findTarget);

// add friend
route.get(
  '/add',
  validateMiddleware.validateAccessToken,
  finderMiddleware.findTarget,
  friendController.addFriend,
);

// unfriend
route.get(
  '/breakup',
  validateMiddleware.validateAccessToken,
  finderMiddleware.findTarget,
  friendController.unfriend,
);

// decide friend request
route.get(
  '/decide',
  validateMiddleware.validateAccessToken,
  finderMiddleware.findTarget,
  friendController.decide,
);

// unsend friend request
route.get(
  '/unsend',
  validateMiddleware.validateAccessToken,
  finderMiddleware.findTarget,
  friendController.unsend,
);

module.exports = route;
