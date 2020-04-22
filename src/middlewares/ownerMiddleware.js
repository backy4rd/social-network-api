const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

module.exports.ownerComment = asyncHandler(async (req, res, next) => {
  const { username } = req.user;
  const { comment } = req;

  if (comment.commenter !== username) {
    return next(new ErrorResponse('permission denied', 400));
  }
  next();
});

module.exports.ownerPost = asyncHandler(async (req, res, next) => {
  const { username } = req.user;
  const { post } = req;

  if (post.createdBy !== username) {
    return next(new ErrorResponse('permission denied', 400));
  }

  next();
});
