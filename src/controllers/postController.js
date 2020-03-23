const fs = require('fs');
const sharp = require('sharp');

const { Post, PostPhoto } = require('../models');
const asyncHandler = require('../utils/asyncHandler');
const ErrorResponse = require('../utils/errorResponse');

module.exports.createPost = asyncHandler(async (req, res, next) => {
  const { username } = req.user;
  const { files } = req;
  const { content } = req.body;

  if (!(files.length !== 0 || content)) {
    return next(new ErrorResponse('missing parameters', 400));
  }

  const post = await Post.create({ createdBy: username });

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
  res.status(201).json({
    status: 'success',
    data: post,
  });
});

module.exports.updatePost = asyncHandler(async (req, res, next) => {
  const { username } = req.user;
  const { id } = req.params;
  const { removePhotos, content } = req.body;
  const { files } = req;

  // must have id and at least one of data to update
  if (!id || !(removePhotos || content || files.length !== 0)) {
    return next(new ErrorResponse('missing parameters', 400));
  }

  const post = await Post.findByPk(id, {
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

// module.exports.rate = asyncHandler(async (req, res, next) => {
//   const { id } = req.params;
//   const { option } = req.query;
//   if (!option) {
//     return next(new ErrorResponse('missing parameters', 400));
//   }
//   if (option !== 'like' && option !== 'unlike') {
//     return next(new ErrorResponse('invalid option', 400));
//   }

//   const creament = option === 'like' ? 1 : -1;

//   const data = await Post.increment(
//     { like: creament },
//     { where: { id } },
//   );

//   res.status(200).json({
//     status: 'success',
//     data: data,
//   });
// });

// module.exports.getPost = asyncHandler(async (req, res, next) => {
//   const { id } = req.params;
//   if (!id) {
//     return next(new ErrorResponse('missing parameters', 400));
//   }

//   const post = await Post.findOne({
//     where: { id },
//     include: { model: PostPhoto, as: 'photos' },
//   });

//   if (!post) {
//     return next(new ErrorResponse("post doen't exist", 404));
//   }

//   res.status(200).json({
//     status: 'success',
//     data: post,
//   });
// });
