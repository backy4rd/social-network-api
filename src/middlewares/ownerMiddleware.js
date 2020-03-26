const { Comment, Post, PostPhoto } = require('../models');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

module.exports.ownerComment = asyncHandler(async (req, res, next) => {
  const { id: commentId } = req.params;
  const { username } = req.user;

  const comment = await Comment.findByPk(commentId);

  if (!comment) {
    return next(new ErrorResponse('comment not found', 404));
  }
  if (comment.commenter !== username) {
    return next(new ErrorResponse('permission denied', 400));
  }

  req.comment = comment;
  next();
});

module.exports.ownerPost = asyncHandler(async (req, res, next) => {
  const { username } = req.user;
  const { id: postId } = req.params;

  const post = await Post.findByPk(postId, {
    include: { model: PostPhoto, as: 'photos' },
  });

  if (!post) {
    return next(new ErrorResponse('post not found', 404));
  }
  if (post.createdBy !== username) {
    return next(new ErrorResponse('permission denied', 400));
  }

  req.post = post;
  next();
});
