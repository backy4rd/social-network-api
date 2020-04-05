const express = require('express');
const cookieParser = require('cookie-parser');

const commentController = require('../controllers/commentController');

const validateMiddleware = require('../middlewares/validateMiddleware');
const ownerMiddleware = require('../middlewares/ownerMiddleware');
const checkerMiddleware = require('../middlewares/checkerMiddleware');
const finderMiddleware = require('../middlewares/finderMiddleware');

const router = express.Router({ mergeParams: true });

router.use(express.json());
router.use(express.urlencoded({ extended: false }));
router.use(cookieParser());

// create comment
router.post(
  '/',
  validateMiddleware.validateAccessToken,
  finderMiddleware.findPost,
  checkerMiddleware.checkPostStatusPermission,
  commentController.createComment,
);

// update comment
router.patch(
  '/:commentId(\\d+)',
  validateMiddleware.validateAccessToken,
  finderMiddleware.findPost,
  checkerMiddleware.checkPostStatusPermission,
  finderMiddleware.findComment,
  ownerMiddleware.ownerComment,
  commentController.updateComment,
);

// delete comment
router.delete(
  '/:commentId(\\d+)',
  validateMiddleware.validateAccessToken,
  finderMiddleware.findPost,
  checkerMiddleware.checkPostStatusPermission,
  finderMiddleware.findComment,
  ownerMiddleware.ownerComment,
  commentController.deleteComment,
);

// get post comment
router.get(
  '/',
  validateMiddleware.identify,
  finderMiddleware.findPost,
  checkerMiddleware.checkPostStatusPermission,
  commentController.getPostComments,
);

// reply comment
router.post(
  '/:commentId(\\d+)/reply',
  validateMiddleware.validateAccessToken,
  finderMiddleware.findPost,
  checkerMiddleware.checkPostStatusPermission,
  finderMiddleware.findComment,
  commentController.replyComment,
);

// get reply comment
router.get(
  '/:commentId(\\d+)/replies',
  validateMiddleware.identify,
  finderMiddleware.findPost,
  checkerMiddleware.checkPostStatusPermission,
  finderMiddleware.findComment,
  commentController.getReplyComments,
);

// like comment
router.get(
  '/:commentId(\\d+)/like',
  validateMiddleware.validateAccessToken,
  finderMiddleware.findPost,
  checkerMiddleware.checkPostStatusPermission,
  finderMiddleware.findComment,
  commentController.likeComment,
);

// get comment likes
router.get(
  '/:commentId(\\d+)/likes',
  validateMiddleware.identify,
  finderMiddleware.findPost,
  checkerMiddleware.checkPostStatusPermission,
  finderMiddleware.findComment,
  commentController.getCommentLikes,
);

module.exports = router;
