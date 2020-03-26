const express = require('express');
const morgan = require('morgan');

const errorHandler = require('./utils/errorHandler');

const authRoute = require('./routes/authRoute');
const userRoute = require('./routes/userRoute');
const friendRoute = require('./routes/friendRoute');
const postRoute = require('./routes/postRoute');
const commentRoute = require('./routes/commentRoute');

const staticRoute = require('./static');

const app = express();

app.use(morgan('dev'));

app.use('/api/v1/auth', authRoute);
app.use('/api/v1/users', userRoute);
app.use('/api/v1/friends', friendRoute);
app.use('/api/v1/posts', postRoute);
app.use('/api/v1/comments', commentRoute);
app.use('/static', staticRoute);

app.use(errorHandler);

module.exports = app;
