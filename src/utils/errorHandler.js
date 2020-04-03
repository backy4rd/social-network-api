module.exports = (err, req, res, next) => {
  console.log(err.stack);
  if (/Sequelize/.test(err.name)) {
    return res.status(400).json({
      status: 'fail',
      data: err.message.split(',\n'),
    });
  }

  if (!err.statusCode) {
    return res.status(500).json({
      status: 'error',
      data: 'internal server error',
    });
  }

  if (process.env.NODE_ENV === 'development') {
    console.log(err.stack);
  }
  res.status(err.statusCode).json({
    status: 'fail',
    data: err.message,
  });
};
