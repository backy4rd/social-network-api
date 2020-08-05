const { expect } = require('chai');
const {
  Friend,
  Sequelize: { Op },
} = require('../models');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

module.exports.addFriend = asyncHandler(async (req, res, next) => {
  const { username } = req.user;
  const { target } = req;

  expect(username, "400:can't add friend yourself").to.not.equal(
    target.username,
  );

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
  const { target: friend } = req;

  const friendship = await Friend.findOne({
    where: {
      userA: username,
      userB: friend.username,
    },
  });

  expect(friendship, '404:not in relationship').to.exist;
  expect(friendship.status, '400:still not be friend').to.equal('friend');

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
  const action = req.query.action.toLowerCase();
  const { target } = req;

  expect(action, '404:missing parameters').to.exist;
  expect(action, '400:invalid action').to.be.oneOf(['accept', 'decline']);

  const friendship = await Friend.findOne({
    where: {
      userA: username,
      userB: target.username,
    },
  });

  expect(friendship, '404:not in relationship').to.exist;
  expect(friendship.status, '400:already been friend').to.not.equal('friend');
  expect(friendship.status, `400:can't ${action}`).to.equal('pending');

  if (action === 'accept') {
    await Friend.update({ status: 'friend' }, { where: { userA: username } });
    await Friend.update(
      { status: 'friend' },
      { where: { userA: target.username } },
    );
  }
  if (action === 'decline') {
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

module.exports.unsent = asyncHandler(async (req, res, next) => {
  const { username } = req.user;
  const { target } = req;

  const friendship = await Friend.findOne({
    where: {
      userA: username,
      userB: target.username,
    },
  });

  expect(friendship, '404:not in relationship').to.exist;
  expect(friendship.status, `404:can't find request`).to.equal('sent');

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
    data: 'unsent',
  });
});
