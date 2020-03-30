const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const { User } = require('../models');

module.exports.checkTarget = asyncHandler(async (req, res, next) => {
  const { target: targetName } = req.query;

  if (!targetName) {
    return next(new ErrorResponse('missing parameters', 400));
  }

  const target = await User.findOne({ where: { username: targetName } });
  if (!target) {
    return next(new ErrorResponse("friend doen't exist", 404));
  }

  req.target = target;
  next();
});
