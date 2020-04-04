const { Notification, User } = require('../models');
const asyncHandler = require('../utils/asyncHandler');
const requestHandler = require('../utils/requestHandler');
const responseHander = require('../utils/responseHander');

module.exports.getNotification = asyncHandler(async (req, res, next) => {
  const { username } = req.user;
  const { from, limit } = requestHandler.range(req, [20, 50]);

  const notifications = await Notification.findAll({
    where: { owner: username },
    offset: from,
    limit: limit,
    order: ['createdAt'],
    include: { model: User, attributes: ['fullName', 'avatar'] },
  });

  res.status(200).json({
    status: 'success',
    data: responseHander.processNotification(notifications),
  });
});
