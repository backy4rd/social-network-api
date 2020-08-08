const { expect } = require('chai');

const { User, Comment, Post, PostPhoto } = require('../models');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

module.exports.findPost = asyncHandler(async (req, res, next) => {
  const { postId } = req.params;

  const post = await Post.findByPk(postId, {
    include: { model: PostPhoto, as: 'photos' },
  });

  req.post = post;
  next();
});

module.exports.findComment = asyncHandler(async (req, res, next) => {
  const { commentId } = req.params;

  const comment = await Comment.findByPk(commentId);

  req.comment = comment;
  next();
});

module.exports.findTarget = asyncHandler(async (req, res, next) => {
  const { target: targetName } = req.query;

  expect(targetName, '400:missing parameters').to.exist;

  const target = await User.findOne({ where: { username: targetName } });

  req.target = target;
  next();
});
