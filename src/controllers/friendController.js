const {
  User,
  Friend,
  Sequelize: { Op },
} = require('../models');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

module.exports.addFriend = asyncHandler(async (req, res, next) => {
  const { username } = req.user;
  const targetName = req.query.target;

  if (!targetName) {
    return next(new ErrorResponse('missing parameters', 400));
  }

  const target = await User.findOne({ where: { username: targetName } });
  if (!target) {
    return next(new ErrorResponse("target doen't exist", 404));
  }
  if (username === target.username) {
    return next(new ErrorResponse("can't addfriend yourself", 400));
  }

  const friendship = await Friend.findOne({
    where: {
      userA: username,
      userB: target.username,
    },
  });

  if (friendship) {
    const { status } = friendship;
    if (status === 'sent') {
      return next(new ErrorResponse('already sent request', 400));
    }
    if (status === 'pending') {
      return next(new ErrorResponse('waiting you to decide', 400));
    }
    if (status === 'friend') {
      return next(new ErrorResponse('already been friend', 400));
    }
  }

  await Friend.create({
    userA: username,
    userB: target.username,
    status: 'sent',
  });
  await Friend.create({
    userA: target.username,
    userB: username,
    status: 'pending',
  });

  res.status(200).json({
    status: 'success',
    data: 'send request success',
  });
});

module.exports.unfriend = asyncHandler(async (req, res, next) => {
  const { username } = req.user;
  const friendName = req.query.friend;

  if (!friendName) {
    return next(new ErrorResponse('missing parameters', 400));
  }

  const friend = await User.findOne({ where: { username: friendName } });
  if (!friend) {
    return next(new ErrorResponse("friend doen't exist", 404));
  }

  const friendship = await Friend.findOne({
    where: {
      userA: username,
      userB: friend.username,
    },
  });

  if (!friendship) {
    return next(new ErrorResponse('not in relationship', 404));
  }
  if (friendship.status !== 'friend') {
    return next(new ErrorResponse('still not be friend', 400));
  }

  await Friend.destroy({
    where: {
      [Op.and]: [{ userA: username }, { userB: friend.username }],
    },
  });
  await Friend.destroy({
    where: {
      [Op.and]: [{ userA: friend.username }, { userB: username }],
    },
  });

  res.status(200).json({
    status: 'success',
    data: 'unfriend success',
  });
});

module.exports.decide = asyncHandler(async (req, res, next) => {
  const { username } = req.user;
  const { action, target: targetName } = req.query;

  if (!targetName || !action) {
    return next(new ErrorResponse('missing parameters', 400));
  }
  if (!/^(accept|decline)$/.test(action.toLowerCase())) {
    return next(new ErrorResponse('invalid action', 400));
  }

  const target = await User.findOne({ where: { username: targetName } });
  if (!target) {
    return next(new ErrorResponse("target doen't exist", 404));
  }

  const friendship = await Friend.findOne({
    where: {
      userA: username,
      userB: target.username,
    },
  });

  if (!friendship) {
    return next(new ErrorResponse('not in relationship', 404));
  }
  if (friendship.status === 'friend') {
    return next(new ErrorResponse('already been friend', 400));
  }
  if (friendship.status !== 'pending') {
    return next(new ErrorResponse("can't " + action, 400));
  }

  if (action.toLowerCase() === 'accept') {
    await Friend.update({ status: 'friend' }, { where: { userA: username } });
    await Friend.update(
      { status: 'friend' },
      { where: { userA: target.username } },
    );
  }
  if (action.toLowerCase() === 'decline') {
    await Friend.destroy({
      where: {
        [Op.and]: [{ userA: username }, { userB: target.username }],
      },
    });
    await Friend.destroy({
      where: {
        [Op.and]: [{ userA: target.username }, { userB: username }],
      },
    });
  }

  res.status(200).json({
    status: 'success',
    data: action + ' success',
  });
});

module.exports.unsend = asyncHandler(async (req, res, next) => {
  const { username } = req.user;
  const targetName = req.query.target;

  if (!targetName) {
    return next(new ErrorResponse('missing parameters', 400));
  }

  const target = await User.findOne({ where: { username: targetName } });
  if (!target) {
    return next(new ErrorResponse("target doen't exist", 404));
  }

  const friendship = await Friend.findOne({
    where: {
      userA: username,
      userB: target.username,
    },
  });

  if (!friendship) {
    return next(new ErrorResponse('not in relationship', 404));
  }
  if (friendship.status !== 'sent') {
    return next(new ErrorResponse("can't find request", 404));
  }

  await Friend.destroy({
    where: {
      [Op.and]: [{ userA: username }, { userB: target.username }],
    },
  });
  await Friend.destroy({
    where: {
      [Op.and]: [{ userA: target.username }, { userB: username }],
    },
  });

  res.status(200).json({
    status: 'success',
    data: 'unsend success',
  });
});
