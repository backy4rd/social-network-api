const { expect } = require('chai');
const { User, Comment, CommentLike, Notification } = require('../models');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const requestHandler = require('../utils/requestHandler');
const responseHandler = require('../utils/responseHandler');

module.exports.createComment = asyncHandler(async (req, res, next) => {
  const { post } = req;
  const { username } = req.user;
  const { content } = req.body;

  expect(content, '400:missing parameters').to.exist;

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
    data: responseHandler.toUnderscored(newComment),
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
    order: ['createdAt'],
    include: { model: User, attributes: ['firstName', 'lastName', 'avatar'] },
  });

  res.status(200).json({
    status: 'success',
    data: responseHandler.toUnderscored(comments),
  });
});

module.exports.getReplyComments = asyncHandler(async (req, res, next) => {
  const { comment } = req;
  const { from, limit } = requestHandler.range(req, [20, 50]);

  const replies = await comment.getReplies({
    offset: from,
    limit: limit,
    order: ['createdAt'],
    include: { model: User, attributes: ['firstName', 'lastName', 'avatar'] },
  });

  res.status(200).json({
    status: 'success',
    data: responseHandler.toUnderscored(replies),
  });
});

module.exports.updateComment = asyncHandler(async (req, res, next) => {
  const { comment } = req;
  const { content } = req.body;

  expect(content, '400:missing parameters').to.exist;

  comment.content = content;
  await comment.save();

  res.status(200).json({
    status: 'success',
    data: responseHandler.toUnderscored(comment),
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

module.exports.replyComment = asyncHandler(async (req, res, next) => {
  const { content } = req.body;
  const { username } = req.user;
  const { comment } = req;

  expect(content, '400:missing parameters').to.exist;
  expect(content, '400:unaccepted nesting reply').to.not.be.null;

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
    data: responseHandler.toUnderscored(replyComment),
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
      data: 'unlike',
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
    data: 'like',
  });
});

module.exports.getCommentLikes = asyncHandler(async (req, res, next) => {
  const { comment } = req;
  const { from, limit } = requestHandler.range(req, [20, 200]);

  const users = await comment.getCommentLikes({
    offset: parseInt(from, 10),
    limit: parseInt(limit, 10),
    order: ['createdAt'],
    include: { model: User, attributes: ['lastName', 'lastName'] },
  });

  res.status(200).json({
    status: 'success',
    data: responseHandler.toUnderscored(users),
  });
});
