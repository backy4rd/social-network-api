const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');
const { User, Post, PostPhoto, Friend } = require('../models');

module.exports.checkTarget = asyncHandler(async (req, res, next) => {
  const { target: targetName } = req.query;

  if (!targetName) {
    return next(new ErrorResponse('missing parameters', 400));
  }

  const target = await User.findOne({ where: { username: targetName } });
  if (!target) {
    return next(new ErrorResponse("friend doen't exist", 404));
  }

  req.target = target;
  next();
});

module.exports.checkPostStatusPermission = asyncHandler(
  async (req, res, next) => {
    const { postId } = req.params;
    const { user } = req;

    const post = await Post.findOne({
      where: { id: postId },
      include: { model: PostPhoto, as: 'photos' },
    });

    if (!post) {
      return next(new ErrorResponse('post not found', 404));
    }

    if (user) {
      if (post.status === 'private' && user.username !== post.createdBy) {
        return next(new ErrorResponse('permission denied', 400));
      }

      if (post.status === 'friend') {
        const isFriend = await Friend.count({
          where: { userA: post.createdBy, userB: user.username },
        });

        if (!isFriend) {
          return next(new ErrorResponse('permission denied', 400));
        }
      }
    } else if (post.status !== 'public') {
      return next(new ErrorResponse('permission denied', 400));
    }

    req.post = post;
    next();
  },
);
