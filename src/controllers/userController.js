const fs = require('fs');
const sharp = require('sharp');

const { User } = require('../models');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

module.exports.getUser = asyncHandler(async (req, res, next) => {
  const { username } = req.params;

  const user = await User.findOne(
    { attributes: { exclude: ['password'] } },
    { where: { username } },
  );

  if (!user) {
    return next(new ErrorResponse("username doesn't exist"), 404);
  }

  res.status(200).json({
    status: 'success',
    data: user,
  });
});

module.exports.updateUser = asyncHandler(async (req, res) => {
  const user = await User.findOne({
    attributes: { exclude: ['password'] },
    where: { username: req.user.username },
  });

  if (req.body.fullName) {
    user.fullName = req.body.fullName;
  }

  if (req.file) {
    // if not, avatar will be saved to disk even though data is invalid
    await user.validate({ fields: { exclude: ['password'] } });

    const uniqueName = `${Date.now()}-${Math.random().toFixed(3)}.jpg`;

    // remove previous avatar
    if (user.avatar !== 'avatars/default.png') {
      fs.unlink(`./static/${user.avatar}`, err => {
        if (err) console.log(err);
      });
    }

    // resize, convert type and save
    sharp(req.file.buffer)
      .resize(720, 720)
      .jpeg()
      .toFile(`./static/avatars/${uniqueName}`);

    user.avatar = `avatars/${uniqueName}`;
  }

  await user.save();

  res.status(200).json({
    status: 'success',
    data: user,
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
