const express = require('express');
const cookieParser = require('cookie-parser');
const multer = require('multer');

const userController = require('../controllers/userController');

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

// get user post
route.get(
  '/:username/posts',
  validateMiddleware.identify,
  userController.getPost,
);

// get own friend request
route.get(
  '/requests',
  validateMiddleware.validateAccessToken,
  userController.getFriendsRequest,
);

// get own post
route.get(
  '/posts',
  validateMiddleware.validateAccessToken,
  userController.getOwnPost,
);

// get user
route.get('/:username', userController.getUser);

// get friend
route.get('/:username/friends', userController.getFriends);

// update user
route.patch(
  '/info/',
  validateMiddleware.validateAccessToken,
  upload.single('avatar'),
  userController.updateUser,
);

// update password
route.patch(
  '/password',
  validateMiddleware.validateAccessToken,
  userController.updatePassword,
);

module.exports = route;
