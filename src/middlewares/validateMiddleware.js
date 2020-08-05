const jwt = require('jsonwebtoken');
const { expect } = require('chai');

const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

module.exports.authorize = asyncHandler((req, res, next) => {
  const token = req.cookies.token || req.headers.authorization;
  const secret = process.env.SECRET;

  expect(token, '401:unauthorized').to.exist;

  jwt.verify(token, secret, (err, decode) => {
    if (err) return next(new ErrorResponse('unauthorized', 401));
    req.user = decode;

    next();
  });
});

module.exports.identify = asyncHandler((req, res, next) => {
  const token = req.cookies.token || req.headers.authorization;
  const secret = process.env.SECRET;

  if (!token) return next();

  jwt.verify(token, secret, (err, decode) => {
    if (err) return next();
    req.user = decode;
    next();
  });
});
