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

route.get('/:id(\\d+)', postController.getPost);
route.get('/:id(\\d+)/comments', postController.getComments);
route.get('/:id(\\d+)/likes', postController.getLikes);

// these route above doesn't need authorization
route.use(validateMiddleware.validateAccessToken);

route.get('/:id(\\d+)/like', postController.like);
route.post('/:id(\\d+)/comment', postController.createComment);
route.post('/', upload.array('photos', 20), postController.createPost);

// these route above doesn't need authorization
route.use('/:id(\\d+)', ownerMiddleware.ownerPost);

route.patch(
  '/:id(\\d+)',
  upload.array('photos', 20),
  postController.updatePost,
);
route.delete('/:id(\\d+)', postController.deletePost);

module.exports = route;
