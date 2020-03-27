const express = require('express');
const cookieParser = require('cookie-parser');

const commentController = require('../controllers/commentController');

const validateMiddleware = require('../middlewares/validateMiddleware');
const ownerMiddleware = require('../middlewares/ownerMiddleware');

const route = express.Router();

route.use(express.json());
route.use(express.urlencoded({ extended: false }));
route.use(cookieParser());

route.get('/:id(\\d+)/likes', commentController.getLikes);

// these route above doesn't need authorization
route.use(validateMiddleware.validateAccessToken);

route.get('/:id(\\d+)/like', commentController.like);

// these route above doesn't need owner permission
route.use('/:id(\\d+)', ownerMiddleware.ownerComment);

route.patch('/:id(\\d+)', commentController.updateComment);
route.delete('/:id(\\d+)', commentController.deleteComment);

module.exports = route;
