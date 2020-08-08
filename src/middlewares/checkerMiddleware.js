const { expect } = require('chai');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const { Friend } = require('../models');

module.exports.checkPostExist = asyncHandler(async (req, res, next) => {
  expect(req.post, '404:post new not found').to.exist;
  next();
});

module.exports.checkCommentExist = asyncHandler(async (req, res, next) => {
  expect(req.comment, '404:comment new not found').to.exist;
  next();
});

module.exports.checkTargetExist = asyncHandler(async (req, res, next) => {
  expect(req.target, '404:target new not found').to.exist;
  next();
});

module.exports.checkPostStatusPermission = asyncHandler(
  async (req, res, next) => {
    const { user, post } = req;

    if (user) {
      if (post.status === 'private' && user.username !== post.createdBy) {
        return next(new ErrorResponse('permission denied', 400));
      }

      if (post.status === 'friend' && user.username !== post.createdBy) {
        const isFriend = await Friend.count({
          where: {
            userA: post.createdBy,
            userB: user.username,
            status: 'friend',
          },
        });

        if (!isFriend) {
          return next(new ErrorResponse('permission denied', 400));
        }
      }
    } else if (post.status !== 'public') {
      return next(new ErrorResponse('permission denied', 400));
    }

    next();
  },
);
