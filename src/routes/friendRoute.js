const express = require('express');
const cookieParser = require('cookie-parser');

const friendController = require('../controllers/friendController');

const validateMiddleware = require('../middlewares/validateMiddleware');

const route = express.Router();

route.use(cookieParser());
route.use(validateMiddleware.validateAccessToken);

route.get('/add', friendController.addFriend);
route.get('/breakup', friendController.unfriend);
route.get('/decide', friendController.decide);
route.get('/unsend', friendController.unsend);

module.exports = route;
