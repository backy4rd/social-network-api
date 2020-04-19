const fs = require('fs');

const nodeEnv = process.env.NODE_ENV;

const logStream = fs.createWriteStream('./src/server.log', { flags: 'a' });

module.exports = (err, req, res, next) => {
  if (/Validation error/.test(err)) {
    return res.status(400).json({
      status: 'fail',
      data: err.message.split(',\n'),
    });
  }

  if (!err.statusCode) {
    if (nodeEnv === 'production') {
      logStream.write(`[${Date()}]:  ${err.stack}\n\n`);
    }
    if (nodeEnv === 'development') {
      console.log(err.stack);
    }

    return res.status(500).json({
      status: 'error',
      data: 'internal server error',
    });
  }

  res.status(err.statusCode).json({
    status: 'fail',
    data: err.message,
  });
};
