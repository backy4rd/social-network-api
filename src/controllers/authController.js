const url = require('url');
const jwt = require('jsonwebtoken');
const request = require('request-promise');
const { expect } = require('chai');

const { User } = require('../models');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const transporter = require('../utils/mailTransporter');
const responseHandler = require('../utils/responseHandler');
const randomString = require('../utils/randomString');

module.exports.register = asyncHandler(async (req, res, next) => {
  const { username, password, firstName, lastName, female, email } = req.body;

  expect(female, '400:require female field').to.exist;
  expect(female, '400:invalid parameters').to.be.oneOf(['0', '1']);

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
  expect(username, '400:require username field').to.exist;
  expect(password, '400:require password field').to.exist;

  const user = await User.findOne({ where: { username } });
  expect(user, "404:username doesn't exist").to.exist;

  const match = await user.comparePassword(password);
  expect(match, '400:password not match').to.be.true;

  const token = await user.generateAccessToken();

  res.cookie('token', token, { httpOnly: true });
  res.status(200).json({
    status: 'success',
    data: responseHandler.processUser(user),
  });
});

module.exports.sendVerificationMail = asyncHandler(async (req, res, next) => {
  const { username, email, verified } = req.user;

  expect(match, '400:already verified').to.be.false;

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

  expect(token, '400:token not found').to.be.exist;

  jwt.verify(token, secret, async (err, decoded) => {
    if (err) return next(err);
    expect(decoded.verify, '400:invalid token').to.be.true;

    const user = await User.findOne({ where: { username: decoded.username } });

    expect(user.verified, '400:already verified').to.be.false;

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
  expect(username, '400:require username field').to.be.exist;

  const user = await User.findOne({ where: { username } });
  expect(user, "404:username doesn't exist").to.exist;

  expect(user.verified, "400:email hasn't been verified").to.be.true;

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
  expect(username, '400:require username field').to.be.exist;
  expect(newPassword, '400:require newPassword field').to.be.exist;
  expect(forgotCode, '400:require forgotCode field').to.be.exist;

  const user = await User.findOne({ where: { username } });
  expect(user, "404:username doesn't exist").to.exist;

  expect(forgotCode, '400:invalid forgot code').to.equal(
    req.session.get(username),
  );

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
      password: randomString(32),
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

  expect(profile.email, '400:facebook account must have email').to.exist;

  let user = await User.findOne({ where: { username: profile.id } });
  let statusCode = 200;

  if (!user) {
    user = await User.build({
      username: profile.id,
      password: randomString(32),
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
