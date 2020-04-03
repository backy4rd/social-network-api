const { User, Comment, CommentLike, Notification } = require('../models');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const requestHandler = require('../utils/requestHandler');

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
  const { username } = req.user;

  await comment.destroy();

  res.status(200).json({
    status: 'success',
    data: 'deleted',
  });
});

module.exports.replyComment = asyncHandler(async (req, res, next) => {
  const { commentId } = req.params;
  const { content } = req.body;
  const { username } = req.user;

  if (!content) {
    return next(new ErrorResponse('missing parameters', 400));
  }

  const comment = await Comment.findByPk(commentId);
  if (!comment) {
    return next(new ErrorResponse('comment not found', 404));
  }
  if (comment.replyOf !== null) {
    return next(new ErrorResponse('unaccept nesting reply', 400));
  }

  const replyComment = await Comment.create({
    commenter: username,
    postId: comment.postId,
    replyOf: comment.id,
    content: content,
  });

  if (comment.commenter !== username) {
    await Notification.create({
      owner: comment.commenter,
      from: username,
      commentId: comment.id,
      action: 'comment',
    });
  }

  res.status(201).json({
    status: 'success',
    data: replyComment,
  });
});

module.exports.likeComment = asyncHandler(async (req, res, next) => {
  const { commentId } = req.params;
  const { username } = req.user;

  const comment = await Comment.findByPk(commentId);
  if (!comment) {
    return next(new ErrorResponse('comment not found', 404));
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
  if (comment.commenter !== username) {
    await Notification.create({
      owner: comment.commenter,
      from: username,
      commentId: comment.id,
      action: 'like',
    });
  }
  await comment.increment({ like: 1 }, { where: { id: commentId } });
  res.status(200).json({
    status: 'success',
    data: 'liked',
  });
});

module.exports.getCommentLikes = asyncHandler(async (req, res, next) => {
  const { commentId } = req.params;
  const { from, limit } = requestHandler.range(req, [20, 200]);

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
