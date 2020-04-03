const express = require('express');
const cookieParser = require('cookie-parser');

const commentController = require('../controllers/commentController');

const validateMiddleware = require('../middlewares/validateMiddleware');
const ownerMiddleware = require('../middlewares/ownerMiddleware');
const checkerMiddleware = require('../middlewares/checkerMiddleware');
const finderMiddleware = require('../middlewares/finderMiddleware');

const route = express.Router({ mergeParams: true });

route.use(express.json());
route.use(express.urlencoded({ extended: false }));
route.use(cookieParser());

// create comment
route.post(
  '/',
  validateMiddleware.validateAccessToken,
  finderMiddleware.findPost,
  checkerMiddleware.checkPostStatusPermission,
  commentController.createComment,
);

// update comment
route.patch(
  '/:commentId(\\d+)',
  validateMiddleware.validateAccessToken,
  finderMiddleware.findPost,
  checkerMiddleware.checkPostStatusPermission,
  finderMiddleware.findComment,
  ownerMiddleware.ownerComment,
  commentController.updateComment,
);

// delete comment
route.delete(
  '/:commentId(\\d+)',
  validateMiddleware.validateAccessToken,
  finderMiddleware.findPost,
  checkerMiddleware.checkPostStatusPermission,
  finderMiddleware.findComment,
  ownerMiddleware.ownerComment,
  commentController.deleteComment,
);

// get post comment
route.get(
  '/',
  validateMiddleware.identify,
  finderMiddleware.findPost,
  checkerMiddleware.checkPostStatusPermission,
  commentController.getPostComments,
);

// reply comment
route.post(
  '/:commentId(\\d+)/reply',
  validateMiddleware.validateAccessToken,
  finderMiddleware.findPost,
  checkerMiddleware.checkPostStatusPermission,
  finderMiddleware.findComment,
  commentController.replyComment,
);

// like comment
route.get(
  '/:commentId(\\d+)/like',
  validateMiddleware.validateAccessToken,
  finderMiddleware.findPost,
  checkerMiddleware.checkPostStatusPermission,
  finderMiddleware.findComment,
  commentController.likeComment,
);

// get comment likes
route.get(
  '/:commentId(\\d+)/likes',
  validateMiddleware.identify,
  finderMiddleware.findPost,
  checkerMiddleware.checkPostStatusPermission,
  finderMiddleware.findComment,
  commentController.getCommentLikes,
);

module.exports = route;
