const fs = require('fs');
const sharp = require('sharp');
const { expect } = require('chai');

const {
  Friend,
  User,
  Post,
  PostPhoto,
  Sequelize: { Op },
} = require('../models');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const responseHandler = require('../utils/responseHandler');
const requestHandler = require('../utils/requestHandler');
const randomString = require('../utils/randomString');

module.exports.getUser = asyncHandler(async (req, res, next) => {
  const { username } = req.params;

  const user = await User.findByPk(username);

  expect(user, `404:username doesn't exist`).to.exist;

  res.status(200).json({
    status: 'success',
    data: responseHandler.processUser(user),
  });
});

module.exports.updateUser = asyncHandler(async (req, res, next) => {
  const { username } = req.user;
  const { firstName, lastName } = req.body;
  const { file } = req;

  expect(firstName || lastName || file, '400:missing parameters').to.be.true;

  const user = await User.findByPk(username);

  if (firstName) {
    user.firstName = firstName;
  }

  if (lastName) {
    user.lastName = lastName;
  }

  if (file) {
    // if not, avatar will be saved to disk even though data is invalid
    await user.validate({ fields: { exclude: ['password'] } });

    const uniqueName = `${randomString(32)}.jpg`;

    // remove previous avatar
    if (user.avatar !== 'avatars/default.jpg') {
      fs.unlink(`./static/${user.avatar}`, () => {});
    }

    // resize, convert type and save
    sharp(file.buffer)
      .resize(720, 720)
      .jpeg()
      .toFile(`./static/avatars/${uniqueName}`);

    user.avatar = `avatars/${uniqueName}`;
  }

  await user.save();

  res.status(200).json({
    status: 'success',
    data: responseHandler.processUser(user),
  });
});

module.exports.updatePassword = asyncHandler(async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;
  const { username } = req.user;

  expect(oldPassword && newPassword, '400:missing parameters').to.be.true;

  const user = await User.findOne({ where: { username } });

  const match = await user.comparePassword(oldPassword);
  expect(match, '400:old password not match').to.be.true;

  user.password = newPassword;
  await user.validate({ fields: ['password'] });
  await user.encryptPassword();
  await user.save({ validate: false });

  res.status(200).json({
    status: 'success',
    data: 'change password success',
  });
});

module.exports.getPost = asyncHandler(async (req, res, next) => {
  const { username } = req.params;
  const { user } = req;
  const { from, limit } = requestHandler.range(req, [10, 20]);

  const status = ['public'];

  if (user) {
    const isFriend = await Friend.count({
      where: { userA: username, userB: user.username },
    });

    if (isFriend) {
      status.push('friend');
    }

    // user get their own post
    if (user.username === username) {
      status.push('friend', 'private');
    }
  }

  const posts = await Post.findAll({
    where: { [Op.and]: [{ createdBy: username }, { status: status }] },
    offset: from,
    limit: limit,
    order: ['createdAt'],
    include: [
      { model: PostPhoto, as: 'photos' },
      { model: User, attributes: ['firstName', 'lastName'] },
    ],
  });

  res.status(200).json({
    status: 'success',
    data: responseHandler.processPost(posts),
  });
});

module.exports.getOwnPost = asyncHandler(async (req, res, next) => {
  const { username } = req.user;
  const { from, limit } = requestHandler.range(req, [10, 20]);

  const posts = await Post.findAll({
    where: { createdBy: username },
    offset: from,
    limit: limit,
    order: ['createdAt'],
    include: [{ model: PostPhoto, as: 'photos' }],
  });

  res.status(200).json({
    status: 'success',
    data: responseHandler.processPost(posts),
  });
});

module.exports.getFriends = asyncHandler(async (req, res, next) => {
  const { username } = req.params;
  const { from, limit } = requestHandler.range(req, [20, 50]);

  const friends = await Friend.findAll({
    where: { [Op.and]: [{ userA: username }, { status: 'friend' }] },
    attributes: [['userB', 'friend'], 'status', 'createdAt', 'updatedAt'],
    offset: from,
    limit: limit,
    order: ['createdAt'],
    include: {
      model: User,
      attributes: ['firstName', 'lastName', 'avatar'],
    },
  });

  res.status(200).json({
    status: 'success',
    data: responseHandler.processFriend(friends),
  });
});

module.exports.getFriendsRequest = asyncHandler(async (req, res, next) => {
  const { username } = req.user;
  const { from, limit } = requestHandler.range(req, [20, 50]);

  const friendRequests = await Friend.findAll({
    where: { [Op.and]: [{ userA: username }, { status: 'pending' }] },
    attributes: [['userB', 'from'], 'status', 'createdAt', 'updatedAt'],
    offset: from,
    limit: limit,
    order: ['createdAt'],
    include: {
      model: User,
      attributes: ['firstName', 'lastName', 'avatar'],
    },
  });

  res.status(200).json({
    status: 'success',
    data: responseHandler.processFriend(friendRequests),
  });
});
