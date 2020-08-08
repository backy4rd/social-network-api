const express = require('express');
const multer = require('multer');

const userController = require('../controllers/userController');

const validateMiddleware = require('../middlewares/validateMiddleware');

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

// get user post
router.get(
  '/:username/posts',
  validateMiddleware.identify,
  userController.getPost,
);

// get own friend request
router.get(
  '/requests',
  validateMiddleware.authorize,
  userController.getFriendsRequest,
);

// get own post
router.get('/posts', validateMiddleware.authorize, userController.getOwnPost);

// get user
router.get('/:username', userController.getUser);

// get friend
router.get('/:username/friends', userController.getFriends);

// update user
router.patch(
  '/info/',
  validateMiddleware.authorize,
  upload.single('avatar'),
  userController.updateUser,
);

// update password
router.patch(
  '/password',
  validateMiddleware.authorize,
  userController.updatePassword,
);

module.exports = router;
