const express = require('express');
const multer = require('multer');

const commentRouter = require('./commentRouter');

const postController = require('../controllers/postController');

const validateMiddleware = require('../middlewares/validateMiddleware');
const ownerMiddleware = require('../middlewares/ownerMiddleware');
const checkerMiddleware = require('../middlewares/checkerMiddleware');
const finderMiddleware = require('../middlewares/finderMiddleware');

const ErrorResponse = require('../utils/errorResponse');

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, callback) => {
    if (/image/.test(file.mimetype)) {
      return callback(null, true);
    }
    callback(new ErrorResponse('invalid filetype', 400));
  },
});

router.use(express.json());
router.use(express.urlencoded({ extended: false }));

router.use('/:postId(\\d+)/comments', commentRouter);

// create post
router.post(
  '/',
  upload.array('photos', 20),
  validateMiddleware.authorize,
  postController.createPost,
);

// update post
router.patch(
  '/:postId(\\d+)',
  validateMiddleware.authorize,
  finderMiddleware.findPost,
  checkerMiddleware.checkPostExist,
  ownerMiddleware.ownerPost,
  upload.array('photos', 20),
  postController.updatePost,
);

// delete post
router.delete(
  '/:postId(\\d+)',
  validateMiddleware.authorize,
  finderMiddleware.findPost,
  checkerMiddleware.checkPostExist,
  ownerMiddleware.ownerPost,
  postController.deletePost,
);

// get post
router.get(
  '/:postId(\\d+)',
  validateMiddleware.identify,
  finderMiddleware.findPost,
  checkerMiddleware.checkPostExist,
  checkerMiddleware.checkPostStatusPermission,
  postController.getPost,
);

// like post
router.get(
  '/:postId(\\d+)/like',
  validateMiddleware.authorize,
  finderMiddleware.findPost,
  checkerMiddleware.checkPostExist,
  checkerMiddleware.checkPostStatusPermission,
  postController.like,
);

// get like of post
router.get(
  '/:postId(\\d+)/likes',
  validateMiddleware.identify,
  finderMiddleware.findPost,
  checkerMiddleware.checkPostExist,
  checkerMiddleware.checkPostStatusPermission,
  postController.getLikes,
);

module.exports = router;
