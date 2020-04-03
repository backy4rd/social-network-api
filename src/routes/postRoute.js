const express = require('express');
const cookieParser = require('cookie-parser');
const multer = require('multer');

const commentRoute = require('./commentRoute');

const postController = require('../controllers/postController');

const validateMiddleware = require('../middlewares/validateMiddleware');
const ownerMiddleware = require('../middlewares/ownerMiddleware');
const checkerMiddleware = require('../middlewares/checkerMiddleware');
const finderMiddleware = require('../middlewares/finderMiddleware');

const ErrorResponse = require('../utils/errorResponse');

const route = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, callback) => {
    if (/image/.test(file.mimetype)) {
      return callback(null, true);
    }
    callback(new ErrorResponse('invalid filetype', 400));
  },
});

route.use(express.json());
route.use(express.urlencoded({ extended: false }));
route.use(cookieParser());

route.use('/:postId(\\d+)/comments', commentRoute);

// create post
route.post(
  '/',
  upload.array('photos', 20),
  validateMiddleware.validateAccessToken,
  postController.createPost,
);

// update post
route.patch(
  '/:postId(\\d+)',
  validateMiddleware.validateAccessToken,
  finderMiddleware.findPost,
  ownerMiddleware.ownerPost,
  upload.array('photos', 20),
  postController.updatePost,
);

// delete post
route.delete(
  '/:postId(\\d+)',
  validateMiddleware.validateAccessToken,
  finderMiddleware.findPost,
  ownerMiddleware.ownerPost,
  postController.deletePost,
);

// get post
route.get(
  '/:postId(\\d+)',
  validateMiddleware.identify,
  finderMiddleware.findPost,
  checkerMiddleware.checkPostStatusPermission,
  postController.getPost,
);

// like post
route.get(
  '/:postId(\\d+)/like',
  validateMiddleware.validateAccessToken,
  finderMiddleware.findPost,
  checkerMiddleware.checkPostStatusPermission,
  postController.like,
);

// get like of post
route.get(
  '/:postId(\\d+)/likes',
  validateMiddleware.identify,
  finderMiddleware.findPost,
  checkerMiddleware.checkPostStatusPermission,
  postController.getLikes,
);

module.exports = route;
