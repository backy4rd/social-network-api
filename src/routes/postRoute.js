const express = require('express');
const cookieParser = require('cookie-parser');
const multer = require('multer');

const postController = require('../controllers/postController');

const validateMiddleware = require('../middlewares/validateMiddleware');
const ownerMiddleware = require('../middlewares/ownerMiddleware');

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

route.get('/:postId(\\d+)', postController.getPost);
route.get('/:postId(\\d+)/comments', postController.getComments);
route.get('/:postId(\\d+)/likes', postController.getLikes);

// these route above doesn't need authorization
route.use(validateMiddleware.validateAccessToken);

route.get('/:postId(\\d+)/like', postController.like);
route.post('/:postId(\\d+)/comment', postController.createComment);
route.post('/', upload.array('photos', 20), postController.createPost);

// these route above doesn't need authorization
route.use('/:postId(\\d+)', ownerMiddleware.ownerPost);

route.patch(
  '/:postId(\\d+)',
  upload.array('photos', 20),
  postController.updatePost,
);
route.delete('/:postId(\\d+)', postController.deletePost);

module.exports = route;
