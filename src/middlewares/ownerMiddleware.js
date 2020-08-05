const { expect } = require('chai');

const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

module.exports.ownerComment = asyncHandler(async (req, res, next) => {
  const { username } = req.user;
  const { comment } = req;

  expect(comment.commenter, '400:permission denied').to.equal(username);

  next();
});

module.exports.ownerPost = asyncHandler(async (req, res, next) => {
  const { username } = req.user;
  const { post } = req;

  expect(post.createdBy, '400:permission denied').to.equal(username);

  next();
});
