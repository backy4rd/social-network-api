module.exports = (err, req, res, next) => {
  console.log();
  console.log(err.stack)

  if (err.name === 'TypeError') {
    return res.status(500).json({
      status: 'fail',
      data: err.message,
    });
  }

  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      status: 'fail',
      data: err.message.split(',\n'),
    });
  }

  if (!err.statusCode) {
    return res.status(400).json({
      status: 'fail',
      data: err.message,
    });
  }

  res.status(err.statusCode).json({
    status: 'fail',
    data: err.message,
  });
};
