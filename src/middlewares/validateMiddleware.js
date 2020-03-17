const jwt = require('jsonwebtoken');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

module.exports.validateAccessToken = asyncHandler((req, res, next) => {
  const { token } = req.cookies;
  const secret = process.env.SECRET;

  if (!token) {
    return next(new ErrorResponse('token not found', 404));
  }

  jwt.verify(token, secret, (err, decode) => {
    if (err) return next(err);
    req.user = decode;
  });

  next();
});
