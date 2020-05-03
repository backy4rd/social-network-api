const url = require('url');
const jwt = require('jsonwebtoken');
const request = require('request-promise');

const { User } = require('../models');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const transporter = require('../utils/mailTransporter');
const responseHandler = require('../utils/responseHandler');

module.exports.register = asyncHandler(async (req, res, next) => {
  const { username, password, firstName, lastName, female, email } = req.body;

  if (female) {
    if (female !== '0' && female !== '1') {
      return next(new ErrorResponse("female only accept '0' and '1'"));
    }
  }

  const newUser = await User.build({
    username: username,
    password: password,
    female: female ? female === '1' : null,
    firstName: firstName,
    lastName: lastName,
    email: email,
    verified: false,
  });
  await newUser.validate();
  await newUser.encryptPassword();
  await newUser.save({ validate: false });

  const token = await newUser.generateAccessToken();

  res.cookie('token', token, { httpOnly: true });
  res.status(201).json({
    status: 'success',
    data: responseHandler.processUser(newUser),
  });
});

module.exports.login = asyncHandler(async (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return next(new ErrorResponse('missing parameters', 400));
  }

  const user = await User.findOne({ where: { username } });
  if (!user) {
    return next(new ErrorResponse("username doesn't exist", 404));
  }

  const match = await user.comparePassword(password);
  if (!match) {
    return next(new ErrorResponse('password not match', 400));
  }

  const token = await user.generateAccessToken();

  res.cookie('token', token, { httpOnly: true });
  res.status(200).json({
    status: 'success',
    data: responseHandler.processUser(user),
  });
});

module.exports.sendVerificationMail = asyncHandler(async (req, res, next) => {
  const { username, email, verified } = req.user;

  if (verified) {
    return next(new ErrorResponse('already verified', 400));
  }

  const user = await User.findOne({ where: { username } });
  const verificationToken = await user.generateVerificationToken();

  const verificationUrl = url.format({
    protocol: process.env.PROTOCOL || 'http',
    hostname: process.env.DOMAIN || 'localhost',
    port: process.env.DOMAIN ? undefined : process.env.PORT,
    pathname: '/api/v1/auth/verify',
    query: {
      token: verificationToken,
    },
  });

  const mailOptions = {
    from: process.env.MAIL_USER,
    to: email,
    subject: 'verification mail',
    text: verificationUrl,
  };

  res.status(200).json({
    status: 'success',
    data: 'send mail success',
  });

  transporter.sendMail(mailOptions, err => {
    if (err) next(err);
  });
});

module.exports.verifyVerificationMail = asyncHandler(async (req, res, next) => {
  const { token } = req.query;
  const secret = process.env.SECRET;

  if (!token) {
    return next(new ErrorResponse('token not found', 404));
  }

  jwt.verify(token, secret, async (err, decoded) => {
    if (err) return next(err);
    if (!decoded.verify) {
      return next(new ErrorResponse('invalid token', 400));
    }

    const user = await User.findOne({ where: { username: decoded.username } });

    if (user.verified) {
      return next(new ErrorResponse('already verified', 400));
    }

    user.verified = true;
    await user.save();

    const newToken = await user.generateAccessToken();

    res.cookie('token', newToken, { httpOnly: true });

    res.status(200).json({
      status: 'success',
      data: {
        token: newToken,
      },
    });
  });
});

module.exports.sendForgotMail = asyncHandler(async (req, res, next) => {
  const { username } = req.query;
  if (!username) {
    return next(new ErrorResponse('missing parameters', 400));
  }

  const user = await User.findOne({ where: { username } });
  if (!user) {
    return next(new ErrorResponse("username doesn't exist", 404));
  }

  if (!user.verified) {
    return next(new ErrorResponse("email hasn't been verified"), 400);
  }

  const code = Math.floor(Math.random() * 899999 + 100000).toString();
  const mailOptions = {
    from: process.env.MAIL_USER,
    to: user.email,
    subject: 'change password',
    text: 'your code: ' + code,
  };

  req.session.append(username, code);

  res.status(200).json({
    status: 'success',
    data: 'send mail success',
  });

  transporter.sendMail(mailOptions, err => {
    if (err) next(err);
  });
});

module.exports.resetPassword = asyncHandler(async (req, res, next) => {
  const { username, newPassword, forgotCode } = req.body;
  if (!username || !newPassword || !forgotCode) {
    return next(new ErrorResponse('missing parameters', 400));
  }

  const user = await User.findOne({ where: { username } });
  if (!user) {
    return next(new ErrorResponse("username doesn't exist", 404));
  }

  if (forgotCode !== req.session.get(username)) {
    return next(new ErrorResponse('invalid forgot code', 400));
  }

  user.password = newPassword;
  await user.validate({ field: ['password'] });
  await user.encryptPassword();
  await user.save({ validate: false });

  req.session.remove(username);

  res.status(200).json({
    status: 'success',
    data: 'reset password success',
  });
});

module.exports.OAuthGoogle = asyncHandler(async (req, res, next) => {
  const { id_token: idToken } = await request({
    method: 'POST',
    uri: 'https://oauth2.googleapis.com/token',
    body: {
      code: req.query.code,
      client_id: process.env.CLIENT_ID_GOOGLE,
      client_secret: process.env.CLIENT_SECRET_GOOGLE,
      redirect_uri: process.env.REDIRECT_URI_GOOGLE,
      grant_type: 'authorization_code',
    },
    json: true,
  });

  const profile = await request({
    uri: 'https://oauth2.googleapis.com/tokeninfo',
    qs: { id_token: idToken },
    json: true,
  });

  // user exist ? login : register
  let user = await User.findOne({ where: { username: profile.sub } });
  let statusCode = 200;

  // register
  if (!user) {
    user = await User.build({
      username: profile.sub,
      password: Date.now().toString() + Math.random().toString(),
      firstName: profile.given_name,
      lastName: profile.family_name,
      email: profile.email,
      female: null,
      verified: true,
    });
    await user.validate();
    await user.encryptPassword();
    await user.save({ validate: false });
    statusCode = 201;
  }

  const token = await user.generateAccessToken();

  res.cookie('token', token, { httpOnly: true });
  res.status(statusCode).json({
    status: 'success',
    data: responseHandler.processUser(user),
  });
});

module.exports.OAuthFacebook = asyncHandler(async (req, res, next) => {
  const { access_token: accessToken } = await request({
    uri: 'https://graph.facebook.com/v6.0/oauth/access_token',
    qs: {
      client_id: process.env.CLIENT_ID_FACEBOOK,
      client_secret: process.env.CLIENT_SECRET_FACEBOOK,
      redirect_uri: process.env.REDIRECT_URI_FACEBOOK,
      code: req.query.code,
    },
    json: true,
  });

  const profile = await request({
    uri: 'https://graph.facebook.com/v6.0/me',
    qs: {
      fields: 'first_name,last_name,middle_name,email',
      access_token: accessToken,
    },
    json: true,
  });

  if (!profile.email) {
    return next(new ErrorResponse('facebook account must have email', 400));
  }

  let user = await User.findOne({ where: { username: profile.id } });
  let statusCode = 200;

  if (!user) {
    user = await User.build({
      username: profile.id,
      password: Date.now().toString() + Math.random().toString(),
      firstName: `${profile.first_name} ${profile.middle_name || ''}`.trim(),
      lastName: profile.last_name,
      email: profile.email,
      female: null,
      verified: true,
    });
    await user.validate();
    await user.encryptPassword();
    await user.save({ validate: false });
    statusCode = 201;
  }

  const token = await user.generateAccessToken();

  res.cookie('token', token, { httpOnly: true });
  res.status(statusCode).json({
    status: 'success',
    data: responseHandler.processUser(user),
  });
});
