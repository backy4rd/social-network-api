const express = require('express');
const cookieParser = require('cookie-parser');
const multer = require('multer');

const postController = require('../controllers/postController');

const validateMiddleware = require('../middlewares/validateMiddleware');
const ownerMiddleware = require('../middlewares/ownerMiddleware');
const checkerMiddleware = require('../middlewares/checkerMiddleware');

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

// get post by id
route.get(
  '/:postId(\\d+)',
  validateMiddleware.identify,
  checkerMiddleware.checkPostStatusPermission,
  postController.getPost,
);
// get comment of post by id
route.get(
  '/:postId(\\d+)/comments',
  validateMiddleware.identify,
  checkerMiddleware.checkPostStatusPermission,
  postController.getComments,
);
// get like of post by id
route.get(
  '/:postId(\\d+)/likes',
  validateMiddleware.identify,
  checkerMiddleware.checkPostStatusPermission,
  postController.getLikes,
);

// these route above doesn't need authorization
route.use(validateMiddleware.validateAccessToken);

// like post
route.get(
  '/:postId(\\d+)/like',
  checkerMiddleware.checkPostStatusPermission,
  postController.like,
);
// comment post
route.post(
  '/:postId(\\d+)/comment',
  checkerMiddleware.checkPostStatusPermission,
  postController.createComment,
);
// create post
route.post('/', upload.array('photos', 20), postController.createPost);

// these route above doesn't need owner permission
route.use('/:postId(\\d+)', ownerMiddleware.ownerPost);

// update post
route.patch(
  '/:postId(\\d+)',
  upload.array('photos', 20),
  postController.updatePost,
);
// delete post
route.delete('/:postId(\\d+)', postController.deletePost);

module.exports = route;
