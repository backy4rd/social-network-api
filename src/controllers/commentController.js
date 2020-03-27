const { User, Comment, CommentLike } = require('../models');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

module.exports.updateComment = asyncHandler(async (req, res, next) => {
  const { comment } = req;
  const { content } = req.body;

  if (!content) {
    return next(new ErrorResponse('missing parameters', 400));
  }

  comment.content = content;
  await comment.save();

  res.status(200).json({
    status: 'success',
    data: comment,
  });
});

module.exports.deleteComment = asyncHandler(async (req, res, next) => {
  const { comment } = req;

  await comment.destroy();

  res.status(200).json({
    status: 'success',
    data: 'deleted',
  });
});

module.exports.like = asyncHandler(async (req, res, next) => {
  const { id: commentId } = req.params;
  const { username } = req.user;

  const comment = await Comment.findByPk(commentId);
  if (!comment) {
    return next(new ErrorResponse('post not found', 404));
  }

  const like = await CommentLike.findOne({
    where: { liker: username, commentId: commentId },
  });

  if (like) {
    await like.destroy();
    await comment.increment({ like: -1 }, { where: { id: commentId } });
    return res.status(200).json({
      status: 'success',
      data: 'unliked',
    });
  }

  await CommentLike.create({ liker: username, commentId: commentId });
  await comment.increment({ like: 1 }, { where: { id: commentId } });
  res.status(200).json({
    status: 'success',
    data: 'liked',
  });
});

module.exports.getLikes = asyncHandler(async (req, res, next) => {
  const { id: commentId } = req.params;
  const from = req.query.from || 0;
  const limit = (req.query.limit || 20) > 200 ? 200 : req.query.limit || 20;

  const users = await CommentLike.findAll({
    where: { commentId: commentId },
    offset: parseInt(from, 10),
    limit: parseInt(limit, 10),
    order: ['createdAt'],
    include: { model: User, attributes: ['fullName'] },
  });

  res.status(200).json({
    status: 'success',
    data: users,
  });
});
