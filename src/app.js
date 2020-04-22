const express = require('express');
const morgan = require('morgan');

const errorHandler = require('./utils/errorHandler');

const authRouter = require('./routers/authRouter');
const userRouter = require('./routers/userRouter');
const friendRouter = require('./routers/friendRouter');
const postRouter = require('./routers/postRouter');
const notificationRouter = require('./routers/notificationRouter');

const staticRoute = require('./static');

const app = express();

app.disable('etag');

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// whitelist cors
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', process.env.WHITELIST || 'null');
  next();
});

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/friends', friendRouter);
app.use('/api/v1/posts', postRouter);
app.use('/api/v1/notifications', notificationRouter);
app.use('/static', staticRoute);

app.use(errorHandler);

module.exports = app;
