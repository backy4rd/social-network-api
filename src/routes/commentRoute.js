const express = require('express');
const cookieParser = require('cookie-parser');

const commentController = require('../controllers/commentController');

const validateMiddleware = require('../middlewares/validateMiddleware');
const ownerMiddleware = require('../middlewares/ownerMiddleware');

const route = express.Router();

route.use(express.json());
route.use(express.urlencoded({ extended: false }));
route.use(cookieParser());

route.get('/:commentId(\\d+)/likes', commentController.getLikes);

// these route above doesn't need authorization
route.use(validateMiddleware.validateAccessToken);

route.get('/:commentId(\\d+)/like', commentController.like);

// these route above doesn't need owner permission
route.use('/:commentId(\\d+)', ownerMiddleware.ownerComment);

route.patch('/:commentId(\\d+)', commentController.updateComment);
route.delete('/:commentId(\\d+)', commentController.deleteComment);

module.exports = route;
