const fs = require('fs');
const sharp = require('sharp');

const { Post, PostPhoto, Like, Comment } = require('../models');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

module.exports.createPost = asyncHandler(async (req, res, next) => {
  const { username } = req.user;
  const { files } = req;
  const { content } = req.body;

  if (!(files.length !== 0 || content)) {
    return next(new ErrorResponse('missing parameters', 400));
  }

  const newPost = await Post.create({ createdBy: username });

  if (files.length !== 0) {
    const photoDests = [];

    files.forEach(file => {
      const uniqueName = `${Date.now()}-${Math.random().toFixed(3)}.jpg`;
      sharp(file.buffer)
        .resize(1080)
        .jpeg()
        .toFile(`./static/posts/${uniqueName}`);

      photoDests.push(`posts/${uniqueName}`);
    });

    await PostPhoto.bulkCreate(
      photoDests.map(photoDest => ({ postId: newPost.id, photo: photoDest })),
    );
  }

  if (content) {
    newPost.content = content;
  }

  await newPost.save();

  // set photos along with response
  newPost.dataValues.photos = await newPost.getPhotos();
  res.status(201).json({
    status: 'success',
    data: newPost,
  });
});

module.exports.updatePost = asyncHandler(async (req, res, next) => {
  const { username } = req.user;
  const { id: postId } = req.params;
  const { removePhotos, content } = req.body;
  const { files } = req;

  // must have at least one of data to update
  if (!(removePhotos || content || files.length !== 0)) {
    return next(new ErrorResponse('missing parameters', 400));
  }

  const post = await Post.findByPk(postId, {
    include: { model: PostPhoto, as: 'photos' },
  });
  if (!post) {
    return next(new ErrorResponse('post not found', 404));
  }
  if (post.createdBy !== username) {
    return next(new ErrorResponse('permission denied', 400));
  }

  if (removePhotos) {
    // filter to get only owner photo
    const filteredPhotos = removePhotos
      .split(',')
      .map(Number)
      .map(removeId => post.photos.find(photo => photo.id === removeId))
      .filter(photo => photo);

    if (filteredPhotos.length !== 0) {
      await PostPhoto.destroy({
        where: { id: filteredPhotos.map(photo => photo.id) },
      });

      filteredPhotos.forEach(photo => {
        fs.unlink(`./static/${photo.photo}`, err => {
          if (err) console.log(err);
        });
      });
    }
  }

  if (files.length !== 0) {
    const photoDests = [];

    files.forEach(file => {
      const uniqueName = `${Date.now()}-${Math.random().toFixed(3)}.jpg`;
      sharp(file.buffer)
        .resize(1080)
        .jpeg()
        .toFile(`./static/posts/${uniqueName}`);

      photoDests.push(`posts/${uniqueName}`);
    });

    await PostPhoto.bulkCreate(
      photoDests.map(photoDest => ({ postId: post.id, photo: photoDest })),
    );
  }

  if (content) {
    post.content = content;
  }

  await post.save();

  // set photos along with response
  post.dataValues.photos = await post.getPhotos();
  res.status(200).json({
    status: 'success',
    data: post,
  });
});

module.exports.like = asyncHandler(async (req, res, next) => {
  const { id: postId } = req.params;
  const { username } = req.user;

  const post = await Post.findByPk(postId);
  if (!post) {
    return next(new ErrorResponse('post not found', 404));
  }

  const like = await Like.findOne({ where: { liker: username, postId } });

  if (like) {
    await like.destroy();
    await post.increment({ like: -1 }, { where: { id: postId } });
    return res.status(200).json({
      status: 'success',
      data: 'unliked',
    });
  }

  await Like.create({ liker: username, postId: postId });
  await post.increment({ like: 1 }, { where: { id: postId } });
  res.status(200).json({
    status: 'success',
    data: 'liked',
  });
});

module.exports.createComment = asyncHandler(async (req, res, next) => {
  const { id: postId } = req.params;
  const { username } = req.user;
  const { content } = req.body;

  if (!content) {
    return next(new ErrorResponse('missing parameters', 400));
  }

  const post = await Post.count({ where: { id: postId } });
  if (!post) {
    return next(new ErrorResponse('post not found', 404));
  }

  const newComment = await Comment.create({
    commenter: username,
    postId: parseInt(postId, 10),
    content: content,
  });

  res.status(201).json({
    status: 'success',
    data: newComment,
  });
});

module.exports.getComments = asyncHandler(async (req, res, next) => {
  const { id: postId } = req.params;

  const comments = await Comment.findAll({ where: { postId } });

  res.status(200).json({
    status: 'success',
    data: comments,
  });
});

module.exports.getPost = asyncHandler(async (req, res, next) => {
  const { id: postId } = req.params;

  const post = await Post.findOne({
    where: { id: postId },
    include: { model: PostPhoto, as: 'photos' },
  });

  if (!post) {
    return next(new ErrorResponse('post not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: post,
  });
});
