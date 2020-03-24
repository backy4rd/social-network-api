const express = require('express');
const cookieParser = require('cookie-parser');
const multer = require('multer');

const postController = require('../controllers/postController');

const validateMiddleware = require('../middlewares/validateMiddleware');

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

route.get('/:id', postController.getPost);
route.get('/:id/comments', postController.getComments);

// these route above doesn't need authorization
route.use(validateMiddleware.validateAccessToken);

route.get('/:id/like', postController.like);
route.post('/:id/comment', postController.createComment);
route.post('/', upload.array('photos', 20), postController.createPost);
route.patch('/:id', upload.array('photos', 20), postController.updatePost);

module.exports = route;
