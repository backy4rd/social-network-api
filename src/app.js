const express = require('express');
const morgan = require('morgan');

const errorHandler = require('./utils/errorHandler');

const authRoute = require('./routes/authRoute');
const userRoute = require('./routes/userRoute');
const friendRoute = require('./routes/friendRoute');

const app = express();

app.use(morgan('dev'));

app.use('/api/v1/auth', authRoute);
app.use('/api/v1/users', userRoute);
app.use('/api/v1/friends', friendRoute);

app.use(errorHandler);

module.exports = app;
