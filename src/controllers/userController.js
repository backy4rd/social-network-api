const fs = require('fs');
const sharp = require('sharp');

const {
  Friend,
  User,
  Post,
  PostPhoto,
  Sequelize: { Op },
} = require('../models');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const responseHander = require('../utils/responseHander');

module.exports.getUser = asyncHandler(async (req, res, next) => {
  const { username } = req.params;

  const user = await User.findByPk(username);

  if (!user) {
    return next(new ErrorResponse("username doesn't exist"), 404);
  }

  res.status(200).json({
    status: 'success',
    data: responseHander.processUser(user),
  });
});

module.exports.updateUser = asyncHandler(async (req, res, next) => {
  const { username } = req.user;
  const { fullName } = req.body;
  const { file } = req;

  if (!(fullName || file)) {
    return next(new ErrorResponse('missing parameters', 400));
  }

  const user = await User.findByPk(username);

  if (fullName) {
    user.fullName = fullName;
  }

  if (file) {
    // if not, avatar will be saved to disk even though data is invalid
    await user.validate({ fields: { exclude: ['password'] } });

    const uniqueName = `${Date.now()}-${Math.random().toFixed(3)}.jpg`;

    // remove previous avatar
    if (user.avatar !== 'avatars/default.jpg') {
      fs.unlink(`./static/${user.avatar}`, err => {
        if (err) console.log(err);
      });
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
    data: responseHander.processUser(user),
  });
});

module.exports.updatePassword = asyncHandler(async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;
  const { username } = req.user;

  if (!oldPassword || !newPassword) {
    return next(new ErrorResponse('missing parameters'), 400);
  }

  const user = await User.findOne({ where: { username } });

  const match = await user.comparePassword(oldPassword);
  if (!match) {
    return next(new ErrorResponse('old password not match', 400));
  }

  user.password = newPassword;
  await user.validate({ fields: ['password'] });
  await user.encryptPassword();
  await user.save({ validate: false });

  res.status(200).json({
    status: 'success',
    data: 'change password success',
  });
});

module.exports.getUserPost = asyncHandler(async (req, res, next) => {
  const { username } = req.params;
  const from = req.query.from || 0;
  const limit = (req.query.limit || 10) > 20 ? 20 : req.query.limit || 10;

  const posts = await Post.findAll({
    where: { createdBy: username },
    offset: parseInt(from, 10),
    limit: parseInt(limit, 10),
    order: ['createdAt'],
    include: [
      { model: PostPhoto, as: 'photos' },
      { model: User, attributes: ['fullName'] },
    ],
  });

  res.status(200).json({
    status: 'success',
    data: responseHander.processPost(posts),
  });
});

module.exports.getFriends = asyncHandler(async (req, res, next) => {
  const { username } = req.params;
  const from = req.query.from || 0;
  const limit = (req.query.limit || 20) > 50 ? 50 : req.query.limit || 20;

  const friends = await Friend.findAll({
    where: { [Op.and]: [{ userA: username }, { status: 'friend' }] },
    offset: parseInt(from, 10),
    limit: parseInt(limit, 10),
    order: ['createdAt'],
    include: [{ model: User, attributes: { exclude: ['password'] } }],
  });

  res.status(200).json({
    status: 'success',
    data: friends,
  });
});

module.exports.getFriendsRequest = asyncHandler(async (req, res, next) => {
  const { username } = req.user;
  const from = req.query.from || 0;
  const limit = (req.query.limit || 20) > 50 ? 50 : req.query.limit || 20;

  const friendRequests = await Friend.findAll({
    where: { [Op.and]: [{ userA: username }, { status: 'pending' }] },
    offset: parseInt(from, 10),
    limit: parseInt(limit, 10),
    order: ['createdAt'],
  });

  res.status(200).json({
    status: 'success',
    data: friendRequests,
  });
});
