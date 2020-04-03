const { User, Comment, CommentLike, Notification } = require('../models');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const requestHandler = require('../utils/requestHandler');

module.exports.createComment = asyncHandler(async (req, res, next) => {
  const { post } = req;
  const { username } = req.user;
  const { content } = req.body;

  if (!content) {
    return next(new ErrorResponse('missing parameters', 400));
  }

  const newComment = await Comment.create({
    commenter: username,
    postId: post.id,
    content: content,
  });

  if (post.createdBy !== username) {
    await Notification.create({
      owner: post.createdBy,
      from: username,
      postId: post.id,
      action: 'comment',
    });
  }

  res.status(201).json({
    status: 'success',
    data: newComment,
  });
});

module.exports.getPostComments = asyncHandler(async (req, res, next) => {
  const { post } = req;
  const { from, limit } = requestHandler.range(req, [20, 50]);

  // id represent createAt
  const comments = await post.getComments({
    where: { replyOf: null },
    offset: from,
    limit: limit,
    order: ['id'],
    include: { model: User, attributes: ['fullName'] },
  });

  res.status(200).json({
    status: 'success',
    data: comments,
  });
});

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
  const { content } = req.body;
  const { username } = req.user;
  const { comment } = req;

  if (!content) {
    return next(new ErrorResponse('missing parameters', 400));
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
  const { username } = req.user;
  const { comment } = req;

  const like = await CommentLike.findOne({
    where: { liker: username, commentId: comment.id },
  });

  if (like) {
    await like.destroy();
    await comment.increment({ like: -1 }, { where: { id: comment.id } });
    return res.status(200).json({
      status: 'success',
      data: 'unliked',
    });
  }

  await CommentLike.create({ liker: username, commentId: comment.id });
  if (comment.commenter !== username) {
    await Notification.create({
      owner: comment.commenter,
      from: username,
      commentId: comment.id,
      action: 'like',
    });
  }
  await comment.increment({ like: 1 }, { where: { id: comment.id } });
  res.status(200).json({
    status: 'success',
    data: 'liked',
  });
});

module.exports.getCommentLikes = asyncHandler(async (req, res, next) => {
  const { comment } = req;
  const { from, limit } = requestHandler.range(req, [20, 200]);

  const users = await comment.getCommentLikes({
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
