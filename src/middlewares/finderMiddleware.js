const { User, Comment, Post, PostPhoto } = require('../models');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

module.exports.findPost = asyncHandler(async (req, res, next) => {
  const { postId } = req.params;

  const post = await Post.findByPk(postId, {
    include: { model: PostPhoto, as: 'photos' },
  });

  if (!post) {
    return next(new ErrorResponse('post not found', 404));
  }

  req.post = post;
  next();
});

module.exports.findComment = asyncHandler(async (req, res, next) => {
  const { commentId } = req.params;

  const comment = await Comment.findByPk(commentId);

  if (!comment) {
    return next(new ErrorResponse('comment not found', 404));
  }

  req.comment = comment;
  next();
});

module.exports.findTarget = asyncHandler(async (req, res, next) => {
  const { target: targetName } = req.query;

  if (!targetName) {
    return next(new ErrorResponse('missing parameters', 400));
  }

  const target = await User.findOne({ where: { username: targetName } });
  if (!target) {
    return next(new ErrorResponse("target doesn't exist", 404));
  }

  req.target = target;
  next();
});
